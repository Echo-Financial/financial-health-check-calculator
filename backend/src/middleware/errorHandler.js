// src/middleware/errorHandler.js

const mongoose = require('mongoose');
const logger = require('../config/logger'); // Import the logger

/**
 * Centralized Error Handling Middleware
 * 
 * This middleware captures all errors passed through `next(error)` and sends
 * a structured response to the client. It also logs the errors for debugging purposes.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error details
    logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

    // Determine the type of error and set the appropriate status code and message
    let statusCode = 500;
    let message = 'An unexpected error occurred.';

    // Handle Mongoose validation errors
    if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        message = err.message;
    }

    // Handle duplicate key errors (e.g., unique constraints)
    if (err.code && err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue);
        message = `Duplicate value for field: ${field}`;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired. Please log in again.';
    }

    // Handle Joi validation errors (if any residual exist)
    if (err.isJoi) {
        statusCode = 400;
        message = err.details[0].message;
    }

    // Respond to the client
    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;
