const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function buildResumeAnalysisPrompt(resumeText) {
    return `
You are an expert technical recruiter and skills analyst. Your job is to deeply analyse a resume and extract a structured skill profile of the candidate.
 
Analyse the resume below carefully. Look at:
- The explicit Skills section (if present)
- Every project description — infer the technologies and concepts used
- Job/internship responsibilities — infer skills from what they built or did
- Education and certifications
- Any tools, frameworks, platforms, or methodologies mentioned anywhere
 
For each skill you find, assign a proficiency level based on evidence in the resume:
- "beginner"      → mentioned once, no context, or described as "familiar with / exposure to"
- "intermediate"  → used in projects or internships with some described outcomes
- "advanced"      → led projects using it, multiple years, or described as expert/proficient
 
Group the skills into categories. Use these standard categories:
- programming_languages
- frameworks_and_libraries
- databases
- cloud_and_devops
- tools_and_platforms
- concepts_and_methodologies
- soft_skills
 
IMPORTANT RULES:
1. Only extract skills that have actual evidence in the resume. Do not hallucinate.
2. Infer implicit skills from project descriptions (e.g. "Built REST API" → infer REST, HTTP, API design)
3. Normalise skill names (e.g. "ReactJS" → "React", "Postgres" → "PostgreSQL")
4. Return ONLY a valid JSON object. No explanation, no markdown, no backticks.
 
Resume:
---
${resumeText}
---
 
Return this exact JSON structure:
{
  "candidate_name": "string or null",
  "total_experience_years": number or null,
  "skills": {
    "programming_languages": [
      { "name": "string", "proficiency": "beginner|intermediate|advanced", "evidence": "brief reason" }
    ],
    "frameworks_and_libraries": [...],
    "databases": [...],
    "cloud_and_devops": [...],
    "tools_and_platforms": [...],
    "concepts_and_methodologies": [...],
    "soft_skills": [...]
  },
  "top_skills": ["list of 5 strongest skills based on evidence"],
  "experience_summary": "2-3 sentence summary of the candidate's background"
}
`;
}


function analyseJobDescription(input) {
    const isFullJD = input.length > 150; // rough check

    if (isFullJD) {
        return `
You are a technical hiring expert. Extract a structured competency map from the job description below.

Extract:
- Required skills (must-have) with minimum proficiency level
- Nice-to-have skills
- Seniority level (junior / mid / senior)
- Role category (frontend / backend / fullstack / data / devops etc.)

Job Description:
---
${input}
---

Return ONLY valid JSON:
{
  "role_title": "string",
  "seniority_level": "junior|mid|senior",
  "role_category": "string",
  "required_skills": [
    { "name": "string", "min_proficiency": "beginner|intermediate|advanced", "weight": "core|supporting|nice_to_have" }
  ]
}`;
    } else {
        return `
You are a technical hiring expert. Generate a competency map for the role: "${input}".

List the skills typically required for this role at a mid-level seniority.

Return ONLY valid JSON:
{
  "role_title": "string",
  "seniority_level": "mid",
  "role_category": "string",
  "required_skills": [
    { "name": "string", "min_proficiency": "beginner|intermediate|advanced", "weight": "core|supporting|nice_to_have" }
  ]
}`;
    }
}



async function analyseResume(resumeText) {
    if (!resumeText || resumeText.trim().length < 50) {
        throw new Error("Resume text is too short or empty to analyse.");
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0.1,       // Low temperature = consistent, factual output
            topP: 0.8,
            maxOutputTokens: 8192,
        },
    });

    const prompt = buildResumeAnalysisPrompt(resumeText);

    let raw;
    try {
        const result = await model.generateContent(prompt);
        raw = result.response.text();
    } catch (err) {
        throw new Error(`Gemini API error during resume analysis: ${err.message}`);
    }

    // ── Strip markdown fences if Gemini wraps output despite instructions ──
    const cleaned = raw
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    } catch {
        throw new Error(
            "Failed to parse structured output from AI. Raw response: " +
            cleaned.slice(0, 300)
        );
    }

    return parsed;
}
async function analyseJD(jobDescription) {
    if (!jobDescription) {
        throw new Error("Provide the Job Description");
    }
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0.1,       // Low temperature = consistent, factual output
            topP: 0.8,
            maxOutputTokens: 4096,
        },
    });
    const prompt = analyseJobDescription(jobDescription);
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

    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    } catch {
        throw new Error(
            "Failed to parse structured output from AI. Raw response: " +
            cleaned.slice(0, 300)
        );
    }

    return parsed;


}


module.exports = { analyseResume, analyseJD };
