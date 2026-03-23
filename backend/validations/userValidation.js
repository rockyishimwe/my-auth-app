const Joi = require("joi");

const userRegisterSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.base': "Name should be a string",
    'string.empty': "Name cannot be empty",
    'any.required': "Name is required"
  }),

  email: Joi.string().trim().email().required().messages({
    'string.base': "Email should be a string",
    'string.email': "Please provide a valid email address",
    'string.empty': "Email cannot be empty",
    'any.required': "Email is required"
  }),

  password: Joi.string().min(6).max(30).required().messages({
    'string.base': "Password should be a string",
    'string.empty': "Password cannot be empty",
    'string.min': "Password should have at least 6 characters",
    'string.max': "Password should have at most 30 characters",
    'any.required': "Password is required"
  })
});

const userLoginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.base': "Email should be a string",
    'string.email': "Please provide a valid email address",
    'string.empty': "Email cannot be empty",
    'any.required': "Email is required"
  }),

  password: Joi.string().min(6).max(30).required().messages({
    'string.base': "Password should be a string",
    'string.empty': "Password cannot be empty",
    'string.min': "Password should have at least 6 characters",
    'string.max': "Password should have at most 30 characters",
    'any.required': "Password is required"
  })
});

module.exports = { userRegisterSchema, userLoginSchema };
