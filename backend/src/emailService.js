// backend/src/emailService.js

const axios = require('axios');
const querystring = require('querystring'); // For URL encoding
const logger = require('./logger');

/**
 * Sends a marketing email campaign via VBOUT API.
 * @param {Object} emailData - Contains campaign details.
 * @param {string} emailData.name - The campaign name.
 * @param {string} emailData.subject - The email subject line.
 * @param {string} emailData.fromemail - The sender’s email address.
 * @param {string} emailData.from_name - The sender’s name.
 * @param {string} emailData.reply_to - The reply-to email address.
 * @param {string} emailData.body - The email body content.
 * @param {string} emailData.type - The campaign type (e.g., "standard").
 * @param {boolean} emailData.isscheduled - Whether the campaign should be scheduled.
 * @param {boolean} emailData.isdraft - Whether the campaign is saved as a draft.
 * @param {string} [emailData.scheduled_datetime] - The scheduled date and time (if isscheduled is true).
 * @returns {Promise<Object>} - The response from the VBOUT API.
 */
async function sendMarketingEmail(emailData) {
  const vboutApiKey = process.env.VBOUT_API_KEY;
  
  if (!vboutApiKey) {
    throw new Error("VBOUT_API_KEY is not defined in your environment variables.");
  }
  
  // Use the VBOUT endpoint for adding campaigns, with the API key in the query string.
  const url = `https://api.vbout.com/1/emailmarketing/addcampaign.json?key=${vboutApiKey}`;
  
  // Build the payload with all required parameters.
  const payload = {
    name: emailData.name || "Test Campaign",
    subject: emailData.subject,
    fromemail: emailData.fromemail || "info@example.com",
    from_name: emailData.from_name || "Your Advisor Name",
    reply_to: emailData.reply_to || "reply@example.com",
    body: emailData.body,
    type: emailData.type || "standard",
    isscheduled: emailData.isscheduled !== undefined ? emailData.isscheduled : false,
    isdraft: emailData.isdraft !== undefined ? emailData.isdraft : false,
    // Include scheduled_datetime if the campaign is scheduled
    ...(emailData.isscheduled && emailData.scheduled_datetime ? { scheduled_datetime: emailData.scheduled_datetime } : {})
    // Optionally include audiences or lists if required by your campaign settings.
  };

  // Convert the payload to URL-encoded format.
  const data = querystring.stringify(payload);

  try {
    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    logger.info("VBOUT API Response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      logger.error("Detailed Error from VBOUT API:", error.response.data);
    } else {
      logger.error("Error sending email:", error.message);
    }
    throw new Error("Failed to send marketing email via VBOUT.");
  }
}

module.exports = { sendMarketingEmail };
