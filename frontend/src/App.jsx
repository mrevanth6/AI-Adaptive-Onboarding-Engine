import ResumeAnalyzer from "./components/ResumeAnalyzer";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearningRoadmap from "./components/LearningRoadmap";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ResumeAnalyzer />} />
          <Route path="/learning-roadmap" element={<LearningRoadmap />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App