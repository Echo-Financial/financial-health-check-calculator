const Joi = require('joi');

const userSchema = Joi.object({
     personalDetails: Joi.object({
        age: Joi.number().integer().min(18).required(),
        annualIncome: Joi.number().min(0).required(),
        incomeFromInterest: Joi.number().min(0).optional(),
        incomeFromProperty: Joi.number().min(0).optional(),
     }).required(),
    expensesAssets: Joi.object({
        monthlyExpenses: Joi.number().min(0).required(),
        emergencyFunds: Joi.number().min(0).required(),
        savings: Joi.number().min(0).required(),
        totalDebt: Joi.number().min(0).required(),
        totalInvestments: Joi.number().min(0).required(),
    }).required(),
    retirementPlanning: Joi.object({
        retirementAge: Joi.number().integer().min(18).required(),
        targetRetirementSavings: Joi.number().min(0).required(),
        currentRetirementSavings: Joi.number().min(0).required(), // <-- ADDED
        adjustForInflation: Joi.boolean().optional(),
    }).required(),
    contactInfo: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().min(1).required(),
        phone: Joi.string().optional(),
    }).required(),
});
module.exports = { userSchema };