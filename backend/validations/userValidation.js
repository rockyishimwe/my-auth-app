const joi = require("joi");

const userRegisterSchema = joi.object({
    name: joi.string().required().trim().messages({
        'string.name':"please the name should be a string type",
        'any.required':"Name is required"
    }),

    email: joi.string().required().email().trim().messages({
        'string.email':"please email should contain @ email type",
        'any.required':"Email is required",
        'string.base':"Email should be a string"
    }),
    password:joi.string().min(6).max(30).required().messages({
        'string.base':"password should be a string",
        'any.required':"password cannot be empty",
        'string.min':"password should have at least 6 characters",
        'string.max':"password should have at most 30 characters",
        'any.required':"password is required"
    })

});
const userLoginSchema=joi.object({
    email: joi.string().required().email().trim().messages({
        'string.email':"please email should contain @ email type",
        'any.required':"Email is required",
        'string.base':"Email should be a string"
    }),
    password:joi.string().min(6).max(30).required().messages({
        'string.base':"password should be a string",
        'any.required':"password cannot be empty",
        'string.min':"password should have at least 6 characters",
        'string.max':"password should have at most 30 characters",
        'any.required':"password is required"
    })
});

module.exports = {userRegisterSchema,userLoginSchema};