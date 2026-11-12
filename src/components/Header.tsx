import type { User } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { logout } from '../firebase/auth';
import { menus, products, subcategories, img } from '../data';
import type { Product } from '../data/types';
export default function Header({ navigate, cartCount, favCount, currentPath, user }: {
    navigate: (s: string) => void;
    cartCount: number;
    favCount: number;
    currentPath: string;
    user: User | null;
}) {
    const [accountOpen, setAccountOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false), [term, setTerm] = useState(''), [mobile, setMobile] = useState(false), [active, setActive] = useState<string | null>(null);
    const input = useRef<HTMLInputElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const current = currentPath;
    const currentCategory = current.startsWith('/category/') ? decodeURIComponent(current.split('/')[2] || '') : null;
    const iconClass = (path: string) => current === path ? 'is-current' : '';
    useEffect(() => {
        if (searchOpen)
            input.current?.focus();
    }, [searchOpen]);
    useEffect(() => {
        const align = () => {
            const nav = navRef.current;
            if (!nav)
                return;
            const first = nav.querySelector<HTMLElement>(".nav-item");
            const header = nav.closest<HTMLElement>(".header-inner");
            if (!first || !header)
                return;
            const left = first.getBoundingClientRect().left - header.getBoundingClientRect().left;
            nav.style.setProperty("--nav-start", `${Math.max(0, left)}px`);
        };
        align();
        window.addEventListener("resize", align);
        return () => window.removeEventListener("resize", align);
    }, []);
    const suggestions = ['원목 의자', '라운지 체어', '원형 테이블', '패브릭 소파', '바 스툴', '라탄 가구'];
    const matches = term.trim() ? products.filter(p => [p.name, p.sub || '', menus.find(m => m[0] === p.category)?.[1] || ''].some(t => t.toLowerCase().includes(term.trim().toLowerCase()))).slice(0, 10) : [];
    const go = (path: string) => { navigate(path); setMobile(false); setSearchOpen(false); setActive(null); setAccountOpen(false); setTerm(''); };
    useEffect(() => { setAccountOpen(false); }, [currentPath, user?.uid]);
    const signOut = async () => { try { await logout(); go('/'); } catch (error) { console.error('로그아웃 실패:', error); } };
    return <>
      <header className="site-header">
        <div className="topbar">TIMELESS LIVING · CURATED FURNITURE</div>
        <div className="header-inner">
          <button className="hamburger" aria-label="메뉴" onClick={() => setMobile(!mobile)}>☰</button>
          <button className="brand" onClick={() => go('/')}>
            INDEBOX
            <span>INTERIOR & LIVING</span>
          </button>
          <nav ref={navRef} className={'main-nav ' + (mobile ? 'open' : '')} onMouseLeave={() => setActive(null)}>
            {menus.map(m => <div key={m[0]} className={"nav-item " + (currentCategory === m[0] ? "nav-item-current" : "")} onMouseEnter={() => setActive(m[0])}>
                <button onFocus={() => setActive(m[0])} onClick={() => go('/category/' + m[0])}>{m[1]}</button>
                {active === m[0] && <div className="nav-dropdown">
                    <div className="dropdown-inner">
                      <div className="dropdown-heading">
                        <small>EXPLORE</small>
                        <strong>{m[2]}</strong>
                        <button onClick={() => go('/category/' + m[0])}>전체보기 ↗</button>
                      </div>
                      <div className="dropdown-links">
                        {(subcategories[m[0]] || []).map(s => <button key={s} onClick={() => go('/category/' + m[0] + '/' + encodeURIComponent(s))}>{s}</button>)}
                      </div>
                    </div>
                  </div>}
              </div>)}
            <div className={'nav-item support-nav ' + (current.startsWith('/support') ? 'nav-item-current' : '')} onMouseEnter={() => setActive('support')}>
              <button onFocus={() => setActive('support')} onClick={() => go('/support/faq')}>고객문의 / A/S</button>
              {active === 'support' && <div className="nav-dropdown">
                  <div className="dropdown-inner">
                    <div className="dropdown-heading">
                      <small>HELP CENTER</small>
                      <strong>고객지원</strong>
                      <button onClick={() => go('/support/faq')}>전체보기 ↗</button>
                    </div>
                    <div className="dropdown-links">
                      {[['faq', '자주 묻는 질문'], ['delivery', '배송 안내'], ['returns', '교환·반품'], ['as', 'A/S 안내'], ['inquiry', '1:1 문의']].map(([key, label]) => <button key={key} onClick={() => go('/support/' + key)}>{label}</button>)}
                    </div>
                  </div>
                </div>}
            </div>
          </nav>
          <div className="header-actions">
            <button className={'action-icon ' + (searchOpen ? 'is-current' : '')} aria-label="검색" aria-pressed={searchOpen} onClick={() => setSearchOpen(!searchOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="10.5" cy="10.5" r="6.5"/>
                <path d="m15.5 15.5 5 5"/>
              </svg>
            </button>
            <button className={'action-icon ' + iconClass('/favorites')} aria-label="찜" onClick={() => go('/favorites')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.8 8.1c0 5-8.8 11-8.8 11s-8.8-6-8.8-11a4.8 4.8 0 0 1 8.8-2.5 4.8 4.8 0 0 1 8.8 2.5Z"/>
              </svg>
              {favCount > 0 && <em className="icon-count">{favCount > 99 ? '99+' : favCount}</em>}
            </button>
            <button className={'action-icon ' + iconClass('/cart')} aria-label="장바구니" onClick={() => go('/cart')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 8h14l1 12H4L5 8Z"/>
                <path d="M9 9V6a3 3 0 0 1 6 0v3"/>
              </svg>
              {cartCount > 0 && <em className="icon-count">{cartCount > 99 ? '99+' : cartCount}</em>}
            </button>
            <div
              className="header-account-wrap"
              onMouseEnter={() => user && setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
            >
              <button
                type="button"
                className={'account ' + ((current === '/login' || current === '/mypage') ? 'is-current' : '')}
                aria-label={user ? '마이페이지로 이동' : '로그인'}
                onClick={() => go(user ? '/mypage' : '/login')}
              >
                {user ? (user.displayName || user.email?.split('@')[0] || 'MY PAGE') : 'LOGIN'}
              </button>
              {user && accountOpen && (
                <div className="header-account-menu" role="menu">
                  <button type="button" role="menuitem" onClick={() => go('/mypage')}>마이페이지</button>
                  <button type="button" role="menuitem" onClick={signOut}>로그아웃</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {searchOpen && <div className="search-overlay">
          <div className="search-panel">
            <div className="search-field">
              <span>⌕</span>
              <input ref={input} value={term} onChange={e => setTerm(e.target.value)} placeholder="찾으시는 가구를 검색해보세요" onKeyDown={e => {
                if (e.key === 'Enter')
                    go('/search?q=' + encodeURIComponent(term));
                if (e.key === 'Escape')
                    setSearchOpen(false);
            }}/>
              <button onClick={() => setSearchOpen(false)}>✕</button>
            </div>
            <div className="search-results">
              {!term.trim()
        ? <>
                  <p className="search-label">추천 검색어</p>
                  <div className="suggestions">
                    {suggestions.map(s => <button key={s} onClick={() => setTerm(s)}>{s}</button>)}
                  </div>
                </>
        : <>
                  <p className="search-label">검색 결과 {matches.length === 10 ? '최대 10개' : matches.length + '개'}</p>
                  {matches.length ? matches.map((p: Product) => <button className="search-result" key={p.id} onClick={() => go('/product/' + p.id)}>
                      <img src={img(p)} alt=""/>
                      <span>
                        {p.name}
                        <small>{p.sub || '가구'}</small>
                      </span>
                      <b>↗</b>
                    </button>)
        : <p className="muted">일치하는 상품이 없습니다.</p>}
                  <button className="search-all" onClick={() => go('/search?q=' + encodeURIComponent(term))}>전체 검색 결과 보기 →</button>
                </>}
            </div>
          </div>
        </div>}
    </>;
}

