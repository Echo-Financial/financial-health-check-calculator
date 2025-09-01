// backend/src/emailService.js
const sgMail = require('@sendgrid/mail');

const API_KEY = (process.env.SENDGRID_API_KEY || '').trim();
const SENDGRID_ENABLED = API_KEY.startsWith('SG.');

if (SENDGRID_ENABLED) {
  sgMail.setApiKey(API_KEY);
  console.log('[emailService] SendGrid enabled');
} else {
  console.warn('[emailService] SendGrid disabled: set SENDGRID_API_KEY (starts with "SG.") to enable sending.');
}

/**
 * Send a marketing email. In dev (no key), this is a no-op so the app can run.
 * @param {{ to: string, subject: string, text?: string, html?: string, from?: string }} opts
 */
async function sendMarketingEmail({ to, subject, text, html, from }) {
  if (!SENDGRID_ENABLED) {
    console.warn('[emailService] Skipping email send (SendGrid disabled).');
    return { skipped: true };
  }

  const msg = {
    to,
    from: from || process.env.EMAIL_FROM || 'no-reply@localhost',
    subject,
    text,
    html,
  };

  return sgMail.send(msg);
}

module.exports = { sendMarketingEmail, SENDGRID_ENABLED };
