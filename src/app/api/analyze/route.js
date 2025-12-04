/**
 * Legal Case Analysis API Route
 * Analyzes user-submitted legal situations using Gemini AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLawsContextForPrompt } from "@/lib/constants/philippine-laws";
import { getLawyersByCaseType } from "@/lib/constants/lawyers";
import {
  getAgenciesByCaseType,
  formatAgencyForDisplay,
} from "@/lib/constants/government-agencies";
import {
  saveToKnowledgeBase,
  findSimilarCasesByDescription,
} from "@/lib/knowledgeBaseService";

// Gemini AI will be initialized lazily
let genAI = null;

function getGenAI() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Build the analysis prompt for Gemini with similar cases context and follow-up Q&A
 */
async function buildPrompt(description, followUpQuestions = []) {
  const lawsContext = getLawsContextForPrompt();

  // Find similar cases from knowledge base
  let similarCasesContext = "";
  try {
    const { cases: similarCases } = await findSimilarCasesByDescription(
      description,
      3
    );

    if (similarCases && similarCases.length > 0) {
      similarCasesContext = `\n\nMGA KATULAD NA KASO MULA SA KNOWLEDGE BASE (para sa mas mahusay na pagsusuri):\n`;
      similarCases.forEach((similarCase, index) => {
        similarCasesContext += `\nKaso ${index + 1}:\n`;
        similarCasesContext += `- Uri: ${similarCase.caseType}\n`;
        similarCasesContext += `- Paglalarawan: ${similarCase.description.substring(
          0,
          200
        )}${similarCase.description.length > 200 ? "..." : ""}\n`;
        if (similarCase.relevantLaws && similarCase.relevantLaws.length > 0) {
          const laws = similarCase.relevantLaws
            .slice(0, 3)
            .map((l) => l.law || l.title)
            .join(", ");
          similarCasesContext += `- Mga Batas: ${laws}\n`;
        }
        if (similarCase.rights && similarCase.rights.length > 0) {
          similarCasesContext += `- Mga Karapatan: ${similarCase.rights
            .slice(0, 3)
            .join(", ")}\n`;
        }
      });
      similarCasesContext += `\nGamitin ang mga kasong ito bilang reference para sa mas tumpak na pagsusuri. Isaalang-alang ang mga pattern at similarities sa pagitan ng kasong ito at ng mga nakaraang kaso.\n`;
    }
  } catch (error) {
    console.error("Error fetching similar cases:", error);
    // Continue without similar cases if there's an error
  }

  // Build follow-up Q&A context if available
  let followUpContext = "";
  if (followUpQuestions && followUpQuestions.length > 0) {
    followUpContext = `\n\nKARAGDAGANG IMPORMASYON MULA SA FOLLOW-UP NA MGA TANONG:\n`;
    followUpQuestions.forEach((qa, index) => {
      followUpContext += `\nTanong ${index + 1}: ${qa.question}\n`;
      followUpContext += `Sagot: ${qa.answer}\n`;
    });
    followUpContext += `\nGamitin ang mga karagdagang impormasyong ito upang magbigay ng mas tumpak at detalyadong pagsusuri. Isaalang-alang ang mga detalye mula sa mga sagot sa pagbuo ng iyong rekomendasyon.\n`;
  }

  return `Ikaw ay isang eksperto sa batas ng Pilipinas. Suriin ang sumusunod na sitwasyon at magbigay ng komprehensibong legal na pagsusuri.

SITWASYON NG USER:
${description}${followUpContext}

AVAILABLE NA BATAS NG PILIPINAS:
${lawsContext}
${similarCasesContext}

Magbigay ng detalyadong pagsusuri sa JSON format na may mga sumusunod na field. Gumamit ng TAGALOG para sa lahat ng descriptions at explanations:

{
  "caseType": "string - Uri ng kaso (Property, Criminal, Labor, Family Law, Civil, Consumer, Administrative, etc.)",
  "severity": {
    "rating": "low | medium | high",
    "complexity": "number 1-10",
    "financialImpact": "string - Posibleng epekto sa pananalapi",
    "timeSensitivity": "string - Gaano kahalaga ang oras"
  },
  "timeline": {
    "issueDuration": "string - Gaano na katagal ang isyu",
    "statuteOfLimitations": {
      "applicable": "boolean",
      "deadline": "string o null - Petsa ng deadline kung applicable",
      "daysRemaining": "number o null",
      "warning": "string o null - Babala kung malapit na ang deadline"
    },
    "estimatedResolution": "string - Tinatayang oras ng resolusyon",
    "milestones": [
      {
        "title": "string",
        "description": "string",
        "duration": "string"
      }
    ]
  },
  "relevantLaws": [
    {
      "title": "string - Pamagat ng batas",
      "law": "string - Citation (e.g., Civil Code of the Philippines, Article 1134)",
      "description": "string - Paano ito applicable sa kaso",
      "relevance": "high | medium | low"
    }
  ],
  "sources": [
    {
      "type": "law | code | constitution | government | website",
      "title": "string - Pamagat ng source",
      "citation": "string - Full citation kung available",
      "url": "string - Link sa source kung available",
      "description": "string - Paano ginamit ang source na ito"
    }
  ],
  "rights": ["string - Mga karapatan ng user sa sitwasyong ito"],
  "essentialDocuments": ["string - Mga dokumentong kailangan"],
  "nextSteps": [
    {
      "action": "string - Aksyon na dapat gawin",
      "priority": "high | medium | low",
      "deadline": "string o null"
    }
  ],
  "estimatedCosts": {
    "consultationFee": "string - Halaga ng konsultasyon",
    "filingFees": "string - Halaga ng pag-file",
    "totalEstimated": "string - Kabuuang tinatayang gastos",
    "paymentPlan": "string - Mga opsyon sa pagbabayad",
    "additionalCosts": "string - Iba pang posibleng gastos"
  },
  "riskAssessment": {
    "inactionRisks": ["string - Mga panganib kung hindi kikilos"],
    "actionBenefits": ["string - Mga benepisyo kung kikilos"],
    "urgencyLevel": "low | medium | high"
  },
  "evidenceGuide": [
    {
      "item": "string - Pangalan ng ebidensya",
      "description": "string - Paano ito makukuha at bakit importante",
      "importance": "critical | important | helpful"
    }
  ]
}

IMPORTANTE:
1. Siguraduhing VALID JSON ang output
2. Gumamit ng Filipino/Tagalog sa lahat ng text descriptions
3. Maging praktikal at helpful sa mga rekomendasyon
4. Isama ang lahat ng relevant na batas mula sa listahan
5. Magbigay ng realistic na cost estimates sa Philippine Peso
6. Isaalang-alang ang mga timeline at deadlines ng Philippine legal system
7. SIGURADUHING isama ang "sources" array na naglalaman ng mga legal sources, citations, at references na ginamit sa pagsusuri
8. Para sa bawat relevant law, magdagdag ng corresponding entry sa sources array na may complete citation at URL kung available`;
}

