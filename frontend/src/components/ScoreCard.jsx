import roadmap from '../assets/roadmap.json';
import React from 'react';
const { useState, useEffect } = React;
import { TrendingUp } from "lucide-react";
import './ScoreCard.css';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function ScoreCard({ score }) {
    const getColor = (score) => {
        if (score < 40) return "#EF4444";
        if (score < 70) return "#F59E0B";
        return "#22C55E";
    };
    const [progress, setProgress] = useState(0);

    useEffect(() => {

        const timer = setTimeout(() => {
            setProgress(score);
        }, 200);

        return () => clearTimeout(timer);

    }, [score]);
    return (
        <div className="score-card">
            <div className="header-wrapper">
                <div className="icon-container">
                    <TrendingUp size={32} className="score-icon" />
                </div>

                <h3>Readiness Score</h3>
            </div >


            <div className="progress-wrapper">
                <CircularProgressbar
                    value={progress}
                    text={`${progress}%`}
                    styles={buildStyles({
                        transition: "stroke-dashoffset 0.5s ease 0s, color 0.5s ease",
                        pathTransitionDuration: 2,
                        pathColor: getColor(score),
                        textColor: "#1F2937",
                        trailColor: "#E5E7EB",
                        strokeLinecap: "round",
                    })}
                />
            </div>
            <p>
                Keep going! You're on your way to becoming
                job-ready.
            </p>

        </div>

    );
}

export default ScoreCard;