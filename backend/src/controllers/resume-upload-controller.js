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
        // Find the user by ID from the request (assuming you have user authentication and the user ID is available in req.user)
        const user = await User.findById(req.user.userId);
        // Save the generated roadmap to the user's savedRoadmaps array
        user.savedRoadmaps.push({ role_title: JDSkills.role_title, roadmap });
        await user.save();
        // Send the roadmap and the updated savedRoadmaps back to the frontend
        res.status(200).json({ message: 'Resume processed successfully', roadmap });
    } catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ error: err.message });
    }
};

module.exports = { resumeUpload };