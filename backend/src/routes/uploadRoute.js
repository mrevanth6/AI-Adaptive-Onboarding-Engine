const express = require("express");
const router = express.Router();
const { uploadMemory } = require("../middlewares/upload-middleware");
const {
  resumeUpload,
  getSavedRoadmaps,
} = require("../controllers/resumeControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

// POST /upload - handle file upload and text extraction

router.post(
  "/upload",
  authMiddleware,
  uploadMemory.single("file"),
  resumeUpload,
);
router.get("/saved-roadmaps", authMiddleware, getSavedRoadmaps);

module.exports = router;
