import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './resume-analyzer.css';

function ResumeAnalyser() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const preProcessData = (resumeSkills, requiredSkills) => {
    // Pre Proccess the data that we got from the First API and then send it to the second API
    
    const jdSkills = Object.keys(requiredSkills).filter(
        key => key !== "job_role"
    );
    const inputRole=requiredSkills.job_role;
    return { resumeSkills, jdSkills, inputRole };
  }
  const uploadResume = async () => {
    // Validation
    if (!resumeFile) {
      setError("Please upload a resume file");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("jobDescription", jobDescription);


    try {
      const res = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
     
      const processedData = preProcessData(res.data.skills, res.data.requiredSkills);
      const roadMapRes=await axios.post(
        "http://localhost:3000/api/analyze",
        processedData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
 
      
      // Navigate to Learning Roadmap with the backend data
      navigate("/learning-roadmap", { state: { roadmapData: roadMapRes.data, resumeData: res.data } });
    } catch (error) {
      console.error("Error uploading resume:", error);
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setResumeFile(files[0]);
      setError("");
    }
  };

  return (
    <div className="ra-container">
      <div className="ra-card">
        {/* Title */}
        <div className="ra-header">
          <h1 className="ra-title">Resume Analyzer</h1>
          <p className="ra-subtitle">Upload your resume and job description to get instant insights</p>
        </div>

        {/* File Upload Section */}
        <div className="ra-section">
          <label className="ra-label">Upload Resume</label>
          <div
            className="ra-upload-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="resume-file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="ra-file-input"
            />
            <label htmlFor="resume-file" className="ra-upload-label">
              <svg className="ra-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span className="ra-upload-text">
                {resumeFile ? resumeFile.name : "Drag & drop your resume or click to browse"}
              </span>
              <span className="ra-upload-hint">PDF, DOC, or DOCX (Max 10MB)</span>
            </label>
          </div>
        </div>

        {/* Job Description Section */}
        <div className="ra-section">
          <label htmlFor="job-description" className="ra-label">Job Description</label>
          <textarea
            id="job-description"
            className="ra-textarea"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="ra-error">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="ra-actions">
          <button
            className="ra-button"
            onClick={uploadResume}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="ra-spinner"></span>
                Analyzing...
              </>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyser;