# 기능 명세서
## JNU-AI: AI API 통합 라이브러리

### 📋 문서 정보
- **문서 유형**: 기능 명세서
- **버전**: 1.0
- **최종 업데이트**: 2025-08-30
- **대상 독자**: 개발자, 통합 엔지니어, API 소비자

---

## 1. 개요 및 범위

### 1.1 라이브러리 목적
JNU-AI는 OpenAI GPT, Anthropic Claude, Google Gemini, Perplexity를 포함한 주요 AI 서비스와 통합하기 위한 통합 TypeScript 인터페이스를 제공합니다. 플랫폼 간 타입 안전성과 일관된 오류 처리를 유지하면서 서비스별 구현 세부 사항을 추상화합니다.

### 1.2 지원 서비스
- **OpenAI GPT**: ChatGPT 및 GPT-4 모델
- **Anthropic Claude**: Claude 3.5 Sonnet 및 최신 모델
- **Google Gemini**: Gemini 1.5 Flash 및 Pro 모델
- **Perplexity**: 실시간 검색 기반 AI 응답
- **웹 통합**: Chrome 자동화를 통한 웹 콘텐츠 처리 (계획됨)

### 1.3 통합 패턴
- **통합 API**: 서비스 간 일관된 함수 시그니처
- **타입 안전성**: 모든 작업에 대한 완전한 TypeScript 정의
- **오류 처리**: 재시도 메커니즘이 포함된 표준화된 오류 응답
- **인증**: 모든 서비스에 대한 안전한 자격 증명 관리

---

## 2. OpenAI GPT 통합 모듈

### 2.1 핵심 GPT 함수

#### 2.1.1 함수: `chatGpt(message: string, api_key: string, options?: ChatGPTOptions): Promise<ChatCompletionResponse>`
**목적**: OpenAI GPT 모델과 채팅 상호작용을 수행합니다.

**입력 명세**:
- `message: string` - AI에게 전송할 사용자 메시지
- `api_key: string` - OpenAI API 키
- `options?: ChatGPTOptions` - 선택적 생성 매개변수

**ChatGPTOptions 인터페이스**:
```typescript
interface ChatGPTOptions {
  model?: string;                    // 사용할 GPT 모델 (기본값: 'gpt-4-1106-preview')
  system?: string;                   // 시스템 프롬프트 (기본값: 'Be precise and concise.')
  max_tokens?: number;               // 최대 출력 토큰 (기본값: 4096)
  temperature?: number;              // 창의성 수준 0-2 (기본값: 0.2)
  top_p?: number;                    // 핵심 샘플링 (기본값: 0.9)
  frequency_penalty?: number;        // 빈도 페널티 (기본값: 1)
  presence_penalty?: number;         // 존재 페널티 (기본값: 0)
  stream?: boolean;                  // 스트리밍 응답 (기본값: false)
}
```

**출력 명세**:
- 반환값 `Promise<ChatCompletionResponse>` - OpenAI Chat Completion 응답
- 응답에는 생성된 텍스트, 사용량 통계, 모델 정보 포함
- 스트리밍이 활성화된 경우 스트림 객체 반환

**동작**:
- OpenAI Chat Completions API에 POST 요청 전송
- 시스템 메시지와 사용자 메시지를 메시지 배열로 구성
- 지정된 매개변수로 요청 본문 구성
- HTTP 상태 코드 및 응답 유효성 검증

**오류 처리**:
- 400: 잘못된 요청 매개변수
- 401: 잘못된 또는 만료된 API 키
- 429: 속도 제한 초과
- 500-503: 서버 오류 (재시도 가능)

---

## 3. Anthropic Claude 통합 모듈

### 3.1 핵심 Claude 함수

#### 3.1.1 함수: `chatClaude(message: string, api_key: string, options?: ClaudeOptions): Promise<MessageResponse>`
**목적**: Anthropic Claude 모델과 대화 상호작용을 수행합니다.

**입력 명세**:
- `message: string` - Claude에게 전송할 사용자 메시지
- `api_key: string` - Anthropic API 키
- `options?: ClaudeOptions` - 선택적 생성 매개변수

**ClaudeOptions 인터페이스**:
```typescript
interface ClaudeOptions {
  model?: string;                    // Claude 모델 (기본값: 'claude-3-5-sonnet-20241022')
  max_tokens?: number;               // 최대 출력 토큰 (기본값: 1024)
}
```

