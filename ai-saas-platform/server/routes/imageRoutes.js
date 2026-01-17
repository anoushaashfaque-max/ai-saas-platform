const express = require('express');
const router = express.Router();
const {
  createImage,
  removeImageBackground,
  removeImageObject,
  upload
} = require('../controllers/imageController');
const { ensureUser, requirePro } = require('../middleware/auth');
const { generationLimiter } = require('../middleware/rateLimiter');

// All routes require authentication and rate limiting
router.use(ensureUser);
router.use(generationLimiter);

// Generate image (Pro only)
router.post('/generate', requirePro, createImage);

// Remove background (Pro only)
router.post('/remove-background', requirePro, upload.single('image'), removeImageBackground);

// Remove object (Pro only)
router.post('/remove-object', requirePro, upload.single('image'), removeImageObject);

module.exports = router;
