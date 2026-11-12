import { useEffect, useState } from 'react';
import type { Product } from '../data/types';
import ProductCard from './ProductCard';
export default function ProductGrid({ items, navigate, favs, toggleFav, addCart }: {
    items: Product[];
    navigate: (s: string) => void;
    favs: number[];
    toggleFav: (n: number) => void;
    addCart: (n: number) => void;
}) { const [page, setPage] = useState(1), [sort, setSort] = useState('default'); useEffect(() => setPage(1), [items, sort]); const sorted = [...items].sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : b.id - a.id); const total = Math.ceil(sorted.length / 24); return <>
      <div className="list-toolbar">
        <span>
          총
          <b>{items.length}</b>
          개의 상품
        </span>
        <select value={sort} onChange={e => setSort(e.target.value)} aria-label="정렬">
          <option value="default">최신순</option>
          <option value="low">낮은 가격순</option>
          <option value="high">높은 가격순</option>
        </select>
      </div>
      <div className="product-grid">
        {sorted.slice((page - 1) * 24, page * 24).map(p => <ProductCard key={p.id} product={p} navigate={navigate} isFav={favs.includes(p.id)} toggleFav={toggleFav} addCart={addCart}/>)}
      </div>
      {!items.length && <p className="empty">해당하는 상품이 없습니다.</p>}
      {total > 1 && <div className="pagination">
          <button disabled={page === 1} onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}>‹</button>
          {Array.from({ length: total }, (_, i) => <button key={i} className={page === i + 1 ? 'selected' : ''} onClick={() => { setPage(i + 1); window.scrollTo(0, 0); }}>{i + 1}</button>)}
          <button disabled={page === total} onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}>›</button>
        </div>}
    </>; }

