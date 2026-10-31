// ─────────────────────────────────────────────
// 좌측 색띠 색: 빨강 → 회색 → 초록
// ─────────────────────────────────────────────

// 색이 바뀌는 기준점 (보정 점수 0 ~ 5 위에서)
export const COLOR_STOPS = [
  { at: 0, color: '#C8333F' },   // 빨강
  { at: 2.5, color: '#B7B4AE' }, // 회색
  { at: 5, color: '#1E8E5A' },   // 초록
];

// 고정 보정 범위: 실제 1점 이하 = 빨강, 4점 이상 = 초록
// 데이터가 늘어도 범위가 고정이라 기존 카드 색이 바뀌지 않음
const COLOR_RANGE = { min: 1, max: 4 };

// "#C8333F" → [200, 51, 63]
function hexToRgb(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

// [200, 51, 63] → "rgb(200, 51, 63)"
function rgbToCss([r, g, b]) {
  return `rgb(${r}, ${g}, ${b})`;
}

// 실제 점수 → 보정 점수(0~5)
function toAdjusted(rating) {
  const { min, max } = COLOR_RANGE;
  const v = ((rating - min) / (max - min)) * 5;
  return Math.min(5, Math.max(0, v)); // 0보다 작으면 0, 5보다 크면 5
}

// 실제 점수 → 색띠 색
export function getRatingColor(rating) {
  const v = toAdjusted(rating);
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const from = COLOR_STOPS[i];
    const to = COLOR_STOPS[i + 1];
    if (v <= to.at) {
      const t = (v - from.at) / (to.at - from.at); // 두 기준점 사이 어디쯤인지 (0~1)
      const a = hexToRgb(from.color);
      const b = hexToRgb(to.color);
      return rgbToCss(a.map((x, k) => Math.round(x + (b[k] - x) * t)));
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1].color;
}

// ─────────────────────────────────────────────
// 별점, 날짜
// ─────────────────────────────────────────────

// 점수를 별 조각 목록으로 변환
// 2.6 → [1, 1, 0.6]  (1은 꽉 찬 별, 0.6은 60%만 보이는 별)
export function toStarParts(rating) {
  const full = Math.floor(rating);
  const rest = Math.round((rating - full) * 100) / 100; // 0.6000…1 같은 오차 정리
  const parts = Array(full).fill(1);
  if (rest > 0) parts.push(rest);
  return parts;
}

// "2024-06-19" → "06.19"  (연도는 배경에 표시하므로 생략)
export function formatMonthDay(date) {
  return date.slice(5).replace('-', '.');
}