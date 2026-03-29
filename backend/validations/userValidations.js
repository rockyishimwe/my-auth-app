const Joi = require('joi');

const userRegistrationValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters'
    }),
    
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
    
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    })
});

const userLoginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
    
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

const userUpdateValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .trim()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters'
    }),
    
  email: Joi.string()
    .email()
    .optional()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address'
    })
});

const passwordUpdateValidation = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required'
    }),
    
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters'
    })
});

module.exports = {
  userRegistrationValidation,
  userLoginValidation,
  userUpdateValidation,
  passwordUpdateValidation
};

module.exports = {
  userRegistrationValidation,
  userLoginValidation,
  userUpdateValidation,
  passwordUpdateValidation
};