/**
 * Parse JSON from AI response (handles markdown code blocks)
 */
function parseJsonResponse(text) {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1].trim());
  }

  // Try direct JSON parse
  try {
    return JSON.parse(text);
  } catch {
    // Try to find JSON object in text
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    }
    throw new Error("Could not parse JSON from response");
  }
}

/**
 * Generate fallback analysis when AI fails
 */
function getFallbackAnalysis(description) {
  return {
    caseType: "General Legal Inquiry",
    severity: {
      rating: "medium",
      complexity: 5,
      financialImpact:
        "Hindi pa matukoy - kailangan ng karagdagang impormasyon",
      timeSensitivity: "Depende sa uri ng kaso",
    },
    timeline: {
      issueDuration: "Hindi tinukoy",
      statuteOfLimitations: {
        applicable: true,
        deadline: null,
        daysRemaining: null,
        warning: "Kumonsulta sa abogado para sa eksaktong deadline",
      },
      estimatedResolution: "3-12 buwan depende sa uri ng kaso",
      milestones: [
        {
          title: "Konsultasyon sa Abogado",
          description: "Makipag-usap sa isang kwalipikadong abogado",
          duration: "1-2 linggo",
        },
        {
          title: "Paghahanda ng Dokumento",
          description: "Kolektahin ang lahat ng kinakailangang dokumento",
          duration: "2-4 na linggo",
        },
        {
          title: "Pag-file ng Kaso",
          description: "Isumite ang mga dokumento sa naaangkop na ahensya",
          duration: "1-2 linggo",
        },
      ],
    },
    relevantLaws: [
      {
        title: "Konsultasyon Kinakailangan",
        law: "Maraming batas ang maaaring applicable",
        description:
          "Kinakailangan ng propesyonal na legal na payo para matukoy ang eksaktong mga batas na applicable sa iyong kaso.",
        relevance: "high",
      },
    ],
    rights: [
      "Karapatan sa legal na representasyon",
      "Karapatan sa due process",
      "Karapatan sa patas na paglilitis",
      "Karapatan sa impormasyon tungkol sa iyong kaso",
    ],
    essentialDocuments: [
      "Valid ID",
      "Mga dokumentong may kaugnayan sa kaso",
      "Mga ebidensya at patunay",
      "Mga kontrata o kasunduan (kung applicable)",
    ],
    nextSteps: [
      {
        action: "Kumonsulta sa isang abogado para sa propesyonal na payo",
        priority: "high",
        deadline: null,
      },
      {
        action: "Kolektahin ang lahat ng relevant na dokumento at ebidensya",
        priority: "high",
        deadline: null,
      },
      {
        action: "Itala ang lahat ng detalye ng pangyayari",
        priority: "medium",
        deadline: null,
      },
    ],
    estimatedCosts: {
      consultationFee: "₱2,000 - ₱5,000",
      filingFees: "₱500 - ₱5,000 (depende sa kaso)",
      totalEstimated: "₱10,000 - ₱50,000+",
      paymentPlan: "Maraming abogado ang tumatanggap ng installment",
      additionalCosts: "Notaryo, dokumentasyon, transportasyon",
    },
    riskAssessment: {
      inactionRisks: [
        "Maaaring mag-expire ang statute of limitations",
        "Maaaring mawala ang ebidensya",
        "Maaaring mas lumala ang sitwasyon",
      ],
      actionBenefits: [
        "Proteksyon ng iyong mga karapatan",
        "Malinaw na direksyon sa iyong kaso",
        "Mas malaking posibilidad ng paborableng resulta",
      ],
      urgencyLevel: "medium",
    },
    evidenceGuide: [
      {
        item: "Mga Dokumento",
        description:
          "Kolektahin ang lahat ng mga dokumento na may kaugnayan sa kaso",
        importance: "critical",
      },
      {
        item: "Mga Litrato o Video",
        description: "Kung mayroon, kunan ng litrato o video ang mga ebidensya",
        importance: "important",
      },
      {
        item: "Mga Saksi",
        description:
          "Alamin kung sino ang mga posibleng saksi at kunin ang kanilang contact details",
        importance: "important",
      },
    ],
  };
}

