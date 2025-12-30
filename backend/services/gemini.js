import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiModel = null;

export function getGeminiModel() {
  if (!geminiModel) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
  }

  return geminiModel;
}
