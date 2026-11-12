# INDEBOX V18 Firebase 인증 적용

## 적용
기존 V17 프로젝트에 ZIP의 변경 파일을 덮어쓰세요. `src/firebase/firebase.ts`는 업로드된 `firebase.js`의 환경변수 이름을 그대로 따르는 TypeScript 버전입니다. **실제 .env 파일은 포함하지 않습니다.** 기존 .env를 유지하세요.

1. `npm install` (firebase 패키지 설치)
2. Firebase Console → Authentication → Sign-in method에서 **이메일/비밀번호**, **Google** 활성화
3. Firebase Console → Authentication → Settings → Authorized domains에 localhost 및 배포 도메인 추가
4. `npm run dev`

## 구현
- Firebase 이메일 로그인/회원가입, Google 팝업 로그인, 인증 상태 감지, 로그아웃
- 네이버·카카오 버튼은 **비활성 UI** (실제 인증 없음)
- 로그인한 사용자의 이름을 헤더에 표시, 클릭 시 마이페이지
- 마이페이지: 주문/배송, 구매상품, 쿠폰, 회원정보
- 결제 완료 시 로그인 사용자의 **시연용 주문**을 브라우저 localStorage에 저장

## 주의
- 마이페이지 주문 정보는 Firebase/Firestore와 연동되지 않습니다. 현재 브라우저에 저장되는 데모 데이터로, 다른 기기나 계정과 동기화되지 않습니다. 실제 서비스에서는 uid별 Firestore 접근 규칙과 주문 저장 로직이 필요합니다.
- 기존 결제는 실제 결제가 아닙니다.
- Google 계정과 이메일 계정은 Firebase가 동일 계정으로 인식하는 경우에만 연결됩니다. 서로 다른 인증 제공자 자격 증명에 대한 수동 링크 기능은 미구현입니다.
- 인증 설정을 Firebase Console에서 활성화해야 정상 동작합니다.
