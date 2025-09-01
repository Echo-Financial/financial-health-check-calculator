const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    // Contact basics
    firstName: String,
    lastName: String,
    fullName: String,
    email: { type: String, index: true },
    phone: String,

    // Consent audit
    consentGiven: { type: Boolean, default: false },
    consentText: String,
    consentAt: Date,

    // Attribution
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,
    gclid: String,
    referrer: String,
    landingPage: String,

    // Tech meta
    ip: String,
    userAgent: String,
    tenantId: String,

    // Calculation outputs (snapshot)
    scores: mongoose.Schema.Types.Mixed,
    calculatedMetrics: mongoose.Schema.Types.Mixed,

    // Raw input snapshot
    payload: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true, collection: 'leads' }
);

module.exports = mongoose.model('Lead', LeadSchema);

