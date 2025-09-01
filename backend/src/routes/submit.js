// backend/src/routes/submit.js

const express = require('express');
const router = express.Router();
const { submitUser } = require('../controllers/submitController');
const validate = require('../middleware/validate');
const submitSchema = require('../validations/submitSchema');

// GET /api/submit
router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'GET /api/submit is working!' });
});

// POST /api/submit
router.post('/', validate(submitSchema), submitUser);

module.exports = router;
