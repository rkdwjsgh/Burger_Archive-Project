// 조회 페이지 문구 — 글자는 따옴표 안만 고치면 됨

export const SEARCH = {
  title: '조회',
  countText: '{n}개 기록', // {n} 자리에 지금 보이는 기록 수가 들어감

  // 검색창 안내 문구 ← 원하는 내용으로 수정
  placeholder: '메뉴, 한줄평 등으로 검색',

  // 검색 키 (검색창에 '메뉴명:새우'처럼 씀)
  keys: {
    menu: '메뉴명',
    comment: '한줄평',
  },
  recommendWord: '추천', // 이 단어로 검색하면 추천 메뉴가 나옴

  // 자동완성 목록
  suggestMenuTitle: '메뉴',
  suggestKeyTitle: '검색어로 찾기',
  suggestEnterText: "Enter: 모든 항목에서 '{q}' 찾기",

  // 결과가 없을 때
  emptyText: '조건에 맞는 기록이 없어요.',

  // 표 제목
  columns: {
    menu: '메뉴',
    rating: '별점',
    price: '가격',
  },

  // 필터 버튼 이름
  filters: {
    brand: '브랜드',
    year: '연도',
    rating: '별점',
    sort: '정렬',
    all: '전체',
    reset: '초기화',
    selected: '{n}개 선택',
  },

  // 정렬 표시
  sortText: {
    newest: '최신순',
    oldest: '오래된순',
    ratingDesc: '별점 높은순',
    ratingAsc: '별점 낮은순',
    priceDesc: '가격 높은순',
    priceAsc: '가격 낮은순',
    },

  // 브랜드 목록에서 '그 외'로 보여줄 이름
  etcName: '그 외',
};

// 별점 필터 구간
// min 이상, max 미만인 점수가 그 구간에 들어감 / sample은 색 네모를 칠할 대표 점수
export const RATING_BANDS = [
  { id: '3.0+', label: '3.0+', min: 3.0, max: Infinity, sample: 3.0 },
  { id: '2.5~2.9', label: '2.5~2.9', min: 2.5, max: 3.0, sample: 2.6 },
  { id: '2.0~2.4', label: '2.0~2.4', min: 2.0, max: 2.5, sample: 2.2 },
  { id: '2.0-', label: '2.0 -', min: -Infinity, max: 2.0, sample: 1.6 },
];