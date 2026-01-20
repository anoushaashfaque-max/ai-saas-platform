const express = require('express');
const router = express.Router();

const {
  createArticle,
  createBlogTitles,
  reviewResumeText
} = require('../controllers/articleController');

const { ensureUser, requirePro } = require('../middleware/auth');
const { generationLimiter } = require('../middleware/rateLimiter');

// All routes require authentication and rate limiting
router.use(ensureUser);
router.use(generationLimiter);

// FREE tools (for logged-in users)
router.post('/generate', createArticle);
router.post('/blog-titles', createBlogTitles);

// PRO tools (require Pro subscription)
router.post('/review-resume', requirePro, reviewResumeText);

module.exports = router;
