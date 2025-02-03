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
    stopSequences = ['red'],
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
  const gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig });

  let fullResponse = '';
  let continueGenerating = true;
  let currentMessage = message;

  while (continueGenerating) {
    const result = await gemini.generateContentStream(currentMessage);
    let chunkResponse = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      chunkResponse += chunkText;
    }

    fullResponse += chunkResponse;

    // Check if the response is complete or needs continuation
    if (chunkResponse.endsWith('...')) {
      // Example condition to check if continuation is needed
      currentMessage = 'continue'; // Adjust this based on how the API expects continuation prompts
    } else {
      continueGenerating = false;
    }
  }

  return fullResponse;
};

export { chatGemini };
