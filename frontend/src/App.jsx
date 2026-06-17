import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearningRoadMap from "./pages/LearningRoadMap";
import ResumeAnalyser from "./pages/ResumeAnalyzer";
import LoginInPage from "./pages/LoginInPage";

function App() {
  return (
    <Router>
      <div >
        <Routes>
          {/* <Route path="/" element={<ResumeAnalyzer />} /> */}
          <Route path="/" element={<LoginInPage />} />
          <Route path="/analyzer" element={<ResumeAnalyser />} />
          <Route path="/roadmap" element={<LearningRoadMap />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App