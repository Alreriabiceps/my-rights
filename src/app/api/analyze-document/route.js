/**
 * Document Analysis API Route
 * Analyzes uploaded legal documents (contracts, affidavits, etc.) using Gemini AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";

// Gemini AI will be initialized lazily
let genAI = null;

function getGenAI() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Extract text from PDF file
 */
async function extractTextFromPDF(buffer) {
  try {
    // Dynamic import for pdf-parse to handle Next.js 16/Turbopack compatibility
    // pdf-parse may export differently in different versions
    const pdfModule = await import("pdf-parse");
    
    // Try different export patterns
    let pdfParse;
    if (typeof pdfModule === "function") {
      pdfParse = pdfModule;
    } else if (pdfModule.default) {
      pdfParse = pdfModule.default;
    } else {
      // If no default, use the module itself (named export)
      pdfParse = pdfModule;
    }
    
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF file");
  }
}

/**
 * Extract text from Word document
 */
async function extractTextFromWord(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("Error extracting text from Word document:", error);
    throw new Error("Failed to extract text from Word document");
  }
}

/**
 * Extract text from plain text file
 */
function extractTextFromPlainText(buffer) {
  try {
    return buffer.toString("utf-8");
  } catch (error) {
    console.error("Error extracting text from plain text file:", error);
    throw new Error("Failed to extract text from file");
  }
}

/**
 * Extract text from uploaded file based on file type
 */
