import { HashRouter, Routes, Route } from "react-router-dom";
import TransitionTestPage from "./pages/TransitionTest";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>메인 화면</h1>
            </div>
          }
        />
        <Route path="/transitionTest" element={<TransitionTestPage />} />
      </Routes>
    </HashRouter>
  );
}
