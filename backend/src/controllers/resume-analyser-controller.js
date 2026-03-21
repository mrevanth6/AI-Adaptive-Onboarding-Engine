const express = require('express');
const resumeAnalyser = require('../services/resume_analyser');
const resumeAnalyserController = async (req, res) => {
    try {
        const { resumeSkills, jdSkills, inputRole } = req.body;
        const analysisResult = await resumeAnalyser.analyzeResume(resumeSkills, jdSkills, inputRole);
        res.status(200).json(analysisResult);
    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ error: 'Failed to analyze the resume' });

    }
}
module.exports = { resumeAnalyserController };