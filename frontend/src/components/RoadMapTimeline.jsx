import React from "react";
import RoadMapCard from "./RoadMapCard";

import "./RoadMapTimeline.css";
import { BookOpen, Clock3, Map, Calendar1Icon } from "lucide-react";

function RoadMapTimeline({ modules }) {
  const totalWeeks = modules[modules.length - 1].end_week;
  return (
    <div className="roadmap-section">
      <div className="roadmap-header">
        <div className="roadmap-heading">
          <div className="header-wrapper">
            <Map size={24} className="icon-map" />
            <h2 className="roadmap-title">Your Learning Roadmap</h2>
          </div>

          <p>Step-by-step plan to build your skills and advance your career.</p>
        </div>
        <div className="roadmap-summary">
          <div className="summary-item">
            <BookOpen size={24} className="icon-module" />
            <span className="summary-label">Total Modules:</span>
            <span className="summary-value">{modules.length}</span>
          </div>
          <div className="summary-item">
            <Calendar1Icon size={24} className="icon-module" />
            <span className="summary-label">Total Weeks:</span>
            <span className="summary-value">{totalWeeks}</span>
          </div>
        </div>
      </div>

      <div className="module-container">
        <div className="module-cards">
          {modules.map((module, idx) => (
            <RoadMapCard key={idx} module={module} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default RoadMapTimeline;
