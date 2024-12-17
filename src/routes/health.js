// src/routes/health.js

const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running smoothly!' });
});

module.exports = router;
