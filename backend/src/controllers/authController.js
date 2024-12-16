// src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Remove Joi import since validation is handled by middleware
// const Joi = require('joi');

/**
 * JWT Secret and Expiration
 * 
 * Ensure that the JWT_SECRET is defined in your .env file.
 * Example: JWT_SECRET=your_jwt_secret_key
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '1h'; // Token expires in 1 hour

/**
 * Registration Controller
 * 
 * Handles user registration by creating a new user and generating a JWT token upon successful registration.
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Create a new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        // Respond with user data and token
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login Controller
 * 
 * Handles user login by authenticating the user and generating a JWT token upon successful authentication.
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        // Respond with user data and token
        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout Controller (Optional)
 * 
 * Since JWTs are stateless, logout can be handled on the client side by deleting the token. Alternatively, implement token blacklisting for enhanced security.
 */
const logout = async (req, res, next) => {
    try {
        // For stateless JWTs, instruct the client to delete the token
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// Export the controllers
module.exports = {
    register,
    login,
    logout,
};
