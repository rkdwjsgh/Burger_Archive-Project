import { useEffect, useRef, useState } from 'react';
import { SEARCH } from '../../data/searchContent';
import { suggestMenus, normalize } from '../../utils/search';
import BrandIcon from '../common/BrandIcon';
import './SearchBox.css';

// 메뉴 이름에서 검색어와 맞는 부분만 굵게
function Highlight({ text, query }) {
  const q = normalize(query);
  if (!q) return text;
  // 띄어쓰기를 무시하고 위치를 찾기 위해, 글자마다 원래 위치를 기억
  const chars = [...text];
  const map = [];
  chars.forEach((c, i) => { if (!/\s/.test(c)) map.push(i); });
  const start = normalize(text).indexOf(q);
  if (start === -1) return text;
  const from = map[start];
  const to = map[start + q.length - 1] + 1;
  return (
    <>
      {chars.slice(0, from).join('')}
      <b>{chars.slice(from, to).join('')}</b>
      {chars.slice(to).join('')}
    </>
  );
}

// 검색창 + 자동완성 목록
export default function SearchBox({ value, onChange, burgers, onPickMenu }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // 바깥을 누르면 목록 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const trimmed = value.trim();
  const hasKey = trimmed.includes(':'); // 이미 '메뉴명:'처럼 키를 쓴 경우
  const menus = suggestMenus(burgers, hasKey ? trimmed.split(':').pop() : trimmed);
  const showList = open && trimmed !== '';

  return (
    <div className="search-box" ref={boxRef}>
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        type="search"
        value={value}
        placeholder={SEARCH.placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') setOpen(false); // 결과는 이미 표에 반영됨
        }}
      />

      {showList && (
        <div className="suggest">
          {menus.length > 0 && (
            <>
              <div className="suggest-title">{SEARCH.suggestMenuTitle}</div>
              {menus.map((b) => (
                <button
                  key={b.id}
                  className="suggest-menu"
                  onClick={() => {
                    onPickMenu(b); // 상세 패널 열기
                    setOpen(false);
                  }}
                >
                  <BrandIcon brand={b.brand} size={22} shape="square" />
                  <span>
                    <Highlight text={b.fullName} query={hasKey ? trimmed.split(':').pop() : trimmed} />
                  </span>
                </button>
              ))}
            </>
          )}

          {/* 키를 아직 안 썼을 때만 '메뉴명:새우', '한줄평:새우' 제안 */}
          {!hasKey && (
            <>
              <div className="suggest-title">{SEARCH.suggestKeyTitle}</div>
              <div className="suggest-keys">
                {[SEARCH.keys.menu, SEARCH.keys.comment].map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      onChange(`${k}:${trimmed}`);
                      setOpen(false);
                    }}
                  >
                    {k}:{trimmed}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="suggest-footer">{SEARCH.suggestEnterText.replace('{q}', trimmed)}</div>
        </div>
      )}
    </div>
  );
}
