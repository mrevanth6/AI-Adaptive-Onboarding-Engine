const path = require('path');
const multer = require('multer');

// Allowed mime types/extensions
const ALLOWED_MIMES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
];
const ALLOWED_EXT = ['.pdf', '.docx'];

// Memory storage (recommended if you want to pass buffers to parser services)
const memoryStorage = multer.memoryStorage();

// Disk storage example (if you want to save files to disk)
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    }
});

// File filter: check mime and extension
function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIMES.includes(file.mimetype) && ALLOWED_EXT.includes(ext)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF and DOCX are allowed'));
    }
}

// Export two preconfigured middlewares
const uploadMemory = multer({
    storage: memoryStorage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

module.exports = { uploadMemory };