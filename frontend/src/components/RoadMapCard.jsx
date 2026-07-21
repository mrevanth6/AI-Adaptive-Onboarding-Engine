import "./RoadMapCard.css";
import { useState } from "react";
import ResourceDialog from "./ResourceDialog";
function RoadMapCard({ module, index }) {
  console.log(module);
  const [DialogOpen, setDialogOpen] = useState(false);
  const getTypeClass = (type) => {
    return type === "full-module" ? "full-module" : "fast-track";
  };

  const getTypeLabel = (type) => {
    return type === "full-module" ? "Full Module" : "Fast Track";
  };
  return (
    <>
      <div className="roadmap-card-wrapper">
        <div className="week-indicator">
          <p className={`week-number color-${index % 3}`}>
            {module.module_number}
          </p>
          <div className="week-meta">
            <p className="week-range">
              Week {module.start_week} - {module.end_week}
            </p>
            <p className="week-duration">({module.duration_weeks} weeks)</p>
          </div>
        </div>
        <div className={`roadmap-card color-${index % 3}`}>
          <div className="module-content">
            <div className="module-header">
              <h3 className="module-title">{module.topic}</h3>
              <div className="module-details">
                <span className={`module-type ${getTypeClass(module.type)}`}>
                  {getTypeLabel(module.type)}
                </span>
                <span className="estimated-hours">
                  ⏱ {module.estimated_hours} Hours
                </span>
              </div>
              <div className="module-reason">
                <p className="module-reason-para p-font">{module.reason}</p>
              </div>
            </div>

            <div className="module-milestone">
              <div className="milestone-box">
                <h4 className="milestone-heading">Milestone</h4>
                <p className="milestone-description p-font">
                  {module.milestone}
                </p>
              </div>
              <button
                className={`expand-btn btn-color-${index % 3}`}
                onClick={() => setDialogOpen(true)}
              >
                View Resources
              </button>
              {DialogOpen && (
                <ResourceDialog
                  topic={module.topic}
                  resources={
                    module.resources
                      ? module.resources
                      : module.learning_resources
                  }
                  onClose={() => setDialogOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default RoadMapCard;
