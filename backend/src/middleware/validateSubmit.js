// src/middleware/validateSubmit.js

const Joi = require('joi');

/**
 * Defines the validation schema for financial data submission.
 */
const submitSchema = Joi.object({
    totalAssets: Joi.number().min(0).required().messages({
        'number.base': `"totalAssets" should be a type of 'number'`,
        'number.min': `"totalAssets" must be at least {#limit}`,
        'any.required': `"totalAssets" is a required field`
    }),
    totalLiabilities: Joi.number().min(0).required().messages({
        'number.base': `"totalLiabilities" should be a type of 'number'`,
        'number.min': `"totalLiabilities" must be at least {#limit}`,
        'any.required': `"totalLiabilities" is a required field`
    }),
    totalMonthlyDebtPayments: Joi.number().min(0).required().messages({
        'number.base': `"totalMonthlyDebtPayments" should be a type of 'number'`,
        'number.min': `"totalMonthlyDebtPayments" must be at least {#limit}`,
        'any.required': `"totalMonthlyDebtPayments" is a required field`
    }),
    grossMonthlyIncome: Joi.number().min(0).required().messages({
        'number.base': `"grossMonthlyIncome" should be a type of 'number'`,
        'number.min': `"grossMonthlyIncome" must be at least {#limit}`,
        'any.required': `"grossMonthlyIncome" is a required field`
    }),
    annualSavings: Joi.number().min(0).required().messages({
        'number.base': `"annualSavings" should be a type of 'number'`,
        'number.min': `"annualSavings" must be at least {#limit}`,
        'any.required': `"annualSavings" is a required field`
    }),
    grossIncome: Joi.number().min(0).required().messages({
        'number.base': `"grossIncome" should be a type of 'number'`,
        'number.min': `"grossIncome" must be at least {#limit}`,
        'any.required': `"grossIncome" is a required field`
    }),
    savings: Joi.number().min(0).required().messages({
        'number.base': `"savings" should be a type of 'number'`,
        'number.min': `"savings" must be at least {#limit}`,
        'any.required': `"savings" is a required field`
    }),
    monthlyExpenses: Joi.number().min(0).required().messages({
        'number.base': `"monthlyExpenses" should be a type of 'number'`,
        'number.min': `"monthlyExpenses" must be at least {#limit}`,
        'any.required': `"monthlyExpenses" is a required field`
    }),
    currentRetirementSavings: Joi.number().min(0).required().messages({
        'number.base': `"currentRetirementSavings" should be a type of 'number'`,
        'number.min': `"currentRetirementSavings" must be at least {#limit}`,
        'any.required': `"currentRetirementSavings" is a required field`
    }),
    targetRetirementSavings: Joi.number().min(0).required().messages({
        'number.base': `"targetRetirementSavings" should be a type of 'number'`,
        'number.min': `"targetRetirementSavings" must be at least {#limit}`,
        'any.required': `"targetRetirementSavings" is a required field`
    }),
    passiveIncome: Joi.number().min(0).required().messages({
        'number.base': `"passiveIncome" should be a type of 'number'`,
        'number.min': `"passiveIncome" must be at least {#limit}`,
        'any.required': `"passiveIncome" is a required field`
    }),
    essentials: Joi.number().min(0).max(100).required().messages({
        'number.base': `"essentials" should be a type of 'number'`,
        'number.min': `"essentials" must be at least {#limit}`,
        'number.max': `"essentials" must be less than or equal to {#limit}`,
        'any.required': `"essentials" is a required field`
    }),
    discretionary: Joi.number().min(0).max(100).required().messages({
        'number.base': `"discretionary" should be a type of 'number'`,
        'number.min': `"discretionary" must be at least {#limit}`,
        'number.max': `"discretionary" must be less than or equal to {#limit}`,
        'any.required': `"discretionary" is a required field`
    }),
    savingsAllocation: Joi.number().min(0).max(100).required().messages({
        'number.base': `"savingsAllocation" should be a type of 'number'`,
        'number.min': `"savingsAllocation" must be at least {#limit}`,
        'number.max': `"savingsAllocation" must be less than or equal to {#limit}`,
        'any.required': `"savingsAllocation" is a required field`
    }),
    creditHealth: Joi.number().min(300).max(850).required().messages({
        'number.base': `"creditHealth" should be a type of 'number'`,
        'number.min': `"creditHealth" must be at least {#limit}`,
        'number.max': `"creditHealth" must be less than or equal to {#limit}`,
        'any.required': `"creditHealth" is a required field`
    })
});

/**
 * Middleware to validate the financial data submission.
 */
const validateSubmit = (req, res, next) => {
    const { error } = submitSchema.validate(req.body);
    if (error) {
        // Customize error message based on validation failure
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateSubmit;
