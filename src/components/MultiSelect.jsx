import { useEffect, useRef, useState } from 'react';
import { SEARCH } from '../data/searchContent';
import './MultiSelect.css';

// 체크 목록 필터 (브랜드·연도·별점 공용)
// options: [{ value, label, icon }]  /  selected: 고른 value 배열
export default function MultiSelect({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // 바깥을 누르면 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // 체크 켜기/끄기
  function toggle(value) {
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    );
  }

  const count = selected.length;

  return (
    <div className="multi-select" ref={boxRef}>
      <button
        className={count > 0 ? 'filter-button active' : 'filter-button'}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}{' '}
        {count > 0 ? <span className="filter-count">{count}</span> : <b>{SEARCH.filters.all}</b>}
        <span className="filter-caret">▾</span>
      </button>

      {open && (
        <div className="filter-menu">
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <label key={opt.value} className="filter-option">
                <input type="checkbox" checked={checked} onChange={() => toggle(opt.value)} />
                <span className={checked ? 'check on' : 'check'} aria-hidden="true">
                  {checked && '✓'}
                </span>
                {opt.icon}
                <span>{opt.label}</span>
              </label>
            );
          })}
          <div className="filter-footer">
            <span>{SEARCH.filters.selected.replace('{n}', count)}</span>
            <button onClick={() => onChange([])}>{SEARCH.filters.reset}</button>
          </div>
        </div>
      )}
    </div>
  );
}
