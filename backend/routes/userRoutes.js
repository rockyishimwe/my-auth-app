const express = require('express');
const userValidation= require('../validations/userValidation');
const validate = require('../middleware/Validator');
const router = express.Router();
const { registerUser,loginUser,getMe} = require('../controllers/userControllers')

const {protect }= require('../middleware/authMiddleware');

router.post('/',validate(userValidation.userRegisterSchema),registerUser);

router.post('/login',validate(userValidation.userLoginSchema),loginUser);

router.get('/me',protect,  getMe);

module.exports =router;