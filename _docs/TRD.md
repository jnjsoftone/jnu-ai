# 기술 요구사항 정의서
## JNU-AI: AI API 통합 라이브러리

### 📋 문서 정보
- **문서 유형**: 기술 요구사항 정의서 (TRD)
- **버전**: 1.0
- **최종 업데이트**: 2025-08-30
- **대상 독자**: 개발자, 아키텍트, DevOps 엔지니어

---

## 1. 시스템 아키텍처

### 1.1 전체 시스템 구조
```
JNU-AI Library
├── API Integration Layer
│   ├── OpenAI GPT Client
│   ├── Anthropic Claude Client  
│   ├── Google Gemini Client
│   └── Perplexity Client
├── Abstraction Layer
│   ├── Unified Interface
│   ├── Request/Response Normalizer
│   └── Error Handler
├── Web Integration Layer
│   ├── Content Fetcher
│   ├── HTML to Markdown Converter
│   └── Chrome Automation
└── Utility Layer
    ├── Type Definitions
    ├── Configuration Manager
    └── Logging System
```

### 1.2 모듈 설계

#### API 통합 모듈 (`src/api/`)
- **목적**: 각 AI 서비스의 네이티브 API 클라이언트 구현
- **책임**: 서비스별 인증, 요청 형식화, 응답 파싱
- **인터페이스**: 일관된 함수 시그니처 유지

#### 웹 통합 모듈 (`src/web/`)
- **목적**: 웹 콘텐츠 추출 및 AI 프롬프트 통합
- **책임**: URL 페치, HTML 파싱, 마크다운 변환
- **의존성**: jnu-web (Chrome 자동화), jnu-abc (유틸리티)

#### 사용자 정의 모듈 (`src/custom/`)
- **목적**: 확장 가능한 아키텍처로 사용자 정의 기능 지원
- **책임**: 플러그인 시스템, 커스텀 처리기
- **확장성**: 새로운 AI 서비스 또는 처리 로직 추가

---

## 2. AI 서비스 통합 세부사항

### 2.1 OpenAI GPT 통합

#### 기술 명세
- **SDK**: 공식 OpenAI JavaScript SDK 사용
- **인증**: Bearer 토큰 기반 API 키
- **엔드포인트**: `https://api.openai.com/v1/chat/completions`
- **모델 지원**: GPT-4, GPT-3.5-turbo, 최신 모델

#### 구현 아키텍처
```typescript
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
```

#### 오류 처리
- **429 Too Many Requests**: 지수 백오프 재시도
- **401 Unauthorized**: API 키 검증 오류
- **500+ Server Errors**: 자동 폴백 서비스 활성화

### 2.2 Anthropic Claude 통합

#### 기술 명세
- **SDK**: @anthropic-ai/sdk 공식 패키지
- **인증**: API 키 기반 인증
- **모델**: claude-3-5-sonnet-20241022 (기본값)
- **메시지 형식**: Anthropic Messages API 형식

#### 구현 특징
```typescript
interface ClaudeOptions {
  model?: string;
  max_tokens?: number;
}

// 응답 구조
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

### 2.3 Google Gemini 통합

#### 기술 명세
- **SDK**: @google/generative-ai 공식 패키지
- **인증**: API 키 기반
- **모델**: gemini-1.5-flash (기본값)
- **기능**: 텍스트 생성, 멀티모달 입력 지원

#### 구성 매개변수
```typescript
interface ChatGeminiOptions {
  model?: string;
  stopSequences?: string[];
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}
```

### 2.4 Perplexity 통합

#### 기술 명세
- **API**: REST API 직접 호출
- **인증**: Bearer 토큰
- **모델**: llama-3.1-sonar-small-128k-online
- **특징**: 실시간 검색 기반 응답

#### 고급 기능
```typescript
interface PerplexityOptions {
  search_domain_filter?: string[];
  return_images?: boolean;
  return_related_questions?: boolean;
  search_recency_filter?: string;
}
```

---

## 3. 데이터 흐름 및 처리

### 3.1 요청 처리 파이프라인
```
사용자 입력
    ↓
입력 검증 및 전처리
    ↓
서비스 선택 로직
    ↓
서비스별 요청 형식화
    ↓
API 호출 실행
    ↓
응답 정규화
    ↓
