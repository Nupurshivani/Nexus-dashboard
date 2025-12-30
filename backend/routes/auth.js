const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');

const router = express.Router();

// Generate tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Create user (password hashed by pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      department: department || 'engineering',
      status: 'active'
    });

    // Log activity
    await Activity.create({
      user: user._id,
      action: 'signup',
      description: `New user registered: ${user.name}`,
      severity: 'info',
      status: 'success'
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    // Check if user is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({ msg: 'Your account has been suspended. Please contact support.' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    // Update login info
    await user.updateLoginInfo();

    // Log activity
    await Activity.create({
      user: user._id,
      action: 'login',
      description: `User logged in: ${user.name}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      severity: 'info',
      status: 'success'
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public (with refresh token)
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh'
    );

    // Find user with matching refresh token
    const user = await User.findOne({ _id: decoded.id, refreshToken });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    res.json({
      success: true,
      token: accessToken
    });
  } catch (error) {
    console.error('REFRESH TOKEN ERROR:', error);
    res.status(401).json({ msg: 'Invalid or expired refresh token' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Clear refresh token
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });

      // Log activity
      await Activity.create({
        user: decoded.id,
        action: 'logout',
        description: 'User logged out',
        severity: 'info',
        status: 'success'
      });
    }

    res.json({ success: true, msg: 'Logged out successfully' });
  } catch (error) {
    res.json({ success: true, msg: 'Logged out' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        phone: user.phone,
        location: user.location,
        preferences: user.preferences,
        twoFactorEnabled: user.twoFactorEnabled,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('GET ME ERROR:', error);
    res.status(401).json({ msg: 'Not authenticated' });
  }
});

// @route   POST /api/auth/seed
// @desc    Seed database with sample data
// @access  Public (if empty) or Private/Admin
router.post('/seed', async (req, res) => {
  try {
    const { key } = req.body;
    const isProtected = await User.countDocuments() > 0;

    // Security check: If users exist, require admin token or secret key
    if (isProtected) {
      if (key !== process.env.JWT_SECRET) {
        // Try parsing token if key not provided
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(403).json({ msg: 'Database already initialized' });

        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const admin = await User.findById(decoded.id);
          if (!admin || !['admin', 'superadmin'].includes(admin.role)) {
            return res.status(403).json({ msg: 'Admin access required' });
          }
        } catch (e) {
          return res.status(403).json({ msg: 'Invalid credentials' });
        }
      }
    }

    const Order = require('../models/Order');
    const Notification = require('../models/Notification');
    const DailyAnalytics = require('../models/Analytics');

    // Clear existing data
    await User.deleteMany({});
    await Order.deleteMany({});
    await Activity.deleteMany({});
    await Notification.deleteMany({});
    await DailyAnalytics.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Nupur Shivani',
      email: 'admin@dashboard.com',
      password: 'admin123',
      role: 'superadmin',
      status: 'active',
      department: 'engineering',
      phone: '+91 98765 43210',
      location: { city: 'Mumbai', country: 'India' },
      preferences: { theme: 'dark', notifications: true, language: 'en' }
    });

    // Create sample data (Subset of seed-admin.js for performance)
    const users = [];
    const departments = ['engineering', 'marketing', 'sales', 'support'];
    for (let i = 0; i < 10; i++) {
      users.push(await User.create({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: 'user123',
        role: 'user',
        department: departments[i % departments.length],
        status: 'active'
      }));
    }

    // Sample Orders
    const orderStatuses = ['pending', 'processing', 'delivered'];
    for (let i = 0; i < 20; i++) {
      await Order.create({
        orderNumber: `ORD-${1000 + i}`,
        customer: { name: users[i % users.length].name, email: users[i % users.length].email },
        total: Math.floor(Math.random() * 5000) + 500,
        status: orderStatuses[i % 3],
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7)
      });
    }

    // Analytics
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      await DailyAnalytics.create({
        date,
        users: { newSignups: Math.floor(Math.random() * 10), activeUsers: 50 + i },
        revenue: { total: Math.floor(Math.random() * 20000), orders: 5 + i },
        traffic: { pageViews: 100 + i * 10, uniqueVisitors: 50 + i * 5 },
        conversions: { signups: 5, purchases: 2, downloads: 10 },
        deviceBreakdown: { desktop: 60, mobile: 30, tablet: 10 },
        browserBreakdown: { chrome: 70, safari: 20, firefox: 10 }
      });
    }

    res.json({ success: true, msg: 'Database seeded successfully', admin: { email: 'admin@dashboard.com', password: 'admin123' } });

  } catch (error) {
    console.error('SEED ERROR:', error);
    res.status(500).json({ msg: 'Error seeding database' });
  }
});

module.exports = router;
