import { menus, products, subcategories } from '../data';
import ProductGrid from '../components/ProductGrid';
export default function CategoryPage({ category, sub, navigate, favs, toggleFav, addCart }: {
    category: string;
    sub?: string;
    navigate: (s: string) => void;
    favs: number[];
    toggleFav: (n: number) => void;
    addCart: (n: number) => void;
}) {
    const menu = menus.find(m => m[0] === category);
    if (!menu)
        return <div className="container empty">카테고리를 찾을 수 없습니다.</div>;
    const filtered = products.filter(p => category === 'new' ? (!sub || sub === '전체 신상품' || p.category === ({ '의자 신상품': 'chairs', '테이블 신상품': 'tables', '소파 신상품': 'sofas', '리빙 신상품': 'living' }[sub] || '')) : p.category === category && (!sub || p.sub === sub));
    return <main className="container category-page">
      <div className="breadcrumbs">HOME / {menu[1]} {sub && '/ ' + sub}</div>
      <div className="category-heading">
        <span>{menu[2]}</span>
        <h1>{sub || menu[1]}</h1>
        <p>{menu[3]}</p>
      </div>
      <div className="subnav">
        <button className={!sub ? 'active' : ''} onClick={() => navigate('/category/' + category)}>전체보기</button>
        {(subcategories[category] || []).map(s => <button className={sub === s ? 'active' : ''} key={s} onClick={() => navigate('/category/' + category + '/' + encodeURIComponent(s))}>{s}</button>)}
      </div>
      <ProductGrid items={filtered} navigate={navigate} favs={favs} toggleFav={toggleFav} addCart={addCart}/>
    </main>;
}

