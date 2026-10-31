import { getBrand } from '../utils/brandColors';
import './BrandIcon.css';

// 브랜드 아이콘: 색 동그라미 + 짧은 글자 (카드와 안내 창에서 같이 사용)
export default function BrandIcon({ brand, size = 26 }) {
  const { label, bg, text, scale = 0.38, weight = 800 } = getBrand(brand);
  const pieces = Array.isArray(label) ? label : [label];
  return (
    <span
      className="brand-icon"
      style={{
        background: bg,
        color: text,
        width: size,
        height: size,
        fontSize: size * scale,
        fontWeight: weight,
      }}
      title={brand}
    >
      <span>
        {pieces.map((p, i) =>
          typeof p === 'string' ? p : <span key={i} style={{ color: p.color }}>{p.text}</span>
        )}
      </span>
    </span>
  );
}
