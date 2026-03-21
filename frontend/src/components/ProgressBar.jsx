import React from 'react';
import { motion } from 'framer-motion';

function ProgressBar({ completed, total, percentage }) {
  return (
    <motion.div
      className="pb-container"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="pb-content">
        <div className="pb-info">
          <span className="pb-label">Overall Progress</span>
          <span className="pb-percentage">{Math.round(percentage)}%</span>
        </div>

        <div className="pb-bar-container">
          <div className="pb-bar-background">
            <motion.div
              className="pb-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
            />
          </div>
        </div>

        <div className="pb-milestone-markers">
          {[0, 25, 50, 75, 100].map((milestone) => (
            <motion.div
              key={milestone}
              className="pb-milestone"
              style={{ left: `${milestone}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: percentage >= milestone ? 1 : 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="pb-milestone-dot" />
              <span className="pb-milestone-label">{milestone}%</span>
            </motion.div>
          ))}
        </div>

        <div className="pb-stats">
          <div className="pb-stat">
            <span className="pb-stat-icon">✅</span>
            <span className="pb-stat-text">{completed} completed</span>
          </div>
          <div className="pb-stat">
            <span className="pb-stat-icon">⏳</span>
            <span className="pb-stat-text">{total - completed} remaining</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProgressBar;
