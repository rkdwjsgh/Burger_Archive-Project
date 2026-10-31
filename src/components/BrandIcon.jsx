import { getBrand } from '../utils/brandColors';
import './BrandIcon.css';

// 브랜드 아이콘: 색 도형 + 짧은 글자
// shape: 'circle'(기본, 버거 로드·안내 창·상세 패널) / 'square'(조회 페이지)
export default function BrandIcon({ brand, size = 26, shape = 'circle' }) {
  const { label, bg, text, scale = 0.38, weight = 800 } = getBrand(brand);
  const pieces = Array.isArray(label) ? label : [label];
  return (
    <span
      className={`brand-icon ${shape}`}
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
