/*
 * -------------------------------------------------------
 * File : ai.service.js
 * Description : Wrapper around Gemini API — generates
 *               explanations for student doubts
 * Author : Raju Barman
 * -------------------------------------------------------
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/*
 * Builds a system-style instruction so answers stay
 * short, student-friendly, and age-appropriate
 */
function buildPrompt({ subject, topic, question }) {
  return `You are a friendly tutor helping a school/college student.
Subject: ${subject}
Topic: ${topic}
Question: ${question}

Explain the answer clearly in simple language, in under 120 words.
Use a short example if it helps. Avoid unnecessary jargon.`;
}

/*
 * Calls Gemini and returns a clean text answer
 */
async function generateDoubtAnswer({ subject, topic, question }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = buildPrompt({ subject, topic, question });

    const result = await model.generateContent(prompt);

    const answer = result.response.text();

    return answer;
  } catch (error) {
    console.error("AI Service Error:", error);

    throw new Error("Failed to generate answer");
  }
}

module.exports = { generateDoubtAnswer };