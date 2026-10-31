// ─────────────────────────────────────────────
// 화면 배치에 쓰는 크기 값 (px)
// ─────────────────────────────────────────────
const CARD_W = 220;     // 카드 너비
const CARD_H = 124;     // 카드 높이
const CARD_GAP = 16;    // 같은 달 카드 사이 세로 간격
const COL_GAP = 70;     // 월 묶음 사이 가로 간격
const YEAR_GAP = 80;    // 연도가 바뀔 때 추가로 띄우는 간격
const HUB_OFFSET = 30;  // 가지가 뻗어 나오는 점(허브)이 카드 왼쪽에서 떨어진 거리
const DOT = 8;          // 월 점 지름
const LABEL_GAP = 26;   // 월 라벨이 카드 묶음 위로 떨어진 거리
const YEAR_H = 760;     // 연도 구분선 길이
const YEAR_W = 100;     // 연도 노드 너비

// ① 기록을 월 단위로 묶기
// burgers는 이미 날짜순으로 정렬되어 있다고 가정
export function groupByMonth(burgers) {
  const groups = [];
  for (const burger of burgers) {
    const month = burger.date.slice(0, 7); // "2024-05-10" → "2024-05"
    const last = groups[groups.length - 1];
    if (last && last.month === month) {
      last.items.push(burger);             // 같은 달이면 마지막 묶음에 추가
    } else {
      groups.push({ month, items: [burger] }); // 새 달이면 새 묶음 생성
    }
  }
  return groups;
}

// ② 묶음 → React Flow의 nodes, edges 배열로 변환
export function buildFlow(burgers) {
  const groups = groupByMonth(burgers);
  const nodes = [];
  const edges = [];
  const years = []; // 연도별 구분선 x좌표 (연도 이동, 현재 연도 표시용)

  let x = 0;            // 현재 월 묶음의 카드 왼쪽 x좌표
  let prevYear = null;
  let prevHubId = null;

  for (const group of groups) {
    const year = group.month.slice(0, 4);

    // 연도가 바뀌면: 간격을 더 띄우고 연도 노드 추가
    if (year !== prevYear) {
      if (prevYear !== null) x += YEAR_GAP;
      years.push({ year, x: x - 120 });
      nodes.push({
        id: `year-${year}`,
        type: 'year',
        // 이전 해 마지막 카드와 이번 해 첫 월 점 사이에 구분선이 오도록 배치
        position: { x: x - 120, y: -YEAR_H / 2 },
        data: { year },
        style: { width: YEAR_W, height: YEAR_H },
        zIndex: -1, // 카드보다 뒤에 깔리게
        draggable: false,
        selectable: false,
      });
      prevYear = year;
    }

    // 이 달 카드 묶음의 전체 높이 → 세로 가운데(y=0) 정렬용
    const n = group.items.length;
    const totalH = n * CARD_H + (n - 1) * CARD_GAP;
    const topY = -totalH / 2;

    // 허브(월) 노드: 시간축 위의 점 + 월 라벨
    // 점의 중심이 정확히 시간축(y=0) 위에 오도록 지름의 절반만큼 당겨서 배치
    const hubId = `month-${group.month}`;
    const hubX = x - HUB_OFFSET - DOT / 2;
    const hubY = -DOT / 2;
    nodes.push({
      id: hubId,
      type: 'month',
      position: { x: hubX, y: hubY },
      data: {
        month: Number(group.month.slice(5)), // "05" → 5
        // 라벨 위치 = (점 기준) 첫 카드 왼쪽 위에서 LABEL_GAP만큼 위
        labelOffsetX: x - hubX,
        labelOffsetY: topY - LABEL_GAP - hubY,
      },
      draggable: false,
      selectable: false,
    });

    // 시간축: 이전 달 허브 → 이번 달 허브
    if (prevHubId) {
      edges.push({
        id: `spine-${prevHubId}-${hubId}`,
        source: prevHubId,
        target: hubId,
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'straight',
        className: 'spine-edge',
      });
    }

    // 버거 카드 노드 + 허브에서 카드로 뻗는 가지
    group.items.forEach((burger, i) => {
      const id = `burger-${burger.id}`;
      nodes.push({
        id,
        type: 'burger',
        position: { x, y: topY + i * (CARD_H + CARD_GAP) },
        data: burger,
        draggable: false,
        style: { width: CARD_W, height: CARD_H },
      });
      edges.push({
        id: `branch-${hubId}-${id}`,
        source: hubId,
        target: id,
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'default', // 곡선(베지어)
        className: 'branch-edge',
      });
    });

    prevHubId = hubId;
    x += CARD_W + COL_GAP; // 다음 달로 이동
  }

  // 맵 전체 범위 (화면 이동 제한에 사용)
  const bounds = {
    minX: nodes[0].position.x,         // 첫 연도 구분선
    maxX: x - COL_GAP,                 // 마지막 카드 오른쪽 끝
    minY: -YEAR_H / 2,
    maxY: YEAR_H / 2,
  };

  return { nodes, edges, bounds, years };
}