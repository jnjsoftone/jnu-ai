// https://docs.anthropic.com/en/api/getting-started

import Anthropic from '@anthropic-ai/sdk';

interface ClaudeOptions {
  model?: string;
  max_tokens?: number;
}

const chatClaude = async (
  message = 'Hello, Claude',
  api_key = '',
  {
    model = "claude-3-5-sonnet-20241022",
    max_tokens = 1024,
  }: ClaudeOptions = {}
) => {

  const anthropic = new Anthropic({
    apiKey: api_key, // defaults to process.env["ANTHROPIC_API_KEY"]
  });

  const msg = await anthropic.messages.create({
    model,
    max_tokens,
    messages: [{ role: "user", content: message }],
  });
  return msg;
}

export {
  chatClaude
}

// https://medium.com/@lisakim01/how-to-use-the-claude-api-for-enhanced-ai-integration-7024964a3486

// import axios from "axios";

// const api_key = "your-api-key";
// const prompt = "Human: Tell me a haiku about trees. Assistant:";
// const model = "claude-v1";
// const max_tokens_to_sample = 300;

// const data = {
//   "prompt": prompt,
//   "model": model,
//   "max_tokens_to_sample": max_tokens_to_sample,
// };

// const headers = {
//   "x-api-key": api_key,
//   "Content-Type": "application/json",
//   "anthropic-version": "2023-06-01",
// };

// axios.post("https://api.anthropic.com/v1/complete", data, { headers })
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
// }