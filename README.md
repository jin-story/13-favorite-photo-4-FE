# 최애의 포토 - Frontend

디지털 포토카드를 직접 만들고, 포인트로 구매하거나 다른 사용자와 교환할 수 있는 **최애의 포토** 서비스의 프런트엔드 레포지토리입니다.

## 주요 기능

- 서비스 소개 랜딩 페이지
- 이메일 회원가입·로그인·로그아웃
- Google OAuth 로그인
- Access Token 재발급을 포함한 인증 상태 관리
- 포토카드 마켓 목록 조회, 검색, 필터, 정렬 및 무한 스크롤
- 보유 포토카드 판매 등록·수정·판매 취소
- 포토카드 상세 조회 및 포인트 구매
- 포토카드 교환 제안·승인·거절·취소
- 내 포토카드 갤러리 조회 및 포토카드 생성
- 내 판매 포토카드 조회
- 랜덤 포인트 뽑기
- 알림 목록 조회 및 읽음 상태 표시
- 모바일·태블릿·PC 반응형 UI

## 기술 스택

- Next.js 16 App Router
- React 19
- JavaScript
- Tailwind CSS 4
- TanStack Query 5
- Motion
- Vaul
- React Intersection Observer
- Swiper
- ESLint
- Husky
- Commitlint
- Vercel

## 로컬 개발 환경 설정

### 1. 레포지토리 클론 및 패키지 설치

```bash
git clone <FRONTEND_REPOSITORY_URL>
cd 13-favorite-photo-4-FE
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env`를 생성합니다.

```env
BACKEND_ORIGIN=http://localhost:3001
```

`BACKEND_ORIGIN`에는 함께 실행할 백엔드 서버의 주소를 입력합니다. 배포 환경에서는 배포된 백엔드 주소를 설정합니다.

> `.env`에는 환경별 실제 값을 입력하고 Git에 커밋하지 않습니다.

### 3. 백엔드 실행

인증, 포토카드, 마켓, 교환 및 포인트 기능을 사용하려면 백엔드 서버가 필요합니다. 백엔드 레포지토리의 README를 참고해 서버를 먼저 실행합니다.

기본 백엔드 주소:

```text
http://localhost:3001
```

### 4. 개발 서버 실행

```bash
npm run dev
```

기본 프런트엔드 주소:

```text
http://localhost:3000
```

## API 연결 구조

브라우저는 프런트엔드와 동일한 Origin의 경로로 API를 요청합니다. Next.js Rewrite가 해당 요청을 `BACKEND_ORIGIN`으로 전달합니다.

```text
브라우저 요청
→ Next.js Rewrite
→ Express API
→ 응답 렌더링 및 TanStack Query 캐시 갱신
```

Rewrite가 적용되는 API prefix는 다음과 같습니다.

- `/auth`
- `/users`
- `/photo-cards`
- `/market-postings`
- `/exchange-proposals`
- `/point-draws`

세부 API 요청·응답 형식은 백엔드 Swagger 문서를 기준으로 확인합니다.

## 인증 구조

### Access Token

- 로그인·회원가입 성공 시 발급받습니다.
- 프런트엔드의 HttpOnly 쿠키에 저장합니다.
- 보호된 API 요청에 Bearer Token으로 전달합니다.
- API가 `401 Unauthorized`를 반환하면 Refresh Token을 이용해 재발급을 시도합니다.

### Refresh Token

- 백엔드가 HttpOnly 쿠키로 발급합니다.
- Access Token 재발급 요청에 사용합니다.
- 재발급 성공 시 원래 요청을 새 Access Token으로 다시 실행합니다.
- 로그아웃 시 프런트엔드 인증 쿠키를 제거합니다.

인증이 필요한 페이지는 메인 레이아웃에서 인증 상태를 확인하고, 인증되지 않은 사용자를 로그인 페이지로 이동시킵니다.

## 주요 페이지

