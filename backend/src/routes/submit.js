// backend/src/routes/submit.js

const express = require('express');
const router = express.Router();
const { submitUser } = require('../controllers/submitController');

// GET /api/submit
router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'GET /api/submit is working!' });
});

// POST /api/submit
router.post('/', submitUser);

module.exports = router;
