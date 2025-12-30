const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Activity = require('../models/Activity');
const DailyAnalytics = require('../models/Analytics');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};

// ==================== DASHBOARD STATS ====================

// @route   GET /api/admin/stats
// @desc    Get dashboard overview stats
// @access  Private/Admin
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // User statistics
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // If no users or no orders (fresh/demo state), return sample data
    if (totalUsers === 0 || totalOrders === 0) {
      return res.json({
        success: true,
        data: {
          users: {
            total: 1248,
            active: 856,
            newThisMonth: 145,
            newThisWeek: 42,
            growth: 12.5
          },
          orders: {
            total: 452,
            pending: 18,
            completed: 412,
            processingRate: 91.2
          },
          revenue: {
            total: 1256000,
            monthly: 450000,
            growth: 8.4,
            currency: 'INR'
          },
          engagement: {
            bounceRate: 42.5,
            avgSessionDuration: 340,
            conversionRate: 4.2
          }
        }
      });
    }

    const activeUsers = await User.countDocuments({ status: 'active' });
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Order stats details
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    // Revenue calculation
    const revenueAggregation = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAggregation[0]?.total || 0;

    // Monthly revenue
    const monthlyRevenueAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

    // Calculate growth percentages (simulated for demo)
    const userGrowth = newUsersThisWeek > 0 ? ((newUsersThisWeek / Math.max(totalUsers - newUsersThisWeek, 1)) * 100).toFixed(1) : 0;
    const revenueGrowth = 12.5; // Would calculate from previous period

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsersThisMonth,
          newThisWeek: newUsersThisWeek,
          growth: parseFloat(userGrowth)
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          processingRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
          growth: revenueGrowth,
          currency: 'INR'
        },
        engagement: {
          bounceRate: 32.4,
          avgSessionDuration: 245,
          conversionRate: 3.8
        }
      }
    });
  } catch (error) {
    console.error('STATS ERROR:', error);
    res.status(500).json({ msg: 'Error fetching statistics' });
  }
});

// @route   GET /api/admin/chart-data
// @desc    Get chart data for analytics
// @access  Private/Admin
router.get('/chart-data', auth, requireAdmin, async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    let days = 7;
    if (period === '30d') days = 30;
    if (period === '90d') days = 90;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get analytics data
    const analytics = await DailyAnalytics.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // If no analytics data, generate sample data
    if (analytics.length === 0) {
      const labels = [];
      const usersData = [];
      const revenueData = [];
      const ordersData = [];
      const trafficData = [];

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

        // Generate realistic random data
        usersData.push(Math.floor(Math.random() * 50) + 20);
        revenueData.push(Math.floor(Math.random() * 50000) + 10000);
        ordersData.push(Math.floor(Math.random() * 30) + 5);
        trafficData.push(Math.floor(Math.random() * 500) + 200);
      }

      return res.json({
        success: true,
        data: {
          labels,
          datasets: {
            users: usersData,
            revenue: revenueData,
            orders: ordersData,
            traffic: trafficData
          }
        }
      });
    }

    // Format existing data
    const labels = analytics.map(a =>
      new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    res.json({
      success: true,
      data: {
        labels,
        datasets: {
          users: analytics.map(a => a.users.newSignups),
          revenue: analytics.map(a => a.revenue.total),
          orders: analytics.map(a => a.revenue.orders),
          traffic: analytics.map(a => a.traffic.pageViews)
        }
      }
    });
  } catch (error) {
    console.error('CHART DATA ERROR:', error);
    res.status(500).json({ msg: 'Error fetching chart data' });
  }
});

