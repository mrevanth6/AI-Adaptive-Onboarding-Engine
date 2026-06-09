const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
function buildRoadmapPrompt(candidateProfile, roleCompetencyMap) {
    return `
You are an expert learning and development specialist. You will be given a candidate's skill profile and a job role's competency requirements.

Your job is to:
1. Compare the candidate's skills against the role requirements and identify gaps
2. Generate a personalized, adaptive learning roadmap that skips what they already know and focuses only on what they need

CANDIDATE PROFILE:
${JSON.stringify(candidateProfile, null, 2)}

ROLE COMPETENCY MAP:
${JSON.stringify(roleCompetencyMap, null, 2)}

ANALYSIS RULES:
- If candidate proficiency MEETS or EXCEEDS required proficiency → mark as "proficient" → DO NOT include in roadmap
- If candidate proficiency is ONE level BELOW required → mark as "partial" → include as a short fast-track module
- If skill is completely MISSING from candidate profile → mark as "missing" → include as a full module
- Proficiency order: beginner < intermediate < advanced

ROADMAP RULES:
- Order topics by dependency (fundamentals before advanced)
- "missing" skills get a full module (more hours, more resources)
- "partial" skills get a fast-track module (fewer hours, focused on the gap only)
- "proficient" skills are completely skipped
- Each module must have a practical milestone — not just theory
- Tailor the reason to the candidate's existing background. Be specific, not generic.

Return ONLY valid JSON, no explanation, no markdown:
{
  "gap_analysis": {
    "readiness_score": <0-100 based on how many required skills candidate already meets>,
    "proficient": ["skill names the candidate already meets"],
    "partial": ["skills candidate knows but below required level"],
    "missing": ["skills completely absent from candidate profile"]
  },
  "roadmap": [
    {
      "week": <number>,
      "topic": "skill or topic name",
      "type": "full-module | fast-track",
      "reason": "personalised explanation referencing their background",
      "estimated_hours": <number>,
      "resources": ["resource 1", "resource 2"],
      "milestone": "practical task to validate this skill"
    }
  ]
}
`;
}

async function generateRoadmap(candidateProfile, roleCompetencyMap) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0.1,       // Low temperature = consistent, factual output
            topP: 0.8,
            maxOutputTokens: 8192,
        },
    });
    const prompt = buildRoadmapPrompt(candidateProfile, roleCompetencyMap);
    let raw;
    try {
        const result = await model.generateContent(prompt);
        raw = result.response.text();

    } catch (err) {
        throw new Error(`Gemini API error during resume analysis: ${err.message}`);
    }
    const cleaned = raw
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("No JSON found in AI response. Raw: " + cleaned.slice(0, 300));
    }

    try {
        return JSON.parse(jsonMatch[0]);
    } catch {
        throw new Error("Found JSON block but failed to parse it. Raw: " + cleaned.slice(0, 300));
    }
}



// // Normalize skill: lowercase + trim
// function normalizeSkill(skill) {
//     return (typeof skill === 'string' ? skill : '').toLowerCase().trim().replace(/\.js$/g, "")
// }

// // Normalize array of skills
// function normalizeSkills(skills) {
//     return Array.isArray(skills)
//         ? skills.map(normalizeSkill).filter(s => s.length > 0)
//         : [];
// }

// // Remove duplicates from skill array
// function deduplicateSkills(skills) {
//     return [...new Set(skills)];
// }

// // Map inputRole to O*NET role (defaults to "Software Developers")
// function mapRole(inputRole) {
//     return roleMap[inputRole] || 'Software Developers';
// }

// // Fetch core skills from O*NET data
// function getCoreSkills(mappedRole) {
//     const skills = onetData[mappedRole] || [];
//     return skills.map(item => ({
//         skill: normalizeSkill(item.skillName),
//         value: item.dataValue
//     }));
// }

// // Main analyzer function
// async function analyzeResume(resumeSkills, jdSkills, inputRole) {
//     try {
//         // Normalize resume skills
//         const normalizedResume = deduplicateSkills(normalizeSkills(resumeSkills || []));

//         // Normalize technical skills (from JD)
//         let technicalSkills = [];
//         if (Array.isArray(jdSkills)) {
//             technicalSkills = jdSkills
//                 .map(item => ({
//                     skill: normalizeSkill(typeof item === 'string' ? item : item.skill),
//                     score: typeof item.score === 'number' ? item.score : 3
//                 }))
//                 .filter(item => item.skill.length > 0);
//         }

//         // Remove duplicate technical skills (keep highest score)
//         const uniqueTechnical = {};
//         technicalSkills.forEach(item => {
//             if (!uniqueTechnical[item.skill] || item.score > uniqueTechnical[item.skill].score) {
//                 uniqueTechnical[item.skill] = item;
//             }
//         });
//         technicalSkills = Object.values(uniqueTechnical);

