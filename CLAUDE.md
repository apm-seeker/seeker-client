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

### 상태 관리
- 서버 상태 → TanStack Query만 사용 (Zustand에 캐싱하지 말 것).
- 전역 UI 상태(선택된 시간 범위, 필터 등) → Zustand. 해당 도메인 entity의 `model/store.ts`에 둔다.

### 스타일
- Tailwind 우선. `@apply`는 `shared/ui` 내부에서만.
- 색상은 CSS 변수 토큰(`bg-background`, `text-foreground` 등)을 사용. 하드코딩된 hex/rgb 금지.
- 다크 모드는 `dark` 클래스 기반 (이미 설정됨).

### shadcn/ui
- `npx shadcn@latest add <component>` 실행 시 `src/shared/ui/`에 생성됨 (components.json에 설정됨).
- 생성된 컴포넌트는 자유롭게 수정 가능. 업그레이드 없는 복사본임을 전제로.

## Scripts

- `npm run dev` — 개발 서버
- `npm run build` — 타입체크 + 프로덕션 빌드
- `npm test` — Vitest 1회 실행
- `npm run test:watch` — Vitest watch
- `npm run lint` / `npm run format`

## 금지사항

- `src/components/`, `src/hooks/`, `src/api/` 같은 타입 기반 폴더를 만들지 말 것 — 전부 FSD 레이어 내부로.
- 상위 레이어를 하위 레이어에서 임포트하지 말 것 (린트로 막기 전에 리뷰에서 걸러낼 것).
- 서버 데이터를 Zustand나 useState에 복사 저장하지 말 것.
