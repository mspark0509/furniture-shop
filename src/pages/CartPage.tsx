import { useEffect, useState } from 'react';
import { products, img, money } from '../data';

type Props = {
  cart: Record<number, number>;
  remove: (id: number) => void;
  change: (id: number, quantity: number) => void;
  navigate: (path: string) => void;
  checkout: () => void;
  selectedIds: number[];
  setSelectedIds: (updater: (previous: number[]) => number[]) => void;
};

export default function CartPage({ cart, remove, change, navigate, checkout, selectedIds, setSelectedIds }: Props) {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const pendingDeleteProduct = products.find(p => p.id === pendingDeleteId);
  useEffect(() => {
    if (pendingDeleteId === null) return;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setPendingDeleteId(null); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingDeleteId]);
  const items = products.filter(p => cart[p.id] > 0);
  const allSelected = items.length > 0 && items.every(p => selectedIds.includes(p.id));
  const selectedItems = items.filter(p => selectedIds.includes(p.id));
  const total = selectedItems.reduce((sum, p) => sum + p.price * cart[p.id], 0);

  const toggleItem = (id: number) => {
    setSelectedIds(previous => previous.includes(id) ? previous.filter(n => n !== id) : [...previous, id]);
  };
  const toggleAll = () => {
    const currentIds = items.map(p => p.id);
    setSelectedIds(previous => allSelected ? previous.filter(id => !currentIds.includes(id)) : [...new Set([...previous, ...currentIds])]);
  };

  return (
    <main className="container utility-page">
      <div className="category-heading">
        <span>SHOPPING BAG</span>
        <h1>장바구니</h1>
      </div>
      {items.length ? (
        <>
          <div className="cart-selection-toolbar">
            <label className="cart-check-label">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              <span>전체선택</span>
            </label>
            <span>{selectedItems.length} / {items.length}개 선택</span>
          </div>
          <div className="cart-list">
            {items.map(p => (
              <article className="cart-row" key={p.id}>
                <label className="cart-item-check" aria-label={`${p.name} 선택`}>
                  <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleItem(p.id)} />
                </label>
                <img src={img(p)} alt={p.name} />
                <div className="cart-product-info">
                  <button onClick={() => navigate('/product/' + p.id)}>{p.name}</button>
                  <p>{money(p.price)}</p>
                  <div className="qty cart-qty">
                    <button type="button" aria-label={`${p.name} 수량 감소`} disabled={cart[p.id] <= 1} onClick={() => change(p.id, Math.max(1, cart[p.id] - 1))}>−</button>
                    <span>{cart[p.id]}</span>
                    <button type="button" aria-label={`${p.name} 수량 증가`} onClick={() => change(p.id, cart[p.id] + 1)}>＋</button>
                  </div>
                </div>
                <strong>{money(p.price * cart[p.id])}</strong>
                <button className="remove" aria-label={`${p.name} 삭제`} onClick={() => setPendingDeleteId(p.id)}>✕</button>
              </article>
            ))}
          </div>
          <div className="cart-total">
            <span>선택 상품 합계</span>
            <strong>{money(total)}</strong>
            <p>시연용 결제로 실제 금액은 청구되지 않습니다.</p>
            <button className="checkout-button" onClick={checkout} disabled={!selectedItems.length}>
              선택 상품 {selectedItems.length}개 구매 · 결제하기 <span>→</span>
            </button>
          </div>
        </>
      ) : (
        <div className="empty">
          장바구니에 담긴 상품이 없습니다.
          <p><button className="solid" onClick={() => navigate('/')}>쇼핑 계속하기</button></p>
        </div>
      )}
      {pendingDeleteProduct && (
        <div className="cart-delete-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setPendingDeleteId(null); }}>
          <div className="cart-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="cart-delete-title" aria-describedby="cart-delete-description">
            <h2 id="cart-delete-title">상품을 삭제하시겠습니까?</h2>
            <p id="cart-delete-description">선택한 상품이 장바구니에서 삭제됩니다.</p>
            <div className="cart-delete-actions">
              <button type="button" onClick={() => setPendingDeleteId(null)}>취소</button>
              <button type="button" onClick={() => { remove(pendingDeleteProduct.id); setPendingDeleteId(null); }}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
