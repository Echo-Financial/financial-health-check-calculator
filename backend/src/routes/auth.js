// src/routes/auth.js

const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const validateRegister = require('../middleware/validateRegister'); // Import the registration validation middleware
const validateLogin = require('../middleware/validateLogin'); // Import the login validation middleware

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login an existing user
 * @access  Public
 */
router.post('/login', validateLogin, login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout the user (optional)
 * @access  Private
 */
router.post('/logout', logout);

module.exports = router;
