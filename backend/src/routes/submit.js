// src/routes/submit.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); // Import the authentication middleware
const { submitFinancialData } = require('../controllers/submitController'); // Import the submit controller
const validateSubmit = require('../middleware/validateSubmit'); // Import the validation middleware

/**
 * @route   POST /api/submit
 * @desc    Submit financial data
 * @access  Private (Requires Authentication)
 */
router.post('/', authenticate, validateSubmit, submitFinancialData);

module.exports = router;
