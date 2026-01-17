const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Clerk authentication middleware
// 🔑 Secret key automatically .env se uthata hai
const clerkMiddleware = ClerkExpressRequireAuth();

// Helper: get logged-in Clerk user ID
const getClerkUserId = (req) => {
  return req.auth?.userId || null;
};

// Helper: check if user is authenticated
const isAuthenticated = (req) => {
  return !!req.auth?.userId;
};

module.exports = {
  clerkMiddleware,
  getClerkUserId,
  isAuthenticated
};
