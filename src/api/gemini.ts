// https://ai.google.dev/gemini-api/docs?hl=ko#node.js


// // import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatGeminiOptions {
  model?: string;
  stopSequences?: string[];
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

const chatGemini = async (
  message = 'Hello, Gemini',
  api_key = '',
  {
    model = 'gemini-1.5-flash',
    stopSequences = ["red"],
    maxOutputTokens = 2048,
    temperature = 0.9,
    topP = 0.1,
    topK = 16,
  }: ChatGeminiOptions = {}
) => {
  if (!api_key) {
    throw new Error('API key is required');
  }

  const generationConfig = {
    stopSequences,
    maxOutputTokens,
    temperature,
    topP,
    topK,
  };

  const genAI = new GoogleGenerativeAI(api_key);
  const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });

  try {
    const result = await gemini.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export {
  chatGemini
}
