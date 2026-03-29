const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { AppError, errorHandler } = require('../utils/errorHandler');
const { successResponse, paginatedResponse } = require('../utils/response');
const { userRegistrationValidation, userLoginValidation, userUpdateValidation, passwordUpdateValidation } = require('../validations/userValidations');

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * Format user response (without password)
 */
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatarColor: user.avatarColor,
  createdAt: user.createdAt
});

/**
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = userRegistrationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: [error.details[0].message]
      });
    }

    const { name, email, password } = value;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        errors: ['Email already registered']
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with random avatar color
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatarColor: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#06b6d4'][
        Math.floor(Math.random() * 8)
      ]
    });

    const token = generateToken(user._id);

    return res.status(201).json(
      successResponse(
        {
          user: formatUserResponse(user),
          token
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = userLoginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: [error.details[0].message]
      });
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: ['Authentication failed']
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: ['Authentication failed']
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json(
      successResponse(
        {
          user: formatUserResponse(user),
          token
        },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json(
      successResponse(formatUserResponse(user), 'User data retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    // Validate profile updates (name, email)
    if (req.body.name || req.body.email) {
      const { error, value: updateValue } = userUpdateValidation.validate({
        name: req.body.name,
        email: req.body.email
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
          errors: [error.details[0].message]
        });
      }
    }
    
    // Validate password update if provided
    let passwordValue = {};
    if (req.body.currentPassword || req.body.password) {
      const { error, value: pwValue } = passwordUpdateValidation.validate({
        currentPassword: req.body.currentPassword,
        newPassword: req.body.password
      });
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
          errors: [error.details[0].message]
        });
      }
      passwordValue = pwValue;
    }
    
    const value = {
      name: req.body.name,
      email: req.body.email,
      currentPassword: passwordValue.currentPassword,
      password: passwordValue.newPassword
    };

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, email, currentPassword, password } = value;

    // If updating password, verify current password
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password',
          errors: ['currentPassword required']
        });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
          errors: ['Invalid current password']
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update name and email
    if (name) user.name = name.trim();
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use',
          errors: ['Email taken']
        });
      }
      user.email = email.toLowerCase();
    }

    await user.save();

    return res.status(200).json(
      successResponse(formatUserResponse(user), 'Profile updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
