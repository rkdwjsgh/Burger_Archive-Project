import { useRef, useState } from 'react';
import { ReactFlow, ReactFlowProvider, useReactFlow, useViewport } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // React Flow 기본 스타일
import './styles/flow.css';            // 우리 선·연결점 스타일

import burgers from './data/burgers.json';
import { buildFlow } from './utils/buildFlow';
import BurgerNode from './components/BurgerNode';
import MonthNode from './components/MonthNode';
import YearNode from './components/YearNode';
import TopBar from './components/TopBar';
import ZoomSlider from './components/ZoomSlider';
import GuideModal from './components/GuideModal';

// type 이름 ↔ 컴포넌트 연결표 (컴포넌트 밖에 두어야 매번 새로 만들어지지 않음)
const nodeTypes = { burger: BurgerNode, month: MonthNode, year: YearNode };

// 데이터가 바뀌지 않으므로 파일을 불러올 때 한 번만 계산
const { nodes, edges, bounds, years } = buildFlow(burgers);

const TOP_BAR_H = 56;   // 상단바 높이
const START_LEFT = 80;  // 연도 구분선이 화면 왼쪽에서 떨어질 거리 (시작·연도 이동 시)
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.5;
const MARGIN = { left: 200, right: 400, y: 120 }; // 맵 바깥으로 갈 수 있는 여유

// 드래그로 이동할 수 있는 범위
const translateExtent = [
  [bounds.minX - MARGIN.left, bounds.minY - MARGIN.y],
  [bounds.maxX + MARGIN.right, bounds.maxY + MARGIN.y],
];

// 처음 화면: 왼쪽 끝(첫 연도)에서 시작, 시간축은 상단바 아래 공간의 세로 가운데
const defaultViewport = {
  x: START_LEFT - bounds.minX,
  y: TOP_BAR_H + (window.innerHeight - TOP_BAR_H) / 2,
  zoom: 1,
};

// 화면 x 위치가 맵 범위 밖으로 나가지 않게 제한
function clampX(x, zoom, width) {
  const maxX = -translateExtent[0][0] * zoom;        // 왼쪽 끝
  const minX = width - translateExtent[1][0] * zoom; // 오른쪽 끝
  return Math.min(maxX, Math.max(minX, x));
}

function BurgerRoad() {
  const mapRef = useRef(null);
  const flow = useReactFlow();          // 화면 이동·확대 조작 도구
  const { x, y, zoom } = useViewport(); // 현재 화면 위치·배율 (바뀔 때마다 다시 그려짐)
  const [guideOpen, setGuideOpen] = useState(false);

  const width = () => mapRef.current?.clientWidth ?? window.innerWidth;

  // 지금 보고 있는 연도: 화면 왼쪽 30% 지점이 어느 연도 구간인지
  const lookX = (width() * 0.3 - x) / zoom;
  const currentYear = [...years].reverse().find((yr) => yr.x <= lookX)?.year ?? years[0].year;

  // 마우스 휠 → 좌우 이동 (Ctrl+휠은 React Flow의 확대/축소에 맡김)
  function handleWheel(e) {
    if (e.ctrlKey || e.metaKey) return;
    const unit = e.deltaMode === 1 ? 20 : 1; // 일부 마우스는 '줄' 단위로 값을 줌
    const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * unit;
    flow.setViewport({ x: clampX(x - delta, zoom, width()), y, zoom });
  }

  // 연도 선택 → 그 해의 구분선이 화면 왼쪽에 오도록 부드럽게 이동
  function goToYear(year) {
    const target = years.find((yr) => yr.year === year);
    const nextX = clampX(START_LEFT - target.x * zoom, zoom, width());
    flow.setViewport({ x: nextX, y, zoom }, { duration: 500 });
  }

  return (
    <div className="app">
      <TopBar
        years={years.map((yr) => yr.year)}
        currentYear={currentYear}
        onSelectYear={goToYear}
        onOpenGuide={() => setGuideOpen(true)}
      />

      {/* 맵 영역: 휠은 여기서만 처리 (상단바·안내 창 위에서는 맵이 안 움직임) */}
      <div className="map" ref={mapRef} onWheel={handleWheel}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultViewport={defaultViewport}
          translateExtent={translateExtent}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          // 보기 전용: 끌기·연결·선택 끔
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          // 휠은 handleWheel이 처리, 확대는 슬라이더·Ctrl+휠·두 손가락 오므리기
          zoomOnScroll={false}
          panOnScroll={false}
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
        />
      </div>

      <ZoomSlider
        zoom={zoom}
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        onChange={(z) => flow.zoomTo(z)}
        onReset={() => flow.zoomTo(1, { duration: 300 })}
      />

      {guideOpen && <GuideModal onClose={() => setGuideOpen(false)} />}
    </div>
  );
}

// useReactFlow·useViewport를 쓰려면 바깥을 ReactFlowProvider로 감싸야 함
export default function App() {
  return (
    <ReactFlowProvider>
      <BurgerRoad />
    </ReactFlowProvider>
  );
}
