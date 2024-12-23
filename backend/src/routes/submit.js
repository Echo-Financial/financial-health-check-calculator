const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure correct path
const Joi = require('joi');
const { calculateFinancialScores } = require('../utils/financialCalculations');

// Define Joi schema for validation
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
    }).required(),
    retirementPlanning: Joi.object({
        retirementAge: Joi.number().integer().min(18).required(),
        expectedAnnualIncome: Joi.number().min(0).required(),
        adjustForInflation: Joi.boolean().optional(),
    }).required(),
    contactInfo: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().min(1).required(),
        phone: Joi.string().optional(),
    }).required(),
});

// GET /api/submit
router.get('/submit', (req, res) => {
    res.status(200).json({ success: true, message: 'GET /api/submit is working!' });
});

// POST /api/submit
router.post('/submit', async (req, res) => {
    console.log('Received POST /api/submit request:', req.body); // Debugging log
    try {
        // Validate the request body
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const userData = value;

        // Perform financial calculations
        const financialScores = calculateFinancialScores(userData);

        // Create and save a new User document
        const user = new User({...userData, email: userData.contactInfo.email});
        await user.save();

        // Respond with financial scores
        res.json({ success: true, scores: financialScores });
    } catch (error) {
        console.error('Error in /submit route:', error);
        
        // Check if the error is a duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'A user with this email already exists. Please use a different email address.' 
            });
        }
        
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
