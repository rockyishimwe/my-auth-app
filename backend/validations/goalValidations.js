const Joi = require('joi');

const goalValidationSchema = Joi.object({
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