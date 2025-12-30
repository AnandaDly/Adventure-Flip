import express from "express";
import { getGeminiModel } from "../services/gemini.js";
import { speakWithAgent } from "../services/elevenAgent.js";
import { buildPrompt } from "../prompts/storyteller.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { storyContext, userAnswer, theme, turnCount = 1 } = req.body;

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
      console.error("JSON Parse Error, fallback text:", rawResponse);
      storySegments = [{ speaker: "narrator", text: rawResponse }];
    }

    const audioPromises = storySegments.map(async (segment) => {
      try {
        const audioBase64 = await speakWithAgent(segment.text, segment.speaker);
        return { ...segment, audio: audioBase64 };
      } catch (err) {
        console.error(`Audio fail for ${segment.speaker}`);
        return { ...segment, audio: null };
      }
    });

    const processedSegments = await Promise.all(audioPromises);

    res.json({ segments: processedSegments });
  } catch (err) {
    console.error("Story Route Error:", err);
    res.status(500).json({ error: "Gagal membuat cerita" });
  }
});

export default router;
