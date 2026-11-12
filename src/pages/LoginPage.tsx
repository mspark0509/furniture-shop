import { useState, type FormEvent } from 'react';
import { authErrorMessage, emailLogin, googleLogin, registerEmail } from '../firebase/auth';

type Props = { navigate: (path: string) => void };

export default function LoginPage({ navigate }: Props) {
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [comingSoon, setComingSoon] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (register) {
        await registerEmail(name, email, password);
      } else {
        await emailLogin(email, password);
      }
      navigate('/');
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setError('');
    try {
      await googleLogin();
      navigate('/');
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-box">
        <small>WELCOME TO INDEBOX</small>
        <h1>{register ? '회원가입' : '로그인'}</h1>
        <p>나만의 공간을 완성하는 특별한 경험</p>
        <form onSubmit={submit}>
          {register && (
            <label>
              이름
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
            </label>
          )}
          <label>
            이메일
            <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
          </label>
          <label>
            비밀번호
            <input required type="password" minLength={6} autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 6자 이상" />
          </label>
          {error && <p role="alert" className="auth-error">{error}</p>}
          <button className="login-submit" type="submit" disabled={busy}>
            {busy ? '처리 중...' : register ? '회원가입' : '이메일 로그인'}
          </button>
        </form>
        {!register && (
          <>
            <div className="auth-divider"><span>간편 로그인</span></div>
            <div className="social-login-stack">
              <button className="social-login google-login" type="button" disabled={busy} onClick={google}>
                <span className="social-mark google-mark" aria-hidden="true">G</span>
                Google로 계속하기
              </button>
              <button className="social-login naver-login" type="button" onClick={() => setComingSoon(true)}>
                <span className="social-mark" aria-hidden="true">N</span>
                네이버로 계속하기
              </button>
              <button className="social-login kakao-login" type="button" onClick={() => setComingSoon(true)}>
                <span className="social-mark" aria-hidden="true">●</span>
                카카오로 계속하기
              </button>
            </div>
            <button
              className="auth-register-button"
              type="button"
              onClick={() => { setRegister(true); setError(''); }}
            >
              이메일로 회원가입
            </button>
            <div className="auth-recovery-text" aria-label="계정 찾기 안내">
              <span>아이디 찾기</span>
              <span aria-hidden="true">|</span>
              <span>비밀번호 찾기</span>
            </div>
          </>
        )}
        {register && (
          <button
            className="auth-register-button"
            type="button"
            onClick={() => { setRegister(false); setError(''); }}
          >
            로그인으로 돌아가기
          </button>
        )}
        {comingSoon && (
          <div className="auth-coming-soon-backdrop" onClick={() => setComingSoon(false)}>
            <div className="auth-coming-soon-dialog" role="alertdialog" aria-modal="true" aria-labelledby="coming-soon-title" onClick={(event) => event.stopPropagation()}>
              <h2 id="coming-soon-title">준비 중입니다</h2>
              <p>해당 로그인 서비스는 현재 준비 중입니다.</p>
              <button type="button" onClick={() => setComingSoon(false)}>확인</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
