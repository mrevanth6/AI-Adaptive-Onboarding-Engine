import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearningRoadMap from "./pages/LearningRoadMap";


function App() {
  return (
    <Router>
      <div >
        <Routes>
          {/* <Route path="/" element={<ResumeAnalyzer />} /> */}
          <Route path="/" element={<LearningRoadMap />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App