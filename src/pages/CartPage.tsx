import { products, img, money } from '../data';
export default function CartPage({ cart, remove, change, navigate, checkout }: {
    cart: Record<number, number>;
    remove: (n: number) => void;
    change: (n: number, q: number) => void;
    navigate: (s: string) => void;
    checkout: () => void;
}) { const items = products.filter(p => cart[p.id] > 0); const total = items.reduce((n, p) => n + p.price * cart[p.id], 0); return <main className="container utility-page">
      <div className="category-heading">
        <span>SHOPPING BAG</span>
        <h1>장바구니</h1>
      </div>
      {items.length
        ? <>
          <div className="cart-list">
            {items.map(p => <article className="cart-row" key={p.id}>
                <img src={img(p)} alt=""/>
                <div>
                  <button onClick={() => navigate('/product/' + p.id)}>{p.name}</button>
                  <p>{money(p.price)}</p>
                  <div className="qty">
                    <button onClick={() => change(p.id, cart[p.id] - 1)}>−</button>
                    <span>{cart[p.id]}</span>
                    <button onClick={() => change(p.id, cart[p.id] + 1)}>＋</button>
                  </div>
                </div>
                <strong>{money(p.price * cart[p.id])}</strong>
                <button className="remove" onClick={() => remove(p.id)}>✕</button>
              </article>)}
          </div>
          <div className="cart-total">
            합계
            <strong>{money(total)}</strong>
            <p>시연용 결제로 실제 금액은 청구되지 않습니다.</p>
            <button className="checkout-button" onClick={checkout}>
              전체 구매 · 결제하기
              <span>→</span>
            </button>
          </div>
        </>
        : <div className="empty">
          장바구니에 담긴 상품이 없습니다.
          <p>
            <button className="solid" onClick={() => navigate('/')}>쇼핑 계속하기</button>
          </p>
        </div>}
    </main>; }

