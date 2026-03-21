import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import ProgressBar from './ProgressBar';
import TimelineItem from './TimelineItem';
import SkillChart from './SkillChart';
import './learning-roadmap.css';

const DIFFICULTY_LEVELS = {
  beginner: 0,
  intermediate: 1,
  advanced: 2
};

// Dynamically extract skills mentioned in roadmap steps
const buildDynamicStepSkillMap = (roadmap, technicalSkills) => {
  const skillMap = {};
  
  // Create a list of skill names for matching (case-insensitive)
  const skillNames = technicalSkills.map(s => ({
    name: s.skill.toLowerCase(),
    original: s.skill
  }));

  roadmap.forEach((step, index) => {
    const stepLower = step.toLowerCase();
    const foundSkills = [];

    // Find all technical skills mentioned in this step
    skillNames.forEach(skill => {
      if (stepLower.includes(skill.name)) {
        foundSkills.push(skill.original);
      }
    });

    // Also look for common tech keywords not in the list
    const keywords = [
      { pattern: /html5|html/, name: 'HTML5' },
      { pattern: /css3|css/, name: 'CSS3' },
      { pattern: /javascript|js(?!\w)/, name: 'JavaScript' },
      { pattern: /typescript|ts(?!\w)/, name: 'TypeScript' },
      { pattern: /react|vue|angular/, name: step.match(/react|vue|angular/i)?.[0] },
      { pattern: /nodejs|node\.js|node/, name: 'Node' },
      { pattern: /postgresql|postgres|mysql|mongodb/, name: step.match(/postgresql|postgres|mysql|mongodb/i)?.[0] },
      { pattern: /aws|azure|gcp/, name: step.match(/aws|azure|gcp/i)?.[0] },
      { pattern: /restful api|graphql|microservices/, name: step.match(/restful api|graphql|microservices/i)?.[0] },
      { pattern: /ci\/cd|devops/, name: step.match(/ci\/cd|devops/i)?.[0] },
    ];

    keywords.forEach(({ pattern, name }) => {
      if (name && pattern.test(stepLower) && !foundSkills.includes(name)) {
        const existingSkill = skillNames.find(s => s.original.toLowerCase() === name.toLowerCase());
        if (existingSkill) {
          foundSkills.push(existingSkill.original);
        } else {
          foundSkills.push(name);
        }
      }
    });

    skillMap[index] = foundSkills;
  });

  return skillMap;
};

// Assign difficulty based on step position and skill requirements
const detectDifficulty = (stepIndex, totalSteps) => {
  const progressRatio = stepIndex / totalSteps;
  
  if (progressRatio < 0.33) return 'beginner';
  if (progressRatio < 0.66) return 'intermediate';
  return 'advanced';
};

const categorizeRoadmap = (steps) => {
  const categories = {
    beginner: [],
    intermediate: [],
    advanced: []
  };

  steps.forEach((step, index) => {
    const level = detectDifficulty(index, steps.length);
    categories[level].push({ step, index, level });
  });

  return categories;
};

const parseStepTitle = (text) => {
  const match = text.match(/^([^:]+):\s*(.*)/);
  if (match) {
    return {
      title: match[1].trim(),
      description: match[2].trim()
    };
  }
  return {
    title: text.substring(0, 40) + '...',
    description: text
  };
};

