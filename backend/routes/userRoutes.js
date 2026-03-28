const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/response');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register user (alternative route)
// @route   POST /api/users
// @access   Public
router.post('/', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json(errorResponse('User already exists'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    res.status(201).json(successResponse({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
      token
    }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Register user
// @route   POST /api/users/register
// @access   Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json(errorResponse('User already exists'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    res.status(201).json(successResponse({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
      token
    }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access   Public
router.post('/login', async (req, res, next) => {
  try {
    console.log('LOGIN HIT — body:', req.body);
    console.log('Headers:', req.headers['content-type']);
    
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const token = generateToken(user._id);

    res.json(successResponse({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
      token
    }, 'Login successful'));
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user
// @route   GET /api/users/me
// @access   Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    res.json(successResponse(user));
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access   Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(successResponse(user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
