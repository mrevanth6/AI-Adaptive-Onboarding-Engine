import React from "react";
import RoadMapCard from "./RoadMapCard";
import roadmap from "../assets/roadmap.json";
import "./RoadMapTimeline.css";

function RoadMapTimeline() {
    const { roadmap: modules } = roadmap;
    const totalHours = modules.reduce((total, module) => total + module.estimatedHours, 0);
    const totalWeeks = modules[modules.length - 1].end_week;
    return (

        <div className="roadmap-section">
            <div className="roadmap-header">
                <div className="roadmap-heading">
                    <h2 className="roadmap-title">
                        Your Learning Roadmap
                    </h2>
                    <p>Step-by-step plan to build your skills and advance your career.</p>
                </div>
                <div className="roadmap-summary">
                    <div className="summary-item">
                        <span className="summary-label">Total Modules:</span>
                        <span className="summary-value">{modules.length}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Total Weeks:</span>
                        <span className="summary-value">{totalWeeks}</span>
                    </div>

                </div>

            </div>

            <div className="module-container">
                <div className="module-cards">
                    {modules.map((module, idx) => (
                        <RoadMapCard
                            key={idx}
                            module={module}
                        />
                    ))}
                </div>
            </div>
        </div>


    );
}
export default RoadMapTimeline;