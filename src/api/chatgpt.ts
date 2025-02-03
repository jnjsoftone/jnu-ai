// https://platform.openai.com/docs/api-reference/chat

interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatGPTOptions {
  model?: string;
  system?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

const chatGpt = async (
  message = 'Hello, ChatGPT',
  api_key = '',
  {
    model = 'gpt-4-1106-preview',
    system = 'Be precise and concise.',
    max_tokens = 4096,
    temperature = 0.2,
    top_p = 0.9,
    frequency_penalty = 1,
    presence_penalty = 0,
    stream = false
  }: ChatGPTOptions = {}
) => {
  if (!api_key) {
    throw new Error('API key is required');
  }

  const messages: ChatGPTMessage[] = [
    {
      role: 'system',
      content: system
    },
    {
      role: 'user',
      content: message
    }
  ];

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${api_key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens,
      temperature,
      top_p,
      frequency_penalty,
      presence_penalty,
      stream
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}\n${text}`);
    }

    return await response.json();
  } catch (err) {
    console.error('ChatGPT API Error:', err);
    throw err;
  }
};

export { chatGpt };
