import { useEffect, useRef, useState } from 'react';
import { SEARCH } from '../data/searchContent';
import './MultiSelect.css';

// 날짜 정렬 선택 (최신순 / 오래된순)
// sort: { key: 'date' | 'rating' | 'price', dir: 'desc' | 'asc' }
export default function SortSelect({ sort, onChange }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // 버튼에 보일 글자: 날짜순이면 최신/오래된, 표 제목으로 정렬 중이면 별점순/가격순
  const current =
    sort.key === 'date'
      ? sort.dir === 'desc' ? SEARCH.sortText.newest : SEARCH.sortText.oldest
      : SEARCH.sortText[sort.key];

  const options = [
    { dir: 'desc', label: SEARCH.sortText.newest },
    { dir: 'asc', label: SEARCH.sortText.oldest },
  ];

  return (
    <div className="multi-select" ref={boxRef}>
      <button className="filter-button" onClick={() => setOpen(!open)} aria-expanded={open}>
        {SEARCH.filters.sort} <b>{current}</b>
        <span className="filter-caret">▾</span>
      </button>
      {open && (
        <div className="filter-menu">
          {options.map((o) => (
            <button
              key={o.dir}
              className={
                sort.key === 'date' && sort.dir === o.dir ? 'filter-option sort current' : 'filter-option sort'
              }
              onClick={() => {
                onChange({ key: 'date', dir: o.dir });
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
