# entities

도메인 객체 (예: Service, Trace, Span, Metric).

- 각 슬라이스: `entities/service/`, `entities/trace/` 등
- 각 슬라이스는 `ui/`(해당 엔티티 표시 컴포넌트), `model/`(타입/스토어), `api/`를 보유할 수 있습니다.
- 허용 임포트: shared만
- 금지: 다른 entity 슬라이스 직접 임포트 (공통 타입은 shared로)
