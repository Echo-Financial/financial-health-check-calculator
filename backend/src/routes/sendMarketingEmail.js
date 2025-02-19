// backend/src/routes/sendMarketingEmail.js

const express = require('express');
const { sendMarketingEmail } = require('../emailService');
const logger = require('../logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const emailData = req.body;

    // Basic validation: Check that required fields are present.
    if (!emailData.subject || !emailData.body || !emailData.cta) {
      return res.status(400).json({ error: 'Missing required email fields: subject, body, or cta.' });
    }
    
    // Set default values for additional parameters if they are not provided.
    emailData.name = emailData.name || "Test Campaign";
    emailData.fromemail = emailData.fromemail || "info@example.com";
    emailData.type = emailData.type || "standard";
    // Set 'isdraft' default to true if not specified.
    if (emailData.isdraft === undefined) {
      emailData.isdraft = true;
    }
    
    // Call the email service to send the marketing email.
    const result = await sendMarketingEmail(emailData);
    res.json(result);
  } catch (error) {
    logger.error("Error in /api/send-marketing-email endpoint:", error);
    res.status(500).json({ error: "Failed to send marketing email." });
  }
});

module.exports = router;
