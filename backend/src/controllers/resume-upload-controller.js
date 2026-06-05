
const { extractText } = require('../services/parser_service');
const { cleanText, extractSkills, requiredSkills } = require('../services/skillsExtractor');
const resumeUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const text = await extractText(req.file.buffer, { mime: req.file.mimetype, filename: req.file.originalname });
        const jobDescription = req.body.jobDescription || '';

        const cleanedText = cleanText(text);
        const skills = await extractSkills(cleanedText);
        const requiredSkillsList = await requiredSkills(jobDescription);

        res.status(200).json({ skills, requiredSkills: requiredSkillsList });
    } catch (err) {
        console.error('Error processing file:', err);
        res.status(500).json({ error: 'Failed to process the uploaded file' });
    }
};

module.exports = { resumeUpload };