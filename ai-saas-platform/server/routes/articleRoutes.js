const express = require('express');
const router = express.Router();
const {
  createArticle,
  createBlogTitles,
  reviewResumeText
} = require('../controllers/articleController');
const { ensureUser, requirePro } = require('../middleware/auth');
const { generationLimiter } = require('../middleware/rateLimiter');

// Apply authentication and rate limiter to all routes
router.use(ensureUser);
router.use(generationLimiter);

// Generate article (completely free)
router.post('/generate', createArticle);

// Generate blog titles (completely free)
router.post('/blog-titles', createBlogTitles);

// Review resume (Pro only)
router.post('/review-resume', requirePro, reviewResumeText);

module.exports = router;
