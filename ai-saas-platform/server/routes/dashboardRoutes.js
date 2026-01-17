const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCreations,
  getCreation,
  deleteCreation
} = require('../controllers/dashboardController');
const { ensureUser } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// All routes require authentication and rate limiting
router.use(ensureUser);
router.use(apiLimiter);

// Get dashboard stats
router.get('/stats', getDashboardStats);

// Get all creations
router.get('/creations', getCreations);

// Get single creation
router.get('/creations/:id', getCreation);

// Delete creation
router.delete('/creations/:id', deleteCreation);

module.exports = router;