async function extractTextFromFile(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // PDF files
  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    return await extractTextFromPDF(buffer);
  }

  // Word documents
  if (
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  ) {
    return await extractTextFromWord(buffer);
  }

  // Plain text files
  if (fileType === "text/plain" || fileName.endsWith(".txt")) {
    return extractTextFromPlainText(buffer);
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

/**
 * Build the document analysis prompt for Gemini
 */
function buildDocumentAnalysisPrompt(documentText, fileName, fileType) {
  return `Ikaw ay isang eksperto sa batas ng Pilipinas na dalubhasa sa pagsusuri ng legal na dokumento. Suriin ang sumusunod na dokumento at magbigay ng komprehensibong pagsusuri.

INFORMASYON NG DOKUMENTO:
- Pangalan ng File: ${fileName}
- Uri ng File: ${fileType}

KONTENIDO NG DOKUMENTO:
${documentText}

Magbigay ng detalyadong pagsusuri sa JSON format na may mga sumusunod na field. Gumamit ng TAGALOG para sa lahat ng descriptions at explanations:

{
  "documentType": "string - Uri ng dokumento (Contract, Affidavit, Agreement, Deed, etc.)",
  "summary": {
    "overview": "string - Maikling buod ng dokumento (2-3 sentences)",
    "parties": ["string - Mga partido o taong kasangkot sa dokumento"],
    "purpose": "string - Layunin ng dokumento",
    "keyDates": ["string - Mahahalagang petsa sa dokumento"]
  },
  "keyClauses": [
    {
      "title": "string - Pamagat ng clause",
      "content": "string - Nilalaman ng clause",
      "importance": "high | medium | low",
      "explanation": "string - Paliliwanag kung bakit importante"
    }
  ],
  "issues": [
    {
      "type": "string - Uri ng isyu (Unfair Terms, Missing Information, Ambiguity, etc.)",
      "severity": "high | medium | low",
      "description": "string - Detalyadong paliliwanag ng isyu",
      "location": "string - Saan sa dokumento matatagpuan",
      "recommendation": "string - Rekomendasyon kung paano ito ayusin"
    }
  ],
  "risks": [
    {
      "category": "string - Kategorya ng panganib (Financial, Legal, Rights, etc.)",
      "level": "high | medium | low",
      "description": "string - Detalyadong paliliwanag ng panganib",
      "impact": "string - Posibleng epekto",
      "mitigation": "string - Paano maiiwasan o mababawasan ang panganib"
    }
  ],
  "rights": [
    {
      "right": "string - Karapatan na nakalista o implied sa dokumento",
      "description": "string - Paliliwanag ng karapatan",
      "protected": "boolean - Kung ang karapatan ay protektado o hindi"
    }
  ],
  "recommendations": [
    {
      "action": "string - Aksyon na dapat gawin",
      "priority": "high | medium | low",
      "reason": "string - Bakit importante ang aksyong ito"
    }
  ],
  "legalCompliance": {
    "philippineLawCompliant": "boolean - Kung ang dokumento ay sumusunod sa batas ng Pilipinas",
    "concerns": ["string - Mga alalahanin tungkol sa legal compliance"],
    "requiredModifications": ["string - Mga pagbabagong kailangan para maging compliant"]
  },
  "nextSteps": [
    {
      "step": "string - Hakbang na dapat gawin",
      "priority": "high | medium | low",
      "deadline": "string o null - Deadline kung applicable"
    }
  ]
}

IMPORTANTE:
1. Siguraduhing VALID JSON ang output
2. Gumamit ng Filipino/Tagalog sa lahat ng text descriptions
3. Maging praktikal at helpful sa mga rekomendasyon
4. Tukuyin ang lahat ng potensyal na isyu at panganib
5. Magbigay ng actionable na mga rekomendasyon
6. Isaalang-alang ang Philippine legal standards at best practices
7. Kung may mga unfair terms o clauses, tukuyin ang mga ito at magbigay ng alternatibo`;
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
function getFallbackAnalysis(fileName, documentText) {
  const textPreview = documentText.substring(0, 500);
  return {
    documentType: "Legal Document",
    summary: {
      overview:
        "Ang dokumento ay nangangailangan ng propesyonal na pagsusuri. Hindi maaaring makumpleto ang automated analysis sa oras na ito.",
      parties: [],
      purpose: "Hindi matukoy - kailangan ng karagdagang pagsusuri",
      keyDates: [],
    },
    keyClauses: [
      {
        title: "Konsultasyon Kinakailangan",
        content: "Ang dokumento ay nangangailangan ng propesyonal na legal na pagsusuri.",
        importance: "high",
        explanation:
          "Kinakailangan ng abogado para sa mas detalyadong pagsusuri ng dokumento.",
      },
    ],
    issues: [
      {
        type: "Automated Analysis Unavailable",
        severity: "medium",
        description:
          "Hindi maaaring makumpleto ang automated analysis. Kailangan ng propesyonal na legal na payo.",
        location: "Buong dokumento",
        recommendation:
          "Kumonsulta sa isang kwalipikadong abogado para sa komprehensibong pagsusuri.",
      },
    ],
    risks: [
      {
        category: "Incomplete Analysis",
        level: "medium",
        description:
          "Ang automated analysis ay hindi makumpleto. Maaaring may mga isyu na hindi natukoy.",
        impact:
          "Maaaring may mga panganib o isyu na hindi natukoy ng automated system.",
        mitigation:
          "Kumonsulta sa isang abogado para sa mas detalyadong pagsusuri.",
      },
    ],
    rights: [
      {
        right: "Karapatan sa Legal na Payo",
        description:
          "May karapatan ka na kumonsulta sa isang abogado tungkol sa iyong dokumento.",
        protected: true,
      },
    ],
    recommendations: [
      {
        action:
          "Kumonsulta sa isang kwalipikadong abogado para sa propesyonal na pagsusuri",
        priority: "high",
        reason:
          "Ang propesyonal na legal na payo ay mahalaga para sa tamang pag-unawa ng dokumento.",
      },
    ],
    legalCompliance: {
      philippineLawCompliant: null,
      concerns: [
        "Hindi matukoy ang legal compliance nang walang propesyonal na pagsusuri",
      ],
      requiredModifications: [
        "Konsultasyon sa abogado para matukoy ang kinakailangang pagbabago",
      ],
    },
    nextSteps: [
      {
        step: "Kumonsulta sa isang abogado",
        priority: "high",
        deadline: null,
      },
    ],
  };
}

export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { error: "Walang file na na-upload" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "Ang file ay masyadong malaki. Maximum na laki: 10MB" },
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

    // Extract text from document
    let documentText;
    try {
      documentText = await extractTextFromFile(file);
      
      // Limit text length to avoid token limits (keep first 50000 characters)
      if (documentText.length > 50000) {
        documentText = documentText.substring(0, 50000) + "\n\n[Document truncated for analysis...]";
      }
    } catch (extractError) {
      console.error("Error extracting text:", extractError);
      return Response.json(
        {
          error: `Hindi ma-extract ang text mula sa file: ${extractError.message}`,
        },
        { status: 400 }
      );
    }

    if (!documentText || documentText.trim().length === 0) {
      return Response.json(
        { error: "Walang text na nakuha mula sa dokumento. Baka ang file ay walang text content o corrupted." },
        { status: 400 }
      );
    }

    let analysis;

    try {
      // Initialize Gemini model
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Build and send prompt
      const prompt = buildDocumentAnalysisPrompt(
        documentText,
        file.name,
        file.type
      );
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse AI response
      analysis = parseJsonResponse(text);
      
      // Add metadata
      analysis.metadata = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        analyzedAt: new Date().toISOString(),
        textLength: documentText.length,
      };
    } catch (aiError) {
      console.error("AI Analysis Error:", aiError);
      // Use fallback analysis if AI fails
      analysis = getFallbackAnalysis(file.name, documentText);
      analysis.metadata = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        analyzedAt: new Date().toISOString(),
        textLength: documentText.length,
        error: "AI analysis failed, showing fallback analysis",
      };
    }

    return Response.json(analysis);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "May error sa pagsusuri ng dokumento. Pakisubukan muli." },
      { status: 500 }
    );
  }
}

