import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase.js';

export { onAuthStateChanged };
export type { User };

export async function emailLogin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerEmail(name: string, email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name.trim() });
  return result;
}

export function googleLogin() {
  return signInWithPopup(auth, googleProvider);
}

export function logout() {
  return signOut(auth);
}

export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/invalid-email': return '이메일 주소를 확인해주세요.';
    case 'auth/invalid-credential': return '이메일 또는 비밀번호가 올바르지 않습니다.';
    case 'auth/email-already-in-use': return '이미 가입된 이메일입니다. 로그인해 주세요.';
    case 'auth/weak-password': return '비밀번호는 6자 이상 입력해주세요.';
    case 'auth/popup-closed-by-user': return '로그인 창이 닫혔습니다.';
    case 'auth/popup-blocked': return '팝업 차단을 해제하고 다시 시도해주세요.';
    case 'auth/account-exists-with-different-credential': return '같은 이메일의 계정이 있습니다. 기존 로그인 방식으로 로그인해주세요.';
    case 'auth/operation-not-allowed': return 'Firebase 콘솔에서 해당 로그인 방식을 활성화해주세요.';
    case 'auth/unauthorized-domain': return 'Firebase 인증 도메인 설정을 확인해주세요.';
    case 'auth/network-request-failed': return '네트워크 연결을 확인해주세요.';
    default: return '로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
}
