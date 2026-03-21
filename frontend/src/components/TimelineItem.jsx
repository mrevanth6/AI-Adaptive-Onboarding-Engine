import React from 'react';
import { motion } from 'framer-motion';

function TimelineItem({
  stepNumber,
  totalSteps,
  title,
  description,
  isCompleted,
  isCurrent,
  isLocked,
  onComplete,
  delay,
  id,
  skillsToDevelop = []
}) {
  const getStatusIcon = () => {
    if (isLocked) return '🔒';
    if (isCompleted) return '✓';
    if (isCurrent) return '▶';
    return `${stepNumber}`;
  };

  const getStatusLabel = () => {
    if (isLocked) return 'Locked';
    if (isCompleted) return 'Completed';
    if (isCurrent) return 'In Progress';
    return 'Not Started';
  };

  return (
    <motion.div
      id={id}
      className={`ti-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
    >
      {/* Timeline marker */}
      <div className="ti-marker">
        <motion.div
          className="ti-status-icon"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
        >
          {getStatusIcon()}
        </motion.div>
        {stepNumber < totalSteps && <div className="ti-connector" />}
      </div>

      {/* Content Card */}
      <motion.div
        className="ti-card"
        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(157, 78, 221, 0.3)' }}
        transition={{ duration: 0.2 }}
      >
        <div className="ti-header">
          <div className="ti-step-info">
            <span className="ti-step-number">Step {stepNumber}</span>
            <h3 className="ti-title">{title}</h3>
          </div>
          <span className={`ti-status-badge ${getStatusLabel().toLowerCase().replace(' ', '-')}`}>
            {getStatusLabel()}
          </span>
        </div>

        <p className="ti-description">{description}</p>

        {skillsToDevelop && skillsToDevelop.length > 0 && (
          <div className="ti-skills">
            <span className="ti-skills-label">Skills developed:</span>
            <div className="ti-skills-tags">
              {skillsToDevelop.map((skill, index) => (
                <span key={index} className="ti-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="ti-footer">
          <div className="ti-progress-info">
            <div className="ti-mini-progress">
              <div
                className="ti-mini-progress-fill"
                style={{
                  width: isCompleted ? '100%' : isCurrent ? '50%' : '0%',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {!isCompleted && !isLocked && (
            <motion.button
              className={`ti-action-btn ${isCurrent ? 'current' : ''}`}
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCurrent ? 'Mark Complete' : 'Start'}
            </motion.button>
          )}

          {isCompleted && (
            <motion.div
              className="ti-completed-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              ✅ Done!
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TimelineItem;
