const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const {
  getCurrentUser,
  updateUser,
  makeUserAdmin,
  createUser,
  loginUser
} = require('../controllers/authController');

const { ensureUser } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const User = require('../models/User');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'demo_jwt_secret_key';

// Public routes (no authentication required)
router.post('/signup', apiLimiter, createUser);
router.post('/login', apiLimiter, loginUser);

// Protected routes (authentication required)
router.use(ensureUser);
router.use(apiLimiter);

// Get current user
router.get('/me', getCurrentUser);

// Update user profile
router.put('/me', updateUser);

// Make user admin (development only)
router.post('/make-admin', makeUserAdmin);

module.exports = router;


