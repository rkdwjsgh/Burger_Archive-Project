import { useEffect } from 'react';
import { GUIDE } from '../data/guideContent';
import { BRANDS } from '../utils/brandColors';
import { COLOR_STOPS } from '../utils/rating';
import BrandIcon from './BrandIcon';
import ThumbUpIcon from './ThumbUpIcon';
import './GuideModal.css';
import StarIcon from './StarIcon';


// 색띠 막대: 카드 색띠와 같은 기준점 색으로 그라데이션
const gradient = `linear-gradient(90deg, ${COLOR_STOPS.map(
  (s) => `${s.color} ${(s.at / 5) * 100}%`
).join(', ')})`;

// 각 줄의 왼쪽 칸: 글자 / 색띠 막대 / 추천 아이콘
function ItemKey({ item }) {
  if (item.visual === 'thumb') return <ThumbUpIcon />;
  if (item.visual === 'star') return <span className="guide-star" title={item.key}><StarIcon size={18} /></span>;
  return item.key;
}

export default function GuideModal({ onClose }) {
  // Esc 키로 닫기
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    // 바깥 어두운 영역을 누르면 닫힘
    <div className="guide-dim" onClick={onClose}>
      {/* 창 안쪽을 누른 건 바깥까지 전달되지 않게 막음 */}
      <div className="guide-modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <button className="guide-close" onClick={onClose} aria-label="닫기">✕</button>

        <h2 className="guide-title">{GUIDE.title}</h2>
        <p className="guide-intro">
          {GUIDE.intro.map((line, i) => <span key={i}>{line}<br /></span>)}
        </p>

        {GUIDE.sections.map((section) => (
          <section key={section.title} className="guide-section">
            <h4 className="guide-section-title">{section.title}</h4>
            <ul className="guide-items">
              {section.items.map((item) => (
                <li key={item.key}>
                  <span className="guide-key"><ItemKey item={item} /></span>
                  {item.visual === 'gradient' && (
                    <span className="guide-gradient" style={{ background: gradient }} />
                  )}
                  <span className={item.visual === 'gradient' ? 'guide-desc sub' : 'guide-desc'}>
                    {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="guide-section">
          <h4 className="guide-section-title">{GUIDE.brandTitle}</h4>
          <div className="guide-brands">
            {Object.keys(BRANDS).map((name) => (
              <span key={name} className="guide-brand">
                <BrandIcon brand={name} size={24} />
                {name}
              </span>
            ))}
            <span className="guide-brand">
              {/* 목록에 없는 이름을 넣으면 etc 아이콘이 나옴 */}
              <BrandIcon brand={GUIDE.etcName} size={24} />
              {GUIDE.etcName}
            </span>
          </div>
        </section>

        {GUIDE.note && <p className="guide-note">{GUIDE.note}</p>}
      </div>
    </div>
  );
}