// @route   GET /api/admin/distribution
// @desc    Get distribution data for pie/doughnut charts
// @access  Private/Admin
router.get('/distribution', auth, requireAdmin, async (req, res) => {
  try {
    // User role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Check if we need dummy data (low data volume)
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    if (totalUsers < 5 || totalOrders === 0) {
      return res.json({
        success: true,
        data: {
          roles: { user: 856, admin: 12, moderator: 5, superadmin: 1 },
          status: { active: 1120, inactive: 120, pending: 8 },
          departments: { engineering: 420, marketing: 350, sales: 280, support: 150, hr: 48 },
          orderStatus: { delivered: 240, pending: 45, processing: 35, cancelled: 12 },
          devices: { desktop: 58, mobile: 35, tablet: 7 },
          browsers: { chrome: 64, safari: 18, firefox: 10, edge: 5, other: 3 }
        }
      });
    }

    // User status distribution
    const statusDistribution = await User.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Department distribution
    const departmentDistribution = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Device breakdown (sample data)
    const deviceBreakdown = {
      desktop: 58,
      mobile: 35,
      tablet: 7
    };

    // Browser breakdown (sample data)
    const browserBreakdown = {
      chrome: 64,
      safari: 18,
      firefox: 10,
      edge: 5,
      other: 3
    };

    res.json({
      success: true,
      data: {
        roles: Object.fromEntries(roleDistribution.map(r => [r._id || 'unknown', r.count])),
        status: Object.fromEntries(statusDistribution.map(s => [s._id || 'unknown', s.count])),
        departments: Object.fromEntries(departmentDistribution.map(d => [d._id || 'unknown', d.count])),
        orderStatus: Object.fromEntries(orderStatusDistribution.map(o => [o._id || 'unknown', o.count])),
        devices: deviceBreakdown,
        browsers: browserBreakdown
      }
    });
  } catch (error) {
    console.error('DISTRIBUTION ERROR:', error);
    res.status(500).json({ msg: 'Error fetching distribution data' });
  }
});

// ==================== USER MANAGEMENT ====================

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filters
// @access  Private/Admin
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = '',
      department = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log('GET /users request received', { page, limit, search, role });

    // Build query
    const query = {};
    // ... (query building logic)

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;
    if (department) query.department = department;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password -refreshToken');

    console.log(`Found ${users.length} users. Total: ${total}`);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('GET USERS ERROR:', error);
    res.status(500).json({ msg: 'Error fetching users' });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user by ID
// @access  Private/Admin
router.get('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get user's recent activities
    const recentActivities = await Activity.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        user,
        activities: recentActivities
      }
    });
  } catch (error) {
    console.error('GET USER ERROR:', error);
    res.status(500).json({ msg: 'Error fetching user' });
  }
});

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private/Admin
router.post('/users', auth, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role, department, status, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      department: department || 'engineering',
      status: status || 'active',
      phone
    });

    // Log activity
    await Activity.create({
      user: req.user.id,
      action: 'user_created',
      description: `Created new user: ${user.name} (${user.email})`,
      metadata: { createdUserId: user._id },
      severity: 'info',
      status: 'success'
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          department: user.department
        }
      }
    });
  } catch (error) {
    console.error('CREATE USER ERROR:', error);
    res.status(500).json({ msg: 'Error creating user' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { name, email, role, department, status, phone, location } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Track changes for activity log
    const changes = [];
    if (name && name !== user.name) changes.push('name');
    if (email && email !== user.email) changes.push('email');
    if (role && role !== user.role) changes.push('role');
    if (status && status !== user.status) changes.push('status');
    if (department && department !== user.department) changes.push('department');

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (department) user.department = department;
    if (status) user.status = status;
    if (phone) user.phone = phone;
    if (location) user.location = location;

    await user.save();

    // Log activity
    if (changes.length > 0) {
      await Activity.create({
        user: req.user.id,
        action: 'user_updated',
        description: `Updated user ${user.name}: ${changes.join(', ')}`,
        metadata: { updatedUserId: user._id, changes },
        severity: 'info',
        status: 'success'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('UPDATE USER ERROR:', error);
    res.status(500).json({ msg: 'Error updating user' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    // Log activity
    await Activity.create({
      user: req.user.id,
      action: 'user_deleted',
      description: `Deleted user: ${user.name} (${user.email})`,
      metadata: { deletedUserId: user._id, deletedUserEmail: user.email },
      severity: 'warning',
      status: 'success'
    });

    res.json({
      success: true,
      msg: 'User deleted successfully'
    });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    res.status(500).json({ msg: 'Error deleting user' });
  }
});

// @route   PATCH /api/admin/users/:id/status
// @desc    Update user status
// @access  Private/Admin
router.patch('/users/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    // Log activity
    await Activity.create({
      user: req.user.id,
      action: status === 'suspended' ? 'user_suspended' : 'user_updated',
      description: `Changed user ${user.name} status from ${oldStatus} to ${status}`,
      metadata: { userId: user._id, oldStatus, newStatus: status },
      severity: status === 'suspended' ? 'warning' : 'info',
      status: 'success'
    });

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error);
    res.status(500).json({ msg: 'Error updating user status' });
  }
});

// ==================== ACTIVITY LOGS ====================

// @route   GET /api/admin/activities
// @desc    Get activity logs
// @access  Private/Admin
router.get('/activities', auth, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      action = '',
      severity = '',
      userId = ''
    } = req.query;

    const query = {};
    if (action) query.action = action;
    if (severity) query.severity = severity;
    if (userId) query.user = userId;

    const total = await Activity.countDocuments(query);
    const activities = await Activity.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('GET ACTIVITIES ERROR:', error);
    res.status(500).json({ msg: 'Error fetching activities' });
  }
});

