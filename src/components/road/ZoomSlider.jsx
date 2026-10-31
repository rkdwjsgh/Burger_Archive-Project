import './ZoomSlider.css';

// 왼쪽 아래 확대/축소: 초기화 버튼 + 슬라이더 + 현재 배율
export default function ZoomSlider({ zoom, min, max, onChange, onReset }) {
  return (
    <div className="zoom-slider">
      <button className="zoom-reset" onClick={onReset} title="원래 크기로">
        ↺ 초기화
      </button>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={zoom}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="확대 / 축소"
      />
      <span className="zoom-value">{Math.round(zoom * 100)}%</span>
    </div>
  );
}
