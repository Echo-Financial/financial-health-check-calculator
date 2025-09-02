const express = require('express');
const { sendMarketingEmail } = require('../emailService');
const { prepareMarketingPrompt, callOpenAIForMarketing } = require('../utils/gptUtils');
const logger = require('../logger');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Lightweight limiter: 10 requests / 15 minutes per IP
const marketingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(marketingLimiter);

router.post('/', async (req, res) => {
  try {
    let emailData = req.body;

    // If any of subject, body, or CTA are missing, generate them dynamically via GPT.
    if (!emailData.subject || !emailData.body || !emailData.cta) {
      // Verify that the necessary financial data is provided.
      if (
        !emailData.analysisText ||
        !emailData.personalDetails ||
        !emailData.calculatedMetrics
      ) {
        return res.status(400).json({
          error:
            "Missing required fields for dynamic marketing content generation (analysisText, personalDetails, calculatedMetrics).",
        });
      }
      
      // Merge contactInfo name into personalDetails so that GPT gets the client's name.
      if (emailData.contactInfo && emailData.contactInfo.name) {
        emailData.personalDetails.name = emailData.contactInfo.name;
      }
      
      // Prepare the marketing prompt using the provided financial data.
      const marketingPrompt = prepareMarketingPrompt(
        {
          personalDetails: emailData.personalDetails,
          calculatedMetrics: emailData.calculatedMetrics,
        },
        emailData.analysisText
      );
      logger.info("Generated marketing prompt:", marketingPrompt);
      
      // Call GPT to generate personalized marketing content.
      const marketingContent = await callOpenAIForMarketing(marketingPrompt);
      
      // Use GPT-generated subject.
        emailData.subject = marketingContent.subject;

    // Process the GPT-generated body:
        // Remove any unwanted placeholder text such as "[Your Name]".
        let rawBody = marketingContent.body.replace(/\[Your Name\]/g, "").trim();

        // Replace newline characters with <br> tags.
        const formattedBody = rawBody.replace(/\n+/g, '<br>');

        // Split the formatted body into paragraphs using <br> as a delimiter.
        const paragraphs = formattedBody.split(/<br\s*\/?>/).filter(p => p.trim() !== '');

        // Wrap each paragraph in <p> tags with extra margin for spacing.
        const spacedBody = paragraphs.map(p => `<p style="margin-bottom:20px;">${p.trim()}</p>`).join('');

        // Define a configurable styled link (displayed as a button) and signature block.
        const BOOKING_URL = process.env.BOOKING_URL || 'https://outlook.office.com/book/EchoFinancialAdvisorsLtd1@echo-financial-advisors.co.nz/';
        const hardCodedLink = `<p style='margin-bottom:20px;'><a href='${BOOKING_URL}' style='display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; text-align: center; text-decoration: none; border-radius: 5px;'>Book Your Free Consultation</a></p>`;
        const hardCodedSignature = "<p style='margin-bottom:20px;'>Best regards,<br>Kevin Morgan<br>Founder & Managing Director, Echo Financial Advisors<br>Email: kevin.morgan@echo-financial-advisors.co.nz<br>Phone: +6421667511</p>";

        // Combine the spaced GPT-generated body, GPT-generated CTA text (wrapped in its own paragraph), hard-coded link, and signature.
        emailData.body = spacedBody +
          "<p style='margin-bottom:20px;'>" + marketingContent.cta + "</p>" +
          hardCodedLink +
          hardCodedSignature;
    }
    
    // Update defaults for marketing email details.
    emailData.name = emailData.name || "Kevin Morgan";
    emailData.fromemail = emailData.fromemail || "kevin.morgan@echo-financial-advisors.co.nz";
    emailData.from_name = emailData.from_name || "Kevin Morgan";
    emailData.reply_to = emailData.reply_to || "kevin.morgan@echo-financial-advisors.co.nz";
    emailData.type = emailData.type || "standard";
    if (emailData.isdraft === undefined) {
      emailData.isdraft = true;
    }
    
    // Ensure the recipient's email is in the "to" field.
    if (!emailData.to && emailData.email) {
      emailData.to = emailData.email;
    }

    console.log("Received payload:", req.body);
    
    // Call the email service to send the marketing email via SendGrid.
    await sendMarketingEmail(emailData);
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Error in /api/send-marketing-email endpoint:", error?.message || error);
    return res.status(500).json({ success: false, message: 'Email send failed' });
  }
});

module.exports = router;
