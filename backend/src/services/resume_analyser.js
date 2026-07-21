require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // from console.groq.com
});
function buildRoadmapPrompt(candidateProfile, roleCompetencyMap) {
  return `You are a senior learning and development specialist and mentor. Analyze the candidate's skill profile against the role requirements and generate a personalized adaptive learning roadmap.

CANDIDATE PROFILE:
${JSON.stringify(candidateProfile, null, 2)}

ROLE COMPETENCY MAP:
${JSON.stringify(roleCompetencyMap, null, 2)}

STEP 1 — GAP ANALYSIS RULES:
- proficient → candidate meets or exceeds required proficiency → SKIP in roadmap
- partial → candidate is one level below required → fast-track module
- missing → skill absent from candidate profile → full module
- Proficiency order: beginner < intermediate < advanced
- Infer implied skills from project evidence — do not mark missing purely due to keyword mismatch
- readiness_score = round(((proficient_count * 1.0) + (partial_count * 0.5)) / total_required_skills * 100)

STEP 2 — ROADMAP RULES:
- Candidate has 8-10 hours/week available — realistic pacing only
- duration_weeks = ceil(estimated_hours / 9)
- start_week and end_week must be sequential — no gaps, no overlaps
- Order by JD criticality first (core skills before supporting before nice_to_have), then by dependency
- Max 8 modules — combine related gaps into one module if needed
- full-module → missing skills (deeper coverage, more hours)
- fast-track → partial skills (focused only on the gap, fewer hours)
- Each milestone must be ONE specific, verifiable, practical deliverable

STEP 3 — REASON FIELD RULES (CRITICAL):
- Write in second person ("you", "your") — speak directly to the candidate as a mentor
- Structure: WHY (connect to their specific background by name) + WHAT YOU'LL GAIN (concrete capability after completing)
- Example: "You've built REST APIs with Node.js in your Student Management project, so you understand client-server communication. In this module you'll learn GraphQL — giving you the ability to let clients request exactly the data they need, eliminating over-fetching."
- Never use third person ("the candidate", "Mekala has...")
- Never contradict gap_analysis — if marked missing, don't imply they already have it

OUTPUT RULES:
- Return ONLY valid JSON. No markdown, no backticks, no explanation before or after.
- Top-level keys are "gap_analysis" and "roadmap" — no extra wrapper key.

{
  "gap_analysis": {
    "readiness_score": <number 0-100>,
    "proficient": ["skill names"],
    "partial": ["skill names"],
    "missing": ["skill names"]
  },
  "roadmap": [
    {
      "module_number": <number>,
      "topic": "string",
      "type": "full-module|fast-track",
      "start_week": <number>,
      "end_week": <number>,
      "duration_weeks": <number>,
      "reason": "second-person WHY + WHAT YOU'LL GAIN",
      "estimated_hours": <number>,
      "resources": [
        { "title": "string", "url": "string or empty", "type": "video|article|course|documentation|practice|book|workshop" }
      ],
      "milestone": "one specific verifiable practical deliverable"
    }
  ]
}`;
}
async function generateRoadmap(candidateProfile, roleCompetencyMap) {
  let raw;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: buildRoadmapPrompt(candidateProfile, roleCompetencyMap),
        },
      ],
      temperature: 0.2,
      max_completion_tokens: 8192,
      top_p: 0.8,
      stream: false,
      stop: null,
    });

    const finishReason = completion.choices[0]?.finish_reason;
    if (finishReason === "length") {
      throw new Error("Response truncated — increase max_tokens.");
    }

    raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from GROQ API.");
  } catch (err) {
    throw new Error(`NVIDIA NIM API error: ${err.message}`);
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
module.exports = { generateRoadmap };
