const User = require('../models/User');
const { getClerkUserId } = require('../config/clerk');

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          imageUrl: user.imageUrl,
          isPro: user.isPro,
          credits: user.credits,
          totalCreditsUsed: user.totalCreditsUsed,
          subscriptionStatus: user.subscriptionStatus,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const { name } = req.body;

    if (name) {
      user.name = name;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          imageUrl: user.imageUrl,
          isPro: user.isPro,
          credits: user.credits
        }
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Make user admin (for development/testing)
const makeUserAdmin = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isAdmin = true;
    await user.save();

    res.json({
      success: true,
      message: 'User promoted to admin',
      data: {
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          isPro: user.isPro,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to make user admin'
    });
  }
};

module.exports = {
  getCurrentUser,
  updateUser,
  makeUserAdmin
};
