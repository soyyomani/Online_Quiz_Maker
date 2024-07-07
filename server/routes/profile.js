const express = require('express');
const multer = require('multer');
const path = require('path');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

 router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
        }
        res.send(file);
        });
        
router.get('/:id', authMiddleware, getProfile);
router.put('/:id', authMiddleware, upload.single('profilePicture'), updateProfile);

module.exports = router;
