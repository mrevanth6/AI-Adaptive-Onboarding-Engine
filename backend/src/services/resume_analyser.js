const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});
function buildRoadmapPrompt(candidateProfile, roleCompetencyMap, roleTitle) {
  return `

 You are an expert learning mentor.

Compare the candidate profile with the role requirements and generate a personalized learning roadmap.

Candidate:
${JSON.stringify(candidateProfile)}

Role:
${JSON.stringify(roleCompetencyMap)}

Rules:

- Compare required skills against candidate skills.
- Skills meeting or exceeding required proficiency → proficient.
- One level below → partial.
- Missing → missing.
- Infer reasonable skills from project evidence.
- Proficiency order:
  beginner < intermediate < advanced

Compute:

readiness_score =
round(((proficient × 1.0) + (partial × 0.5)) / total_required_skills × 100)

Roadmap:

- Include only partial and missing skills.
- Maximum 8 modules.
- Prioritize core skills first.
- Missing skills → full-module.
- Partial skills → fast-track.
- Each module should include:
  - module_number
  - topic
  - type
  - duration_weeks
  - start_week
  - end_week
  - estimated_hours
  - reason (written directly to the candidate using "you")
  - 2–3 learning resources
  - milestone

Return ONLY valid JSON.

Return:
{
  "gap_analysis": {
    "readiness_score": 0,
    "proficient": [],
    "partial": [],
    "missing": []
  },
  "roadmap": []
}
`;
}
async function generateRoadmap(candidateProfile, roleCompetencyMap) {
  //   const model = genAI.getGenerativeModel({
  //     model: "gemini-2.5-flash",
  //     generationConfig: {
  //       temperature: 0.1, // Low temperature = consistent, factual output
  //       topP: 0.8,
  //       maxOutputTokens: 8192,
  //       thinkingConfig: {
  //         thinkingBudget: 0, // disable thinking — all tokens go to output JSON
  //       },
  //     },
  //   });
  const prompt = buildRoadmapPrompt(
    candidateProfile,
    roleCompetencyMap,
    roleCompetencyMap.role_title,
  );
  let raw;
  try {
    console.time("NVIDIA NIM API call");
    const completion = await client.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct", // or "meta/llama-3.1-70b-instruct"
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      top_p: 0.8,
      max_tokens: 3192,
    });
    // const result = await model.generateContent(prompt);

    // const finishReason = result.response.candidates?.[0]?.finishReason;
    // if (finishReason === "MAX_TOKENS") {
    //   throw new Error(
    //     "Gemini response was truncated (MAX_TOKENS). Increase maxOutputTokens or reduce module count in the prompt.",
    //   );
    // }

    // raw = result.response.text();
    const finishReason = completion.choices[0]?.finish_reason;
    if (finishReason === "length") {
      throw new Error("Response truncated — increase max_tokens.");
    }
    console.timeEnd("NVIDIA NIM API call");
    console.log("Tokens 3:", completion.usage);
    raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from NVIDIA NIM.");
  } catch (err) {
    // throw new Error(`Gemini API error during resume analysis: ${err.message}`);
    throw new Error(`NVIDIA NIM API error: ${err.message}`);
  }
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      "No JSON found in AI response. Raw: " + cleaned.slice(0, 300),
    );
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error(
      "Found JSON block but failed to parse it. Raw: " + cleaned.slice(0, 300),
    );
  }
}
module.exports = { generateRoadmap };
