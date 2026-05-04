# Seeker APM Client

Vite + React 18 + TypeScript로 만드는 APM(Application Performance Monitoring) 대시보드 SPA. 폴링 기반 소규모 데이터, 트레이스/시계열/대시보드 시각화.

## Tech Stack

- **빌드**: Vite 5, TypeScript 5
- **UI**: React 18, React Router v6
- **데이터**: TanStack Query (폴링 주력), Axios, Zod
- **상태**: Zustand (전역 UI 상태)
- **시각화**: ECharts + echarts-for-react (시계열/대시보드), @visx (트레이스/커스텀)
- **테이블**: TanStack Table v8
- **스타일**: Tailwind CSS v3 + shadcn/ui
- **날짜**: date-fns + date-fns-tz
- **테스트**: Vitest + React Testing Library + jsdom, MSW

## Architecture — Feature-Sliced Design (FSD)

이 프로젝트는 **FSD**를 따릅니다. 모든 새로운 파일은 아래 규칙을 준수해야 합니다.

### 레이어 (위 → 아래로 의존)

```
src/
├── app/        # 앱 진입, Provider, 라우터, 전역 스타일
├── pages/      # 라우트 페이지 (얇게 — 조립만)
├── widgets/    # 여러 features/entities를 조합한 큰 UI 블록
├── features/   # 사용자 상호작용 단위 (검색/필터/선택 등)
├── entities/   # 도메인 객체 (Service, Trace, Span, Metric)
└── shared/     # 도메인 중립 공용 코드 (ui, lib, api, config, types, hooks)
```

### 임포트 규칙 (엄수)

1. **상위 레이어만 하위 레이어를 임포트할 수 있다.**
   - `app → pages → widgets → features → entities → shared` 순서.
   - 예: `features/`는 `entities/`, `shared/`만 임포트 가능. `widgets`, `pages`, `app` 임포트 금지.

2. **같은 레이어 내 슬라이스끼리 직접 임포트 금지.**
   - 예: `features/trace-search`는 `features/time-range-picker`를 직접 임포트 못 함.
   - 공유가 필요하면 하위 레이어(entities/shared)로 끌어내리거나, 상위(widgets)에서 조립.

3. **슬라이스 외부에서는 `index.ts` (public API)만 임포트한다.**
   - OK: `import { ServiceCard } from '@/entities/service'`
   - 금지: `import { ServiceCard } from '@/entities/service/ui/service-card'`

4. **절대 경로 `@/`만 사용.** 상대 경로는 같은 슬라이스 내부에서만 허용.

### 슬라이스 내부 구조 (세그먼트)

한 슬라이스(예: `entities/service/`) 내부는 필요한 것만 만듭니다:

```
entities/service/
├── ui/          # 해당 슬라이스 전용 컴포넌트
├── model/       # 타입, zustand 스토어, 비즈니스 로직
├── api/         # API 호출, TanStack Query 훅
├── lib/         # 슬라이스 전용 유틸
└── index.ts     # public API — 외부 공개할 것만 re-export
```

### 레이어별 가이드

