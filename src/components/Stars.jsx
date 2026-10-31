import { toStarParts } from '../utils/rating';
import StarIcon from './StarIcon';
import './Stars.css';

// 점수만큼만 별을 그리고, 마지막 별은 비율만큼 잘라서 보여줌 (카드·상세 패널 공용)
export default function Stars({ rating, size = 14 }) {
  return (
    <span
      className="stars"
      aria-label={`5점 만점에 ${rating}점`}
      title={`별점 ${rating.toFixed(1)} / 5`}
    >
      {toStarParts(rating).map((part, i) => (
        <span key={i} className="star" style={{ width: size * part }}>
          <StarIcon size={size} />
        </span>
      ))}
    </span>
  );
}
