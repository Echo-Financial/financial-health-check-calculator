// backend/src/routes/health.js

const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Health check OK' });
});

module.exports = router;
