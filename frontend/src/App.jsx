import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearningRoadMap from "./pages/LearningRoadMap.jsx";
import ResumeAnalyser from "./pages/ResumeAnalyzer.jsx";
import LoginInPage from "./pages/LoginInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Router>
      <div >
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
        />
        <Routes>

          <Route path="/" element={<LoginInPage />} />
          <Route path="/login" element={<LoginInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/analyzer" element={<ResumeAnalyser />} />
          <Route path="/roadmap" element={<LearningRoadMap />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App