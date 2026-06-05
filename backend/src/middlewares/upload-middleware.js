const multer = require('multer');
// Allowed mime types/extensions
const ALLOWED_MIMES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
];
const ALLOWED_EXT = ['.pdf', '.docx'];

// Memory storage to store files in the RAM
const memoryStorage = multer.memoryStorage();
// File filter: check mime and extension
function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIMES.includes(file.mimetype) && ALLOWED_EXT.includes(ext)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF and DOCX are allowed'));
    }
}

const uploadMemory = multer({
    storage: memoryStorage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});
module.exports = { uploadMemory };