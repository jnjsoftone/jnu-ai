// https://perplexity.mintlify.app/api-reference/chat-completions
// model : llama-3.1-sonar-small-128k-online

interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityOptions {
  model?: string;
  system?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  search_domain_filter?: string[];
  return_images?: boolean;
  return_related_questions?: boolean;
  search_recency_filter?: string;
  top_k?: number;
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
}

const chatPerplexity = async (
  message = 'How many stars are there in our galaxy?',
  api_key = '',
  {
    model = 'llama-3.1-sonar-small-128k-online',
    system = 'Be precise and concise.',
    max_tokens = 1000,
    temperature = 0.2,
    top_p = 0.9,
    search_domain_filter = ['perplexity.ai'],
    return_images = false,
    return_related_questions = false,
    search_recency_filter = 'month',
    top_k = 0,
    stream = false,
    presence_penalty = 0,
    frequency_penalty = 1
  }: PerplexityOptions = {}
) => {
  if (!api_key) {
    throw new Error('API key is required');
  }

  const messages: PerplexityMessage[] = [
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
      search_domain_filter,
      return_images,
      return_related_questions,
      search_recency_filter,
      top_k,
      stream,
      presence_penalty,
      frequency_penalty
    })
  };

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', options);
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}\n${text}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Perplexity API Error:', err);
    throw err;
  }
};

export { chatPerplexity };
