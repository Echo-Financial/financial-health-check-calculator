const User = require('../models/User');
const Lead = require('../models/Lead');
const Joi = require('joi');
const { calculateFinancialScores, calculateCompleteFinancialProfile } = require('../utils/financialCalculations');
const logger = require('../logger');
const { userSchema } = require('../validations');

// Helpers to safely pick email/phone from request
function pickEmail(req) {
  try {
    const v = (req.body?.contactInfo?.email || req.body?.email || req.query?.email || '').trim();
    return v || null;
  } catch (_) {
    return null;
  }
}

function pickPhone(req) {
  try {
    const v = (req.body?.contactInfo?.phone || req.body?.phone || '').trim();
    return v || null;
  } catch (_) {
    return null;
  }
}

// Ensure scalar values from possibly-array query/body params
function scalar(v) {
  if (v === undefined || v === null) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

async function submitUser(req, res, next) {
  logger.info('Received POST /api/submit request');
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      logger.error('Validation Error:', error.details[0].message);
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    
    const userData = value;
    
    // Calculate all financial metrics in one centralized place
    const completeProfile = calculateCompleteFinancialProfile(userData);
    
    // For backward compatibility, keep the scores in a top-level property
    const financialScores = completeProfile.scores;
    
    try {
      const user = new User(userData);
      await user.save();
      logger.info('User saved successfully', { userId: user._id, email: user.contactInfo.email });

      // Attempt to persist lead with UTM and consent audit (non-blocking for response path)
      try {
        const {
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
          gclid,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
        } = { ...req.query, ...(req.body.utm || {}) };

        const safeReferrer = scalar(req.body.referrer) ?? scalar(req.query.referrer);
        const safeLanding = scalar(req.body.landingPage) ?? scalar(req.query.landingPage);

        const utm = {
          utmSource: utmSource || utm_source || null,
          utmMedium: utmMedium || utm_medium || null,
          utmCampaign: utmCampaign || utm_campaign || null,
          utmTerm: utmTerm || utm_term || null,
          utmContent: utmContent || utm_content || null,
          gclid: gclid || null,
          referrer: safeReferrer,
          landingPage: safeLanding,
        };

        const consentGiven = Boolean(
          req.body.marketingConsent ||
          req.body.consent ||
          req.body.agreeMarketing ||
          (typeof req.query.consent === 'string' && req.query.consent.toLowerCase() === 'true')
        );
        const consentText = 'User consented to be contacted for financial advice and to receive their report.';
        const consentAt = consentGiven ? new Date() : undefined;

        const fullName = (userData && userData.contactInfo && userData.contactInfo.name) || null;
        let firstName = null;
        let lastName = null;
        if (fullName) {
          const parts = String(fullName).trim().split(/\s+/);
          firstName = parts[0] || null;
          lastName = parts.length > 1 ? parts.slice(1).join(' ') : null;
        }

        const email = pickEmail(req);
        const phone = pickPhone(req) || (userData && userData.contactInfo && userData.contactInfo.phone) || null;

        if (email) {
          const upsertDoc = {
            firstName,
            lastName,
            fullName,
            email,
            phone,

            consentGiven,
            consentText,
            consentAt: consentGiven ? new Date() : undefined,

            utmSource: utm.utmSource || null,
            utmMedium: utm.utmMedium || null,
            utmCampaign: utm.utmCampaign || null,
            utmTerm: utm.utmTerm || null,
            utmContent: utm.utmContent || null,
            gclid: utm.gclid || null,

            referrer: safeReferrer,
            landingPage: safeLanding,

            ip: req.ip,
            userAgent: req.headers['user-agent'] || null,

            scores: financialScores,
            calculatedMetrics: financialScores,
            payload: req.body,
          };

          const doc = await Lead.findOneAndUpdate(
            { email },
            { $set: upsertDoc },
            { upsert: true, new: true, setDefaultsOnInsert: true, timestamps: true }
          );
          console.log('[Lead] upserted', doc && doc._id ? doc._id.toString() : undefined, doc && doc.email);
        } else {
          console.warn('[Lead] no email found in submission; skipping lead save');
        }
      } catch (leadErr) {
        logger.warn('Lead upsert failed (non-blocking):', { error: leadErr && leadErr.message });
        console.error('[Lead] upsert error', leadErr && leadErr.message);
      }

      // Return enhanced response with complete profile data
      res.json({ 
        success: true, 
        scores: financialScores,
        financialProfile: completeProfile,
        originalData: userData
      });
    } catch (saveError) {
      if (saveError.code === 11000 && saveError.keyPattern && saveError.keyPattern.email === 1) {
        logger.warn('Duplicate email attempted', { email: userData.contactInfo.email });
        return res.status(400).json({ success: false, message: 'Email already registered.' });
      } else {
        logger.error('Database error during user creation:', saveError);
        return res.status(500).json({ success: false, message: 'Server error during user creation.' });
      }
    }
  } catch (error) {
    logger.error('Validation or calculation error:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { submitUser };