- **app/**: `main.tsx`에서 임포트할 `App`, Provider 구성(`QueryClientProvider` 등), 라우터 정의. 여기에 비즈니스 로직 두지 말 것.
- **pages/**: 라우트 컴포넌트 = 얇게 조립. 페이지 내부에서 직접 API 호출하거나 복잡한 상태를 두면 widgets/features로 내릴 신호.
- **widgets/**: "대시보드 상단 헤더", "서비스 개요 패널" 같이 화면의 독립적인 큰 블록.
- **features/**: 사용자 행동. "시간 범위 선택기", "트레이스 검색 폼" 등.
- **entities/**: 도메인 모델. `Service`, `Trace`, `Span` 같은 핵심 개념과 그 표시 컴포넌트(`ServiceCard` 등).
- **shared/**: `shared/ui`는 shadcn/ui 컴포넌트(`Button`, `Dialog` 등), `shared/lib`는 `cn()` 같은 도메인 중립 유틸, `shared/api`는 axios 인스턴스/TanStack Query 설정.

## Conventions

### 파일명
- 컴포넌트 파일: `kebab-case.tsx` (예: `service-card.tsx`). export는 PascalCase.
- 훅: `use-xxx.ts`
- 모델/타입: `types.ts`, `store.ts`, `schema.ts`(zod)
- 배럴: `index.ts`

### 데이터 페칭
- 모든 서버 데이터는 **TanStack Query**로. 직접 `useEffect + fetch` 금지.
- 폴링이 필요하면 `refetchInterval` + `refetchIntervalInBackground: false`.
- API 응답은 **Zod로 검증**한 뒤 사용.
- 쿼리 훅은 해당 슬라이스의 `api/`에 둔다 (예: `entities/service/api/use-services.ts`).
- 호출은 `apiClient` 직접이 아니라 `@/shared/api`의 `request(config, schema)` 헬퍼로. **자세한 패턴은 아래 [API 호출](#api-호출) 섹션 참조.**

### 상태 관리
- 서버 상태 → TanStack Query만 사용 (Zustand에 캐싱하지 말 것).
- 전역 UI 상태(선택된 시간 범위, 필터 등) → Zustand. 해당 도메인 entity의 `model/store.ts`에 둔다.

### 스타일
- Tailwind 우선. `@apply`는 `shared/ui` 내부에서만.
- 색상은 CSS 변수 토큰(`bg-background`, `text-foreground` 등)을 사용. 하드코딩된 hex/rgb 금지.
- **앱은 상시 다크모드**. `<html class="dark">`가 고정되어 있고 라이트 테마로 전환할 계획 없음. `dark:` prefix 쓰지 말고 토큰만 사용. `:root`의 light 토큰 블록은 shadcn 호환용으로 남겨둔 것일 뿐 실제로는 동작하지 않음.
- **사이드바 전용 토큰**: `--sidebar`, `--sidebar-active`, `--sidebar-foreground`, `--sidebar-active-foreground`, `--sidebar-border`가 별도 존재. **사이드바 내부에서만** 사용하고, 일반 패널/카드는 `bg-card`/`bg-background` 사용.

### 레이아웃
- 화면 쉘(탑바 + 사이드바 + 메인 영역)은 `widgets/app-layout`이 단독 책임짐.
- 페이지는 자기 콘텐츠만 렌더. **페이지에서 레이아웃·사이드바·탑바·전역 패딩 건드리지 말 것.**
- 탑바는 최상단 전체 폭, 그 아래 왼쪽 사이드바 + 오른쪽 메인 스크롤 영역 구조.

### shadcn/ui
- `npx shadcn@latest add <component>` 실행 시 `src/shared/ui/`에 생성됨 (components.json에 설정됨).
- 생성된 컴포넌트는 자유롭게 수정 가능. 업그레이드 없는 복사본임을 전제로.

## API 호출

### 공통 함수 (`@/shared/api`)
- `apiClient` — axios 인스턴스. `baseURL = VITE_API_BASE_URL`. 응답 인터셉터가 axios 에러를 `ApiError`로 정규화.
- `request<TSchema>(config, schema)` — axios 호출 + Zod 검증을 한 번에. **모든 서버 호출은 이 함수로.** `apiClient`를 직접 쓰지 말 것 (특수한 경우 빼고).
- `ApiError` — 호출부에 axios 의존을 노출하지 않기 위한 공통 에러 타입. `status`, `code`, `cause` 보유. `useQuery.error`도 이 타입.

### 표준 쿼리 훅 패턴

스키마는 `api/schema.ts`, 훅은 `api/use-xxx.ts`. 응답 타입과 Zod 스키마를 1:1 동기화하기 위해 `z.ZodType<DomainType>` 어노테이션 — 드리프트 시 컴파일 에러로 즉시 발견.

### 시간 파라미터
- 백엔드 시간 필드는 항상 **UTC epoch milliseconds** (`Long`).
- `Date`를 보낼 때는 `toEpochMs(date)` (`@/shared/lib`)을 사용. `toString()` / `toLocaleString()` / `toISOString()` 등 로컬 타임존이 섞이거나 string 직렬화로 가는 변환 금지.

### 훅 인자 컨벤션
- 훅은 상위 레이어 타입(예: `features/time-range-picker`의 `TimeRange`)을 받지 말 것 — entity가 features를 import하면 FSD 위반.
- 백엔드 파라미터 그대로(`{ startTime: number; endTime: number }` 형태)로 받음. `Date → epoch ms` 변환은 호출부(widget 이상)에서.

### URL
- baseURL은 `request()`가 자동 prefix. 호출 시 path만(`/dashboard/topology`) 적음.
- URL은 백엔드 컨트롤러의 `@RequestMapping` + `@GetMapping`과 **반드시 1:1**. mock(MSW)과 실서버 양쪽이 같은 URL이어야 토글이 작동.

## Mock 데이터 (MSW)

### 토글
- env: `VITE_USE_MOCK=true|false`. 미설정 시 `MODE` 기반(dev=on, prod=off, fail-closed).
- **코드는 분기하지 않음** — 항상 `request(...)`로 호출. mock/실서버 선택은 부트스트랩 시점에 한 번.
- 변경 후 dev 서버 재시작 필요. 브라우저 콘솔의 `[MSW] Mocking enabled.` 메시지로 활성 여부 확인.
- 배포 빌드는 CI에서 `VITE_USE_MOCK=false` 주입 필수 (커밋된 `.env`는 dev 편의를 위해 `true`).

### 핸들러
- 위치: `src/mocks/handlers/<도메인>.ts` → `handlers/index.ts`에서 합침.
- URL은 `${env.apiBaseUrl}/...` 형태로 백엔드 명세와 **반드시 일치**. 다르면 인터셉트가 안 걸려 실 호출로 흘러감.
- mock 데이터는 **entity의 `model/mock.ts`에서 import** — 단일 출처. 핸들러에서 새 데이터 인라인으로 만들지 말 것.

새 도메인 추가 시: 핸들러 파일 작성 → `handlers/index.ts`의 `handlers` 배열에 spread로 등록.

### 부트스트랩
- 브라우저: `src/main.tsx`에서 `env.useMock`이 true일 때 `@/mocks/browser`를 **dynamic import** → `worker.start({ onUnhandledRequest: 'bypass' })`. prod 빌드는 별도 chunk로 분리되어 useMock=false면 fetch 안 됨.
- 노드(vitest): `src/test/setup.ts`에서 `setupServer`를 항상 띄움 (`onUnhandledRequest: 'error'`). 명세 누락 시 테스트가 즉시 실패.
- 운영 코드는 `src/mocks/`를 직접 import하지 않음 — 진입점은 `main.tsx`/`test/setup.ts`뿐.

## Scripts

- `npm run dev` — 개발 서버
- `npm run build` — 타입체크 + 프로덕션 빌드
- `npm test` — Vitest 1회 실행
- `npm run test:watch` — Vitest watch
- `npm run lint` / `npm run format`

## 새 라우트 추가 절차

1. `src/pages/<slug>-page/ui/<slug>-page.tsx` 작성 (PascalCase export, `kebab-case` 파일명).
2. `src/pages/<slug>-page/index.ts`에 public API 배럴.
3. `src/app/router/routes.tsx`에 라우트 등록.
4. 사이드바에 노출해야 하면 `src/widgets/app-sidebar/model/nav-items.ts`에 항목 추가.

> 사이드바와 라우터는 자동 연결되지 않음. 둘 다 손대야 메뉴로 접근 가능.

## 금지사항

- `src/components/`, `src/hooks/`, `src/api/` 같은 타입 기반 폴더를 만들지 말 것 — 전부 FSD 레이어 내부로.
- 상위 레이어를 하위 레이어에서 임포트하지 말 것 (린트로 막기 전에 리뷰에서 걸러낼 것).
- 서버 데이터를 Zustand나 useState에 복사 저장하지 말 것.
