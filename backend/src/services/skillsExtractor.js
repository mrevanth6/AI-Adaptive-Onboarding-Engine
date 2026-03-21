const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);


function cleanText(text) {
    if (typeof text !== 'string') return '';
    return text
        .replace(/\s+/g, ' ')
        .replace(/[\r\n]+/g, '\n')
        .trim();
}

const extractSkills = async (text) => {
    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"

        });
        const prompt = `Extract the all the skills from the text below
        Rules:
        1. Extract only the skills, do not include any other information.
        2. Return the skills as a comma-separated list.
        3. Do not include any explanations or additional text, only the skills.
        4.Skills should be extracted only from the skills section of the resume.
        Text: ${text}`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response;
        const skills = responseText.text();

        return JSON.parse(JSON.stringify(skills.split(',').map(skill => skill.trim())));
    } catch (error) {
        console.error('Error extracting skills:', error);
        return [];
    }

};
const requiredSkills = async (jobDescription) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });
        const prompt = `You are an AI that extracts technical skills from job descriptions.

Return ONLY a valid JSON object.

Rules:
- Extract ONLY technical skills
- Assign a scale from 1 to 5
- Output must be STRICT JSON (no text, no explanation, no markdown)
-Assign a job role to the job description based on provide job description.

Example:
{"JavaScript": 4, "Python": 5}

Job Description:
${jobDescription}
`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response;
        const skillsText = responseText.text();
        skills = skillsText
            .replace(/```json|```/g, '')  // remove code blocks
            .replace(/\n/g, '')           // remove new lines
            .trim();

        return JSON.parse(skills);
    } catch (error) {
        console.error('Error extracting required skills:', error);
        return [];
    }
};

module.exports = { cleanText, extractSkills, requiredSkills };
