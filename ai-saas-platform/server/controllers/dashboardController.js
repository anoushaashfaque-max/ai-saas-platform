const Creation = require('../models/Creation');
const User = require('../models/User');

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Latest user data to ensure correct Pro status
    const user = await User.findById(userId) || req.user;

    // Recent creations
    const recentCreations = await Creation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('toolType title createdAt');

    // Creation counts by tool type
    const creationCounts = await Creation.aggregate([
      { $match: { userId } },
      { $group: { _id: '$toolType', count: { $sum: 1 } } }
    ]);

    // Total creations
    const totalCreations = await Creation.countDocuments({ userId });

    // Today's creations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCreations = await Creation.countDocuments({
      userId,
      createdAt: { $gte: today }
    });

    // This month's creations
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const monthCreations = await Creation.countDocuments({
      userId,
      createdAt: { $gte: thisMonth }
    });

    res.json({
      success: true,
      data: {
        user: {
          isPro: user.isPro || false,
          subscriptionEndDate: user.subscriptionEndDate || null
        },
        stats: {
          totalCreations,
          todayCreations,
          monthCreations,
          creationCounts: creationCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        recentCreations
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
};

// Get all creations with pagination
const getCreations = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const toolType = req.query.toolType;

    const query = { userId };
    if (toolType) query.toolType = toolType;

    const creations = await Creation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('toolType title input output createdAt metadata');

    const total = await Creation.countDocuments(query);

    res.json({
      success: true,
      data: {
        creations,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
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

// Get single creation
const getCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const creation = await Creation.findOne({ _id: id, userId });

    if (!creation) return res.status(404).json({ success: false, message: 'Creation not found' });

    res.json({ success: true, data: { creation } });
  } catch (error) {
    console.error('Get creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to get creation' });
  }
};

// Delete creation
const deleteCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const creation = await Creation.findOneAndDelete({ _id: id, userId });

    if (!creation) return res.status(404).json({ success: false, message: 'Creation not found' });

    res.json({ success: true, message: 'Creation deleted successfully' });
  } catch (error) {
    console.error('Delete creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete creation' });
  }
};

module.exports = { getDashboardStats, getCreations, getCreation, deleteCreation };
