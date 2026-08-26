import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TransitionTest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* localhost:5173/ 접속 시 기존 메인 화면 유지 */}
        <Route
          path="/"
          element={
            <div>
              <h1>메인 화면</h1>
            </div>
          }
        />

        {/* localhost:5173/test 접속 시 테스트 페이지 렌더링 */}
        <Route path="/transitionTest" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}
