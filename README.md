# Firebase export 오류 수정

기존 프로젝트의 `src/firebase/firebase.js`와 `src/firebase/auth.ts`만 덮어쓰세요.

- firebase.js에서 `auth`, `googleProvider`, `firebaseApp`를 export합니다.
- auth.ts는 `./firebase.js`를 명시적으로 import하여 .js/.ts 파일 공존 시 모호성을 제거합니다.
- `.env`는 수정하지 않습니다.
- Vite 개발 서버를 재시작하세요.

주의: 기존 `firebase.ts`가 함께 있으면 중복 설정이 될 수 있으므로 추후 하나로 통일하는 것을 권장합니다. 이 패치의 인증 모듈은 `firebase.js`를 사용합니다.
"# furniture-shop" 
