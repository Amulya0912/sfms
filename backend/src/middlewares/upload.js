const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880; // 5MB

/**
 * Multer Storage Configuration
 * // TODO: PRODUCTION INTEGRATION — Replace with AWS S3 or Cloudinary SDK
 * Local file storage for development
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter,
});

module.exports = upload;
