import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { menus, products } from '../data';
import ProductCard from '../components/ProductCard';
export default function HomePage({ navigate, favs, toggleFav, addCart }: {
    navigate: (s: string) => void;
    favs: number[];
    toggleFav: (n: number) => void;
    addCart: (n: number) => void;
}) { const [slide, setSlide] = useState(0); const scroller = useRef<HTMLDivElement>(null);
    const heroDrag = useRef<{ startX: number; pointerId: number } | null>(null);
    const productDrag = useRef<{ startX: number; scrollLeft: number; pointerId: number; moved: boolean } | null>(null);
    const suppressProductClick = useRef(false);
    const [heroOffset, setHeroOffset] = useState(0);
    const [heroAnimating, setHeroAnimating] = useState(true);
    const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const slideBusy = useRef(false);
    const draggingHero = useRef(false);
    const changeSlideRef = useRef<(direction: -1 | 1) => void>(() => {});

    useEffect(() => {
      const interval = window.setInterval(() => {
        if (!draggingHero.current && !slideBusy.current && !document.hidden) {
          changeSlideRef.current(1);
        }
      }, 10000);
      return () => window.clearInterval(interval);
    }, []);

    useEffect(() => () => {
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    }, []);

    const changeSlide = (direction: -1 | 1) => {
      if (slideBusy.current) return;
      slideBusy.current = true;
      setHeroAnimating(false);
      setHeroOffset(direction * -100);
      transitionTimer.current = window.setTimeout(() => {
        setSlide((previous) => (previous + direction + 3) % 3);
        setHeroOffset(0);
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
          slideBusy.current = false;
          setHeroAnimating(true);
        }));
      }, 950);
    };

    changeSlideRef.current = changeSlide;

    const onHeroPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if ((event.target as HTMLElement).closest('button, a')) return;
      draggingHero.current = true;
      heroDrag.current = { startX: event.clientX, pointerId: event.pointerId };
    };
    const onHeroPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
      const drag = heroDrag.current;
      heroDrag.current = null;
      draggingHero.current = false;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const distance = event.clientX - drag.startX;
      if (Math.abs(distance) > 45) changeSlide(distance < 0 ? 1 : -1);
    };

    const onProductPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (!scroller.current || (event.target as HTMLElement).closest('button, input')) return;
      productDrag.current = {
        startX: event.clientX,
        scrollLeft: scroller.current.scrollLeft,
        pointerId: event.pointerId,
        moved: false,
      };
      suppressProductClick.current = false;
    };
    const onProductPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = productDrag.current;
      if (!drag || !scroller.current || drag.pointerId !== event.pointerId) return;
      const distance = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(distance) < 7) return;
      if (!drag.moved) {
        drag.moved = true;
        scroller.current.setPointerCapture(event.pointerId);
      }
      scroller.current.scrollLeft = drag.scrollLeft - distance;
    };
    const onProductPointerUp = () => {
      if (productDrag.current?.moved) {
        suppressProductClick.current = true;
        window.setTimeout(() => { suppressProductClick.current = false; }, 180);
      }
      productDrag.current = null;
    };
    const onProductClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
      if (suppressProductClick.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
; const hero = [{ title: 'A slower kind of living.', sub: '시간이 머무는 공간, 인디박스', image: '/images/banner-sunset-sea.webp' }, { title: 'Objects with a soul.', sub: '일상에 자연스럽게 스며드는 가구', image: '/images/banner-sunset-garden.webp' }, { title: 'Made for your moments.', sub: '나만의 취향으로 완성하는 집', image: '/images/banner-living-room.webp' }]; return <main>
      <section
        className="hero"
        onPointerDown={onHeroPointerDown}
        onPointerUp={onHeroPointerUp}
        onPointerCancel={() => { heroDrag.current = null; draggingHero.current = false; }}
      >
        <div className="hero-slides" style={{ transform: `translateX(calc(-100% + ${heroOffset}%))`, transition: heroOffset !== 0 ? 'transform 950ms cubic-bezier(.22,.61,.36,1)' : 'none' }}>
          {[hero[(slide + 2) % 3], hero[slide], hero[(slide + 1) % 3]].map((item, index) => (
            <div
              key={`${slide}-${index}`}
              className="hero-slide"
              style={{ backgroundImage: `linear-gradient(90deg,rgba(33,25,19,.55),rgba(33,25,19,.05)),url('${item.image}')` }}
            >
              <div className="hero-copy">
                <small>INDEBOX · CURATED INTERIORS</small>
                <h1>{item.title}</h1>
                <p>{item.sub}</p>
                <button onClick={() => navigate('/category/chairs')}>COLLECTION 살펴보기 ↗</button>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-nav">
          <button aria-label="이전 배너" onClick={() => changeSlide(-1)}>←</button>
          <span>0{slide + 1} / 03</span>
          <button aria-label="다음 배너" onClick={() => changeSlide(1)}>→</button>
        </div>
      </section>
      <section className="intro">
        <span className="eyebrow">THE ART OF LIVING</span>
        <h2>
          공간에 취향을 더하다
          <span>.</span>
        </h2>
        <p>오래 바라볼수록 더 좋아지는 디자인. 인디박스가 제안하는 따뜻한 일상의 풍경을 만나보세요.</p>
        <div className="intro-visual">
          <img src="/images/intro-living.webp" alt="자연광이 스며드는 편안한 거실" loading="lazy"/>
        </div>
      </section>
      <section className="container home-section">
        <div className="section-heading">
          <div>
            <small>DISCOVER YOUR STYLE</small>
            <h2>공간을 위한 컬렉션</h2>
          </div>
        </div>
        <div className="category-tiles">
          {menus.map((m) => { const featured = products.find(p => p.category === m[0]) ?? products[0]; return <button key={m[0]} onClick={() => navigate('/category/' + m[0])}>
              <img src={'/images/' + featured.image} alt={m[1] + ' 컬렉션'} loading="lazy"/>
              <span>
                {m[1]}
                <b>↗</b>
              </span>
            </button>; })}
        </div>
      </section>
      <section className="featured">
        <div className="container">
          <div className="section-heading">
            <div>
              <small>EDITOR'S PICK</small>
              <h2>당신을 위한 추천 가구</h2>
            </div>
            <div className="slide-arrows">
              <button aria-label="이전 상품" onClick={() => scroller.current?.scrollBy({ left: -330, behavior: 'smooth' })}>←</button>
              <button aria-label="다음 상품" onClick={() => scroller.current?.scrollBy({ left: 330, behavior: 'smooth' })}>→</button>
            </div>
          </div>
          <div
            className="featured-track"
            ref={scroller}
            onPointerDown={onProductPointerDown}
            onPointerMove={onProductPointerMove}
            onPointerUp={onProductPointerUp}
            onPointerCancel={onProductPointerUp}
            onClickCapture={onProductClickCapture}
            onDragStart={(event) => event.preventDefault()}
          >
            {products.slice(0, 15).map(p => <div className="featured-item" key={p.id}>
                <ProductCard product={p} navigate={navigate} isFav={favs.includes(p.id)} toggleFav={toggleFav} addCart={addCart}/>
              </div>)}
          </div>
        </div>
      </section>
      <section className="home-story container">
        <div className="home-story-photo">
          <img src="/images/photo-40.jpg" alt="따뜻한 감성의 인테리어 가구" loading="lazy"/>
        </div>
        <div className="home-story-copy">
          <small>INDEBOX SPACE GUIDE</small>
          <h2>
            나만의 공간을
            <br />
            완성하는 방법
          </h2>
          <p>오래 머무는 거실부터 작은 휴식이 필요한 방까지, 공간의 분위기를 바꾸는 가구를 제안합니다.</p>
          <button onClick={() => navigate('/category/sofas')}>소파 컬렉션 둘러보기 ↗</button>
        </div>
      </section>
      <section className="home-new container">
        <div className="section-heading">
          <div>
            <small>JUST ARRIVED</small>
            <h2>새롭게 만나는 디자인</h2>
          </div>
          <button className="home-more" onClick={() => navigate('/category/new')}>전체 상품 보기 ↗</button>
        </div>
        <div className="home-new-grid">
          {products.slice(-4).map(p => <ProductCard key={p.id} product={p} navigate={navigate} isFav={favs.includes(p.id)} toggleFav={toggleFav} addCart={addCart}/>)}
        </div>
      </section>
      <section className="home-material">
        <div className="container home-material-inner">
          <div>
            <small>THE INDEBOX EDIT</small>
            <h2>
              매일의 취향을 담은
              <br />
              가구와 리빙
            </h2>
            <p>자연스러운 질감과 편안한 색감. 매일 마주하는 공간에 특별한 감도를 더해보세요.</p>
            <button onClick={() => navigate('/category/living')}>리빙 컬렉션 보기 ↗</button>
          </div>
          <div className="home-material-photo">
            <img src="/images/photo-52.jpg" alt="인디박스 리빙 컬렉션" loading="lazy"/>
          </div>
        </div>
      </section>
      <section className="statement">
        <small>INDEBOX JOURNAL</small>
        <h2>
          Beautiful things,
          <br />
          <i>beautiful everyday.</i>
        </h2>
        <button onClick={() => navigate('/category/living')}>라이프스타일 컬렉션 보기 ↗</button>
      </section>
    </main>; }

