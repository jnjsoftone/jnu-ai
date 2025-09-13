# 사용자 가이드
## JNU-AI: AI API 통합 라이브러리

### 📋 목차
1. [시작하기](#시작하기)
2. [설치 및 설정](#설치-및-설정)
3. [OpenAI GPT 사용하기](#openai-gpt-사용하기)
4. [Anthropic Claude 사용하기](#anthropic-claude-사용하기)
5. [Google Gemini 사용하기](#google-gemini-사용하기)
6. [Perplexity 사용하기](#perplexity-사용하기)
7. [웹 콘텐츠 통합](#웹-콘텐츠-통합)
8. [고급 사용법](#고급-사용법)
9. [모범 사례](#모범-사례)
10. [문제해결](#문제해결)

---

## 🚀 시작하기

JNU-AI는 주요 AI 서비스들을 위한 통합 TypeScript 인터페이스를 제공합니다:
- **OpenAI GPT**: ChatGPT, GPT-4 모델
- **Anthropic Claude**: Claude 3.5 Sonnet 및 최신 모델
- **Google Gemini**: Gemini 1.5 Flash 및 Pro 모델
- **Perplexity**: 실시간 검색 기반 AI 응답

### 빠른 시작
```typescript
import { chatGpt, chatClaude, chatGemini, chatPerplexity } from 'jnu-ai';

// GPT로 질문하기
const gptResponse = await chatGpt('안녕하세요!', process.env.OPENAI_API_KEY);

// Claude로 질문하기
const claudeResponse = await chatClaude('안녕하세요!', process.env.ANTHROPIC_API_KEY);

// Gemini로 질문하기  
const geminiResponse = await chatGemini('안녕하세요!', process.env.GOOGLE_API_KEY);

// Perplexity로 검색 질문하기
const perplexityResponse = await chatPerplexity('최신 AI 뉴스는?', process.env.PERPLEXITY_API_KEY);
```

---

## 📦 설치 및 설정

### 설치
```bash
npm install jnu-ai
```

### 환경 구성
AI 서비스 API 키로 `.env` 파일을 생성하세요:

```bash
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Anthropic Claude
ANTHROPIC_API_KEY=your-anthropic-api-key

# Google Gemini
GOOGLE_API_KEY=your-google-api-key

# Perplexity
PERPLEXITY_API_KEY=your-perplexity-api-key
```

### TypeScript 설정
```typescript
// types.d.ts
declare module 'jnu-ai' {
  // 더 나은 IDE 지원을 위한 타입 임포트
}
```

---

## 🤖 OpenAI GPT 사용하기

### 기본 사용법
```typescript
import { chatGpt } from 'jnu-ai';

// 간단한 채팅
const response = await chatGpt(
  '파이썬으로 피보나치 수열을 구현하는 방법을 알려주세요.',
  process.env.OPENAI_API_KEY
);

console.log(response.choices[0].message.content);
```

### 고급 옵션
```typescript
// 상세한 설정으로 GPT 사용
const response = await chatGpt(
  '창의적인 마케팅 아이디어를 제안해주세요.',
  process.env.OPENAI_API_KEY,
  {
    model: 'gpt-4-1106-preview',
    system: '당신은 창의적인 마케팅 전문가입니다.',
    max_tokens: 1000,
    temperature: 0.8,
    top_p: 0.9,
    frequency_penalty: 0.5,
    presence_penalty: 0.3
  }
);
```

### 스트리밍 응답
```typescript
// 실시간 스트리밍 (참고: 현재 구현되지 않음)
const response = await chatGpt(
  '긴 이야기를 써주세요.',
  process.env.OPENAI_API_KEY,
  {
    stream: true,
    max_tokens: 2000
  }
);
```

---

## 🎭 Anthropic Claude 사용하기

### 기본 사용법
```typescript
import { chatClaude } from 'jnu-ai';

// Claude와 대화
const response = await chatClaude(
  '복잡한 윤리적 딜레마에 대해 분석해주세요.',
  process.env.ANTHROPIC_API_KEY
);

console.log(response.content[0].text);
```

### 모델 및 토큰 설정
```typescript
// 다른 Claude 모델 사용
const response = await chatClaude(
  '코드 리뷰를 해주세요.',
  process.env.ANTHROPIC_API_KEY,
  {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048
  }
);
```

### 응답 구조 이해
```typescript
// Claude 응답 구조
interface ClaudeResponse {
  content: ContentBlock[];
  model: string;
  role: 'assistant';
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}
```

---

## 💎 Google Gemini 사용하기

### 기본 사용법
```typescript
import { chatGemini } from 'jnu-ai';

// Gemini로 질문
const response = await chatGemini(
  '인공지능의 미래에 대해 설명해주세요.',
  process.env.GOOGLE_API_KEY
);

console.log(response);
```

### 고급 생성 설정
```typescript
// 창의적 글쓰기를 위한 설정
const creativeResponse = await chatGemini(
  '공상과학 소설의 첫 문단을 써주세요.',
  process.env.GOOGLE_API_KEY,
  {
    model: 'gemini-1.5-flash',
    temperature: 1.0,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1000,
    stopSequences: ['END']
  }
);
```

### 오류 처리
```typescript
try {
  const response = await chatGemini(message, apiKey);
  console.log(response);
} catch (error) {
  console.error('Gemini API 오류:', error.message);
  // 폴백 로직 구현
}
```

---

## 🔍 Perplexity 사용하기

### 기본 검색 질문
```typescript
import { chatPerplexity } from 'jnu-ai';

// 실시간 정보 검색
const response = await chatPerplexity(
  '2025년 최신 AI 기술 트렌드는 무엇인가요?',
  process.env.PERPLEXITY_API_KEY
);

console.log(response.choices[0].message.content);
```

### 도메인 필터링
```typescript
// 특정 도메인에서만 검색
const techNewsResponse = await chatPerplexity(
  '최신 AI 연구 동향',
  process.env.PERPLEXITY_API_KEY,
  {
    model: 'llama-3.1-sonar-small-128k-online',
    search_domain_filter: ['arxiv.org', 'papers.with-code.com'],
    return_related_questions: true,
    search_recency_filter: 'week'
  }
);
```

### 이미지 및 관련 질문
```typescript
// 이미지와 관련 질문 포함
const enrichedResponse = await chatPerplexity(
  'AI 이미지 생성 기술에 대해 알려주세요.',
  process.env.PERPLEXITY_API_KEY,
  {
    return_images: true,
    return_related_questions: true,
    max_tokens: 2000
  }
);
```

---

## 🌐 웹 콘텐츠 통합

### 웹 페이지 콘텐츠 가져오기
```typescript
import { fetchByChrome } from 'jnu-ai';

// 웹 페이지에서 콘텐츠 추출 (현재 주석 처리됨)
// const pageContent = await fetchByChrome('https://example.com/article');
// 
// // AI와 함께 웹 콘텐츠 분석
// const analysis = await chatClaude(
//   `다음 웹 콘텐츠를 요약해주세요: ${pageContent.markdown}`,
//   process.env.ANTHROPIC_API_KEY
// );
```

### HTML to Markdown 변환
```typescript
// HTML 콘텐츠를 마크다운으로 변환
// const markdown = convertHtmlToMarkdown(htmlContent);
// 
// // 변환된 마크다운을 AI 프롬프트에 사용
// const summary = await chatGemini(
//   `이 마크다운 문서의 핵심 내용을 정리해주세요: ${markdown}`,
//   process.env.GOOGLE_API_KEY
// );
```

---

## 🔄 고급 사용법

### 다중 서비스 비교
```typescript
class AIServiceComparator {
  async compareResponses(prompt: string) {
    const results = await Promise.allSettled([
      chatGpt(prompt, process.env.OPENAI_API_KEY),
      chatClaude(prompt, process.env.ANTHROPIC_API_KEY),
      chatGemini(prompt, process.env.GOOGLE_API_KEY),
      chatPerplexity(prompt, process.env.PERPLEXITY_API_KEY)
    ]);

    return results.map((result, index) => ({
      service: ['OpenAI', 'Claude', 'Gemini', 'Perplexity'][index],
      status: result.status,
      response: result.status === 'fulfilled' ? result.value : result.reason
    }));
  }
}

// 사용법
const comparator = new AIServiceComparator();
const comparison = await comparator.compareResponses('AI의 장점과 단점을 설명해주세요.');
```

### 폴백 시스템
```typescript
class AIWithFallback {
  private services = [
    { name: 'claude', fn: chatClaude, key: process.env.ANTHROPIC_API_KEY },
    { name: 'gpt', fn: chatGpt, key: process.env.OPENAI_API_KEY },
    { name: 'gemini', fn: chatGemini, key: process.env.GOOGLE_API_KEY }
  ];

  async askWithFallback(message: string): Promise<any> {
    for (const service of this.services) {
      try {
        console.log(`${service.name} 시도 중...`);
        const response = await service.fn(message, service.key);
        console.log(`${service.name} 성공!`);
        return { service: service.name, response };
      } catch (error) {
        console.warn(`${service.name} 실패:`, error.message);
        continue;
      }
    }
    throw new Error('모든 AI 서비스가 실패했습니다.');
  }
}
```

### 사용량 추적
```typescript
class AIUsageTracker {
  private usage = new Map<string, number>();

  async trackUsage<T>(
    service: string, 
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      
      this.usage.set(service, (this.usage.get(service) || 0) + 1);
      console.log(`${service}: ${duration}ms`);
      
      return result;
    } catch (error) {
      console.error(`${service} 오류:`, error.message);
      throw error;
    }
  }

  getUsageStats() {
    return Object.fromEntries(this.usage);
  }
}
```

---

## ✅ 모범 사례

### API 키 보안
```typescript
// ✅ 권장: 환경 변수 사용
const apiKey = process.env.ANTHROPIC_API_KEY;

// ❌ 권장하지 않음: 하드코딩
const apiKey = 'sk-...'; // 절대 하지 마세요!
```

### 오류 처리
```typescript
async function robustAICall() {
  try {
    const response = await chatClaude(
      '복잡한 질문입니다.',
      process.env.ANTHROPIC_API_KEY,
      { max_tokens: 1000 }
    );
    return response;
  } catch (error) {
    console.error('AI 호출 실패:', error.message);
    
    // 사용자 친화적 폴백
    return {
      content: [{ 
        text: '죄송합니다. AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.' 
      }]
    };
  }
}
```

### 비용 최적화
```typescript
class CostOptimizedAI {
  async getCheapestResponse(message: string) {
    // 비용이 낮은 서비스부터 시도
    const services = [
      { name: 'gemini', fn: chatGemini, key: process.env.GOOGLE_API_KEY },
      { name: 'claude', fn: chatClaude, key: process.env.ANTHROPIC_API_KEY },
      { name: 'gpt', fn: chatGpt, key: process.env.OPENAI_API_KEY }
    ];

    for (const service of services) {
      try {
        return await service.fn(message, service.key, { 
          max_tokens: 500  // 토큰 제한으로 비용 절약
        });
      } catch (error) {
        console.warn(`${service.name} 실패, 다음 서비스 시도 중...`);
      }
    }
  }
}
```

### 타입 안전성
```typescript
// AI 응답에 대한 타입 정의
interface AIResponse {
  content: string;
  service: string;
  tokens_used?: number;
  cost_estimate?: number;
}

// 응답 정규화 함수
function normalizeResponse(response: any, service: string): AIResponse {
  switch (service) {
    case 'gpt':
      return {
        content: response.choices[0].message.content,
        service: 'openai',
        tokens_used: response.usage?.total_tokens
      };
    
    case 'claude':
      return {
        content: response.content[0].text,
        service: 'anthropic',
        tokens_used: response.usage?.input_tokens + response.usage?.output_tokens
      };
    
    case 'gemini':
      return {
        content: response,
        service: 'google'
      };
    
    default:
      throw new Error(`지원되지 않는 서비스: ${service}`);
  }
}
```

---

## 🛠️ 실제 사용 예제

### 예제 1: AI 코드 리뷰어
```typescript
class AICodeReviewer {
  async reviewCode(code: string, language: string) {
    const prompt = `
다음 ${language} 코드를 리뷰해주세요:

\`\`\`${language}
${code}
\`\`\`

다음 항목들을 검토해주세요:
1. 코드 품질
2. 성능 문제
3. 보안 취약점
4. 개선 제안
`;

    const review = await chatClaude(prompt, process.env.ANTHROPIC_API_KEY, {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000
    });

    return review.content[0].text;
  }
}

// 사용법
const reviewer = new AICodeReviewer();
const review = await reviewer.reviewCode(`
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
`, 'javascript');
```

### 예제 2: 다국어 번역기
```typescript
class AITranslator {
  async translate(text: string, targetLanguage: string) {
    const prompt = `다음 텍스트를 ${targetLanguage}로 번역해주세요: "${text}"`;
    
    return await chatGemini(prompt, process.env.GOOGLE_API_KEY, {
      temperature: 0.1,  // 일관된 번역을 위해 낮은 창의성
      maxOutputTokens: 1000
    });
  }

  async detectLanguage(text: string) {
    const prompt = `다음 텍스트의 언어를 감지해주세요: "${text}". 언어 이름만 답변해주세요.`;
    
    return await chatGpt(prompt, process.env.OPENAI_API_KEY, {
      max_tokens: 50,
      temperature: 0
    });
  }
}
```

### 예제 3: 실시간 정보 검색
```typescript
class RealTimeInfoService {
  async getLatestInfo(topic: string) {
    const prompt = `${topic}에 대한 최신 정보와 뉴스를 알려주세요.`;
    
    return await chatPerplexity(prompt, process.env.PERPLEXITY_API_KEY, {
      search_recency_filter: 'day',
      return_related_questions: true,
      max_tokens: 1500
    });
  }

  async getCompanyInfo(companyName: string) {
    const prompt = `${companyName} 회사에 대한 최신 정보를 알려주세요.`;
    
    return await chatPerplexity(prompt, process.env.PERPLEXITY_API_KEY, {
      search_domain_filter: ['bloomberg.com', 'reuters.com', 'cnbc.com'],
      search_recency_filter: 'week'
    });
  }
}
```

---

## 🔧 문제해결

### 일반적인 문제

#### API 키 인증 오류
```typescript
// API 키 유효성 확인
async function validateApiKeys() {
  const tests = [
    { name: 'OpenAI', fn: () => chatGpt('test', process.env.OPENAI_API_KEY) },
    { name: 'Claude', fn: () => chatClaude('test', process.env.ANTHROPIC_API_KEY) },
    { name: 'Gemini', fn: () => chatGemini('test', process.env.GOOGLE_API_KEY) },
    { name: 'Perplexity', fn: () => chatPerplexity('test', process.env.PERPLEXITY_API_KEY) }
  ];

  for (const test of tests) {
    try {
      await test.fn();
      console.log(`✅ ${test.name} API 키가 유효합니다`);
    } catch (error) {
      console.error(`❌ ${test.name} API 키 문제:`, error.message);
    }
  }
}
```

#### 속도 제한 처리
```typescript
class RateLimitHandler {
  private lastRequestTime = new Map<string, number>();
  private minInterval = 1000; // 1초 간격

  async withRateLimit<T>(
    service: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const lastTime = this.lastRequestTime.get(service) || 0;
    const timeSinceLastRequest = Date.now() - lastTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      console.log(`${service} 속도 제한: ${waitTime}ms 대기 중...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime.set(service, Date.now());
    return operation();
  }
}
```

#### 네트워크 오류 복구
```typescript
async function retryableAICall<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 지수 백오프
        console.log(`재시도 ${i + 1}/${maxRetries}: ${delay}ms 후 재시도`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}
```

### 디버그 모드
```typescript
// 디버그 로깅 활성화
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(service: string, message: string, data?: any) {
  if (DEBUG) {
    console.log(`[DEBUG:${service}] ${message}`, data || '');
  }
}

// AI 호출에서 사용법
async function debuggedAICall() {
  debugLog('claude', 'API 호출 시작');
  const response = await chatClaude('테스트', process.env.ANTHROPIC_API_KEY);
  debugLog('claude', '응답 받음', { 
    length: response.content[0].text.length,
    tokens: response.usage.output_tokens 
  });
  return response;
}
```

---

*최종 업데이트: 2025-08-30*  
*버전: 1.0*