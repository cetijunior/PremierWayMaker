const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) return cb(null, true);
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  },
});

module.exports = upload;
