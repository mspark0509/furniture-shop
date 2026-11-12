# V10 변경 파일
기존 V9 프로젝트에 동일 경로로 덮어쓰세요.

- `src/components/Header.tsx`: 현재 경로를 App에서 prop으로 받아 메뉴/아이콘 활성 상태를 새로고침 없이 즉시 갱신
- `src/components/Footer.tsx`: 공통 푸터 분리
- `src/App.tsx`: Header/Footer 공통 연결 및 현재 경로 전달
- `src/styles/site.scss`, `site.css`: 선택된 메뉴만 글씨 크기 확대 + 둥근 베이지 배경. 굵기는 기본과 동일. 아이콘 채움 스타일 유지.

`npm run dev`로 확인하세요. 기존 스타일 감시 스크립트를 그대로 사용합니다.
