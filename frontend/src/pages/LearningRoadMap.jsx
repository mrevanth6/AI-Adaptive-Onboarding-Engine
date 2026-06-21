import React from 'react';
import ScoreCard from '../components/ScoreCard';
import SkillAnalysis from '../components/SkillAnalysis';
import './LearningRoadMap.css';
import RoadMapTimeline from '../components/RoadMapTimeline';
import { useLocation } from 'react-router-dom';
function LearningRoadmap() {
    const location = useLocation();
    const resumeData = location.state || JSON.parse(localStorage.getItem('resumeData'));

    return (
        <div className="learning-roadmap">
            <div className="header">
                <div className='header-text'>
                    <h1>Learning Roadmap</h1>
                    <p>Based on your resume analysis, here is a personalized learning roadmap to help you bridge the skill gaps and enhance your readiness for your target role.</p>
                </div>
                <div className="skills-card">
                    <ScoreCard score={resumeData.gap_analysis.readiness_score} />
                    <SkillAnalysis gap_analysis={resumeData.gap_analysis} />

                </div>
            </div>
            <RoadMapTimeline modules={resumeData.roadmap} />

        </div >
    );
}
export default LearningRoadmap;