후처리 및 반환
```

### 3.2 웹 콘텐츠 처리 파이프라인
```
URL 입력
    ↓
Chrome 브라우저 시작
    ↓
페이지 로딩 및 렌더링
    ↓
DOM 콘텐츠 추출
    ↓
HTML → 마크다운 변환
    ↓
콘텐츠 정리 및 구조화
    ↓
AI 프롬프트에 통합
```

### 3.3 오류 처리 흐름
```
API 요청 실행
    ↓
오류 발생?
    ├─ No → 응답 반환
    └─ Yes → 오류 분류
         ├─ 재시도 가능? → 지수 백오프 재시도
         ├─ 폴백 가능? → 대체 서비스 시도
         └─ 복구 불가능? → 상세 오류 정보 반환
```

---

## 4. 보안 및 인증

### 4.1 API 키 관리
- **저장**: 환경 변수 (.env 파일)
- **전송**: HTTPS 전용, 헤더에 Bearer 토큰
- **로깅**: API 키 정보 로그에서 제외
- **검증**: 시작 시 API 키 유효성 확인

### 4.2 데이터 보안
- **전송 중 보안**: TLS 1.2+ 암호화
- **메모리 보안**: 민감한 데이터 즉시 해제
- **로깅 보안**: 개인정보 및 민감한 프롬프트 로그 제외

### 4.3 접근 제어
- **권한 검증**: 각 서비스별 적절한 권한 확인
- **속도 제한**: 서비스별 요청 제한 준수
- **감사 추적**: 중요한 작업에 대한 로그 기록

---

## 5. 성능 및 확장성

### 5.1 성능 최적화 전략

#### 연결 관리
- **연결 풀링**: HTTP 연결 재사용으로 지연 시간 감소
- **Keep-Alive**: 지속적 연결 유지
- **타임아웃**: 적절한 타임아웃 설정으로 리소스 누수 방지

#### 요청 최적화
- **배칭**: 가능한 경우 여러 요청 결합
- **병렬 처리**: 독립적 요청 병렬 실행
- **캐싱**: 반복되는 요청 결과 캐싱

### 5.2 메모리 관리
- **스트리밍**: 대용량 응답에 대한 스트리밍 처리
- **가비지 컬렉션**: 사용 후 객체 참조 해제
- **메모리 모니터링**: 메모리 사용량 추적 및 경고

### 5.3 확장성 설계
- **무상태**: 서비스 클라이언트는 상태를 유지하지 않음
- **수평 확장**: 여러 인스턴스에서 독립적 실행
- **부하 분산**: 여러 API 키 또는 엔드포인트 간 부하 분산

---

## 6. 오류 처리 및 복구

### 6.1 오류 분류 시스템
```typescript
enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth', 
  VALIDATION = 'validation',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server'
}

interface AIError {
  service: 'openai' | 'claude' | 'gemini' | 'perplexity';
  type: ErrorType;
  message: string;
  code?: string | number;
  retryable: boolean;
  originalError?: Error;
}
```

### 6.2 재시도 메커니즘
- **지수 백오프**: 1s → 2s → 4s → 8s → 16s
- **재시도 조건**: 네트워크 오류, 서버 오류, 속도 제한
- **최대 재시도**: 5회 시도 후 최종 실패
- **재시도 불가**: 인증 오류, 검증 오류

### 6.3 폴백 전략
- **서비스 폴백**: 주 서비스 실패 시 대체 서비스 사용
- **기본값 폴백**: 모든 서비스 실패 시 기본 응답 반환
- **우아한 성능 저하**: 부분적 기능으로 서비스 지속

---

## 7. 모니터링 및 로깅

### 7.1 로깅 전략
- **구조화된 로깅**: JSON 형식으로 구조화된 로그
- **로그 레벨**: ERROR, WARN, INFO, DEBUG
- **민감한 정보**: API 키 및 사용자 데이터 로그 제외
- **성능 로깅**: 요청 시간, 응답 크기, 오류율

### 7.2 메트릭 수집
```typescript
interface Metrics {
  request_count: number;
  success_rate: number;
  average_response_time: number;
  error_rate_by_service: Record<string, number>;
  token_usage: Record<string, number>;
  cost_tracking: Record<string, number>;
}
```

### 7.3 건상성 체크
- **API 연결성**: 각 서비스 엔드포인트 상태 확인
- **응답 시간**: 서비스별 응답 시간 모니터링
- **오류율**: 임계값 초과 시 알림
- **토큰 사용량**: 비용 추적 및 예산 관리

---

## 8. 배포 및 운영

### 8.1 패키지 배포
- **빌드 시스템**: SWC를 사용한 고속 트랜스파일링
- **출력 형식**: CommonJS, ES Modules, TypeScript 선언 파일
- **패키지 크기**: 최적화된 번들 크기 (<500KB)
- **의존성**: 최소 의존성으로 충돌 위험 감소

### 8.2 버전 관리
- **시맨틱 버저닝**: MAJOR.MINOR.PATCH 형식
- **하위 호환성**: 마이너 버전 업데이트 시 호환성 유지
- **마이그레이션**: 주요 변경 시 마이그레이션 가이드 제공

### 8.3 환경 지원
- **Node.js**: 16.0+ (LTS 버전 권장)
- **TypeScript**: 4.5+ 완전 지원
- **런타임**: 서버, 브라우저 (Webpack/Vite 번들링)

---

## 9. 개발 도구 및 워크플로우

### 9.1 개발 환경
- **언어**: TypeScript 4.9.5
- **빌드 도구**: SWC (고속 컴파일)
- **테스트**: Jest 29.7.0
- **린팅**: TypeScript 컴파일러 검사

### 9.2 테스트 전략
```bash
# 단위 테스트
npm run test:unit

