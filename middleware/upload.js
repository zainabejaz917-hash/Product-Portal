const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Auto folder create
const uploadDir = 'uploads/Profile/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const valid = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );
  valid ? cb(null, true) : cb(new Error('Images only!'));
};

module.exports = multer({ storage, fileFilter });