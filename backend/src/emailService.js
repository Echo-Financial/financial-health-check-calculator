const sgMail = require('@sendgrid/mail');
const { marked } = require('marked');  // Updated import using destructuring
const logger = require('./logger');

// Set your SendGrid API key from environment variables.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends a personalized marketing email via SendGrid.
 * @param {Object} emailData - Contains campaign details.
 * @param {string} emailData.to - Recipient's email address.
 * @param {string} emailData.subject - The email subject line.
 * @param {string} emailData.body - The email body content in Markdown.
 * @param {string} [emailData.fromemail] - The sender’s email address.
 * @param {string} [emailData.from_name] - The sender’s name.
 * @param {string} [emailData.reply_to] - The reply-to email address.
 * @returns {Promise<Object>} - The response from SendGrid.
 */
async function sendMarketingEmail(emailData) {
  if (!emailData.to) {
    throw new Error("Recipient email (to) is missing.");
  }
  
  // Convert Markdown email body to HTML
  const htmlContent = marked(emailData.body);
  
  // Build the message object with both text and HTML fields.
  const msg = {
    to: emailData.to,
    from: {
      email: emailData.fromemail || "kevin.morgan@echo-financial-advisors.co.nz",
      name: emailData.from_name || "Kevin Morgan",
    },
    subject: emailData.subject,
    text: emailData.body,   // Fallback plain text version.
    html: htmlContent,      // HTML formatted version.
    replyTo: emailData.reply_to || "kevin.morgan@echo-financial-advisors.co.nz",
  };

  try {
    const response = await sgMail.send(msg);
    logger.info("SendGrid API Response:", response);
    return response;
  } catch (error) {
    if (error.response) {
      logger.error("Detailed Error from SendGrid API:", error.response.body);
    } else {
      logger.error("Error sending email:", error.message);
    }
    throw new Error("Failed to send marketing email via SendGrid.");
  }
}

module.exports = { sendMarketingEmail };
