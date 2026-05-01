const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', authMiddleware, productController.getAll);
router.post('/', authMiddleware, upload.single('image'), productController.create);
router.put('/:id', authMiddleware, upload.single('image'), productController.update);
router.delete('/:id', authMiddleware, productController.delete);

module.exports = router; // ✅ Must export router