**출력 명세**:
- 반환값 `Promise<MessageResponse>` - Anthropic Messages API 응답
- 응답 구조:
```typescript
interface MessageResponse {
  content: ContentBlock[];
  model: string;
  role: 'assistant';
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ContentBlock {
  type: 'text';
  text: string;
}
```

**동작**:
- Anthropic SDK를 사용하여 Messages API 호출
- 사용자 메시지를 올바른 형식으로 구조화
- 지정된 모델과 매개변수로 메시지 생성
- 응답을 구조화된 형식으로 반환

**오류 처리**:
- 400: 잘못된 요청 형식
- 401: 인증 실패
- 429: 속도 제한
- 500+: 서버 오류

---

## 4. Google Gemini 통합 모듈

### 4.1 핵심 Gemini 함수

#### 4.1.1 함수: `chatGemini(message: string, api_key: string, options?: ChatGeminiOptions): Promise<string>`
**목적**: Google Gemini 모델로 텍스트를 생성합니다.

**입력 명세**:
- `message: string` - Gemini에게 전송할 프롬프트
- `api_key: string` - Google API 키 (필수)
- `options?: ChatGeminiOptions` - 선택적 생성 구성

**ChatGeminiOptions 인터페이스**:
```typescript
interface ChatGeminiOptions {
  model?: string;                    // 모델 이름 (기본값: 'gemini-1.5-flash')
  stopSequences?: string[];          // 생성 중단 시퀀스 (기본값: ['red'])
  maxOutputTokens?: number;          // 최대 출력 토큰 (기본값: 2048)
  temperature?: number;              // 창의성 수준 0-2 (기본값: 0.9)
  topP?: number;                     // 핵심 샘플링 (기본값: 0.1)
  topK?: number;                     // 탑-K 샘플링 (기본값: 16)
}
```

**출력 명세**:
- 반환값 `Promise<string>` - 생성된 텍스트 콘텐츠
- 응답에서 텍스트 내용만 추출하여 반환
- 스트리밍 및 복잡한 응답 형식 추상화

**동작**:
- Google Generative AI SDK 초기화
- 생성 구성으로 모델 인스턴스 생성
- 프롬프트로 콘텐츠 생성 요청
- 응답에서 텍스트 추출 및 반환

**오류 처리**:
- API 키 누락 시 명시적 오류 발생
- 생성 실패 시 상세한 오류 정보 제공
- 네트워크 오류에 대한 자동 재시도 (구현 예정)

---

## 5. Perplexity 통합 모듈

### 5.1 핵심 Perplexity 함수

#### 5.1.1 함수: `chatPerplexity(message: string, api_key: string, options?: PerplexityOptions): Promise<ChatResponse>`
**목적**: Perplexity의 검색 기반 AI로 실시간 정보 검색 및 응답을 수행합니다.

**입력 명세**:
- `message: string` - 검색 및 분석할 질문 또는 주제
- `api_key: string` - Perplexity API 키 (필수)
- `options?: PerplexityOptions` - 선택적 검색 및 생성 매개변수

**PerplexityOptions 인터페이스**:
```typescript
interface PerplexityOptions {
  model?: string;                           // 모델 (기본값: 'llama-3.1-sonar-small-128k-online')
  system?: string;                          // 시스템 프롬프트 (기본값: 'Be precise and concise.')
  max_tokens?: number;                      // 최대 토큰 (기본값: 1000)
  temperature?: number;                     // 창의성 (기본값: 0.2)
  top_p?: number;                          // 핵심 샘플링 (기본값: 0.9)
  search_domain_filter?: string[];         // 검색 도메인 필터 (기본값: ['perplexity.ai'])
  return_images?: boolean;                 // 이미지 포함 (기본값: false)
  return_related_questions?: boolean;      // 관련 질문 포함 (기본값: false)
  search_recency_filter?: string;          // 검색 시기 필터 (기본값: 'month')
  top_k?: number;                          // 탑-K 샘플링 (기본값: 0)
  stream?: boolean;                        // 스트리밍 (기본값: false)
  presence_penalty?: number;               // 존재 페널티 (기본값: 0)
  frequency_penalty?: number;              // 빈도 페널티 (기본값: 1)
}
```

**출력 명세**:
- 반환값 `Promise<ChatResponse>` - Perplexity Chat Completion 응답
- OpenAI 호환 응답 형식
- 검색 기반 실시간 정보 포함
- 선택적으로 이미지 및 관련 질문 포함

**동작**:
- Perplexity Chat Completions API에 POST 요청
- 시스템 및 사용자 메시지를 메시지 배열로 구성
- 검색 매개변수 및 생성 설정 적용
- HTTP 응답 상태 및 콘텐츠 검증

