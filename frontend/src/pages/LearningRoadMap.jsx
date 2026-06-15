import React from 'react';
import ScoreCard from '../components/ScoreCard';
import SkillAnalysis from '../components/SkillAnalysis';
import './LearningRoadMap.css';
function LearningRoadmap() {
    return (
        <div className="learning-roadmap">
            <div className="header">
                <div className='header-text'>
                    <h1>Learning Roadmap</h1>
                    <p>Based on your resume analysis, here is a personalized learning roadmap to help you bridge the skill gaps and enhance your readiness for your target role.</p>
                </div>
                <div className="skills-card">
                    <ScoreCard />
                    <SkillAnalysis />
                </div>
            </div>

        </div >
    );
}
export default LearningRoadmap;
