const Groq = require("groq-sdk");
require("dotenv").config();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // from console.groq.com
});
function buildResumeAnalysisPrompt(resumeText) {
  return `You are a technical recruiter and skills analyst. Analyze the resume below and extract a structured skill profile.

EXTRACTION RULES:
- Extract BOTH explicit skills (listed in Skills section) and implicit skills (inferred from projects and responsibilities)
- Infer skills from project descriptions (e.g. "Built REST API" → infer REST, HTTP, API Design)
- Assign proficiency based on evidence:
  - "beginner" → mentioned once, no context, or "familiar with / exposure to"
  - "intermediate" → used in projects or internships with described outcomes
  - "advanced" → led projects using it, multiple instances, or described as expert
- Normalize skill names (e.g. "ReactJS" → "React", "Postgres" → "PostgreSQL")
- Only extract skills with actual evidence. Do not hallucinate.

SPEED RULES:
- Do not explain your reasoning
- Return ONLY valid JSON, no markdown, no backticks, no preamble

RESUME:
---
${resumeText}
---

Return exactly this JSON:
{
  "candidate_name": "string or null",
  "total_experience_years": number or null,
  "skills": {
    "programming_languages": [
      { "name": "string", "proficiency": "beginner|intermediate|advanced", "evidence": "one short phrase" }
    ],
    "frameworks_and_libraries": [],
    "databases": [],
    "cloud_and_devops": [],
    "tools_and_platforms": [],
    "concepts_and_methodologies": [],
    "soft_skills": []
  },
  "top_skills": ["5 strongest skills based on evidence"],
  "experience_summary": "2 sentence summary of candidate background"
}`;
}

function analyseJobDescription(input) {
  const isFullJD = input.length > 150; // rough check
  return `You are a technical recruiter.

Analyze the job description and identify:

- Role title
- Seniority (junior, mid, senior)
- Role category
- Required skills
- Minimum proficiency
- Skill importance (core, supporting, nice_to_have)

Return ONLY valid JSON.

Job Description:
${input}

Return:
{
  "role_title": "",
  "seniority_level": "",
  "role_category": "",
  "required_skills": [
    {
      "name": "",
      "min_proficiency": "",
      "weight": ""
    }
  ]
`;
}

async function analyseResume(resumeText) {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Resume text is too short or empty to analyse.");
  }

  let raw;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: buildResumeAnalysisPrompt(resumeText) },
      ],
      temperature: 0.1,
      max_completion_tokens: 4096,
      top_p: 0.8,
      stream: false, // ← must be false for JSON parsing
      stop: null,
    });

    const finishReason = completion.choices[0]?.finish_reason;

    if (finishReason === "length") {
      throw new Error("Response truncated — increase max_tokens.");
    }
    raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from Groq.");
  } catch (err) {
    throw new Error(`GROQ API ERROR: ${err.message}`);
  }

  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response. Raw: " + cleaned.slice(0, 300));
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Failed to parse JSON. Raw: " + cleaned.slice(0, 300));
  }
}
async function analyseJD(jobDescription) {
  if (!jobDescription) {
    throw new Error("Provide the Job Description");
  }
  let raw;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: analyseJobDescription(jobDescription) },
      ],
      temperature: 0.1,
      max_completion_tokens: 2048, // small output, fast response
      top_p: 0.8,
      stream: false,
      stop: null,
    });
    const finishReason = completion.choices[0]?.finish_reason;

    if (finishReason === "length") {
      throw new Error("Response truncated — increase max_tokens.");
    }
    raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from GROQ.");
  } catch (err) {
    throw new Error(`GROQ  API error: ${err.message}`);
  }
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response. Raw: " + cleaned.slice(0, 300));
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Failed to parse JSON. Raw: " + cleaned.slice(0, 300));
  }
}

module.exports = { analyseResume, analyseJD };