//         // Map role and fetch core skills
//         const mappedRole = mapRole(inputRole);
//         let coreSkillsArray = getCoreSkills(mappedRole);

//         // Remove duplicates from core skills (keep highest value)
//         const uniqueCore = {};
//         coreSkillsArray.forEach(item => {
//             if (!uniqueCore[item.skill] || item.value > uniqueCore[item.skill].value) {
//                 uniqueCore[item.skill] = item;
//             }
//         });
//         coreSkillsArray = Object.values(uniqueCore);

//         // Find missing skills
//         const missingTechnical = technicalSkills
//             .filter(t => !normalizedResume.includes(t.skill))
//             .sort((a, b) => b.score - a.score);

//         const missingCore = coreSkillsArray
//             .filter(c => !normalizedResume.includes(c.skill))
//             .sort((a, b) => b.value - a.value);

//         // Generate roadmap using LLM
//         const roadmap = await generateRoadmap(missingTechnical, missingCore, normalizedResume, inputRole);

//         return {
//             role: inputRole,
//             mappedRole,
//             missingSkills: {
//                 technical: missingTechnical,
//                 core: missingCore
//             },
//             roadmap
//         };
//     } catch (error) {
//         console.error('Error analyzing resume:', error);
//         throw error;
//     }
// }

// // Generate learning roadmap using Gemini
// async function generateRoadmap(missingTechnical, missingCore, knownSkills, inputRole) {
//     try {
//         const model = genAI.getGenerativeModel({
//             model: "gemini-3-flash-preview"
//         });

//         // Format skills for prompt
//         const technicalStr = missingTechnical
//             .slice(0, 10) // Top 10 to avoid token overload
//             .map(t => `${t.skill} (score: ${t.score}/5)`)
//             .join(', ');

//         const coreStr = missingCore
//             .slice(0, 10) // Top 10 to avoid token overload
//             .map(c => `${c.skill} (value: ${c.value}/5)`)
//             .join(', ');

//         const knownStr = knownSkills.slice(0, 20).join(', ');

//         const prompt = `You are an expert career mentor designing a personalized, job-ready learning roadmap.

// Context:
// - Target Role: ${inputRole}
// - Known skills: ${knownStr || 'none'}
// - Missing core skills (with importance): ${coreStr || 'none'}
// - Missing technical skills (with scores): ${technicalStr || 'none'}

// Objective:
// Generate a structured learning roadmap tailored specifically to the Target Role.

// Instructions:

// 1. Generate 8-10 steps ONLY.

// 2. Adapt the roadmap structure based on the Target Role:
//    - Identify the natural learning flow for that role
//    - Example:
//      • Frontend → UI → JS → Frameworks → Projects
//      • Backend → APIs → DB → Scaling
//      • Data roles → Python → Analysis → ML → Projects
//      • Full Stack → Backend → DB → Frontend → Integration

// 3. Each step MUST:
//    - Start with a strong action verb (Learn, Build, Implement, Design, Develop, Optimize)
//    - Focus on ONLY ONE main concept
//    - Be practical and job-oriented
//    - Clearly relate to the Target Role

// 4. Strict Rules:
//    - Do NOT include skills already in Known skills
//    - ONLY use skills from Missing core and Missing technical
//    - Do NOT introduce new or unrelated skills
//    - Do NOT include generic soft skills (e.g., communication, reading, listening)
//    - Avoid vague steps like "improve understanding"

// 5. Learning Progression:
//    - Start with core fundamentals (relevant ones only, e.g., programming, problem solving)
//    - Then move to domain-specific technical skills
//    - Then tools/frameworks
//    - Then integration (if applicable)
//    - End with:
//      • One real-world project step
//      • One optimization or advanced improvement step

// 6. Ensure:
//    - Logical beginner → advanced progression
//    - Clean separation of steps
//    - Real-world applicability

// Return ONLY a valid JSON array of strings.
// No explanation. No extra text.

// Example (Frontend Developer):
// [
//   "Learn JavaScript fundamentals and DOM manipulation",
//   "Build responsive UI using modern CSS techniques",
//   "Develop interactive interfaces using React",
//   "Manage state effectively in React applications",
//   "Integrate frontend with backend APIs",
//   "Build a real-world frontend project",
//   "Optimize performance and improve user experience"
// ]`;

//         const result = await model.generateContent(prompt);
//         const responseText = result.response.text();

//         // Extract JSON array from response
//         const jsonMatch = responseText.match(/\[[\s\S]*\]/);
//         if (jsonMatch) {
//             const roadmapArray = JSON.parse(jsonMatch[0]);
//             return Array.isArray(roadmapArray) ? roadmapArray : [];
//         }
//         return [];

//     } catch (error) {
//         console.error('Error generating roadmap:', error);
//         return [];
//     }

// }

// module.exports = { analyzeResume, normalizeSkill, normalizeSkills, mapRole, getCoreSkills };
module.exports = { generateRoadmap };