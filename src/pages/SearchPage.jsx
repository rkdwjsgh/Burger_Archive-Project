import { useCallback, useMemo, useState } from 'react';
import burgers from '../data/burgers.json';
import { SEARCH, RATING_BANDS } from '../data/searchContent';
import { BRANDS } from '../utils/brandColors';
import { getRatingColor, getRatingTextColor } from '../utils/rating';
import { parseQuery, matchQuery } from '../utils/search';
import TopBar from '../components/common/TopBar';
import MultiSelect from '../components/search/MultiSelect';
import SortSelect from '../components/search/SortSelect';
import SearchBox from '../components/search/SearchBox';
import BrandIcon from '../components/common/BrandIcon';
import Stars from '../components/common/Stars';
import ThumbUpIcon from '../components/common/ThumbUpIcon';
import DetailPanel from '../components/common/DetailPanel';
import './SearchPage.css';

const ETC = 'etc'; // 목록에 없는 브랜드를 묶는 값

// 필터 목록에 넣을 선택지
const brandOptions = [
  ...Object.keys(BRANDS).map((name) => ({
    value: name,
    label: name,
    icon: <BrandIcon brand={name} size={22} shape="square" />,
  })),
  { value: ETC, label: SEARCH.etcName, icon: <BrandIcon brand={ETC} size={22} shape="square" /> },
];
const yearOptions = [...new Set(burgers.map((b) => b.date.slice(0, 4)))].map((y) => ({ value: y, label: y }));
const ratingOptions = RATING_BANDS.map((band) => ({
  value: band.id,
  label: band.label,
  icon: <span className="band-swatch" style={{ background: getRatingColor(band.sample) }} />,
}));

// 정렬 기준별로 비교할 값
const SORT_VALUE = {
  date: (b) => b.date,
  rating: (b) => b.rating,
  price: (b) => b.price ?? 0,
};

// 별점·가격 표 제목 (누르면 정렬)
function SortHeader({ label, sortKey, sort, onSort, align }) {
  const active = sort.key === sortKey;
  const arrow = active && sort.dir === 'asc' ? '▲' : '▼';
  return (
    <th className={align}>
      <button className={active ? 'th-sort active' : 'th-sort'} onClick={() => onSort(sortKey)}>
        {label} <span className="th-arrow">{arrow}</span>
      </button>
    </th>
  );
}

export default function SearchPage({ topBar }) {
  const [brands, setBrands] = useState([]);
  const [years, setYears] = useState([]);
  const [bands, setBands] = useState([]);
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const closePanel = useCallback(() => setSelectedId(null), []);

  // 별점·가격 제목 클릭: 같은 기준이면 방향만 바꾸고, 새 기준이면 높은 값부터
  function handleSort(key) {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' } : { key, dir: 'desc' }
    );
  }

  // 필터 → 검색 → 정렬 순서로 걸러낸 목록
  const rows = useMemo(() => {
    const tokens = parseQuery(query);
    const filtered = burgers.filter((b) => {
      const brandKey = BRANDS[b.brand] ? b.brand : ETC;
      if (brands.length && !brands.includes(brandKey)) return false;
      if (years.length && !years.includes(b.date.slice(0, 4))) return false;
      if (bands.length) {
        const inBand = RATING_BANDS.some(
          (band) => bands.includes(band.id) && b.rating >= band.min && b.rating < band.max
        );
        if (!inBand) return false;
      }
      return matchQuery(b, tokens);
    });

    const value = SORT_VALUE[sort.key];
    const sign = sort.dir === 'desc' ? -1 : 1;
    return [...filtered].sort((a, b) => {
      const diff = value(a) > value(b) ? 1 : value(a) < value(b) ? -1 : 0;
      // 값이 같으면 최신 기록을 위로
      return diff !== 0 ? diff * sign : b.date.localeCompare(a.date);
    });
  }, [brands, years, bands, sort, query]);

  const selectedBurger = burgers.find((b) => b.id === selectedId);

  return (
    <>
      <TopBar {...topBar} />

      <main className={selectedBurger ? 'search-page with-panel' : 'search-page'}>
        <div className="search-wrap">
          <div className="search-title">
            <h1>{SEARCH.title}</h1>
            <span>{SEARCH.countText.replace('{n}', rows.length)}</span>
          </div>

          {/* 필터 한 줄: [브랜드] [연도] [별점] [정렬] ─ 여백 ─ [검색] */}
          <div className="search-filters">
            <MultiSelect label={SEARCH.filters.brand} options={brandOptions} selected={brands} onChange={setBrands} />
            <MultiSelect label={SEARCH.filters.year} options={yearOptions} selected={years} onChange={setYears} />
            <MultiSelect label={SEARCH.filters.rating} options={ratingOptions} selected={bands} onChange={setBands} />
            <SortSelect sort={sort} onChange={setSort} />
            <div className="filter-spacer" />
            <SearchBox
              value={query}
              onChange={setQuery}
              burgers={burgers}
              onPickMenu={(b) => setSelectedId(b.id)}
            />
          </div>

          <table className="search-table">
            <thead>
              <tr>
                <th>{SEARCH.columns.menu}</th>
                <SortHeader label={SEARCH.columns.rating} sortKey="rating" sort={sort} onSort={handleSort} />
                <SortHeader label={SEARCH.columns.price} sortKey="price" sort={sort} onSort={handleSort} align="right" />
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr
                  key={b.id}
                  className={b.id === selectedId ? 'selected' : ''}
                  onClick={() => setSelectedId(b.id === selectedId ? null : b.id)}
                >
                  <td>
                    <div className="cell-menu">
                      <BrandIcon brand={b.brand} size={26} shape="square" />
                      <span className="menu-text">{b.fullName}</span>
                      {b.tasty && <ThumbUpIcon />}
                    </div>
                  </td>
                  <td className="cell-rating">
                    <span
                      className="rating-badge"
                      style={{ background: getRatingColor(b.rating), color: getRatingTextColor(b.rating) }}
                    >
                      {b.rating.toFixed(1)}
                    </span>
                    <Stars rating={b.rating} />
                  </td>
                  <td className="cell-price">
                    {b.price != null ? `${b.price.toLocaleString('ko-KR')}원` : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && <p className="search-empty">{SEARCH.emptyText}</p>}
        </div>
      </main>

      {selectedBurger && <DetailPanel burger={selectedBurger} onClose={closePanel} />}
    </>
  );
}
