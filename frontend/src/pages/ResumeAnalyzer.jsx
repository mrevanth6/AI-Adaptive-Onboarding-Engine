import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./resume-analyzer.css";
const API_URL = import.meta.env.VITE_API_URL;
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";
import { Upload } from "lucide-react";
import { BeatLoader } from "react-spinners";
function ResumeAnalyser() {
  const navigate = useNavigate();
  const [resume, setResume] = useState();
  const [jobDescription, setjobDescription] = useState("");
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setDisable(true);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", resume);
    formData.append("jobDescription", jobDescription);
    console.log(formData);
    console.log(formData);
    try {
      const response = await axios.post(
        "https://ai-adaptive-onboarding-engine-d0qy.onrender.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the Authorization header
          },
        },
      );

      // If Invalid token, redirect to login page
      if (response.status === 401) {
        toast.error("Invalid token. Please login again.");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
      if (response.status === 200) {
        const { message, data } = response.data;
        toast.success(message);
        navigate("/roadmap", { state: data.roadmap });
      } else {
        toast.error("Error uploading resume. Please try again.");
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while uploading the resume. Please try again.",
      );
    } finally {
      setDisable(false);
      setLoading(false);
    }
  }
  const handleResume = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };
  const handleJobDescription = (e) => {
    const value = e.target.value;
    setjobDescription(value);
  };
  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <BeatLoader color="#4F46E5" size={10} />
        </div>
      )}
      <div className="resume-analyzer">
        <form onSubmit={handleSubmit}>
          <div className="resume-card">
            <h2>Upload Resume</h2>
            <div className="input-group">
              <label htmlFor="resume-file" className="upload-area">
                <div className="upload-icon">
                  <Upload size={28} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    color: "#0F172A",
                  }}
                >
                  Upload your Resume
                </h3>
                <p>
                  {resume
                    ? resume.name
                    : "Drag & drop your PDF or DOCX here, or click to browse"}
                </p>
                <span className="browse-btn">Choose File</span>
              </label>

              <input
                id="resume-file"
                type="file"
                accept=".pdf,.docx"
                onChange={handleResume}
                required
                hidden
              />
            </div>
            <div className="input-group">
              <label> Job Description</label>
              <textarea
                id="job-description"
                placeholder="Enter Job Description..."
                required
                onChange={handleJobDescription}
              />
            </div>

            <button type="submit" disabled={disable} className="submit-btn">
              Upload & Analyze <ArrowRight size={24} className="arrow-icon" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ResumeAnalyser;
