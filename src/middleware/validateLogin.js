// src/middleware/validateLogin.js

const Joi = require('joi');

/**
 * Defines the validation schema for user login.
 */
const loginSchema = Joi.object({
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
 * Middleware to validate user login data.
 */
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        // Customize error message based on validation failure
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateLogin;
