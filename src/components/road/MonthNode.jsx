import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './MonthNode.css';

// 월 노드: 시간축 위의 작은 점 + 카드 묶음 위에 뜨는 "7월" 라벨
function MonthNode({ data }) {
  return (
    <div className="month-node">
      {/* 이전 달에서 오는 시간축이 들어오는 곳 */}
      <Handle type="target" position={Position.Left} id="left" className="hidden-handle" />

      <div className="month-dot" />

      {/* 라벨은 노드(점) 밖, buildFlow가 계산해준 위치에 띄움 */}
      <div
        className="month-label"
        style={{ left: data.labelOffsetX, top: data.labelOffsetY }}
      >
        {data.month}월
      </div>

      {/* 다음 달로 가는 시간축 + 이 달 카드들로 가는 가지가 나가는 곳 */}
      <Handle type="source" position={Position.Right} id="right" className="hidden-handle" />
    </div>
  );
}

export default memo(MonthNode);
