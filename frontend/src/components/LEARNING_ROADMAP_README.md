# 🎓 Learning Roadmap UI Component Suite

A modern, production-ready React component library for displaying personalized learning journeys with animations, skill visualization, and gamification.

## 📦 Components Overview

### Core Components
1. **LearningRoadmap.jsx** - Main container component
2. **TimelineItem.jsx** - Individual learning step card
3. **ProgressBar.jsx** - Progress visualization
4. **SkillChart.jsx** - Skill analytics with charts

## ✨ Features

### 🎨 UI/UX
- **Dark theme** with purple/blue gradient backgrounds
- **Smooth animations** with Framer Motion
- **Responsive design** from mobile to desktop
- **Card-based layout** with modern glassmorphism effects
- **Interactive elements** with hover effects and transitions

### 📊 Functionality
- **Vertical timeline** for learning steps
- **Progress tracking** with localStorage persistence
- **Difficulty categorization** (Beginner/Intermediate/Advanced)
- **Skill visualization** with bar and radar charts
- **Status management** (Locked/In Progress/Completed)
- **Badge notifications** for achievement milestones
- **Daily task suggestions** based on current step
- **Completion celebration** when all steps are done

### 🎮 Gamification
- 🏆 Achievement badges at 3, 6, 9, and 10 steps
- 📈 Visual progress indicators and milestone markers
- ⭐ Color-coded status badges
- 🎓 Celebration message on completion
- 💾 Persistent progress tracking

## 🚀 Quick Start

### Installation

1. **Install dependencies:**
```bash
npm install framer-motion recharts react-router-dom axios
```

2. **Import the component:**
```jsx
import LearningRoadmap from './components/LearningRoadmap';
```

3. **Pass data via React Router:**
```jsx
const navigate = useNavigate();

// After receiving roadmapData from API
navigate("/roadmap", { 
  state: { 
    roadmapData: {
      coreSkills: [...],
      technicalSkills: [...],
      roadmap: [...]
    }
  } 
});
```

## 📋 Data Format

### Expected API Response Structure

```javascript
{
  // Core technical skills with percentage values (0-100)
  coreSkills: [
    { skill: 'JavaScript', value: 75 },
    { skill: 'React', value: 60 },
    { skill: 'CSS', value: 85 }
  ],

  // Additional technical competencies with scores
  technicalSkills: [
    { skill: 'Problem Solving', score: 72 },
    { skill: 'Debugging', score: 68 },
    { skill: 'System Design', score: 55 }
  ],

  // Learning steps with title and description
  // Format: "Title: Description"
  roadmap: [
    'Master ES6+: Learn modern JavaScript syntax and features',
    'React Fundamentals: Understand components, hooks, and state management',
    'Advanced State Management: Master Redux and Context API patterns',
    // ... more steps
  ]
}
```

## 🎯 Component Details

### LearningRoadmap (Main Component)

**Props:** None (uses React Router state)

**Features:**
- Auto-categorizes roadmap into difficulty levels
- Manages progress state with localStorage
- Provides two view modes: Timeline and Skills
- Handles step completion logic
- Shows achievement badges

**State:**
```javascript
const [completedSteps, setCompletedSteps] = useState([]);
const [currentStep, setCurrentStep] = useState(0);
const [showBadges, setShowBadges] = useState(false);
const [viewMode, setViewMode] = useState('timeline');
```

---

### TimelineItem (Child Component)

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `stepNumber` | number | Current step number (1-indexed) |
| `totalSteps` | number | Total number of steps |
| `title` | string | Step title |
| `description` | string | Step description |
| `isCompleted` | boolean | Whether step is completed |
| `isCurrent` | boolean | Whether this is current step |
| `isLocked` | boolean | Whether step is locked |
| `onComplete` | function | Callback when marked complete |
| `delay` | number | Stagger animation delay |
| `id` | string | HTML id for scroll-to functionality |

**Status Indicators:**
- 🔒 Locked - Cannot be started yet
- ▶️ In Progress - Current step
- ✅ Completed - Already finished
- Number - Not started yet

---

### ProgressBar (Child Component)

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `completed` | number | Number of completed steps |
| `total` | number | Total number of steps |
| `percentage` | number | Progress percentage (0-100) |

