const Joi = require('joi');

const goalValidationSchema = Joi.object({
  user: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
      'any.required': 'User ID is required',
    }),
  text: Joi.string()
    .min(1)
    .trim()
    .required()
    .messages({
      'string.base': 'Text should be a string',
      'string.empty': 'Text cannot be empty',
      'any.required': 'Please add a text value',
    }),
});

module.exports = goalValidationSchema;
