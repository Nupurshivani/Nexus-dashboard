console.log("JWT SECRET:", process.env.JWT_SECRET);


const express = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  res.json(user);
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("JWT generated successfully");

    return res.status(200).json({
      token,
      role: user.role
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
