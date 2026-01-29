const Joi = require('joi');

// Option A: direct email payload
const directSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().min(1).max(200).required(),
  body: Joi.string().min(1).max(20000).required(),
  cta: Joi.string().uri().optional(),
}).required().unknown(false);

// Option B: analysis-based generation
const analysisSchema = Joi.object({
  analysisText: Joi.string().min(1).max(20000).required(),
  personalDetails: Joi.object().optional(),
  calculatedMetrics: Joi.object().optional(),
  contactInfo: Joi.object({
    email: Joi.string().email().optional(),
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
  }).optional(),
}).required().unknown(false);

// Exactly one of the two schemas must match
const sendMarketingEmailSchema = Joi.alternatives().match('one').try(directSchema, analysisSchema);

module.exports = sendMarketingEmailSchema;