function LearningRoadmap() {
  const location = useLocation();
  const roadmapData = location.state?.roadmapData || {
    coreSkills: [
      { skill: 'JavaScript', value: 75 },
      { skill: 'React', value: 60 },
      { skill: 'CSS', value: 85 }
    ],
    technicalSkills: [
      { skill: 'Problem Solving', score: 72 },
      { skill: 'Debugging', score: 68 },
      { skill: 'System Design', score: 55 }
    ],
    roadmap: [
      'Master ES6+: Learn modern JavaScript syntax and features',
      'React Fundamentals: Understand components, hooks, and state management',
      'Advanced State Management: Master Redux and Context API patterns',
      'Component Design: Create reusable, testable React components',
      'Performance Optimization: Learn code splitting and lazy loading',
      'Next.js Mastery: Build full-stack applications with Next.js',
      'Testing Strategies: Unit, integration, and E2E testing',
      'Deployment & DevOps: CI/CD pipelines and cloud deployment',
      'Advanced Patterns: Design patterns in React applications',
      'System Architecture: Scalable application design'
    ]
  };

  const resumeData = location.state?.resumeData || {};

  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showBadges, setShowBadges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // timeline or skills
  const [stepSkillMap, setStepSkillMap] = useState({});

  // Build dynamic skill-to-step map based on roadmap content
  useEffect(() => {
    const dynamicMap = buildDynamicStepSkillMap(
      roadmapData.roadmap,
      roadmapData.technicalSkills || []
    );
    setStepSkillMap(dynamicMap);
  }, [roadmapData]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('learningProgress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedSteps(progress.completed || []);
      setCurrentStep(progress.current || 0);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify({
      completed: completedSteps,
      current: currentStep
    }));
  }, [completedSteps, currentStep]);

  const handleStepComplete = (index) => {
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index]);
      if (index === currentStep) {
        setCurrentStep(index + 1);
      }
      if ((completedSteps.length + 1) % 3 === 0) {
        setShowBadges(true);
        setTimeout(() => setShowBadges(false), 3000);
      }
    }
  };

  const handleContinue = () => {
    if (currentStep < roadmapData.roadmap.length) {
      const nextIndex = roadmapData.roadmap.findIndex((_, i) => i >= currentStep && !completedSteps.includes(i));
      if (nextIndex !== -1) {
        window.scrollTo({ top: document.getElementById(`step-${nextIndex}`)?.offsetTop - 100, behavior: 'smooth' });
      }
    }
  };

  // Analyze skill comparison
  const getSkillComparison = () => {
    const resumeSkills = resumeData.skills || [];
    const requiredSkills = resumeData.requiredSkills || {};
    
    // Normalize skill names for comparison (lowercase)
    const resumeSkillLower = resumeSkills.map(s => typeof s === 'string' ? s.toLowerCase() : s?.skill?.toLowerCase());
    
    const matchedSkills = [];
    const missingSkills = [];

    Object.entries(requiredSkills).forEach(([key, value]) => {
      if (key !== 'job_role') {
        const skillLower = key.toLowerCase();
        const isMatched = resumeSkillLower.some(rs => rs.includes(skillLower) || skillLower.includes(rs));
        
        if (isMatched) {
          matchedSkills.push({ skill: key, level: value });
        } else {
          missingSkills.push({ skill: key, level: value });
        }
      }
    });

    return { matchedSkills, missingSkills };
  };

  const { matchedSkills, missingSkills } = getSkillComparison();
  const progressPercentage = (completedSteps.length / roadmapData.roadmap.length) * 100;
  const categorized = categorizeRoadmap(roadmapData.roadmap);

  // Transform data for charts
  const coreSkillsData = roadmapData.coreSkills || [];
  const technicalSkillsData = (roadmapData.technicalSkills || []).map(skill => ({
    ...skill,
    value: skill.score
  }));

  const getBadgeMessage = () => {
    const count = completedSteps.length;
    if (count === 3) return '🎉 3-Step Warrior!';
    if (count === 6) return '⭐ Halfway Champion!';
    if (count === 9) return '🚀 Almost There!';
    if (count === roadmapData.roadmap.length) return '👑 Master Achieved!';
    return '';
  };

  return (
    <div className="lr-container">
      {/* Navigation Header */}
      <motion.div
        className="lr-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lr-header-content">
          <div>
            <h1 className="lr-main-title">Learning Roadmap</h1>
            <p className="lr-subtitle">Your personalized learning journey</p>
          </div>
          <div className="lr-stats">
            <div className="stat-item">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{completedSteps.length}/{roadmapData.roadmap.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Progress</span>
              <span className="stat-value">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills Comparison Section */}
      <motion.div
        className="lr-skills-comparison"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="skills-comparison-header">
          <h2 className="skills-comparison-title">Your Skills Profile</h2>
          {resumeData.requiredSkills?.job_role && (
            <p className="job-role-badge">Target Role: <strong>{resumeData.requiredSkills.job_role}</strong></p>
          )}
        </div>

        <div className="skills-comparison-grid">
          {/* Matched Skills */}
          <motion.div
            className="skill-category matched-skills"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="category-header matched">
              <span className="category-icon">✓</span>
              <h3>Skills You Have</h3>
              <span className="category-count">{matchedSkills.length}</span>
            </div>
            <div className="skills-list">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, idx) => (
                  <div key={idx} className="skill-item matched">
                    <span className="skill-name">{skill.skill}</span>
                    <span className="skill-level">Level {skill.level}</span>
                  </div>
                ))
              ) : (
                <p className="no-skills">No matching skills yet</p>
              )}
            </div>
          </motion.div>

          {/* Missing Skills */}
          <motion.div
            className="skill-category missing-skills"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="category-header missing">
              <span className="category-icon">→</span>
              <h3>Skills to Develop</h3>
              <span className="category-count">{missingSkills.length}</span>
            </div>
            <div className="skills-list">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, idx) => (
                  <div key={idx} className="skill-item missing">
                    <span className="skill-name">{skill.skill}</span>
                    <span className="skill-level">Level {skill.level}</span>
                  </div>
                ))
              ) : (
                <p className="no-skills">You have all required skills!</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Skill Gap Analysis */}
        {matchedSkills.length > 0 && missingSkills.length > 0 && (
          <motion.div
            className="skill-gap-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="gap-info">
              <span className="gap-label">Readiness</span>
              <div className="gap-meter">
                <div 
                  className="gap-fill" 
                  style={{ width: `${(matchedSkills.length / (matchedSkills.length + missingSkills.length)) * 100}%` }}
                />
              </div>
              <span className="gap-percentage">
                {Math.round((matchedSkills.length / (matchedSkills.length + missingSkills.length)) * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Progress Bar */}
      <ProgressBar
        completed={completedSteps.length}
        total={roadmapData.roadmap.length}
        percentage={progressPercentage}
      />

      {/* View Mode Selector */}
      <motion.div
        className="lr-view-selector"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
          onClick={() => setViewMode('timeline')}
        >
          <span className="icon">📚</span> Learning Path
        </button>
        <button
          className={`view-btn ${viewMode === 'skills' ? 'active' : ''}`}
          onClick={() => setViewMode('skills')}
        >
          <span className="icon">📊</span> Skills Analysis
        </button>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Badge Notification */}
            <AnimatePresence>
              {showBadges && (
                <motion.div
                  className="lr-badge-notification"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="badge-emoji">🏆</span>
                  <span className="badge-text">{getBadgeMessage()}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeline Sections */}
            {Object.entries(categorized).map(([level, steps]) => (
              steps.length > 0 && (
                <motion.div
                  key={level}
                  className="lr-level-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: DIFFICULTY_LEVELS[level] * 0.2 }}
                >
                  <div className={`lr-level-header ${level}`}>
                    <span className="level-icon">
                      {level === 'beginner' && '🌱'}
                      {level === 'intermediate' && '🔥'}
                      {level === 'advanced' && '⚡'}
                    </span>
                    <span className="level-title">
                      {level.charAt(0).toUpperCase() + level.slice(1)} Level
                    </span>
                    <span className="level-count">({steps.length} steps)</span>
                  </div>

                  <div className="lr-timeline">
                    {steps.map((item, idx) => (
                      <TimelineItem
                        key={item.index}
                        stepNumber={item.index + 1}
                        totalSteps={roadmapData.roadmap.length}
                        isCompleted={completedSteps.includes(item.index)}
                        isCurrent={currentStep === item.index}
                        isLocked={item.index > currentStep && completedSteps.length < item.index}
                        {...parseStepTitle(item.step)}
                        skillsToDevelop={stepSkillMap[item.index] || []}
                        onComplete={() => handleStepComplete(item.index)}
                        delay={idx * 0.1}
                        id={`step-${item.index}`}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            ))}

            {/* Call to Action */}
            {completedSteps.length < roadmapData.roadmap.length && (
              <motion.div
                className="lr-cta-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button className="lr-continue-btn" onClick={handleContinue}>
                  <span className="btn-icon">▶</span>
                  Continue Learning
                </button>
              </motion.div>
            )}

            {/* Completion Message */}
            {completedSteps.length === roadmapData.roadmap.length && (
              <motion.div
                className="lr-completion-message"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <span className="completion-emoji">🎓</span>
                <h2>Journey Complete!</h2>
                <p>You've mastered all steps. Keep practicing and growing!</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="lr-skills-view"
          >
            <div className="lr-skills-container">
              <SkillChart
                title="Core Skills"
                data={coreSkillsData}
                type="bar"
                colors={['#9D4EDD', '#3A86FF', '#8338EC']}
              />
              <SkillChart
                title="Technical Skills"
                data={technicalSkillsData}
                type="radar"
                colors={['#FF006E']}
              />
            </div>

            {/* Skills Development Guide */}
            <motion.div
              className="lr-skills-guide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="skills-guide-title">📚 Skill Development Pathway</h3>
              <div className="skills-guide-grid">
                {technicalSkillsData.map((skill, index) => {
                  // Find steps that develop this skill
                  const stepsForSkill = [];
                  Object.entries(stepSkillMap).forEach(([stepIdx, skills]) => {
                    if (skills.some(s => s.toLowerCase() === skill.skill.toLowerCase())) {
                      stepsForSkill.push(parseInt(stepIdx) + 1);
                    }
                  });

                  return (
                    <motion.div
                      key={index}
                      className="skill-guide-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="skill-guide-header">
                        <h4 className="skill-name">{skill.skill}</h4>
                        <span className="skill-current-score">Score: {skill.value}/5</span>
                      </div>
                      <div className="skill-mastery-bar">
                        <div 
                          className="skill-mastery-fill" 
                          style={{ width: `${(skill.value / 5) * 100}%` }}
                        />
                      </div>
                      {stepsForSkill.length > 0 && (
                        <div className="skill-steps-info">
                          <span className="steps-label">Develop in steps:</span>
                          <span className="steps-numbers">
                            {stepsForSkill.join(', ')}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Task Suggestion */}
      {currentStep < roadmapData.roadmap.length && viewMode === 'timeline' && (
        <motion.div
          className="lr-daily-task"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="task-content">
            <span className="task-icon">💡</span>
            <div className="task-text">
              <h3>Today's Focus</h3>
              <p>{parseStepTitle(roadmapData.roadmap[currentStep]).title}</p>
            </div>
          </div>
          <button className="task-btn">Start Now</button>
        </motion.div>
      )}
    </div>
  );
}

export default LearningRoadmap;
