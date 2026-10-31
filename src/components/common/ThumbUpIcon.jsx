import './ThumbUpIcon.css';

// 추천 아이콘 (엄지) — 카드와 안내 창에서 같이 사용
export default function ThumbUpIcon({ title = '추천' }) {
  return (
    <span className="thumb-icon" title={title}>
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.3l1-4.6v-.3c0-.4-.2-.8-.4-1.1L13.2 1 6.6 7.6C6.2 8 6 8.5 6 9v10c0 1.1.9 2 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7.1c.1-.2.2-.5.2-.7v-2z"
        />
      </svg>
    </span>
  );
}
