// src/routes/submit.js

const express = require('express');
const router = express.Router();
const { submitFinancialData } = require('../controllers/submitController'); 
const validateSubmit = require('../middleware/validateSubmit'); 

/**
 * @route   POST /api/submit
 * @desc    Submit financial data
 * @access  Public (No Authentication Required)
 */
router.post('/', validateSubmit, submitFinancialData);

module.exports = router;
