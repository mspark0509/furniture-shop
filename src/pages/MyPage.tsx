import { useState } from 'react';
import type { User } from 'firebase/auth';
import { logout } from '../firebase/auth';
import { img, money, products } from '../data';

export type DemoOrder = {
  id: string;
  createdAt: string;
  items: Record<number, number>;
  status: '구매완료' | '배송준비중';
};

type Props = {
  user: User;
  orders: DemoOrder[];
  navigate: (path: string) => void;
};

export default function MyPage({ user, orders, navigate }: Props) {
  const [tab, setTab] = useState<'orders' | 'coupons' | 'account'>('orders');
  const displayName = user.displayName || user.email?.split('@')[0] || '회원';
  const itemCount = orders.reduce((sum, order) => sum + Object.values(order.items).reduce((a, b) => a + b, 0), 0);

  return (
    <main className="container mypage">
      <div className="category-heading">
        <span>MY INDEBOX</span>
        <h1>마이페이지</h1>
        <p>{displayName}님, 반가워요.</p>
      </div>
      <div className="mypage-summary">
        <div><strong>{orders.filter((order) => order.status === '배송준비중').length}</strong><span>배송 준비 중</span></div>
        <div><strong>{orders.length}</strong><span>구매 내역</span></div>
        <div><strong>{itemCount}</strong><span>구매 상품 수</span></div>
        <div><strong>0</strong><span>보유 쿠폰</span></div>
      </div>
      <div className="mypage-tabs" role="tablist" aria-label="마이페이지 메뉴">
        <button className={tab === 'orders' ? 'selected' : ''} onClick={() => setTab('orders')}>주문·배송 / 구매상품</button>
        <button className={tab === 'coupons' ? 'selected' : ''} onClick={() => setTab('coupons')}>쿠폰·혜택</button>
        <button className={tab === 'account' ? 'selected' : ''} onClick={() => setTab('account')}>회원정보</button>
      </div>
      {tab === 'orders' && (
        <section className="mypage-panel">
          <h2>주문·배송 조회</h2>
          <p className="muted">실제 주문 시스템과 연결되지 않은 시연용 구매 내역입니다.</p>
          {orders.length === 0 ? (
            <div className="mypage-empty">아직 구매한 상품이 없습니다.<button onClick={() => navigate('/')}>상품 둘러보기 →</button></div>
          ) : orders.map((order) => (
            <article className="mypage-order" key={order.id}>
              <div className="mypage-order-heading"><strong>{order.createdAt} · 주문번호 {order.id}</strong><span>{order.status}</span></div>
              {products.filter((product) => order.items[product.id]).map((product) => (
                <button className="mypage-product" key={product.id} onClick={() => navigate('/product/' + product.id)}>
                  <img src={img(product)} alt={product.name} />
                  <span><strong>{product.name}</strong><small>{order.items[product.id]}개 · {money(product.price * order.items[product.id])}</small></span>
                  <span>상세보기 ↗</span>
                </button>
              ))}
            </article>
          ))}
        </section>
      )}
      {tab === 'coupons' && <section className="mypage-panel"><h2>쿠폰·혜택</h2><div className="mypage-empty">현재 발급된 쿠폰이 없습니다.<p>프로모션 쿠폰 기능은 추후 연결 예정입니다.</p></div></section>}
      {tab === 'account' && <section className="mypage-panel"><h2>회원정보</h2><p>이름: {displayName}</p><p>이메일: {user.email}</p><button className="mypage-logout" onClick={async () => { await logout(); navigate('/'); }}>로그아웃</button></section>}

      <section className="mypage-help" aria-labelledby="mypage-help-title">
        <div className="mypage-help-heading">
          <span>CUSTOMER CARE</span>
          <h2 id="mypage-help-title">도움이 필요하신가요?</h2>
          <p>주문과 배송부터 제품 관리까지, 필요한 안내를 확인하세요.</p>
        </div>
        <div className="mypage-help-links">
          <button onClick={() => navigate('/support/inquiry')}>1:1 문의하기 <span>↗</span></button>
          <button onClick={() => navigate('/support/faq')}>자주 묻는 질문 <span>↗</span></button>
          <button onClick={() => navigate('/support/delivery')}>배송 안내 <span>↗</span></button>
          <button onClick={() => navigate('/support/returns')}>교환·반품 안내 <span>↗</span></button>
          <button onClick={() => navigate('/support/as')}>A/S 안내 <span>↗</span></button>
        </div>
        <p className="mypage-help-note">주문·배송 내역은 현재 시연용 데이터이며, 1:1 문의는 실제 고객센터로 전송되지 않습니다.</p>
      </section>
    </main>
  );
}
