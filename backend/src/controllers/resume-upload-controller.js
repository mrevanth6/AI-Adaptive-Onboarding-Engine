const { extractText, cleanText } = require('../services/parser_service');
const { analyseResume, analyseJD } = require('../services/skillsExtractor');
const resumeUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const text = await extractText(req.file.buffer, { mime: req.file.mimetype, filename: req.file.originalname });
        const jobDescription = req.body.jobDescription || '';
        const cleanedText = cleanText(text);
        const extractedSkills = await analyseResume(cleanedText);
        console.log(JSON.stringify(extractedSkills, null, 2));
        // const JDSkills = await analyseJD(jobDescription);
        // console.log(JSON.stringify(JDSkills, null, 2));
        res.status(200).json({ extractedSkills });
    } catch (err) {
        console.error('Error processing file:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { resumeUpload };