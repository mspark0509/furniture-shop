import { useState } from 'react';
import { products, img, money, menus } from '../data';
import ProductCard from '../components/ProductCard';
type Props = {
    id: number;
    navigate: (s: string) => void;
    favs: number[];
    toggleFav: (n: number) => void;
    addCart: (n: number) => void;
    buyNow: (id: number, quantity: number, options: {
        size: string;
        color: string;
        extra: string;
    }) => void;
};
export default function DetailPage({ id, navigate, favs, toggleFav, addCart, buyNow }: Props) {
    const p = products.find(item => item.id === id);
    const [size, setSize] = useState('기본형'), [color, setColor] = useState('내추럴'), [extra, setExtra] = useState('선택 안 함'), [quantity, setQuantity] = useState(1);
    if (!p)
        return <main className="container empty">상품을 찾을 수 없습니다.</main>;
    const extras = [{ label: '선택 안 함', price: 0 }, { label: '가구 관리 키트', price: 19000 }, { label: '미끄럼 방지 패드', price: 9000 }];
    const extraPrice = extras.find(x => x.label === extra)?.price || 0;
    const total = (p.price + extraPrice) * quantity;
    const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    return <main className="container detail">
      <div className="breadcrumbs">HOME / {menus.find(m => m[0] === p.category)?.[1]} / {p.name}</div>
      <div className="detail-layout">
        <div className="detail-gallery">
          <img src={img(p)} alt={p.name}/>
          <p>상품 이미지는 기존 제공된 이미지 자료를 사용합니다.</p>
        </div>
        <div className="detail-copy">
          <small>INDEBOX COLLECTION</small>
          <h1>{p.name}</h1>
          <p className="detail-category">{menus.find(m => m[0] === p.category)?.[1]} · {p.sub || '가구'}</p>
          <strong className="detail-base-price">{money(p.price)}</strong>
          <div className="detail-spec">
            <div>
              <span>상품명</span>
              <b>{p.name}</b>
            </div>
            <div>
              <span>가구 사이즈</span>
              <b>상세 실측 정보 확인 필요</b>
            </div>
            <div>
              <span>배송</span>
              <b>배송비 및 일정은 주문 전 확인</b>
            </div>
          </div>
          <label className="detail-option">
            사이즈
            <select value={size} onChange={e => setSize(e.target.value)}>
              <option>기본형</option>
              <option>사이즈 상담 필요</option>
            </select>
          </label>
          <label className="detail-option">
            색상
            <select value={color} onChange={e => setColor(e.target.value)}>
              <option>내추럴</option>
              <option>브라운</option>
              <option>블랙</option>
              <option>아이보리</option>
            </select>
          </label>
          <label className="detail-option">
            추가상품
            <select value={extra} onChange={e => setExtra(e.target.value)}>
              {extras.map(x => <option key={x.label} value={x.label}>{x.label}{x.price ? ' (+' + money(x.price) + ')' : ''}</option>)}
            </select>
          </label>
          <div className="detail-quantity">
            <span>수량</span>
            <div>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="수량 감소">−</button>
              <b>{quantity}</b>
              <button onClick={() => setQuantity(q => Math.min(99, q + 1))} aria-label="수량 증가">＋</button>
            </div>
          </div>
          <div className="detail-price-total">
            <span>총 상품금액</span>
            <strong>{money(total)}</strong>
          </div>
          <div className="detail-actions">
            <button className="detail-cart" onClick={() => {
            for (let i = 0; i < quantity; i++)
                addCart(p.id);
            setSize('기본형');
            setColor('내추럴');
            setExtra('선택 안 함');
            setQuantity(1);
        }}>
              장바구니 담기
            </button>
            <button className="detail-buy" onClick={() => buyNow(p.id, quantity, { size, color, extra })}>구매하기 →</button>
            <button className="detail-favorite" aria-label="찜하기" onClick={() => toggleFav(p.id)}>{favs.includes(p.id) ? '♥' : '♡'}</button>
          </div>
          <p className="muted">사이즈·색상 선택지와 추가상품은 시연용입니다. 실제 판매 옵션 및 가격과 다를 수 있습니다. 실제 결제는 진행되지 않습니다.</p>
        </div>
      </div>
      {related.length > 0 && <section className="detail-related">
          <div className="section-heading">
            <div>
              <small>YOU MAY ALSO LIKE</small>
              <h2>함께 둘러볼 상품</h2>
            </div>
          </div>
          <div className="product-grid">
            {related.map(item => <ProductCard key={item.id} product={item} navigate={navigate} isFav={favs.includes(item.id)} toggleFav={toggleFav} addCart={addCart}/>)}
          </div>
        </section>}
    </main>;
}

