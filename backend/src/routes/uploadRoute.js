const express = require('express');
const router = express.Router();
const { uploadMemory } = require('../middlewares/upload-middleware');
const { resumeUpload } = require('../controllers/resume-upload-controller');
const { resumeAnalyserController } = require('../controllers/resume-analyser-controller');
// POST /upload - handle file upload and text extraction

router.post('/upload', uploadMemory.single('file'), resumeUpload);
router.post('/analyze', resumeAnalyserController);
module.exports = router;