const User = require('../models/User');
const Joi = require('joi');
const { calculateFinancialScores } = require('../utils/financialCalculations');

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
        adjustForInflation: Joi.boolean().optional(),
    }).required(),
    contactInfo: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().min(1).required(),
        phone: Joi.string().optional(),
    }).required(),
});

async function submitUser(req, res, next) {
    console.log('Received POST /api/submit request:', req.body);
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            console.error('Validation Error:', error.details[0].message);
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const userData = value;

        // Perform financial calculations
        const financialScores = calculateFinancialScores(userData);

        // Create and save a new User document
        const user = new User(userData);
        await user.save();

        // Respond with financial scores
        res.json({ success: true, scores: financialScores });

    } catch (error) {
        console.error('Error in /submit route:', error);
       return res.status(400).json({ success: false, message: error.message }); // Modified to return raw error message
        next(error);
    }
}

module.exports = { submitUser };