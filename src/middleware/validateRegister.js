// src/middleware/validateRegister.js

const Joi = require('joi');

/**
 * Defines the validation schema for user registration.
 */
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.base': `"name" should be a type of 'text'`,
        'string.empty': `"name" cannot be an empty field`,
        'string.min': `"name" should have a minimum length of {#limit}`,
        'any.required': `"name" is a required field`
    }),
    email: Joi.string().email().required().messages({
        'string.base': `"email" should be a type of 'text'`,
        'string.email': `"email" must be a valid email`,
        'string.empty': `"email" cannot be an empty field`,
        'any.required': `"email" is a required field`
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': `"password" should be a type of 'text'`,
        'string.empty': `"password" cannot be an empty field`,
        'string.min': `"password" should have a minimum length of {#limit}`,
        'any.required': `"password" is a required field`
    }),
});

/**
 * Middleware to validate user registration data.
 */
const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        // Customize error message based on validation failure
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateRegister;
