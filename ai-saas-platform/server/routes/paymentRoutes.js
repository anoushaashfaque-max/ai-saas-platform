const express = require('express');
const router = express.Router();
const {
  createProCheckout,
  createCreditPayment,
  createPaymentIntent,
  handleStripeWebhook,
  getPaymentHistory
} = require('../controllers/paymentController');
const { ensureUser } = require('../middleware/auth');
const { paymentLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Webhook route (no auth, Stripe verifies signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// All other routes require authentication
router.use(ensureUser);

// Create Pro checkout session
router.post('/checkout/pro', paymentLimiter, createProCheckout);

// Create credit payment
router.post('/checkout/credits', paymentLimiter, createCreditPayment);

// Create payment intent
router.post('/create-intent', paymentLimiter, createPaymentIntent);

// Get payment history
router.get('/history', apiLimiter, getPaymentHistory);

module.exports = router;
