const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});
function buildResumeAnalysisPrompt(resumeText) {
  return `
You are an expert technical recruiter.

Analyze the resume and return a structured skill profile.

Tasks:
- Extract skills from the Skills section, projects, experience, education, and certifications.
- Infer implicit technical skills from project descriptions (e.g. REST API → REST, HTTP, API Design).
- Normalize skill names (ReactJS → React, Postgres → PostgreSQL).
- Assign proficiency:
  - beginner: mentioned with little evidence
  - intermediate: used in projects/work
  - advanced: extensive or repeated professional use

Group skills into:
- programming_languages
- frameworks_and_libraries
- databases
- cloud_and_devops
- tools_and_platforms
- concepts_and_methodologies
- soft_skills

Rules:
- Only include skills supported by evidence.
- Return ONLY valid JSON.

Resume:
${resumeText}

Return:
{
  "candidate_name": null,
  "total_experience_years": null,
  "skills": {
    "programming_languages": [],
    "frameworks_and_libraries": [],
    "databases": [],
    "cloud_and_devops": [],
    "tools_and_platforms": [],
    "concepts_and_methodologies": [],
    "soft_skills": []
  },
  "top_skills": [],
  "experience_summary": ""
}
`;
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

  const prompt = buildResumeAnalysisPrompt(resumeText);

  let raw;
  try {
    const completion = await client.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct", // or "meta/llama-3.1-70b-instruct"
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      top_p: 0.8,
      max_tokens: 2048,
    });
    const finishReason = completion.choices[0]?.finish_reason;

    if (finishReason === "length") {
      throw new Error("Response truncated — increase max_tokens.");
    }
    raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from NVIDIA NIM.");
  } catch (err) {
    throw new Error(`NVIDIA NIM API error: ${err.message}`);
  }

  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No JSON object found in response.");
  }

  let parsed;

  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Raw Response:", cleaned);
    throw new Error("Invalid JSON returned by the model.");
  }

  return parsed;
}
async function analyseJD(jobDescription) {
  if (!jobDescription) {
    throw new Error("Provide the Job Description");
  }

  const prompt = analyseJobDescription(jobDescription);
  let raw;
  try {
    const completion = await client.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct", // or "meta/llama-3.1-70b-instruct"
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      top_p: 0.8,
      max_tokens: 2048,
    });
    const finishReason = completion.choices[0]?.finish_reason;

    if (finishReason === "length") {
      throw new Error("Response truncated — increase max_tokens.");
    }
    raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from NVIDIA NIM.");
  } catch (err) {
    throw new Error(`NVIDIA NIM API error: ${err.message}`);
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
      "Failed to parse structured output from AI. Raw response: " + cleaned,
    );
  }

  return parsed;
}

module.exports = { analyseResume, analyseJD };