**검색 기능**:
- **도메인 필터링**: 특정 웹사이트에서만 정보 검색
- **시기 필터**: 최신 정보 우선 검색 (day, week, month, year)
- **이미지 검색**: 관련 이미지 URL 포함
- **관련 질문**: 추가 탐색을 위한 관련 질문 제안

---

## 6. 웹 통합 모듈 (계획됨)

### 6.1 웹 콘텐츠 페치 함수

#### 6.1.1 함수: `fetchByChrome(source: string, email?: string): Promise<PageContent>`
**목적**: Chrome 자동화를 통해 웹 페이지 콘텐츠를 추출합니다.

**입력 명세**:
- `source: string` - 추출할 웹 페이지 URL
- `email?: string` - 선택적 사용자 이메일 (기본값에서 사용)

**출력 명세**:
- 반환값 `Promise<PageContent>` - 추출된 페이지 콘텐츠
```typescript
interface PageContent {
  title: string;        // 정리된 페이지 제목 (최대 100자)
  content: string;      // 원본 HTML 콘텐츠
  markdown: string;     // 변환된 마크다운 콘텐츠
}
```

**동작** (현재 주석 처리됨):
- Chrome 브라우저 인스턴스 시작
- 지정된 URL로 이동 및 페이지 로딩 대기
- 페이지 소스 HTML 추출
- 제목 정리 (파일명 안전 문자로 변환)
- HTML을 마크다운으로 변환
- 메타데이터와 함께 구조화된 결과 반환

**Chrome 설정**:
```typescript
const chromeOptions = {
  arguments: [
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-blink-features=AutomationControlled',
    '--disable-extensions',
    '--start-maximized',
    '--window-size=1920,1080',
    '--disable-web-security',
    '--allow-running-insecure-content'
  ]
};
```

---

## 7. 타입 정의 및 인터페이스

### 7.1 공통 타입 정의 (`src/types.ts`)

