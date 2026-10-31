// 안내 창 문구 — 글자는 따옴표 안만 고치면 됨
// 항목을 늘리려면 { key: ..., desc: ... } 한 줄을 복사해서 추가

export const GUIDE = {
  title: '🍔 햄버거 아카이브',

  // 소개 문단: 배열의 한 칸이 한 줄
  intro: [
    '24년 5월부터 기록한 햄버거 흡입 아카이브입니다.',
    '본 아카이브의 내용은 주관적 평가일 뿐이며 평가의 일관성도 떨어질 수 있음을 안내드립니다.',
  ],

  sections: [
    {
      title: '둘러보는 법',
      items: [
        { key: '마우스 휠', desc: '왼쪽 · 오른쪽으로 이동' },
        { key: '드래그', desc: '원하는 방향으로 자유롭게 이동' },
        { key: '확대 / 축소', desc: '왼쪽 아래 슬라이더 또는 Ctrl + 휠' },
        { key: '연도 이동', desc: '오른쪽 위 연도를 눌러 원하는 해로 바로 이동' },
      ],
    },
    {
      title: '카드 읽는 법',
      items: [
        // visual: 'gradient' → 색띠 막대를 함께 보여줌
        { key: '좌측 색띠', visual: 'gradient', desc: '아쉬움 · 무난 · 만족' },
        { key: '별점', visual:'star', desc: '맛, 가격, 먹기 편함 등을 함께 본 종합 점수' },
        // visual: 'thumb' → 왼쪽 칸에 글자 대신 추천 아이콘을 보여줌
        { key: '추천', visual: 'thumb', desc: '가격·편의와 상관없이 맛으로 추천하는 메뉴' },
      ],
    },
  ],

  brandTitle: '브랜드',
  etcName: '그 외', // 목록에 없는 브랜드(etc)를 부르는 이름

  note: '문의사항 melnon72@gmail.com',
};