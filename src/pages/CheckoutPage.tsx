import { useState } from 'react';
import { products, img, money } from '../data';
type Props = {
    items: Record<number, number>;
    options?: {
        size: string;
        color: string;
        extra: string;
    } | null;
    navigate: (to: string) => void;
    complete: () => void;
};
export default function CheckoutPage({ items, options, navigate, complete }: Props) {
    const [buyer, setBuyer] = useState(''), [phone, setPhone] = useState(''), [address, setAddress] = useState(''), [method, setMethod] = useState('카드 결제 (시연)');
    const selected = products.filter(p => (items[p.id] || 0) > 0);
    const total = selected.reduce((v, p) => v + p.price * items[p.id], 0);
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected.length)
            return;
        complete();
    };
    return <main className="container checkout-page">
      <div className="category-heading">
        <span>CHECKOUT</span>
        <h1>결제하기</h1>
        <p>실제 결제가 아닌 주문 완료 화면 시연입니다.</p>
      </div>
      {!selected.length
        ? <div className="empty">
          결제할 상품이 없습니다.
          <button onClick={() => navigate('/cart')}>장바구니로 돌아가기</button>
        </div>
        : <form className="checkout-layout" onSubmit={submit}>
          <section className="checkout-fields">
            <h2>주문자 및 배송 정보</h2>
            <label>
              이름
              <input required value={buyer} onChange={e => setBuyer(e.target.value)} placeholder="이름을 입력하세요"/>
            </label>
            <label>
              연락처
              <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="연락처를 입력하세요"/>
            </label>
            <label>
              배송지
              <input required value={address} onChange={e => setAddress(e.target.value)} placeholder="주소를 입력하세요"/>
            </label>
            <h2>결제 수단</h2>
            <label>
              결제 방식
              <select value={method} onChange={e => setMethod(e.target.value)}>
                <option>카드 결제 (시연)</option>
                <option>무통장 입금 (시연)</option>
              </select>
            </label>
            <p className="muted">입력 내용은 서버에 전송되지 않습니다. 실제 카드 정보는 입력하지 마세요.</p>
          </section>
          <aside className="checkout-summary">
            <h2>주문 상품</h2>
            {selected.map(p => <div className="checkout-item" key={p.id}>
                <img src={img(p)} alt=""/>
                <div>
                  <b>{p.name}</b>
                  <small>수량 {items[p.id]}개</small>
                  {options && selected.length === 1 && <small>{options.size} / {options.color} / {options.extra}</small>}
                  <strong>{money(p.price * items[p.id])}</strong>
                </div>
              </div>)}
            <div className="checkout-total">
              <span>상품 합계</span>
              <strong>{money(total)}</strong>
            </div>
            <p className="muted">배송비 및 선택 옵션의 추가 금액은 실제 상품 정보 확인 후 산정됩니다.</p>
            <button type="submit" className="checkout-confirm">{money(total)} · 결제하기</button>
            <p className="checkout-demo">버튼을 누르면 실제 결제 없이 완료 화면으로 이동합니다.</p>
          </aside>
        </form>}
    </main>;
}

