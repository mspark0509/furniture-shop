import type { Product } from '../data/types';
import { img, money } from '../data';
export default function ProductCard({ product: p, navigate, isFav, toggleFav, addCart }: {
    product: Product;
    navigate: (s: string) => void;
    isFav: boolean;
    toggleFav: (id: number) => void;
    addCart: (id: number) => void;
}) { return <article className="product-card">
      <button className="product-photo" onClick={() => navigate('/product/' + p.id)}>
        <img src={img(p)} alt={p.name} loading="lazy"/>
        {p.tag && <span className="product-tag">{p.tag}</span>}
      </button>
      <button className={'heart ' + (isFav ? 'on' : '')} aria-label="찜하기" onClick={() => toggleFav(p.id)}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" fill={isFav ? '#d94d58' : 'rgba(255,255,255,.76)'} stroke={isFav ? '#c83b49' : '#6b4b3e'} strokeWidth="1.7" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="product-info">
        <small>{p.sub || 'INDEBOX COLLECTION'}</small>
        <button onClick={() => navigate('/product/' + p.id)}>{p.name}</button>
        <div className="price-row">
          <strong>{money(p.price)}</strong>
        </div>
      </div>
    </article>; }

