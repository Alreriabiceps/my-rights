import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { description } = await request.json();

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a legal assistant helping to gather more information about a legal case. Based on the initial description provided, generate 3-5 follow-up questions that will help provide a more comprehensive legal analysis.

Initial description: "${description}"

Generate questions that:
1. Are relevant to the legal context
2. Help clarify important details (who, what, when, where, why, how)
3. Identify key legal elements (jurisdiction, damages, evidence, timeline, parties involved)
4. Are clear and easy to understand
5. Are specific to the type of case mentioned

Return ONLY a JSON array of question objects, each with:
- "id": a unique identifier (number 1, 2, 3, etc.)
- "text": the question text
- "hint": optional helpful hint or context

Example format:
[
  {
    "id": 1,
    "text": "When did this incident occur?",
    "hint": "Please provide the date or approximate time period"
  },
  {
    "id": 2,
    "text": "Who are the parties involved in this case?",
    "hint": "Include names and relationships if applicable"
  }
]

Generate 3-5 questions. If the initial description is very detailed and comprehensive, you may generate fewer questions (minimum 3). If it's brief or lacks important details, generate more questions (up to 5).

Return ONLY the JSON array, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.trim();
    if (text.startsWith("```json")) {
      text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/```\n?/g, "");
    }

    // Parse JSON
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse questions from AI response");
      }
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      // Fallback: generate default questions
      questions = [
        {
          id: 1,
          text: "When did this incident occur?",
          hint: "Please provide the date or approximate time period",
        },
        {
          id: 2,
          text: "Who are the parties involved in this case?",
          hint: "Include names and relationships if applicable",
        },
        {
          id: 3,
          text: "What evidence or documentation do you have?",
          hint: "Mention any documents, photos, witnesses, or other evidence",
        },
      ];
    }

    // Ensure questions have required fields
    questions = questions.map((q, index) => ({
      id: q.id || index + 1,
      text: q.text || q.question || "Please provide more details.",
      hint: q.hint || q.hintText || "",
    }));

    // Limit to 5 questions max
    if (questions.length > 5) {
      questions = questions.slice(0, 5);
    }

    // Ensure at least 3 questions
    if (questions.length < 3) {
      const defaultQuestions = [
        {
          id: questions.length + 1,
          text: "What is the location or jurisdiction of this case?",
          hint: "City, province, or region where the incident occurred",
        },
        {
          id: questions.length + 2,
          text: "What outcome or resolution are you seeking?",
          hint: "What do you hope to achieve with this case?",
        },
      ];
      questions = [...questions, ...defaultQuestions.slice(0, 3 - questions.length)];
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}

