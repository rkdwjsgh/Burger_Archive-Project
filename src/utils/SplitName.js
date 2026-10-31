// 메뉴 이름을 "줄이 바뀌면 안 되는 덩어리"로 나눔
//
// 예) fullName: "나폴리맛피아 모짜렐라 토마토 바질"
//     parts:    ["나폴리맛피아", "모짜렐라", "토마토 바질"]
//  →  [ {text:"나폴리맛피아", keep:true}, {text:" "}, {text:"모짜렐라", keep:true},
//       {text:" "}, {text:"토마토 바질", keep:true} ]
//
// keep:true 조각은 화면에서 한 덩어리로 묶여 중간에 줄이 바뀌지 않음
// parts가 fullName 안에서 찾아지지 않으면 그 부분은 일반 글자로 둠
export function splitName(fullName, parts) {
  const words = parts.filter(Boolean).map(String);

  // 1) 각 덩어리가 fullName 어디에 있는지 찾기 (긴 것부터, 겹치지 않게)
  const ranges = [];
  for (const word of [...words].sort((a, b) => b.length - a.length)) {
    const start = fullName.indexOf(word);
    if (start === -1) continue;
    const end = start + word.length;
    const overlaps = ranges.some((r) => start < r.end && r.start < end);
    if (!overlaps) ranges.push({ start, end });
  }
  ranges.sort((a, b) => a.start - b.start);

  // 2) 찾은 위치를 기준으로 앞에서부터 잘라 조각 목록 만들기
  const pieces = [];
  let cursor = 0;
  for (const { start, end } of ranges) {
    if (cursor < start) pieces.push({ text: fullName.slice(cursor, start) });
    pieces.push({ text: fullName.slice(start, end), keep: true });
    cursor = end;
  }
  if (cursor < fullName.length) pieces.push({ text: fullName.slice(cursor) });
  return pieces;
}