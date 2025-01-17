// backend/src/controllers/authController.js

const User = require('../models/User');
const Joi = require('joi');

// Joi schema for registration, using only contactInfo.email and contactInfo.name
const registerSchema = Joi.object({
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
    email: Joi.string().email().required(), // The unique user identifier
    name: Joi.string().min(1).required(),
    phone: Joi.string().optional(),
  }).required(),
});

//
// Register a new user without a password
//
async function registerUser(req, res, next) {
  try {
    // Validate the request body against the schema above
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Check if user with this contactInfo.email already exists
    const existingUser = await User.findOne({ 'contactInfo.email': value.contactInfo.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create a new user record
    const newUser = new User(value);
    await newUser.save();

    // Respond with success
    res.json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerUser,
};
