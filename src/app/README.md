# app

앱 진입점 / 전역 설정 레이어.

- 라우터(`router.tsx`), Provider(`providers/`), 전역 스타일(`styles/`)만 여기에 둡니다.
- 여기서는 모든 하위 레이어(pages, widgets, features, entities, shared)를 임포트할 수 있습니다.
- 다른 레이어에서 `app/`을 임포트해서는 안 됩니다.
