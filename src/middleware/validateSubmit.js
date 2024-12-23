// src/middleware/validateSubmit.js

const Joi = require('joi');

/**
 * Simplified validation schema for financial data submission.
 */
const submitSchema = Joi.object({
    age: Joi.number().required().min(18).messages({
        'number.base': `"age" should be a number`,
        'number.min': `"age" must be at least 18`,
        'any.required': `"age" is required`
    }),
    annualIncome: Joi.number().required().min(0).messages({
        'number.base': `"annualIncome" should be a number`,
        'number.min': `"annualIncome" must be at least 0`,
        'any.required': `"annualIncome" is required`
    }),
    monthlyExpenses: Joi.number().required().min(0).messages({
        'number.base': `"monthlyExpenses" should be a number`,
        'number.min': `"monthlyExpenses" must be at least 0`,
        'any.required': `"monthlyExpenses" is required`
    }),
    totalDebt: Joi.number().required().min(0).messages({
        'number.base': `"totalDebt" should be a number`,
        'number.min': `"totalDebt" must be at least 0`,
        'any.required': `"totalDebt" is required`
    }),
    totalAssets: Joi.number().required().min(0).messages({
        'number.base': `"totalAssets" should be a number`,
        'number.min': `"totalAssets" must be at least 0`,
        'any.required': `"totalAssets" is required`
    }),
    emergencyFunds: Joi.number().required().min(0).messages({
        'number.base': `"emergencyFunds" should be a number`,
        'number.min': `"emergencyFunds" must be at least 0`,
        'any.required': `"emergencyFunds" is required`
    }),
    currentRetirementSavings: Joi.number().required().min(0).messages({
        'number.base': `"currentRetirementSavings" should be a number`,
        'number.min': `"currentRetirementSavings" must be at least 0`,
        'any.required': `"currentRetirementSavings" is required`
    }),
    targetRetirementSavings: Joi.number().required().min(0).messages({
        'number.base': `"targetRetirementSavings" should be a number`,
        'number.min': `"targetRetirementSavings" must be at least 0`,
        'any.required': `"targetRetirementSavings" is required`
    }),
    retirementAge: Joi.number().required().min(18).messages({
        'number.base': `"retirementAge" should be a number`,
        'number.min': `"retirementAge" must be at least 18`,
        'any.required': `"retirementAge" is required`
    }),
    expectedAnnualIncomeInRetirement: Joi.number().required().min(0).messages({
        'number.base': `"expectedAnnualIncomeInRetirement" should be a number`,
        'number.min': `"expectedAnnualIncomeInRetirement" must be at least 0`,
        'any.required': `"expectedAnnualIncomeInRetirement" is required`
    }),
    creditScore: Joi.number().required().min(300).max(850).messages({
        'number.base': `"creditScore" should be a number`,
        'number.min': `"creditScore" must be at least 300`,
        'number.max': `"creditScore" cannot exceed 850`,
        'any.required': `"creditScore" is required`
    })
});

const validateSubmit = (req, res, next) => {
    const { error } = submitSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateSubmit;
