import { useEffect } from 'react';
import { DETAIL } from '../data/detailContent';
import { formatFullDate } from '../utils/rating';
import BrandIcon from './BrandIcon';
import Stars from './Stars';
import ThumbUpIcon from './ThumbUpIcon';
import './DetailPanel.css';

// 출시 줄 글자 만들기
function releaseText(burger) {
  if (burger.menuType === 'regular' || !burger.releaseMonth) return DETAIL.releaseText.regular;
  const [y, m] = burger.releaseMonth.split('-');
  const template = burger.rerelease ? DETAIL.releaseText.rerelease : DETAIL.releaseText.limited;
  return template.replace('{y}', y).replace('{m}', Number(m));
}

// ⓘ 아이콘 (SVG)
function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <circle cx="12" cy="7.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

// 오른쪽 옆 상세 패널 (버거 로드·조회 페이지 공용)
export default function DetailPanel({ burger, onClose }) {
  // Esc 키로 닫기
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isRegular = burger.menuType === 'regular';

  return (
    <aside className="detail-panel" aria-label={`${burger.fullName} 상세`}>
      <button className="detail-close" onClick={onClose} aria-label="닫기">✕</button>

      {/* ① 브랜드 + 먹은 날짜 */}
      <div className="detail-head">
        <BrandIcon brand={burger.brand} size={28} />
        <span className="detail-brand">{burger.brand}</span>
        <span className="detail-date">{formatFullDate(burger.date)}</span>
      </div>

      {/* ② 메뉴명 */}
      <h2 className="detail-title">{burger.fullName}</h2>

      {/* ③ 별점 + 추천 */}
      <div className="detail-rating">
        <Stars rating={burger.rating} size={18} />
        <strong>{burger.rating.toFixed(1)}</strong>
        <small>/ 5</small>
        {burger.tasty && (
          <span className="detail-recommend">
            <ThumbUpIcon /> 추천
          </span>
        )}
      </div>

      {/* ④ 한줄평 (없으면 숨김) */}
      {burger.comment && <p className="detail-comment">{burger.comment}</p>}

      {/* ⑤ 출시 / 가격 / 중량 (값이 없는 줄은 숨김) */}
      <dl className="detail-info">
        <div>
          <dt>{DETAIL.labels.release}</dt>
          <dd>{releaseText(burger)}</dd>
        </div>
        {burger.price != null && (
          <div>
            <dt>{DETAIL.labels.price}</dt>
            <dd>{burger.price.toLocaleString('ko-KR')}원</dd>
          </div>
        )}
        {burger.weight != null && (
          <div>
            <dt>{DETAIL.labels.weight}</dt>
            <dd>{burger.weight}g</dd>
          </div>
        )}
      </dl>

      {/* ⑥ 가격·중량 안내: 마우스를 올리거나 Tab으로 이동하면 말풍선이 아래로 펼쳐짐 */}
      <div className="detail-note" tabIndex={0}>
        <InfoIcon />
        <span>{DETAIL.noteLabel}</span>
        <span className="detail-tooltip" role="tooltip">
          {isRegular ? DETAIL.note.regular : DETAIL.note.limited}
        </span>
      </div>
    </aside>
  );
}
