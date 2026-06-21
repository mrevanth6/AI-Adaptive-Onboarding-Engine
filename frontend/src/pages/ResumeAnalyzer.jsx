import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './resume-analyzer.css';
const API_URL = import.meta.env.VITE_API_URL;
function ResumeAnalyser() {
  const navigate = useNavigate();
  const [resume, setResume] = useState();
  const [jobDescription, setjobDescription] = useState("");
  const [disable, setDisable] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setDisable(true);
    const formData = new FormData();
    formData.append('file', resume);
    formData.append('jobDescription', jobDescription);
    console.log(formData);
    console.log(formData);
    try {
      const response = await axios.post(
        "https://ai-adaptive-onboarding-engine-d0qy.onrender.com/api/upload",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log(response);
      if (response.status === 200) {
        const data = response.data;

        localStorage.setItem('resumeData', JSON.stringify(data));
        navigate('/roadmap', { state: data });
      } else {
        alert("Error uploading resume. Please try again.");

      }
      setDisable(false);
    }
    catch (error) {

      alert("An error occurred while uploading the resume. Please try again.");
      setDisable(false);
    }

  }
  const handleResume = (e) => {
    const file = e.target.files[0];
    setResume(file);

  }
  const handleJobDescription = (e) => {
    const value = e.target.value;
    setjobDescription(value);

  }
  return (
    <>
      <div className='resume-analyzer'>
        <form onSubmit={handleSubmit}>
          <div className='resume-card'>

            <h2>Upload Resume</h2>
            <div className='input-group'>
              <input
                type="file"
                id="resume-file"
                onChange={handleResume}
                required
                accept='.pdf,.docx'
              />

            </div>
            <div className='input-group'>
              <label> Job Description</label>
              <textarea
                id="job-description"
                placeholder='Enter Job Description...'
                required
                onChange={handleJobDescription}

              />
            </div>
            <button type="submit" disabled={disable} className='submit-btn'>
              Upload
            </button>
          </div>


        </form>
      </div>
    </>
  );
}

export default ResumeAnalyser;