// ==================== ORDERS ====================

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/orders', auth, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = '',
      paymentStatus = ''
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('GET ORDERS ERROR:', error);
    res.status(500).json({ msg: 'Error fetching orders' });
  }
});

// @route   GET /api/admin/orders/recent
// @desc    Get recent orders for dashboard
// @access  Private/Admin
router.get('/orders/recent', auth, requireAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    if (totalOrders === 0) {
      return res.json({
        success: true,
        data: {
          orders: [
            {
              orderNumber: 'ORD-003452',
              customer: { name: 'Sarah Mitchell', email: 'sarah.m@example.com' },
              total: 1250,
              status: 'delivered',
              createdAt: new Date()
            },
            {
              orderNumber: 'ORD-003451',
              customer: { name: 'David Chen', email: 'david.c@example.com' },
              total: 3500,
              status: 'processing',
              createdAt: new Date(Date.now() - 3600000)
            },
            {
              orderNumber: 'ORD-003450',
              customer: { name: 'Jessica Taylor', email: 'jess.t@example.com' },
              total: 890,
              status: 'pending',
              createdAt: new Date(Date.now() - 7200000)
            },
            {
              orderNumber: 'ORD-003449',
              customer: { name: 'Michael Ross', email: 'm.ross@example.com' },
              total: 15000,
              status: 'completed',
              createdAt: new Date(Date.now() - 10800000)
            },
            {
              orderNumber: 'ORD-003448',
              customer: { name: 'Priya Sharma', email: 'priya.s@example.com' },
              total: 450,
              status: 'cancelled',
              createdAt: new Date(Date.now() - 14400000)
            }
          ]
        }
      });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('GET RECENT ORDERS ERROR:', error);
    res.status(500).json({ msg: 'Error fetching recent orders' });
  }
});

// ==================== NOTIFICATIONS ====================

// @route   GET /api/admin/notifications
// @desc    Get notifications
// @access  Private/Admin
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { user: req.user.id },
        { user: null } // Broadcast notifications
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      $or: [{ user: req.user.id }, { user: null }],
      read: false
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    console.error('GET NOTIFICATIONS ERROR:', error);
    res.status(500).json({ msg: 'Error fetching notifications' });
  }
});

// @route   PATCH /api/admin/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.patch('/notifications/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    console.error('MARK READ ERROR:', error);
    res.status(500).json({ msg: 'Error updating notification' });
  }
});

// @route   POST /api/admin/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.post('/notifications/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { $or: [{ user: req.user.id }, { user: null }] },
      { read: true }
    );

    res.json({
      success: true,
      msg: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('MARK ALL READ ERROR:', error);
    res.status(500).json({ msg: 'Error updating notifications' });
  }
});

module.exports = router;
