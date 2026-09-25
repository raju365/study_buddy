/*
 * -------------------------------------------------------
 * File : ai.service.js
 * Description : Wrapper around Gemini API — generates
 *               explanations + auto-detects the topic
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt({ subject, question }) {
  return `You are a friendly tutor helping a school/college student.
Subject: ${subject}
Question: ${question}

Respond with ONLY a valid JSON object (no markdown, no code fences) in this exact shape:
{
  "topic": "<a short, normalized topic name for this question, 1-3 words, Title Case — e.g. 'Trigonometry', 'Photosynthesis', 'Recursion'>",
  "answer": "<clear explanation in under 120 words, simple language, short example if it helps>"
}`;
}

async function generateDoubtAnswer({ subject, question }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = buildPrompt({ subject, question });

    const result = await model.generateContent(prompt);

    const raw = result.response.text();

    // Strip accidental code fences, just in case
    const cleaned = raw.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    return {
      topic: parsed.topic?.trim() || "General",
      answer: parsed.answer?.trim() || cleaned,
    };
  } catch (error) {
    console.error("AI Service Error:", error);

    throw new Error("Failed to generate answer");
  }
}

module.exports = { generateDoubtAnswer };