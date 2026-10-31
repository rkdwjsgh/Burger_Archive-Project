import { useEffect, useState } from 'react';
import RoadPage from './pages/RoadPage';
import SearchPage from './pages/SearchPage';
import GuideModal from "./components/common/GuideModal";

// 주소 끝(#/search)으로 지금 페이지를 정함
// GitHub Pages에서도 새로고침했을 때 페이지가 유지되도록 # 방식을 사용
function pageFromHash() {
  return window.location.hash === '#/search' ? 'search' : 'road';
}

export default function App() {
  const [page, setPage] = useState(pageFromHash);
  const [guideOpen, setGuideOpen] = useState(false);

  // 브라우저 뒤로가기/앞으로가기로 주소가 바뀌면 페이지도 바꿈
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // 탭을 누르면 주소만 바꿈 → 위의 hashchange가 페이지를 바꿔줌
  function changePage(next) {
    window.location.hash = next === 'search' ? '#/search' : '#/';
  }

  // 두 페이지가 같이 쓰는 상단바 설정
  const topBar = {
    page,
    onChangePage: changePage,
    onOpenGuide: () => setGuideOpen(true),
  };

  return (
    <div className="app">
      {page === 'road' ? <RoadPage topBar={topBar} /> : <SearchPage topBar={topBar} />}
      {guideOpen && <GuideModal onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
