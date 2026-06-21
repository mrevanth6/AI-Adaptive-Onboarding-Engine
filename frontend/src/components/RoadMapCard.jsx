import React, { useState } from "react";
import './RoadMapCard.css';
function RoadMapCard({ module }) {

    const getTypeClass = (type) => {
        return type === 'full-module' ? 'full-module' : 'fast-track';
    };

    const getTypeLabel = (type) => {
        return type === 'full-module' ? 'Full Module' : 'Fast Track';
    };
    return (
        <div className="roadmap-card-wrapper">
            <div className="week-indicator">
                <span className="week-number">{module.module_number}</span>
                <span className="week-range">Week {module.start_week} - {module.end_week}</span>
                <span className="week-duration">({module.duration_weeks} weeks)</span>
            </div>
            <div className="roadmap-card">
                <div className="module-content">
                    <div className="module-header">
                        <h3 className="module-title">{module.topic}</h3>
                        <div className="module-details">
                            <span className={`module-type ${getTypeClass(module.type)}`}>{getTypeLabel(module.type)}</span>
                            <span className="estimated-hours">⏱ {module.estimated_hours} Hours</span>
                        </div>
                        <div className="module-reason">
                            <p className="module-reason-para p-font">{module.reason}</p>
                        </div>
                    </div>

                    <div className="module-milestone">
                        <div className="milestone-box">
                            <h4 className="milestone-heading">Milestone</h4>
                            <p className="milestone-description p-font">{module.milestone}</p>
                        </div>
                        <button className="expand-btn">View Details</button>


                    </div>

                </div>
            </div>
        </div>



    );
}
export default RoadMapCard;