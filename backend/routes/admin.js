const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ msg: "Access denied" });

  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ active: true });

  res.json({
    totalUsers,
    activeUsers,
    sales: Math.floor(Math.random() * 10000)
  });
});

router.get('/users', auth, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.delete('/user/:id', auth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
});

module.exports = router;
