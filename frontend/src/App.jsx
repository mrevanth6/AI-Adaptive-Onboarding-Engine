import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearningRoadMap from "./pages/LearningRoadMap.jsx";
import ResumeAnalyser from "./pages/ResumeAnalyzer.jsx";
import LoginInPage from "./pages/LoginInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Layout from "./components/Layout.jsx";
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
          <Route element={<Layout />} />
          {/* <Route path="/" element={<ResumeAnalyzer />} /> */}
          {/* <Route path="/login" element={<LoginInPage />} />
          <Route path="/signup" element={<SignUpPage />} /> */}
          <Route element={<Layout />} >
            <Route path="/analyzer" element={<ResumeAnalyser />} />
            <Route path="/roadmap" element={<LearningRoadMap />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App