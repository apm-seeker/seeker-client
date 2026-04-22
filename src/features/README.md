# features

사용자 상호작용 단위 기능 (예: 시간 범위 선택, 서비스 필터, 트레이스 검색).

- 각 슬라이스는 자체 `ui/`, `model/`, `api/`, `lib/`를 보유할 수 있습니다.
- 허용 임포트: entities, shared
- 금지: pages, widgets, app, 다른 feature 슬라이스