# 통합 테스트  
npm run test:integration

# E2E 테스트
npm run test:e2e

# 커버리지 테스트
npm run test:coverage
```

### 9.3 CI/CD 파이프라인
- **빌드**: 자동 타입 검사 및 컴파일
- **테스트**: 모든 테스트 스위트 실행
- **품질 검사**: 코드 품질 및 보안 스캔
- **배포**: 자동 NPM 패키지 게시

---

## 10. 외부 의존성 및 통합

### 10.1 핵심 의존성

#### AI 서비스 SDK
```json
{
  "@anthropic-ai/sdk": "^0.36.3",
  "@google/generative-ai": "^0.21.0"
}
```

#### 내부 유틸리티
```json
{
  "jnu-abc": "^0.0.4",
  "jnu-web": "^0.0.2"
}
```

#### 환경 관리
```json
{
  "dotenv": "^16.4.7"
}
```

### 10.2 선택적 의존성
- **Chrome 자동화**: jnu-web 패키지를 통한 웹 스크래핑
- **추가 AI 서비스**: 플러그인 방식으로 확장 가능
- **모니터링**: 선택적 메트릭 수집 및 로깅

---

## 11. 성능 요구사항

### 11.1 응답시간 목표
- **평균 응답 시간**: 2초 미만
- **95% 백분위수**: 5초 미만
- **타임아웃**: 30초 (조정 가능)

### 11.2 처리량 요구사항
- **동시 요청**: 100개 이상
- **초당 요청**: 50개 이상 (서비스 제한 내)
- **메모리 사용량**: 50MB 미만 (기본 Node.js 환경)

### 11.3 확장성 목표
- **수평 확장**: 무상태 설계로 인스턴스 복제 가능
- **부하 처리**: 급증하는 트래픽에 대한 우아한 성능 저하
- **리소스 효율성**: CPU 및 메모리 사용량 최적화

---

## 12. 품질 보증

### 12.1 코드 품질 표준
- **TypeScript**: 엄격한 타입 검사 활성화
- **ESLint**: 코드 스타일 및 품질 규칙
- **Prettier**: 일관된 코드 형식화
- **타입 커버리지**: 95% 이상 타입 커버리지

### 12.2 테스트 커버리지 목표
- **단위 테스트**: 90% 이상 코드 커버리지
- **통합 테스트**: 모든 API 엔드포인트 테스트
- **E2E 테스트**: 핵심 사용 시나리오 테스트

### 12.3 보안 검사
- **취약성 스캔**: 의존성 취약성 정기 검사
- **API 키 검증**: 하드코딩된 키 검출 및 방지
- **입력 검증**: 모든 사용자 입력 검증 및 살균

---

*문서 버전: 1.0*  
*최종 업데이트: 2025-08-30*  
*다음 검토: 2025-09-30*