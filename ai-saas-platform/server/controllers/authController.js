const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getClerkUserId } = require('../config/clerk');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'demo_jwt_secret_key';

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
          isAdmin: user.isAdmin,
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

// Create new user (signup)
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { clerkId: email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = await User.create({
      clerkId: email, // Using email as clerkId for demo
      email,
      name,
      isPro: true, // Default to Pro for demo
      subscriptionEndDate: new Date('2026-02-13T18:26:56.571Z')
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.clerkId,
        email: user.email,
        role: user.isAdmin ? 'admin' : 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          isPro: user.isPro,
          isAdmin: user.isAdmin
        },
        token
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // For demo purposes, accept any email/password combination
    // In production, you would verify password hash
    const user = await User.findOne({ email });

    let userToReturn = user;

    if (!user) {
      // Create user if doesn't exist (demo mode)
      userToReturn = await User.create({
        clerkId: email,
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        isPro: true,
        subscriptionEndDate: new Date('2026-02-13T18:26:56.571Z')
      });
    } else {
      // Update last login
      userToReturn.lastLogin = new Date();
      await userToReturn.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userToReturn.clerkId,
        email: userToReturn.email,
        role: userToReturn.isAdmin ? 'admin' : 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: userToReturn._id,
          clerkId: userToReturn.clerkId,
          email: userToReturn.email,
          name: userToReturn.name,
          isPro: userToReturn.isPro,
          isAdmin: userToReturn.isAdmin
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

module.exports = {
  getCurrentUser,
  updateUser,
  makeUserAdmin,
  createUser,
  loginUser
};
