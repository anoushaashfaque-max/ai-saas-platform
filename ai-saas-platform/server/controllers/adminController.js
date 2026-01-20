const User = require('../models/User');
const Creation = require('../models/Creation');
const Payment = require('../models/Payment');

// Get admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const proUsers = await User.countDocuments({ isPro: true });
    const freeUsers = totalUsers - proUsers;
    const adminUsers = await User.countDocuments({ isAdmin: true });

    // Creation statistics
    const totalCreations = await Creation.countDocuments();
    const todayCreations = await Creation.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // Payment statistics
    const totalPayments = await Payment.countDocuments();
    const successfulPayments = await Payment.countDocuments({ status: 'succeeded' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email isPro isAdmin createdAt');

    // Recent creations
    const recentCreations = await Creation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .select('toolType title userId createdAt');

    // Tool usage stats
    const toolStats = await Creation.aggregate([
      {
        $group: {
          _id: '$toolType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'succeeded',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          proUsers,
          freeUsers,
          adminUsers,
          totalCreations,
          todayCreations,
          totalPayments,
          successfulPayments,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        recentUsers,
        recentCreations,
        toolStats,
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admin stats'
    });
  }
};

// Get all users with pagination
const getUsers = async (req, res) => {
  try {
    console.log('getUsers called by admin:', req.user?.email);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const status = req.query.status; // 'all', 'pro', 'free', 'admin'

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'pro') query.isPro = true;
    if (status === 'free') query.isPro = false;
    if (status === 'admin') query.isAdmin = true;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name email isPro isAdmin stripeCustomerId createdAt lastLogin');

    const total = await User.countDocuments(query);

    console.log('Found users:', total, 'for query:', query);

    // Get user creation counts
    const userIds = users.map(user => user._id);
    const creationCounts = await Creation.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]);

    const creationCountMap = {};
    creationCounts.forEach(item => {
      creationCountMap[item._id.toString()] = item.count;
    });

    const usersWithStats = users.map(user => ({
      ...user.toObject(),
      totalCreations: creationCountMap[user._id.toString()] || 0
    }));

    res.json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};

// Update user status
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isPro, isAdmin } = req.body;

    if (req.user._id.toString() === userId && isAdmin === false) {
      return res.status(400).json({
        success: false,
        message: "You can't remove your own admin access"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (typeof isPro === 'boolean') user.isPro = isPro;
    if (typeof isAdmin === 'boolean') user.isAdmin = isAdmin;

    await user.save();

    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};


// Get all payments
const getPayments = async (req, res) => {
  try {
    console.log('getPayments called by admin:', req.user?.email);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const planType = req.query.planType;

    const skip = (page - 1) * limit;
    let query = {};

    if (status) query.status = status;
    if (planType) query.planType = planType;

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .select('amount currency status planType userId stripePaymentIntentId createdAt');

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments'
    });
  }
};

// Get all creations
const getCreations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const toolType = req.query.toolType;
    const userId = req.query.userId;

    const skip = (page - 1) * limit;
    let query = {};

    if (toolType) query.toolType = toolType;
    if (userId) query.userId = userId;

    const creations = await Creation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .select('toolType title input output isPro userId createdAt');

    const total = await Creation.countDocuments(query);

    res.json({
      success: true,
      data: {
        creations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get creations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get creations'
    });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  updateUser,
  getPayments,
  getCreations
};