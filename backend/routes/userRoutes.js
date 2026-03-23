const express = require('express');
const router = express.Router();

const userValidation = require('../validations/userValidation');
const validate = require('../middleware/validate');

const { registerUser, loginUser, getMe } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

// Register new user
router.post('/', validate(userValidation.userRegisterSchema), registerUser);

// Login user
router.post('/login', validate(userValidation.userLoginSchema), loginUser);

// Get current user profile
router.get('/me', protect, getMe);

module.exports = router;
