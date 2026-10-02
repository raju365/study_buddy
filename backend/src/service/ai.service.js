/*
 * -------------------------------------------------------
 * File : ai.service.js
 * Description : Wrapper around Gemini API — generates
 *               explanations from text and/or an image,
 *               and auto-detects the topic
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt({ subject, question, hasImage }) {
  return `You are a friendly tutor helping a school/college student.
Subject: ${subject}
${hasImage ? "The student has attached a photo of their question/problem." : ""}
${question ? `Additional text from the student: ${question}` : ""}

${hasImage ? "First read the question in the image carefully. " : ""}Respond with ONLY a valid JSON object (no markdown, no code fences) in this exact shape:
{
  "topic": "<a short, normalized topic name, 1-3 words, Title Case>",
  "answer": "<clear explanation in under 120 words, simple language, short example if it helps>"
}`;
}

/*
 * image: { data: base64String, mimeType: "image/png" | "image/jpeg" } or null
 */
async function generateDoubtAnswer({ subject, question, image }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = buildPrompt({ subject, question, hasImage: !!image });

    const parts = [{ text: prompt }];

    if (image) {
      parts.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType,
        },
      });
    }

    const result = await model.generateContent(parts);

    const raw = result.response.text();
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
