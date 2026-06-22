const { extractText, cleanText } = require('../services/parser_service');
const { analyseResume, analyseJD } = require('../services/skillsExtractor');
const { generateRoadmap } = require('../services/resume_analyser');
const resumeUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const text = await extractText(req.file.buffer, { mime: req.file.mimetype, filename: req.file.originalname });
        const jobDescription = req.body.jobDescription || '';
        const cleanedText = cleanText(text);
        const extractedSkills = await analyseResume(cleanedText);

        const JDSkills = await analyseJD(jobDescription);


        const roadmap = await generateRoadmap(extractedSkills, JDSkills);

        res.status(200).json(roadmap);
    } catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ error: err.message });
    }
};

module.exports = { resumeUpload };