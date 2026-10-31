import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getRatingColor, formatMonthDay } from '../../utils/rating';
import { splitName } from '../../utils/splitName';
import BrandIcon from '../common/BrandIcon';
import ThumbUpIcon from '../common/ThumbUpIcon';
import Stars from '../common/Stars';
import './BurgerNode.css';

// 메뉴 이름: 의미 덩어리 사이에서만 줄바꿈
function MenuName({ data }) {
  const pieces = splitName(data.fullName, [data.series, data.menu, data.variant]);
  return (
    <div className="menu-name">
      {pieces.map((p, i) =>
        p.keep ? <span key={i} className="nowrap">{p.text}</span> : p.text
      )}
    </div>
  );
}

function BurgerNode({ data }) {
  return (
    <div className="burger-card" style={{ '--rating-color': getRatingColor(data.rating) }}>
      {/* 월 점에서 오는 가지가 붙는 연결점 (화면에는 안 보임) */}
      <Handle type="target" position={Position.Left} id="left" className="hidden-handle" />

      {/* 첫 줄: 브랜드 아이콘 + 월.일 */}
      <div className="card-top">
        <BrandIcon brand={data.brand} />
        <span className="card-date">{formatMonthDay(data.date)}</span>
      </div>

      {/* 메뉴 이름 */}
      <MenuName data={data} />

      {/* 마지막 줄: 별점 + 점수 + 추천 */}
      <div className="card-bottom">
        <Stars rating={data.rating} />
        <span className="score">{data.rating.toFixed(1)} / 5</span>
        {data.tasty && <ThumbUpIcon />}
      </div>
    </div>
  );
}

// memo: data가 바뀌지 않으면 다시 그리지 않음
export default memo(BurgerNode);
