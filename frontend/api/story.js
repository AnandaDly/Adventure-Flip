// api/story.js
import { getGeminiModel } from "../services/gemini.js";
import { speakWithAgent } from "../services/elevenAgent.js";
import { buildPrompt } from "../prompts/storyteller.js";

// Vercel Serverless Handler
export default async function handler(req, res) {
  // Handle CORS manual (Vercel kadang butuh ini)
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { storyContext, userAnswer, theme, turnCount = 1 } = req.body;

    // 1. Gemini Logic
    const prompt = buildPrompt(storyContext, userAnswer, theme, turnCount);
    const model = getGeminiModel();
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const rawResponse = result.response.text();
    let storySegments;
    try {
      storySegments = JSON.parse(rawResponse);
    } catch (e) {
      storySegments = [{ speaker: "narrator", text: rawResponse }];
    }

    // 2. ElevenLabs Logic
    const audioPromises = storySegments.map(async (segment) => {
      try {
        const audioBase64 = await speakWithAgent(segment.text, segment.speaker);
        return { ...segment, audio: audioBase64 };
      } catch (err) {
        console.error(`Audio fail:`, err);
        return { ...segment, audio: null };
      }
    });

    const processedSegments = await Promise.all(audioPromises);

    // Kirim Response
    res.status(200).json({ segments: processedSegments });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Gagal memproses cerita" });
  }
}
