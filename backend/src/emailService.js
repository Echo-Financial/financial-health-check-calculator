// backend/src/emailService.js
const sgMail = require('@sendgrid/mail');

const API_KEY = (process.env.SENDGRID_API_KEY || '').trim();
const SENDGRID_ENABLED = API_KEY.startsWith('SG.');
const PROVIDER_PREF = (process.env.EMAIL_PROVIDER || '').toLowerCase();

if (SENDGRID_ENABLED) {
  try {
    sgMail.setApiKey(API_KEY);
    console.log('[emailService] SendGrid initialized');
  } catch (e) {
    console.warn('[emailService] SendGrid init failed:', e?.message);
  }
} else {
  console.warn('[emailService] SendGrid disabled: set SENDGRID_API_KEY (starts with "SG.") to enable sending.');
}

console.log(`[emailService] Provider preference: ${PROVIDER_PREF || 'auto'}`);

function canUseGraph() {
  return (
    !!process.env.MS_TENANT_ID &&
    !!process.env.MS_CLIENT_ID &&
    !!process.env.MS_CLIENT_SECRET &&
    !!process.env.MS_SENDER
  );
}

function ensureGraphEnv() {
  const missing = [];
  if (!process.env.MS_TENANT_ID) missing.push('MS_TENANT_ID');
  if (!process.env.MS_CLIENT_ID) missing.push('MS_CLIENT_ID');
  if (!process.env.MS_CLIENT_SECRET) missing.push('MS_CLIENT_SECRET');
  if (!process.env.MS_SENDER) missing.push('MS_SENDER');
  if (missing.length) {
    throw new Error(`[emailService] Missing Graph env: ${missing.join(', ')}`);
  }
}

async function getGraphToken() {
  ensureGraphEnv();
  const url = `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`;
  const form = new URLSearchParams();
  form.set('client_id', process.env.MS_CLIENT_ID || '');
  form.set('client_secret', process.env.MS_CLIENT_SECRET || '');
  form.set('grant_type', 'client_credentials');
  form.set('scope', 'https://graph.microsoft.com/.default');

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.error('[emailService] Graph token error', resp.status, text.slice(0, 200));
    throw new Error(`Graph token error: ${resp.status}`);
  }
  const data = await resp.json();
  return data.access_token;
}

async function sendViaGraph({ to, subject, html, replyTo }) {
  const token = await getGraphToken();
  const sender = process.env.MS_SENDER;
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`;
  const body = {
    message: {
      subject,
      body: { contentType: 'HTML', content: html || '' },
      toRecipients: [{ emailAddress: { address: to } }],
      ...(replyTo ? { replyTo: [{ emailAddress: { address: replyTo } }] } : {}),
    },
    saveToSentItems: true,
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    console.error('[emailService] Graph sendMail error', resp.status, txt.slice(0, 200));
    throw new Error(`Graph sendMail ${resp.status}`);
  }
  console.log('[emailService] Graph sendMail 202 Accepted');
  return { provider: 'graph', status: 'sent' };
}

async function sendViaSendGrid({ to, subject, text, html, from, replyTo }) {
  const msg = {
    to,
    from: from || process.env.EMAIL_FROM || 'no-reply@localhost',
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  };
  await sgMail.send(msg);
  return { provider: 'sendgrid', status: 'sent' };
}

/**
 * Send a marketing email via configured provider.
 * Accepts either html or text; prefers html.
 */
async function sendMarketingEmail(payload) {
  const to = payload.to;
  const subject = payload.subject;
  const replyTo = payload.reply_to || payload.replyTo;
  const from = payload.fromemail || payload.from || process.env.EMAIL_FROM;
  const html = payload.html || payload.body || '';
  const text = payload.text || payload.body || '';
  if (!to) throw new Error('Recipient email (to) is missing.');

  // Choose provider
  if (PROVIDER_PREF === 'sendgrid' && SENDGRID_ENABLED) {
    return sendViaSendGrid({ to, subject, text, html, from, replyTo });
  }
  if (PROVIDER_PREF === 'graph' && canUseGraph()) {
    return sendViaGraph({ to, subject, html, replyTo });
  }
  if (canUseGraph()) {
    return sendViaGraph({ to, subject, html, replyTo });
  }
  if (SENDGRID_ENABLED) {
    return sendViaSendGrid({ to, subject, text, html, from, replyTo });
  }
  console.warn('[emailService] Email disabled: configure SendGrid or Microsoft Graph');
  return { provider: 'disabled', status: 'skipped' };
}

module.exports = { sendMarketingEmail, SENDGRID_ENABLED };
