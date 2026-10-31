import { memo } from 'react';
import './YearNode.css';

// 연도 노드: 세로 구분선 + 크고 흐린 연도 글씨 (배경 장식, 연결점 없음)
function YearNode({ data }) {
  return (
    <div className="year-node">
      <div className="year-line" />
      <div className="year-text">{data.year}</div>
    </div>
  );
}

export default memo(YearNode);
