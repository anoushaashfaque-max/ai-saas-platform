const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'demo_jwt_secret_key';

const ensureUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ clerkId: decoded.id });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token user'
      });
    }

    req.user = user;
    req.userId = user._id;
    req.clerkId = user.clerkId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

const requirePro = (req, res, next) => {
  if (!req.user?.isPro) {
    return res.status(403).json({
      success: false,
      message: 'Pro subscription required'
    });
  }
  next();
};

module.exports = {
  ensureUser,
  requireAdmin,
  requirePro
};
