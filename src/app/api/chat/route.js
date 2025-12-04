/**
 * AI Chat Assistant API Route
 * Handles real-time chat conversations with Gemini AI
 * Maintains conversation history for context
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLawsContextForPrompt } from "@/lib/constants/philippine-laws";

// Gemini AI will be initialized lazily
let genAI = null;

function getGenAI() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Build comprehensive system prompt with full case context
 */
function buildSystemPrompt(analysis) {
  const lawsContext = getLawsContextForPrompt();
  
  let fullCaseContext = "";
  if (analysis) {
    // Build comprehensive case context
    fullCaseContext = `
═══════════════════════════════════════════════════════════════
KASO NG USER - KUMBINTO NA KONTEXTO
═══════════════════════════════════════════════════════════════

URI NG KASO:
${analysis.caseType || "Hindi tinukoy"}

SEVERITY AT COMPLEXITY:
- Rating: ${analysis.severity?.rating || "Hindi tinukoy"}
- Complexity: ${analysis.severity?.complexity || "Hindi tinukoy"}/10
- Financial Impact: ${analysis.severity?.financialImpact || "Hindi tinukoy"}
- Time Sensitivity: ${analysis.severity?.timeSensitivity || "Hindi tinukoy"}

TIMELINE:
- Issue Duration: ${analysis.timeline?.issueDuration || "Hindi tinukoy"}
- Statute of Limitations: ${analysis.timeline?.statuteOfLimitations?.applicable ? "Applicable" : "Not Applicable"}
  ${analysis.timeline?.statuteOfLimitations?.deadline ? `- Deadline: ${analysis.timeline.statuteOfLimitations.deadline}` : ""}
  ${analysis.timeline?.statuteOfLimitations?.daysRemaining !== null && analysis.timeline?.statuteOfLimitations?.daysRemaining !== undefined ? `- Days Remaining: ${analysis.timeline.statuteOfLimitations.daysRemaining}` : ""}
  ${analysis.timeline?.statuteOfLimitations?.warning ? `- Warning: ${analysis.timeline.statuteOfLimitations.warning}` : ""}
- Estimated Resolution: ${analysis.timeline?.estimatedResolution || "Hindi tinukoy"}

MGA KARAPATAN NG USER:
${analysis.rights && analysis.rights.length > 0 
  ? analysis.rights.map((right, idx) => `${idx + 1}. ${right}`).join("\n")
  : "Hindi tinukoy"}

MGA BATAS NA APPLICABLE:
${analysis.relevantLaws && analysis.relevantLaws.length > 0
  ? analysis.relevantLaws.map((law, idx) => {
      let lawText = `${idx + 1}. ${law.title || law.name || "Unknown Law"}`;
      if (law.law || law.article) {
        lawText += `\n   Citation: ${law.law || law.article}`;
      }
      if (law.description) {
        lawText += `\n   Description: ${law.description}`;
      }
      if (law.relevance) {
        lawText += `\n   Relevance: ${law.relevance}`;
      }
      return lawText;
    }).join("\n\n")
  : "Hindi tinukoy"}

MGA NEXT STEPS:
${analysis.nextSteps && analysis.nextSteps.length > 0
  ? analysis.nextSteps.map((step, idx) => {
      let stepText = `${idx + 1}. ${step.action}`;
      if (step.priority) {
        stepText += `\n   Priority: ${step.priority.toUpperCase()}`;
      }
      if (step.deadline) {
        stepText += `\n   Deadline: ${step.deadline}`;
      }
      return stepText;
    }).join("\n\n")
  : "Hindi tinukoy"}

ESTIMATED COSTS:
${analysis.estimatedCosts ? `
- Consultation Fee: ${analysis.estimatedCosts.consultationFee || "Hindi tinukoy"}
- Filing Fees: ${analysis.estimatedCosts.filingFees || "Hindi tinukoy"}
- Total Estimated: ${analysis.estimatedCosts.totalEstimated || "Hindi tinukoy"}
- Payment Plan: ${analysis.estimatedCosts.paymentPlan || "Hindi tinukoy"}
- Additional Costs: ${analysis.estimatedCosts.additionalCosts || "Hindi tinukoy"}
` : "Hindi tinukoy"}

RISK ASSESSMENT:
${analysis.riskAssessment ? `
Inaction Risks:
${analysis.riskAssessment.inactionRisks && analysis.riskAssessment.inactionRisks.length > 0
  ? analysis.riskAssessment.inactionRisks.map((risk, idx) => `  ${idx + 1}. ${risk}`).join("\n")
  : "Hindi tinukoy"}

Action Benefits:
${analysis.riskAssessment.actionBenefits && analysis.riskAssessment.actionBenefits.length > 0
  ? analysis.riskAssessment.actionBenefits.map((benefit, idx) => `  ${idx + 1}. ${benefit}`).join("\n")
  : "Hindi tinukoy"}

Urgency Level: ${analysis.riskAssessment.urgencyLevel || "Hindi tinukoy"}
` : "Hindi tinukoy"}

EVIDENCE GUIDE:
${analysis.evidenceGuide && analysis.evidenceGuide.length > 0
  ? analysis.evidenceGuide.map((evidence, idx) => {
      let evidenceText = `${idx + 1}. ${evidence.item}`;
      if (evidence.description) {
        evidenceText += `\n   Description: ${evidence.description}`;
      }
      if (evidence.importance) {
        evidenceText += `\n   Importance: ${evidence.importance.toUpperCase()}`;
      }
      return evidenceText;
    }).join("\n\n")
  : "Hindi tinukoy"}

ESSENTIAL DOCUMENTS:
${analysis.essentialDocuments && analysis.essentialDocuments.length > 0
  ? analysis.essentialDocuments.map((doc, idx) => `${idx + 1}. ${doc}`).join("\n")
  : "Hindi tinukoy"}

FOLLOW-UP QUESTIONS & ANSWERS:
${analysis.followUpQuestions && analysis.followUpQuestions.length > 0
  ? analysis.followUpQuestions.map((qa, idx) => `Q${idx + 1}: ${qa.question}\nA${idx + 1}: ${qa.answer || "No answer"}`).join("\n\n")
  : "Wala"}

═══════════════════════════════════════════════════════════════
`;

    // Add relevant laws context
    if (analysis.relevantLaws && analysis.relevantLaws.length > 0) {
      fullCaseContext += `\nDETAILED LAW INFORMATION:\n`;
      analysis.relevantLaws.forEach((law, idx) => {
        fullCaseContext += `\n${idx + 1}. ${law.title || law.name || "Unknown Law"}\n`;
        if (law.law || law.article) {
          fullCaseContext += `   Full Citation: ${law.law || law.article}\n`;
        }
        if (law.description) {
          fullCaseContext += `   How it applies: ${law.description}\n`;
        }
      });
    }
  }

  return `Ikaw ay isang helpful at friendly na AI legal assistant para sa mga Pilipino. Ang iyong trabaho ay magbigay ng malinaw, praktikal, at madaling maintindihan na sagot tungkol sa legal na mga tanong.

${fullCaseContext ? `\n${fullCaseContext}\n` : ""}

AVAILABLE NA BATAS NG PILIPINAS (Reference Only):
${lawsContext}

═══════════════════════════════════════════════════════════════
MGA MAHALAGANG INSTRUKSYON:
═══════════════════════════════════════════════════════════════

1. STRICT SCOPE - TANGGAPIN LANG ANG RELEVANT NA TANONG:
   - TANGGAPIN LANG ang mga tanong na may kaugnayan sa kaso ng user na nakalista sa itaas
   - KUNG ang tanong ay HINDI RELATED sa kaso (halimbawa: tanong tungkol sa ibang kaso, general legal questions na walang koneksyon, o random questions), SABIHIN:
     "Paumanhin, ngunit ang tanong mo ay hindi kaugnay sa iyong kaso. Pakitulong magtanong lamang tungkol sa iyong kaso na nakalista sa itaas. Kung may iba ka pang legal na tanong, maaari kang magsimula ng bagong case analysis."
   - FOCUS LANG sa kaso ng user - huwag sumagot ng general legal questions na walang koneksyon

2. GAMITIN ANG FULL CASE CONTEXT:
   - Gamitin ang LAHAT ng impormasyon mula sa case context sa itaas
   - Reference ang specific laws, rights, next steps, at iba pang details
   - I-explain kung paano ang mga batas at karapatan ay applicable sa KASO NG USER

3. LANGUAGE:
   - Gumamit ng TAGALOG o Filipino sa lahat ng iyong sagot (maliban kung hihilingin ng user na English)
   - Maging friendly, approachable, at supportive

4. EXPLANATION STYLE:
   - I-explain ang mga legal na konsepto sa simpleng paraan
   - Magbigay ng praktikal na payo na base sa Philippine laws
   - Maging MAIKLI at KONKRETO - maximum 3-4 sentences per sagot
   - Diretso sa punto - huwag magbigay ng mahahabang explanations
   - Kung kailangan ng mas detalyadong sagot, magbigay ng key points lang
   - Iwasan ang pag-uulit ng impormasyon

5. UNCERTAINTY:
   - Kung hindi ka sigurado, aminin ito at magrekomenda ng konsultasyon sa abogado

6. DISCLAIMER:
   - Huwag magbigay ng legal advice na pwedeng gamitin bilang official legal counsel
   - Ipaalala sa user na kumonsulta sa licensed attorney para sa formal legal advice

7. RELEVANCE CHECK:
   - BAGO sumagot, i-check kung ang tanong ay relevant sa kaso ng user
   - KUNG HINDI RELEVANT, tanggihan politely at i-redirect sa kaso ng user

═══════════════════════════════════════════════════════════════`;
}

