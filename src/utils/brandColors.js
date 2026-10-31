// 브랜드 아이콘 설정
// label: 동그라미 안에 들어갈 글자
//   - 문자열이면 그대로 표시
//   - 배열이면 글자 조각별로 색을 따로 줄 수 있음 (예: M's의 ' 만 노란색)
// bg: 동그라미 배경색, text: 기본 글자색
export const BRANDS = {
  맥도날드: { label: 'Mc', bg: '#FFC72C', text: '#3B2B00' },
  버거킹: { label: 'BK', bg: '#E8742A', text: '#FFFFFF' },
  롯데리아: { label: 'Lo', bg: '#E80027', text: '#FFFFFF' },
  맘스터치: { label: "M's", bg: '#6B4226', text: '#FFFFFF' },
  프랭크버거: { label: 'Fr', bg: '#2E9E6B', text: '#FFFFFF' },
};

// 목록에 없는 브랜드는 모두 etc
export const ETC_BRAND = { label: 'etc', bg: '#9AA0A8', text: '#FFFFFF' };

export function getBrand(brand) {
  return BRANDS[brand] ?? ETC_BRAND;
}