#### 7.1.1 메시지 타입
```typescript
interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

#### 7.1.2 응답 정규화 타입
```typescript
interface NormalizedResponse {
  content: string;
  service: string;
  model: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  metadata?: Record<string, any>;
}
```

#### 7.1.3 오류 타입
```typescript
interface AIError {
  service: 'openai' | 'claude' | 'gemini' | 'perplexity';
  type: 'network' | 'auth' | 'validation' | 'rate_limit' | 'server';
  message: string;
  code?: string | number;
  retryable: boolean;
  originalError?: Error;
}
```

---

## 8. 오류 처리 명세

### 8.1 표준화된 오류 응답

#### 8.1.1 오류 분류 시스템
- **네트워크 오류**: 연결 실패, 타임아웃, DNS 문제
- **인증 오류**: 잘못된 API 키, 만료된 토큰, 권한 부족
- **검증 오류**: 잘못된 입력 데이터, 매개변수 오류
- **속도 제한**: API 속도 제한 초과, 할당량 소진
- **서버 오류**: 서비스 사용 불가, 내부 서버 오류

### 8.2 서비스별 오류 처리

#### 8.2.1 OpenAI 오류 처리
- **400 Bad Request**: 잘못된 요청 매개변수 또는 형식
- **401 Unauthorized**: 유효하지 않은 API 키
- **403 Forbidden**: 권한 부족 또는 계정 문제
- **429 Too Many Requests**: 속도 제한 초과
- **500-503 Server Errors**: 서버 문제 (재시도 가능)

#### 8.2.2 Anthropic Claude 오류 처리
- **400 Bad Request**: 잘못된 메시지 형식 또는 매개변수
- **401 Unauthorized**: 잘못된 API 키
- **429 Too Many Requests**: 속도 제한 초과
- **500+ Server Errors**: 내부 서버 오류

#### 8.2.3 Google Gemini 오류 처리
- **400 Bad Request**: 잘못된 프롬프트 또는 구성
- **401/403 Authentication**: API 키 문제
- **429 Quota Exceeded**: 할당량 초과
- **500+ Server Errors**: Google 서비스 오류

#### 8.2.4 Perplexity 오류 처리
- **400 Bad Request**: 잘못된 검색 매개변수
- **401 Unauthorized**: 유효하지 않은 API 키
- **429 Rate Limited**: 속도 제한 초과
- **500-503 Server Errors**: 서비스 오류

### 8.3 재시도 로직 및 복구

#### 8.3.1 자동 재시도 조건
- 네트워크 타임아웃 및 연결 실패
- 서비스 사용 불가 (503) 응답
- Retry-After 헤더가 포함된 속도 제한 (429)
- 임시 서버 오류 (5xx 범위)

#### 8.3.2 지수 백오프 전략
```typescript
const retryDelays = [1000, 2000, 4000, 8000, 16000]; // 밀리초
```
- 1초 후 초기 재시도
- 이후 각 재시도마다 지연 시간 두 배
- 최대 5회 재시도 시도
- 서비스별 속도 제한 헤더 준수

---

## 9. 사용자 정의 및 확장성

### 9.1 사용자 정의 모듈 (`src/custom/`)

#### 9.1.1 확장 가능한 아키텍처
**목적**: 새로운 AI 서비스 또는 사용자 정의 처리 로직을 추가할 수 있는 플러그인 시스템을 제공합니다.

**확장 인터페이스**:
```typescript
interface AIServicePlugin {
  name: string;
  chat: (message: string, apiKey: string, options?: any) => Promise<any>;
  normalizeResponse: (response: any) => NormalizedResponse;
  handleError: (error: Error) => AIError;
}
```

#### 9.1.2 미들웨어 시스템
```typescript
interface AIMiddleware {
  beforeRequest?: (request: any) => any;
  afterResponse?: (response: any) => any;
  onError?: (error: Error) => Error | void;
}
```

---

## 10. 성능 및 확장성

### 10.1 요청 최적화
- **연결 풀링**: HTTP 연결 재사용으로 지연 시간 감소
- **요청 배칭**: 지원되는 경우 여러 요청 결합
- **응답 캐싱**: 반복 요청에 대한 캐싱 메커니즘
- **압축**: 대용량 응답에 gzip/deflate 활성화

### 10.2 속도 제한 관리
- **OpenAI**: 분당 3,500개 요청 (Tier 2)
- **Anthropic**: 분당 1,000개 요청
- **Google**: 분당 300개 요청 (무료 tier)
- **Perplexity**: 분당 20개 요청 (무료 tier)
- **요청 대기열**: 속도 제한을 준수하기 위한 자동 대기열

### 10.3 메모리 관리
- **스트리밍**: 대용량 응답에 스트림 사용
- **가비지 컬렉션**: 작업 후 최소한의 객체 보유
- **메모리 모니터링**: 선택적 메모리 사용량 추적

---

## 11. 보안 및 프라이버시

### 11.1 API 키 보안
- **환경 변수**: API 키는 환경 변수에서만 로드
- **로깅 제외**: API 키 정보를 로그에서 자동 제외
- **메모리 관리**: 사용 후 민감한 데이터 즉시 해제

### 11.2 데이터 프라이버시
- **로컬 처리**: 사용자 데이터는 로컬에서만 처리
- **전송 암호화**: HTTPS를 통한 모든 API 통신
- **로그 정책**: 민감한 프롬프트 내용 로깅 금지

### 11.3 입력 검증
```typescript
function validateInput(message: string, apiKey: string): void {
  if (!message || message.trim().length === 0) {
    throw new Error('메시지는 비어있을 수 없습니다');
  }
  
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API 키가 필요합니다');
  }
  
  if (message.length > 100000) {
    throw new Error('메시지가 너무 깁니다 (최대 100,000자)');
  }
}
```

---

## 12. 모니터링 및 로깅

### 12.1 구조화된 로깅
```typescript
interface LogEntry {
  timestamp: string;
  service: string;
  operation: string;
  duration_ms: number;
  success: boolean;
  error?: string;
  tokens_used?: number;
}
```

### 12.2 메트릭 수집
- **요청 수**: 서비스별 API 호출 횟수
- **성공률**: 서비스별 성공/실패 비율
- **응답 시간**: 평균 및 백분위수 응답 시간
- **토큰 사용량**: 비용 추적을 위한 토큰 사용량
- **오류율**: 오류 타입별 발생 빈도

### 12.3 건상성 체크
```typescript
async function healthCheck(): Promise<HealthStatus> {
  const services = ['openai', 'claude', 'gemini', 'perplexity'];
  const health: HealthStatus = {};

  for (const service of services) {
    try {
      const startTime = Date.now();
      await testServiceConnection(service);
      const responseTime = Date.now() - startTime;
      
      health[service] = {
        status: 'healthy',
        response_time_ms: responseTime
      };
    } catch (error) {
      health[service] = {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  return health;
}
```

---

*문서 버전: 1.0*  
*최종 업데이트: 2025-08-30*  
*다음 검토: 2025-09-30*