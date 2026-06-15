const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function buildRoadmapPrompt(candidateProfile, roleCompetencyMap, roleTitle) {
    return `
You are an expert learning and development specialist. You will be given a candidate's skill profile and a job role's competency requirements.

TARGET ROLE: ${roleTitle}

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
- INFER implied skills from project/experience evidence, regardless of domain. Examples: if the candidate built and shipped projects using a framework (e.g., React), they have at least intermediate proficiency in its underlying fundamentals (HTML5/CSS3/JS). If a candidate performed exploratory data analysis with Pandas, they have at least intermediate proficiency in data cleaning and statistics basics. If a candidate ran agile-style hackathon projects, they have basic exposure to agile workflows. Do not mark a skill "missing" purely because it isn't an exact keyword match — infer from demonstrated work across ANY domain (engineering, data, design, product, operations, etc.).
- Skills, tools, and competencies in the role competency map may belong to ANY professional domain — technical (e.g., programming languages, cloud platforms, ML frameworks), design (e.g., Figma, user research, prototyping), product (e.g., roadmapping, stakeholder management, A/B testing), data (e.g., SQL, statistics, visualization tools), or soft skills (e.g., communication, leadership, negotiation). Apply the same gap-analysis logic uniformly regardless of skill type.

READINESS SCORE CALCULATION:
- readiness_score = round(((proficient_count * 1.0) + (partial_count * 0.5)) / total_required_skills * 100)
- This must be mathematically consistent with the proficient/partial/missing lists — recompute it after finalizing those lists, don't estimate it separately.

ROADMAP RULES (IMPORTANT — REALISTIC PACING):
- The candidate is a working professional going through onboarding. Assume they have 8-10 hours per week available for learning, NOT full-time.
- Each roadmap item represents ONE topic, but its duration must be expressed in WEEKS based on estimated_hours, not assumed to be 1 week.
- duration_weeks = ceil(estimated_hours / 9). For example, 20 hours → duration_weeks: 3, 8 hours → duration_weeks: 1.
- Keep estimated_hours-per-week roughly consistent across modules of the same type (full-module ≈ 9hrs/week, fast-track ≈ 9hrs/week for its shorter duration) — do not arbitrarily reduce hours for a module without adjusting duration_weeks to match.
- Number topics sequentially using "module_number" (1, 2, 3...) — do NOT use "week" as the field name, since modules can span multiple weeks.
- Include a "start_week" and "end_week" for each module, calculated sequentially based on previous modules' duration_weeks (module 1 starts at week 1).
- "missing" skills get a full module (more hours, more resources, deeper coverage)
- "partial" skills get a fast-track module (fewer hours, focused only on the specific gap, not the whole topic from scratch)
- "proficient" skills are completely skipped — do not create modules for them

MODULE ORDERING — PRIORITIZE BY JD CRITICALITY:
- Order modules primarily by how critical the skill is to the role's CORE responsibilities (as stated in the role competency map), not purely by "foundational first."
- Within similar criticality, order by dependency (prerequisites before advanced topics) — this applies to non-technical skill sequencing too (e.g., learn user research basics before advanced usability testing; learn SQL fundamentals before data visualization tools).
- A skill explicitly tied to "Core Responsibilities" or day-1 productivity should rank above a peripheral or "nice-to-have" skill, even if the peripheral skill is more foundational in a general sense.

- Each module must have ONE practical, verifiable milestone — not just theory. The milestone should be appropriate to the skill's domain (e.g., a code deliverable for technical skills, a designed artifact/prototype for design skills, a written analysis/document for strategy or communication skills, a presentation or mock session for soft skills).
- Tailor the "reason" field to the candidate's actual background — reference their specific projects, tools, roles, or experience by name where relevant. Be specific, not generic. Do NOT contradict the gap_analysis classification (e.g., do not say a skill is "missing" in gap_analysis but then reference existing experience with that exact skill in the reason as if they already have it — if they have related experience, that should have placed the skill in "partial" or "proficient" instead).
- Limit the roadmap to a MAXIMUM of 8 modules. If there are more gaps than that, prioritize the most critical/foundational ones and combine related smaller gaps into a single module.

OUTPUT RULES:
- Return ONLY valid JSON. No markdown, no code fences, no explanation text before or after.
- Do NOT wrap the output in an extra "roadmap" key. Return "gap_analysis" and "roadmap" as top-level keys directly.
- The "resources" field MUST be an array of 2-3 objects (not plain strings), each with this shape: { "title": "resource name", "url": "direct link if known, otherwise empty string", "type": "video | article | course | documentation | practice | book | workshop" }

Return exactly this structure:
{
  "gap_analysis": {
    "readiness_score": <0-100, computed per the formula above>,
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
      "resources": [
        { "title": "resource name", "url": "", "type": "video | article | course | documentation | practice | book | workshop" }
      ],
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
            thinkingConfig: {
                thinkingBudget: 0,   // disable thinking — all tokens go to output JSON
            },
        },
    });
    const prompt = buildRoadmapPrompt(candidateProfile, roleCompetencyMap);
    let raw;
    try {
        const result = await model.generateContent(prompt);

        const finishReason = result.response.candidates?.[0]?.finishReason;
        if (finishReason === "MAX_TOKENS") {
            throw new Error(
                "Gemini response was truncated (MAX_TOKENS). Increase maxOutputTokens or reduce module count in the prompt."
            );
        }

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