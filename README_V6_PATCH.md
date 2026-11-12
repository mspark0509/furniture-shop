# INDEBOX V6 변경 파일 안내

V5 React + TypeScript 프로젝트 최상위 폴더에 압축 파일 내부 경로를 그대로 덮어씌우세요. 기존 `public/images/` 사진 50장은 V5에 포함되어 있으므로 이번 패치에 다시 넣지 않았습니다. 새 사진은 추가하지 않았으며 기존 상품 사진을 그대로 사용합니다.

## 실행

```bash
npm install
npm run dev
```

`npm run dev`는 Sass 감시 컴파일과 Vite를 함께 실행합니다. `src/styles/*.scss`를 저장하면 같은 이름의 `.css`로 자동 출력됩니다. `npm run styles:build`로 수동 컴파일도 가능합니다. 생성된 CSS를 React가 import하므로 브라우저에서 즉시 반영됩니다. `npm run build`는 Sass 컴파일 후 TypeScript 검사 및 Vite 빌드를 실행합니다.

## 결제 흐름

상품 상세 → 구매하기 → `/checkout` → 주문자 정보 입력 → 결제하기 → `/order-complete`
장바구니 → 전체 구매 · 결제하기 → `/checkout` → 완료. 결제는 시연용이며 서버에 저장하거나 실제 금액을 청구하지 않습니다.

## 데이터 유의사항

가구 실측 사이즈 및 판매 색상 옵션은 실제 상품 데이터로 확인되지 않아 시연용 선택지로 표시됩니다. 추가상품도 시연용이며 실제 결제금액에는 포함되지 않습니다. 실제 주문 연동 전 반드시 상품 옵션/가격/배송비를 정식 데이터로 교체해야 합니다.