| 경로 | 설명 | 인증 |
| --- | --- | --- |
| `/` | 서비스 소개 랜딩 페이지 | 불필요 |
| `/login` | 이메일 및 Google 로그인 | 불필요 |
| `/register` | 회원가입 | 불필요 |
| `/oauth/callback` | Google OAuth 로그인 처리 | 불필요 |
| `/api/auth/callback` | Google OAuth 인증 결과 처리 | 불필요 |
| `/market-posting` | 마켓 판매글 목록 | 불필요 |
| `/market-posting/:id` | 판매자용 판매글 상세 | 필요 |
| `/market-posting/:id/buyer` | 구매자용 판매글 상세 | 필요 |
| `/market-posting/sell-success` | 판매 등록 성공 결과 | 불필요 |
| `/market-posting/sell-fail` | 판매 등록 실패 결과 | 불필요 |
| `/market-posting/:id/buyer/purchase-success` | 구매 성공 결과 | 필요 |
| `/market-posting/:id/buyer/purchase-error` | 구매 실패 결과 | 필요 |
| `/market-posting/:id/buyer/exchange-success` | 교환 제안 성공 결과 | 필요 |
| `/market-posting/:id/buyer/exchange-error` | 교환 제안 실패 결과 | 필요 |
| `/my-gallery` | 내 보유 포토카드 조회 | 필요 |
| `/my-gallery/create` | 포토카드 생성 | 필요 |
| `/my-listings` | 내 판매 포토카드 조회 | 필요 |

> URL의 `:id`는 실제 Next.js 라우트에서 `[id]` 동적 세그먼트에 해당합니다.

## 상태 및 데이터 관리

- TanStack Query로 서버 상태를 조회하고 캐시합니다.
- 마켓 목록은 커서 기반 무한 스크롤을 사용합니다.
- 검색어는 debounce 후 요청에 반영합니다.
- 인증 사용자와 알림 상태는 Context Provider에서 관리합니다.
- 공통 모달과 랜덤 포인트 상태도 Provider로 관리합니다.
- API 요청 로직은 `src/lib/services/`에 기능별로 분리합니다.

## 폴더 구조

```text
13-favorite-photo-4-FE/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (main)/
│   │   ├── market-posting/
│   │   ├── oauth/
│   │   ├── global-error.jsx
│   │   ├── layout.jsx
│   │   ├── loading.jsx
│   │   ├── not-found.jsx
│   │   └── providers.jsx
│   ├── assets/
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   └── modals/
│   ├── hooks/
│   ├── lib/
│   │   ├── actions/
│   │   ├── services/
│   │   └── utils/
│   └── providers/
├── next.config.mjs
├── package.json
└── README.md
```

## 디렉터리 역할

| 경로 | 역할 |
| --- | --- |
| `src/app/` | App Router 페이지, 레이아웃 및 페이지 전용 컴포넌트 |
| `src/components/common/` | 여러 화면에서 재사용하는 공통 UI 컴포넌트 |
| `src/components/modals/` | 공통 모달 콘텐츠 |
| `src/providers/` | 인증, Query, 모달 및 랜덤 포인트 전역 상태 |
| `src/lib/actions/` | 쿠키를 다루는 Server Action |
| `src/lib/services/` | 도메인별 API 요청 함수 |
| `src/lib/utils/` | 공통 fetch 클라이언트와 유틸리티 |
| `src/hooks/` | debounce, countdown 등 공통 React Hook |
| `src/assets/` | 폰트, 아이콘 및 이미지 리소스 |

## npm 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | Next.js 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |

## 검증

변경 사항을 제출하기 전에 다음 명령을 실행합니다.

```bash
npm run lint
npm run build
```

화면 변경은 모바일·태블릿·PC 크기에서 확인하고, 관련 사용자 흐름이 백엔드 API 응답까지 정상적으로 이어지는지 검증합니다.

## 관련 레포지토리

- Backend: [jin-story/13-favorite-photo-4-BE](https://github.com/jin-story/13-favorite-photo-4-BE)
