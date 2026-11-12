import { useState } from 'react';
type Section = 'faq' | 'delivery' | 'returns' | 'as' | 'inquiry';
const sections: {
    key: Section;
    label: string;
}[] = [{ key: 'faq', label: '자주 묻는 질문' }, { key: 'delivery', label: '배송 안내' }, { key: 'returns', label: '교환·반품' }, { key: 'as', label: 'A/S 안내' }, { key: 'inquiry', label: '1:1 문의' }];
const faqs = [['배송비는 어떻게 확인하나요?', '상품과 지역에 따라 배송 방식과 착불 배송비가 달라질 수 있습니다. 실제 배송비는 해당 상품의 상세 안내를 확인해 주세요.'], ['주문한 가구는 언제 도착하나요?', '상품별 배송기간이 다릅니다. 제작·화물 배송 상품은 일정이 달라질 수 있으므로 주문 전 상세정보를 확인해 주세요.'], ['교환이나 반품은 가능한가요?', '일반적으로 수령 후 7일 이내 신청이 가능하나 상품 상태와 맞춤제작 여부에 따라 제한될 수 있습니다.'], ['상품에 문제가 있으면 어떻게 하나요?', '상품명, 주문정보, 문제 부위의 사진을 준비해 고객센터에 문의해 주세요.']];
export default function SupportPage({ section, navigate }: {
    section: string;
    navigate: (path: string) => void;
}) {
    const current = sections.some(s => s.key === section) ? section as Section : 'faq';
    const [opened, setOpened] = useState<number | null>(0);
    const [sent, setSent] = useState(false);
    const [name, setName] = useState(''), [email, setEmail] = useState(''), [subject, setSubject] = useState(''), [message, setMessage] = useState('');
    const submit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setSent(true); };
    return <main className="container support-page">
      <div className="support-heading">
        <span>INDEBOX CUSTOMER CARE</span>
        <h1>고객문의 & A/S</h1>
        <p>가구를 오래, 편안하게 사용할 수 있도록 필요한 정보를 모았습니다.</p>
      </div>
      <div className="support-layout">
        <aside className="support-sidebar" aria-label="고객지원 메뉴">
          {sections.map(s => <button key={s.key} className={current === s.key ? 'selected' : ''} onClick={() => navigate('/support/' + s.key)}>
              {s.label}
              <span>↗</span>
            </button>)}
        </aside>
        <section className="support-content">
          <div className="support-section-title">
            <small>CUSTOMER SUPPORT</small>
            <h2>{sections.find(s => s.key === current)?.label}</h2>
          </div>
          {current === 'faq' && <div className="support-faq">
              {faqs.map(([q, a], i) => <div key={q} className="support-faq-item">
                  <button aria-expanded={opened === i} onClick={() => setOpened(opened === i ? null : i)}>
                    <span>Q. {q}</span>
                    <b>{opened === i ? '−' : '+'}</b>
                  </button>
                  {opened === i && <p>{a}</p>}
                </div>)}
            </div>}
          {current === 'delivery' && <div className="support-copy">
              <h3>배송 안내</h3>
              <p>가구 특성상 택배·화물 배송 등 상품별 배송 방식이 다릅니다. 배송비, 지역별 추가비용, 예상 배송기간은 각 상품 상세정보를 우선 확인해 주세요.</p>
              <p>도서·산간 지역 및 대형 가구는 추가 운임이나 별도 일정 조율이 필요할 수 있습니다.</p>
              <div className="support-note">※ 본 리뉴얼 시안의 주문·배송 기능은 실제 운영 시스템과 연결되어 있지 않습니다.</div>
            </div>}
          {current === 'returns' && <div className="support-copy">
              <h3>교환·반품 안내</h3>
              <p>일반적으로 상품 수령 후 7일 이내 교환·반품을 신청할 수 있습니다. 단, 사용 흔적이나 상품 훼손, 일부 주문제작 상품 등은 제한될 수 있습니다.</p>
              <p>상품 하자나 표시 내용과 다른 경우에는 관련 법령과 상품별 안내에 따른 절차가 적용됩니다. 단순 변심의 왕복 배송비는 고객 부담일 수 있습니다.</p>
              <div className="support-note">신청 전 상품 사진과 주문정보를 준비해 주세요. 정확한 조건은 원본 판매처의 정책을 확인해야 합니다.</div>
            </div>}
          {current === 'as' && <div className="support-copy">
              <h3>A/S 접수 안내</h3>
              <p>가구의 상태와 구매 내역을 확인한 뒤 수리 가능 여부 및 비용을 안내받는 절차를 가정한 시안입니다.</p>
              <ol>
                <li>구매 상품명과 주문정보 확인</li>
                <li>문제 부위 사진과 증상 정리</li>
                <li>1:1 문의 화면에서 내용 작성</li>
                <li>실제 접수는 원본 인디박스 고객센터를 통해 진행</li>
              </ol>
              <button className="support-primary" onClick={() => navigate('/support/inquiry')}>1:1 문의 작성하기 →</button>
            </div>}
          {current === 'inquiry' && <div className="support-copy">
              <h3>1:1 문의</h3>
              <p>문의 작성 화면 시안입니다. 입력한 정보는 서버로 전송되지 않습니다.</p>
              {sent
            ? <div className="support-note" role="status">
                  입력 내용을 확인했어요. 현재는 시연용 화면이므로 실제 문의가 접수되지 않았습니다.
                  <button onClick={() => setSent(false)}>다시 작성</button>
                </div>
            : <form className="support-form" onSubmit={submit}>
                  <label>
                    이름
                    <input value={name} onChange={e => setName(e.target.value)} required maxLength={40}/>
                  </label>
                  <label>
                    이메일
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                  </label>
                  <label>
                    문의 제목
                    <input value={subject} onChange={e => setSubject(e.target.value)} required maxLength={100}/>
                  </label>
                  <label>
                    문의 내용
                    <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={7} maxLength={3000}/>
                  </label>
                  <button type="submit" className="support-primary">내용 확인하기</button>
                </form>}
            </div>}
        </section>
      </div>
    </main>;
}

