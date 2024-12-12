
const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;
