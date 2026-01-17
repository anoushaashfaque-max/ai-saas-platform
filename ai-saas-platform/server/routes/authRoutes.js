const express = require('express');
const router = express.Router();

const {
  getCurrentUser,
  updateUser,
  makeUserAdmin
} = require('../controllers/authController');

const { ensureUser } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// All routes require authentication
router.use(ensureUser);
router.use(apiLimiter);

// Get current user
router.get('/me', getCurrentUser);

// Update user profile
router.put('/me', updateUser);

// Make user admin (development only)
router.post('/make-admin', makeUserAdmin);

module.exports = router;


