// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminAuthController');

// POST /api/auth/login for admin authentication
router.post('/login', adminLogin);

module.exports = router;
