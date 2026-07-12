const express = require("express");
const router = express.Router();
const { uploadMemory } = require("../middlewares/upload-middleware");
const { resumeUpload } = require("../controllers/resume-upload-controller");
const { authMiddleware } = require("../middlewares/authMiddleware");

// POST /upload - handle file upload and text extraction

router.post(
  "/upload",
  authMiddleware,
  uploadMemory.single("file"),
  resumeUpload,
);
module.exports = router;
