const express = require('express');
const multer = require('multer');
const path = require('path');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Routes
router.get('/:id', authMiddleware, getProfile);
router.put('/:id', authMiddleware, upload.single('profilePicture'), updateProfile);

module.exports = router;
