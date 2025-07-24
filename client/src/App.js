import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS를 불러옴//상대경로로 지정 (그렇지 않으면 도커에서 빌드시 오류 발생)
import { Footer, Navbar } from "./components/Export";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./mainPage/Home";
import Enroll from "./mainPage/Enroll";
import RegiInfo from "./mainPage/RegiInfo";
import NotFound from "./setup/NotFound";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1 mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/enroll" element={<Enroll />} />
            <Route path="/regi" element={<RegiInfo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