export async function POST(request) {
  try {
    const { message, conversationHistory = [], analysis = null } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json(
        { error: "Kinakailangan ang mensahe" },
        { status: 400 }
      );
    }

    // Check for API key
    const ai = getGenAI();
    if (!ai) {
      console.error("GEMINI_API_KEY is not configured");
      return Response.json(
        {
          error: "Hindi nakonfigure ang AI service. Pakicontact ang administrator.",
        },
        { status: 500 }
      );
    }

    // Initialize Gemini model
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build system prompt with analysis context
    const systemPrompt = buildSystemPrompt(analysis);

    // Build conversation context from history
    let conversationContext = "";
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = "\n\nPREVIOUS CONVERSATION:\n";
      conversationHistory.forEach((msg, index) => {
        if (msg.role === "user") {
          conversationContext += `\nUser: ${msg.content}\n`;
        } else if (msg.role === "assistant") {
          conversationContext += `Assistant: ${msg.content}\n`;
        }
      });
      conversationContext += "\n---\n";
    }

    // Build the full prompt with system instruction, conversation history, and current message
    const fullPrompt = `${systemPrompt}${conversationContext}\n\n═══════════════════════════════════════════════════════════════
CURRENT USER QUESTION:
═══════════════════════════════════════════════════════════════
${message}

═══════════════════════════════════════════════════════════════
INSTRUCTIONS:
═══════════════════════════════════════════════════════════════
1. UNA, i-check kung ang tanong ay RELEVANT sa kaso ng user na nakalista sa itaas
2. KUNG HINDI RELEVANT, tanggihan politely at i-redirect
3. KUNG RELEVANT, sagutin gamit ang full case context
4. Gamitin ang Tagalog/Filipino (maliban kung hihilingin ng user na English)
5. Maging helpful, friendly, at supportive
6. **MAHALAGA: Maging MAIKLI at KONKRETO - maximum 3-4 sentences lang. Diretso sa punto. Huwag magbigay ng mahahabang explanations.**

SAGOT (MAIKLI AT KONKRETO):`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Return response
    return Response.json({
      message: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      {
        error: "May error sa chat. Pakisubukan muli.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