**Features:**
- Animated gradient progress bar
- Milestone markers at 0%, 25%, 50%, 75%, 100%
- Real-time percentage display
- Completion statistics

---

### SkillChart (Child Component)

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Chart title |
| `data` | array | Chart data points |
| `type` | string | 'bar' or 'radar' |
| `colors` | array | Color hex values for bars |

**Data Format:**
```javascript
// For chart data
[
  { skill: 'JavaScript', value: 75 },
  { skill: 'React', value: 60 }
]
```

---

## 🎨 Styling

### CSS Classes
All components use prefixed classes for scoping:
- `.lr-*` - Learning Roadmap main component
- `.ti-*` - Timeline item component
- `.pb-*` - Progress bar component
- `.sc-*` - Skill chart component

### Color Scheme
```css
Primary Purple:  #9D4EDD
Primary Blue:    #3A86FF
Secondary Pink:  #FF006E
Secondary Orange: #FB5607
Dark Background: #0f0c29 to #302b63
```

### Responsive Breakpoints
- **Desktop:** Full featured layout
- **Tablet (1024px):** Single column, adjusted spacing
- **Mobile (768px):** Simplified layout, larger touch targets
- **Small Mobile (480px):** Minimal padding, stacked elements

---

## 📱 Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE 11: Not supported (uses modern CSS features)

---

## 💾 Local Storage

Progress is automatically saved and restored:

**Storage Key:** `learningProgress`

**Data Structure:**
```javascript
{
  completed: [0, 2, 5, 7],    // Array of completed step indices
  current: 8                   // Current active step index
}
```

To clear progress:
```javascript
localStorage.removeItem('learningProgress');
```

---

## 🎬 Animations

### Framer Motion Effects
- **Fade-in:** Timeline items fade in on scroll
- **Stagger:** Items entrance with delay
- **Hover:** Cards lift with shadow on hover
- **Scale:** Buttons scale on click
- **Spring:** Badges use spring physics

### Animation Customization
Modify delays in components:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay, duration: 0.5 }}
/>
```

---

## 🔧 Customization

### Changing Colors
Edit `learning-roadmap.css`:
```css
--primary-purple: #9D4EDD;
--primary-blue: #3A86FF;
```

### Adjusting Difficulty Levels
In `LearningRoadmap.jsx`, modify the categorization logic:
```javascript
const categorizeRoadmap = (steps) => {
  // Customize threshold calculations
  if (stepNum > steps.length * 0.66) {
    level = 'advanced';
  }
  // ... etc
};
```

### Adding New Badge Types
In `createBadgeMessage()`:
```javascript
const getBadgeMessage = () => {
  if (count === 5) return '🌟 Halfway Legend!';
  // ... more badges
};
```

---

## 🐛 Debugging

### Enable Console Logging
Add to LearningRoadmap.jsx:
```javascript
useEffect(() => {
  console.log('Roadmap data:', roadmapData);
  console.log('Completed steps:', completedSteps);
  console.log('Current step:', currentStep);
}, [completedSteps, currentStep]);
```

### Check LocalStorage
```javascript
console.log(JSON.parse(localStorage.getItem('learningProgress')));
```

### Verify Chart Data
```javascript
console.log('Core Skills:', coreSkillsData);
console.log('Technical Skills:', technicalSkillsData);
```

---

## 📚 Advanced Usage

### Custom Step Parsing
Modify `parseStepTitle()` to handle different formats:
```javascript
const parseStepTitle = (text) => {
  // Custom parsing logic
  const parts = text.split('|');
  return {
    title: parts[0].trim(),
    description: parts[1].trim()
  };
};
```

### Dynamic Progress Updates
```javascript
// Update progress from external source
const handleExternalUpdate = (completedIndices) => {
  setCompletedSteps(completedIndices);
};
```

### Export Progress Data
```javascript
const exportProgress = () => {
  const progress = localStorage.getItem('learningProgress');
  const dataStr = JSON.stringify(progress, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  // ... download logic
};
```

---

## 📄 License

Production-grade component suite. Modify and distribute freely.

---

## 📞 Support

For issues or enhancements, refer to the inline code comments in each component.

---

**Last Updated:** March 2026
**Version:** 1.0.0
