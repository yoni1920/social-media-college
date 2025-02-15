import {
  GenerativeModel,
  GoogleGenerativeAI,
  ResponseSchema,
} from "@google/generative-ai";
import { geminiConfig } from "../../config";

const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);

export const getGeminiModel = (
  responseSchema: ResponseSchema
): GenerativeModel => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });
};
