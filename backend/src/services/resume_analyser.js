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
- If candidate proficiency is ONE level BELOW required → mark as "partial" → include as a fast-track module
- If skill is completely MISSING from candidate profile → mark as "missing" → include as a full module
- Proficiency order: beginner < intermediate < advanced

ROADMAP RULES (IMPORTANT — REALISTIC PACING):
- The candidate is a working professional going through onboarding. Assume they have 8-10 hours per week available for learning, NOT full-time.
- Each roadmap item represents ONE topic, but its duration must be expressed in WEEKS based on estimated_hours, not assumed to be 1 week.
- duration_weeks = ceil(estimated_hours / 9). For example, 20 hours → duration_weeks: 3, 8 hours → duration_weeks: 1.
- Number topics sequentially using "module_number" (1, 2, 3...) — do NOT use "week" as the field name, since modules can span multiple weeks.
- Include a "start_week" and "end_week" for each module, calculated sequentially based on previous modules' duration_weeks (module 1 starts at week 1).
- "missing" skills get a full module (more hours, more resources, deeper coverage)
- "partial" skills get a fast-track module (fewer hours, focused only on the specific gap, not the whole topic from scratch)
- "proficient" skills are completely skipped — do not create modules for them
- Order topics by dependency (prerequisites before advanced topics)
- Each module must have ONE practical, verifiable milestone — not just theory
- Tailor the "reason" field to the candidate's actual background — reference their specific projects, tools, or experience by name where relevant. Be specific, not generic.
- Limit the roadmap to a MAXIMUM of 8 modules. If there are more gaps than that, prioritize the most critical/foundational ones and combine related smaller gaps into a single module.

OUTPUT RULES:
- Return ONLY valid JSON. No markdown, no code fences, no explanation text before or after.
- Do NOT wrap the output in an extra "roadmap" key. Return "gap_analysis" and "roadmap" as top-level keys directly.

Return exactly this structure:
{
  "gap_analysis": {
    "readiness_score": <0-100, percentage of required skills the candidate already meets at the required level>,
    "proficient": ["skill names the candidate already meets or exceeds"],
    "partial": ["skills candidate has but below required proficiency"],
    "missing": ["skills completely absent from candidate profile"]
  },
  "roadmap": [
    {
      "module_number": <number>,
      "topic": "skill or topic name",
      "type": "full-module | fast-track",
      "start_week": <number>,
      "end_week": <number>,
      "duration_weeks": <number>,
      "reason": "personalised explanation referencing the candidate's actual background, projects, or tools by name",
      "estimated_hours": <number>,
      "resources": ["resource 1", "resource 2", "resource 3"],
      "milestone": "one specific, verifiable practical task to validate this skill"
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
module.exports = { generateRoadmap };