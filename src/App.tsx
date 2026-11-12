import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import type { User } from 'firebase/auth';
import MyPage from './pages/MyPage';
import type { DemoOrder } from './pages/MyPage';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import DetailPage from './pages/DetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import ProductGrid from './components/ProductGrid';
import Toast from './components/Toast';
import SupportPage from './pages/SupportPage';
import { products } from './data';
import './styles/site.css';
import './styles/home.css';
import './styles/category.css';
import './styles/detail.css';
import './styles/cart.css';
import './styles/checkout.css';
import './styles/login.css';
import './styles/support.css';
function stored<T>(key: string, fallback: T): T {
    try {
        const x = localStorage.getItem(key);
        return x ? JSON.parse(x) as T : fallback;
    }
    catch {
        return fallback;
    }
}
export default function App() {
    const [url, setUrl] = useState(location.pathname + location.search), [favs, setFavs] = useState<number[]>(() => stored('indebox:favorites', [])), [cart, setCart] = useState<Record<number, number>>(() => stored('indebox:cart', {})), [toast, setToast] = useState<{
        message: string;
        key: number;
    } | null>(null), [pending, setPending] = useState<{
        items: Record<number, number>;
        options: null | {
            size: string;
            color: string;
            extra: string;
        };
        fromCart: boolean;
    } | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [authReady, setAuthReady] = useState(false);
    const [orders, setOrders] = useState<DemoOrder[]>(() => stored('indebox:demo-orders', []));
    useEffect(() => onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setAuthReady(true); }), []);
    useEffect(() => { const onPop = () => setUrl(location.pathname + location.search); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
    useEffect(() => localStorage.setItem('indebox:favorites', JSON.stringify(favs)), [favs]);
    useEffect(() => localStorage.setItem('indebox:cart', JSON.stringify(cart)), [cart]);
    const navigate = (to: string) => { history.pushState(null, '', to); setUrl(to); window.scrollTo(0, 0); };
    const notify = (message: string) => setToast({ message, key: Date.now() });
    const toggleFav = (id: number) => { const wasFav = favs.includes(id); setFavs(a => wasFav ? a.filter(n => n !== id) : [...a, id]); notify(wasFav ? '찜하기가 해제되었습니다' : '찜하기가 완료되었습니다'); };
    const addCart = (id: number) => { setCart(a => ({ ...a, [id]: (a[id] || 0) + 1 })); notify('장바구니에 담겼습니다'); };
    const change = (id: number, q: number) => setCart(a => {
        const n = { ...a };
        if (q <= 0)
            delete n[id];
        else
            n[id] = q;
        return n;
    });
    const checkout = () => {
        if (!Object.values(cart).some(q => q > 0))
            return;
        setPending({ items: { ...cart }, options: null, fromCart: true });
        navigate('/checkout');
    };
    const buyNow = (id: number, quantity: number, options: {
        size: string;
        color: string;
        extra: string;
    }) => { setPending({ items: { [id]: quantity }, options, fromCart: false }); navigate('/checkout'); };
    const complete = () => {
        if (!pending)
            return;
        if (user) {
            const order: DemoOrder = { id: String(Date.now()), createdAt: new Date().toLocaleDateString('ko-KR'), items: { ...pending.items }, status: '구매완료' };
            setOrders((prev) => { const next = [order, ...prev]; localStorage.setItem('indebox:demo-orders', JSON.stringify(next)); return next; });
        }
        if (pending.fromCart)
            setCart({});
        setPending(null);
        navigate('/order-complete');
    };
    const path = url.split('?')[0];
    const parts = path.split('/').filter(Boolean);
    const props = { navigate, favs, toggleFav, addCart };
    let content;
    if (!parts.length)
        content = <HomePage {...props}/>;
    else if (parts[0] === 'category')
        content = <CategoryPage key={url} category={parts[1] || 'chairs'} sub={parts[2] ? decodeURIComponent(parts[2]) : undefined} {...props}/>;
    else if (parts[0] === 'product')
        content = <DetailPage id={Number(parts[1])} buyNow={buyNow} {...props}/>;
    else if (parts[0] === 'cart')
        content = <CartPage cart={cart} remove={id => change(id, 0)} change={change} navigate={navigate} checkout={checkout}/>;
    else if (parts[0] === 'checkout')
        content = <CheckoutPage items={pending?.items || {}} options={pending?.options} navigate={navigate} complete={complete}/>;
    else if (parts[0] === 'order-complete')
        content = <main className="container order-complete">
      <div className="complete-mark">✓</div>
      <small>ORDER COMPLETE</small>
      <h1>구매가 완료되었습니다</h1>
      <p>디자인 시연용 결제입니다. 실제 결제나 주문은 발생하지 않았습니다.</p>
      <button className="solid" onClick={() => navigate('/')}>쇼핑 계속하기</button>
    </main>;
    else if (parts[0] === 'login')
        content = user ? <MyPage user={user} orders={orders} navigate={navigate} /> : <LoginPage navigate={navigate} />;
    else if (parts[0] === 'mypage')
        content = !authReady ? <main className="container">로그인 상태 확인 중...</main> : user ? <MyPage user={user} orders={orders} navigate={navigate} /> : <LoginPage navigate={navigate} />;
    else if (parts[0] === 'support')
        content = <SupportPage key={url} section={parts[1] || 'faq'} navigate={navigate}/>;
    else if (parts[0] === 'favorites' || parts[0] === 'search') {
        const q = new URLSearchParams(url.split('?')[1] || '').get('q') || '';
        const items = parts[0] === 'favorites' ? products.filter(p => favs.includes(p.id)) : products.filter(p => [p.name, p.sub || ''].some(s => s.toLowerCase().includes(q.toLowerCase())));
        content = <main className="container utility-page">
      <div className="category-heading">
        <span>{parts[0] === 'favorites' ? 'WISHLIST' : 'SEARCH'}</span>
        <h1>{parts[0] === 'favorites' ? '찜한 상품' : '검색 결과'}</h1>
        {q && <p>“{q}” 검색 결과</p>}
      </div>
      <ProductGrid items={items} {...props}/>
    </main>;
    }
    else
        content = <main className="container empty">
      페이지를 찾을 수 없습니다.
      <button onClick={() => navigate('/')}>홈으로</button>
    </main>;
    return <>
      <Header currentPath={path} navigate={navigate} cartCount={Object.values(cart).reduce((a, b) => a + b, 0)} favCount={favs.length} user={user}/>
      {content}
      <Toast toast={toast}/>
      <Footer />
    </>;
}

