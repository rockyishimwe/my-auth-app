const express = require('express');
const router = express.Router();
const { registerUser,loginUser,getMe} = require('../backend/controllers/userControllers')

const {protect }= require('../backend/middleware/authMiddleware');

router.post('/',registerUser);

router.post('/login',loginUser);

router.get('/me',protect,  getMe);

module.exports =router;