import { useEffect, useRef, useState } from 'react';
import './TopBar.css';

// ⓘ 아이콘 (SVG)
function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <circle cx="12" cy="7.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

// 연도 선택: 지금 보는 연도를 보여주고, 누르면 목록이 펼쳐짐
function YearSelect({ years, currentYear, onSelect }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // 목록이 열린 상태에서 바깥을 누르면 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div className="year-select" ref={boxRef}>
      <button className="year-button" onClick={() => setOpen(!open)} aria-expanded={open}>
        {currentYear} <span className="year-caret">▾</span>
      </button>

      {open && (
        <ul className="year-list">
          {years.map((y) => (
            <li key={y}>
              <button
                className={y === currentYear ? 'year-option current' : 'year-option'}
                onClick={() => {
                  onSelect(y);
                  setOpen(false);
                }}
              >
                {y}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TopBar({ years, currentYear, onSelectYear, onOpenGuide }) {
  return (
    <header className="top-bar">
      <button className="icon-button" onClick={onOpenGuide} aria-label="페이지 안내" title="페이지 안내">
        <InfoIcon />
      </button>
      <YearSelect years={years} currentYear={currentYear} onSelect={onSelectYear} />
    </header>
  );
}
