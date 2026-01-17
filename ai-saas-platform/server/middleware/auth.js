const { getClerkUserId, isAuthenticated } = require('../config/clerk');
const User = require('../models/User');

const ensureUser = async (req, res, next) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const clerkId = getClerkUserId(req);

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email:
          req.auth?.sessionClaims?.email ||
          req.auth?.sessionClaims?.email_addresses?.[0]?.email_address ||
          'noemail@user.com',
        name: req.auth?.sessionClaims?.name || 'User',
        imageUrl: req.auth?.sessionClaims?.image_url || ''
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    req.user = user;
    req.userId = user._id;
    req.clerkId = clerkId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
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

const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

module.exports = {
  ensureUser,
  requirePro,
  requireAdmin
};




































































































// const { getClerkUserId, isAuthenticated } = require('../config/clerk');
// const User = require('../models/User');

// // Middleware to ensure user exists in database
// const ensureUser = async (req, res, next) => {
//   try {
//     if (!isAuthenticated(req)) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required'
//       });
//     }

//     const clerkId = getClerkUserId(req);
    
//     // Find or create user in database
//     let user = await User.findOne({ clerkId });
    
//     if (!user) {
//       // Create user if doesn't exist
//       user = await User.create({
//         clerkId,
//         email: req.auth?.sessionClaims?.email 
//         || req.auth?.sessionClaims?.email_addresses?.[0]?.email_address
//         || 'noemail@user.com',    
//         name: req.auth?.sessionClaims?.name || 'User',
//         imageUrl: req.auth?.sessionClaims?.image_url || ''
//       });
//     } else {
//       // Update last login
//       user.lastLogin = new Date();
//       await user.save();
//     }

//     // Attach user to request
//     req.user = user;
//     req.userId = user._id;
//     req.clerkId = clerkId;

//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Authentication error'
//     });
//   }
// };

// // Middleware to check if user is Pro
// const requirePro = (req, res, next) => {
//   try {
//     const user = req.user;
    
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     if (!user.isPro) {
//       return res.status(403).json({
//         success: false,
//         message: 'Pro subscription required',
//         isPro: false
//       });
//     }

//     next();
//   } catch (error) {
//     console.error('Pro check error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error checking subscription'
//     });
//   }
// };

// // Middleware to check if user is Admin
// const requireAdmin = (req, res, next) => {
//   try {
//     const user = req.user;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     if (!user.isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: 'Admin access required',
//         isAdmin: false
//       });
//     }

//     next();
//   } catch (error) {
//     console.error('Admin check error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error checking admin access'
//     });
//   }
// };

// module.exports = {
//   ensureUser,
//   requirePro,
//   requireAdmin
// };
