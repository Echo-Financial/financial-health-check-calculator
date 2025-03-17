// testEmail.js
require('dotenv').config();
const { sendReviewNotification } = require('./src/emailNotification');

async function testEmail() {
  try {
    const result = await sendReviewNotification({
      reviewId: "test123",
      adviceType: "analysis",
      status: "approved",
      reviewerNotes: "Test notification email."
    });
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();
