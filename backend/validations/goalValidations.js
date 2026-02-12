const joi = require('joi');
const goalValidationSchema = joi.object({
    user:joi.string().required().messages({
        'string.base':"User ID should be a string",
        'any.required':"user ID is required"
    }),
    text:joi.string().required().trim().messages({
        'string.base':"Text should be a string",
        'string.empty':"Text cannot be empty",
        'any.required':"please add a text value"
    })
});
module.exports = goalValidationSchema;