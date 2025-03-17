// backend/src/emailNotification.js
const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create the transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,  // e.g., smtp.gmail.com
  port: process.env.EMAIL_PORT,  // e.g., 587
  secure: process.env.EMAIL_SECURE === 'true', // true for port 465, false for others
  auth: {
    user: process.env.EMAIL_USER,       // Your email username
    pass: process.env.EMAIL_PASSWORD    // Your email password or App Password
  }
});

/**
 * Sends an admin notification email when flagged advice is detected.
 * @param {Object} reviewData - Data related to the review.
 * @returns {Promise}
 */
async function sendReviewNotification(reviewData) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,   // Sender address, e.g., noreply@yourdomain.com
    to: process.env.ADMIN_EMAIL,      // Admin email address (from your .env)
    subject: `Review Notification: ${reviewData.adviceType} flagged`,
    html: `
      <h3>Review Alert</h3>
      <p>The following advice has been flagged for review:</p>
      <pre>${JSON.stringify(reviewData, null, 2)}</pre>
      <p>Please log in to the admin dashboard to take action.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Review notification email sent:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Error sending review notification email:', error);
    throw new Error('Failed to send review notification email.');
  }
}

module.exports = {
  sendReviewNotification
};
