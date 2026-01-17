const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUser,
  getPayments,
  getCreations
} = require('../controllers/adminController');
const { ensureUser, requireAdmin } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// All routes require authentication and admin access
router.use(ensureUser);
router.use(requireAdmin);
router.use(apiLimiter);

// Admin dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getUsers);
router.put('/users/:userId', updateUser);

// Payment management
router.get('/payments', getPayments);

// Creation management
router.get('/creations', getCreations);

module.exports = router;