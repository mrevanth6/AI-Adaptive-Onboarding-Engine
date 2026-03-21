/**
 * LEARNING ROADMAP INTEGRATION GUIDE
 * 
 * This file shows how to integrate with your backend API
 * Expected response format from /api/analyze endpoint
 */

// ============================================
// EXPECTED BACKEND RESPONSE FORMAT
// ============================================

export const expectedBackendResponse = {
  // Array of core skills extracted from resume with proficiency levels (0-100)
  coreSkills: [
    { skill: 'JavaScript', value: 75 },
    { skill: 'React', value: 60 },
    { skill: 'TypeScript', value: 50 },
    { skill: 'CSS/Styling', value: 85 },
  ],
  
  // Array of technical competencies with scores (0-100)
  technicalSkills: [
    { skill: 'Problem Solving', score: 72 },
    { skill: 'System Design', score: 55 },
    { skill: 'Debugging', score: 68 },
    { skill: 'Code Review', score: 70 },
    { skill: 'Testing', score: 45 },
  ],
  
  // Array of learning steps with format: "Title: Description"
  // Component will auto-parse and categorize these
  roadmap: [
    'Master ES6+ Syntax: Learn const/let, arrow functions, destructuring',
    'React Fundamentals: Understand JSX, components, props, and hooks',
    'Component Composition: Build reusable components and patterns',
    // ... more steps
  ]
};


// ============================================
// INTEGRATION IN YOUR RESUME ANALYZER
// ============================================

/**
 * Update your ResumeAnalyzer.jsx like this:
 * 
 * Add import at top:
 * import { useNavigate } from 'react-router-dom';
 * 
 * Inside component:
 * const navigate = useNavigate();
 * 
 * Then uncomment the navigate line above:
 * navigate("/roadmap", { state: { roadmapData: roadMapRes.data } });
 * 
 * The component will receive roadMapRes.data directly from your /api/analyze endpoint
 */

// ============================================
// DATA FORMAT YOUR BACKEND SHOULD RETURN
// ============================================

/**
 * From /api/analyze endpoint, return this format:
 * 
 * {
 *   coreSkills: [
 *     { skill: string, value: number 0-100 },
 *     ...
 *   ],
 *   technicalSkills: [
 *     { skill: string, score: number 0-100 },
 *     ...
 *   ],
 *   roadmap: [
 *     "Step Title: Step Description",
 *     "Another Step: Description here",
 *     ...
 *   ]
 * }
 * 
 * IMPORTANT:
 * - coreSkills uses 'value' field
 * - technicalSkills uses 'score' field
 * - roadmap items should follow "Title: Description" format
 * - All scores should be 0-100
 */


// ============================================
// NO DATA TRANSFORMATION NEEDED
// ============================================

/**
 * Your /api/analyze endpoint returns data in the correct format already.
 * Just pass it directly to LearningRoadmap component via state:
 * 
 * navigate("/roadmap", { state: { roadmapData: roadMapRes.data } });
 * 
 * That's it! No transformation needed.
 */

// ============================================
// IF YOU NEED TO DEBUG DATA FORMAT
// ============================================

export const debugRoadmapData = (data) => {
  console.group('🎓 Roadmap Data Debug');
  console.log('Core Skills:', data.coreSkills);
  console.log('Technical Skills:', data.technicalSkills);
  console.log('Roadmap Steps:', data.roadmap.length);
  console.table(data.coreSkills);
  console.table(data.technicalSkills);
  console.log('Sample Roadmap Items:', data.roadmap.slice(0, 3));
  console.groupEnd();
};

// ============================================
// VERIFY YOUR DATA FORMAT
// ============================================

export const isValidRoadmapData = (data) => {
  const hasValidCoreSkills = Array.isArray(data.coreSkills) &&
    data.coreSkills.every(s => s.skill && typeof s.value === 'number');
  
  const hasValidTechSkills = Array.isArray(data.technicalSkills) &&
    data.technicalSkills.every(s => s.skill && typeof s.score === 'number');
  
  const hasValidRoadmap = Array.isArray(data.roadmap) &&
    data.roadmap.every(step => typeof step === 'string' && step.includes(':'));
  
  return hasValidCoreSkills && hasValidTechSkills && hasValidRoadmap;
};

// Use it:
/*
if (isValidRoadmapData(roadMapRes.data)) {
  navigate("/roadmap", { state: { roadmapData: roadMapRes.data } });
} else {
  console.error('Invalid roadmap data format');
  debugRoadmapData(roadMapRes.data);
}
*/
