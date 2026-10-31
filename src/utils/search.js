import { SEARCH } from '../data/searchContent';

// 비교용으로 글자 다듬기: 띄어쓰기 제거 + 영어 소문자
// "통새우 크런KIM" → "통새우크런kim"
export function normalize(text) {
  return String(text ?? '').replace(/\s+/g, '').toLowerCase();
}

// 검색어를 조각으로 나누기
// "메뉴명:새우 추천" → [{ key: 'menu', value: '새우' }, { key: null, value: '추천' }]
export function parseQuery(query) {
  const menuPrefix = `${SEARCH.keys.menu}:`;
  const commentPrefix = `${SEARCH.keys.comment}:`;

  return query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word.startsWith(menuPrefix)) return { key: 'menu', value: word.slice(menuPrefix.length) };
      if (word.startsWith(commentPrefix)) return { key: 'comment', value: word.slice(commentPrefix.length) };
      return { key: null, value: word };
    })
    .filter((t) => t.value !== ''); // "메뉴명:"만 쓰고 값이 없으면 무시
}

// 조각 하나가 기록 하나에 맞는지
function matchToken(burger, { key, value }) {
  const v = normalize(value);
  const inMenu = normalize(burger.fullName).includes(v);
  const inComment = normalize(burger.comment).includes(v);

  if (key === 'menu') return inMenu;
  if (key === 'comment') return inComment;

  // 키 없이 쓰면: 메뉴 이름, 한줄평, 브랜드, '추천' 중 하나라도 맞으면 통과
  const inBrand = normalize(burger.brand).includes(v);
  const isRecommend = v === normalize(SEARCH.recommendWord) && burger.tasty;
  return inMenu || inComment || inBrand || isRecommend;
}

// 검색어 전체가 기록 하나에 맞는지 (조각이 여러 개면 모두 맞아야 함)
export function matchQuery(burger, tokens) {
  return tokens.every((t) => matchToken(burger, t));
}

// 자동완성: 메뉴 이름에 검색어가 들어간 기록 (최대 limit개)
export function suggestMenus(burgers, query, limit = 5) {
  const tokens = parseQuery(query);
  if (tokens.length === 0) return [];
  return burgers
    .filter((b) => tokens.every((t) => normalize(b.fullName).includes(normalize(t.value))))
    .slice(0, limit);
}