export async function POST(request) {
  try {
    // Parse request body
    const formData = await request.formData();
    const description = formData.get("description");
    const followUpQuestionsStr = formData.get("followUpQuestions");

    // Parse follow-up questions if provided
    let followUpQuestions = [];
    if (followUpQuestionsStr) {
      try {
        followUpQuestions = JSON.parse(followUpQuestionsStr);
      } catch (e) {
        console.warn("Failed to parse follow-up questions:", e);
      }
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      return Response.json(
        { error: "Kinakailangan ang paglalarawan ng iyong sitwasyon" },
        { status: 400 }
      );
    }

    // Check for API key
    const ai = getGenAI();
    if (!ai) {
      console.error("GEMINI_API_KEY is not configured");
      return Response.json(
        {
          error:
            "Hindi nakonfigure ang AI service. Pakicontact ang administrator.",
        },
        { status: 500 }
      );
    }

    let analysis;

    try {
      // Initialize Gemini model
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Build and send prompt (now async to fetch similar cases)
      const prompt = await buildPrompt(description, followUpQuestions);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse AI response
      analysis = parseJsonResponse(text);
      
      // Add follow-up Q&A to analysis if available
      if (followUpQuestions && followUpQuestions.length > 0) {
        analysis.followUpQuestions = followUpQuestions;
      }
    } catch (aiError) {
      console.error("AI Analysis Error:", aiError);
      // Use fallback analysis if AI fails
      analysis = getFallbackAnalysis(description);
      
      // Still add follow-up Q&A to fallback analysis
      if (followUpQuestions && followUpQuestions.length > 0) {
        analysis.followUpQuestions = followUpQuestions;
      }
    }

    // Save to knowledge base for future learning (anonymized)
    // This happens asynchronously and doesn't block the response
    try {
      console.log("🔵 API: Attempting to save to knowledge base...");
      const kbResult = await saveToKnowledgeBase({
        description: description,
        analysis: analysis,
      });
      if (kbResult.success) {
        console.log(
          "✅ API: Case saved to knowledge base successfully:",
          kbResult.knowledgeId
        );
      } else {
        console.error(
          "❌ API: Failed to save to knowledge base:",
          kbResult.error,
          kbResult.code
        );
      }
    } catch (kbError) {
      console.error("❌ API: Error saving to knowledge base:", kbError);
      console.error("Error details:", {
        message: kbError.message,
        code: kbError.code,
        stack: kbError.stack,
      });
      // Don't fail the request if knowledge base save fails
    }

    // Enrich with lawyer recommendations
    const lawyers = getLawyersByCaseType(analysis.caseType);
    analysis.lawyers = lawyers.slice(0, 5).map((lawyer) => ({
      ...lawyer,
      distance: "Makati Area", // Default distance, would be calculated with user location
    }));

    // Add government agency recommendations
    const agencies = getAgenciesByCaseType(analysis.caseType);
    if (
      !analysis.governmentAgencies ||
      analysis.governmentAgencies.length === 0
    ) {
      analysis.governmentAgencies = agencies
        .slice(0, 5)
        .map(formatAgencyForDisplay);
    }

    return Response.json(analysis);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "May error sa pagsusuri. Pakisubukan muli." },
      { status: 500 }
    );
  }
}
