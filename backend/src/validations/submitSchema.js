const Joi = require('joi');

const numbersNonNeg = (label) => Joi.number().min(0).required().label(label);
const numbersAge = Joi.number().min(18).required().label('age');
const creditScore = Joi.number().min(300).max(850).optional().allow(null, '').label('creditScore');
// Accept booleans and common string/number forms
const boolish = Joi.boolean()
  .truthy('true').truthy('True').truthy('TRUE').truthy(1).truthy('1').truthy('yes').truthy('on')
  .falsy('false').falsy('False').falsy('FALSE').falsy(0).falsy('0').falsy('no').falsy('off');

const submitSchema = Joi.object({
  personalDetails: Joi.object({
    age: numbersAge,
    annualIncome: numbersNonNeg('annualIncome'),
    incomeFromInterest: Joi.number().min(0).default(0),
    incomeFromProperty: Joi.number().min(0).default(0),
  }).required(),

  expensesAssets: Joi.object({
    monthlyExpenses: numbersNonNeg('monthlyExpenses'),
    emergencyFunds: numbersNonNeg('emergencyFunds'),
    savings: numbersNonNeg('savings'),
    totalDebt: numbersNonNeg('totalDebt'),
    totalInvestments: numbersNonNeg('totalInvestments'),
    totalAssets: Joi.number().min(0).optional(),
  }).required(),

  retirementPlanning: Joi.object({
    retirementAge: numbersAge,
    targetRetirementSavings: numbersNonNeg('targetRetirementSavings'),
    currentRetirementSavings: numbersNonNeg('currentRetirementSavings'),
    adjustForInflation: Joi.boolean().default(false),
  }).required(),

  contactInfo: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(1).required(),
    phone: Joi.string().allow('', null),
  }).required(),

  // New: permit consent and page metadata in the JSON body (optional)
  marketingConsent: boolish.optional(),
  consent: boolish.optional(),
  agreeMarketing: boolish.optional(),
  referrer: Joi.string().max(2048).allow('', null),
  landingPage: Joi.string().max(2048).allow('', null),
});

module.exports = submitSchema;
