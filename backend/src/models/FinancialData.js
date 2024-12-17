
// src/models/FinancialData.js

const mongoose = require('mongoose');

/**
 * FinancialData Schema
 * 
 * This schema defines the structure for storing financial data submitted by users.
 * Each financial data entry is associated with a user.
 */

const financialDataSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        totalAssets: { type: Number, required: true },
        totalLiabilities: { type: Number, required: true },
        totalMonthlyDebtPayments: { type: Number, required: true },
        grossMonthlyIncome: { type: Number, required: true },
        annualSavings: { type: Number, required: true },
        grossIncome: { type: Number, required: true },
        savings: { type: Number, required: true },
        monthlyExpenses: { type: Number, required: true },
        currentRetirementSavings: { type: Number, required: true },
        targetRetirementSavings: { type: Number, required: true },
        passiveIncome: { type: Number, required: true },
        essentials: { type: Number, required: true },
        discretionary: { type: Number, required: true },
        savingsAllocation: { type: Number, required: true },
        creditHealth: { type: Number, required: true },
        netWorth: { type: Number, required: true },
        dti: { type: Number, required: true },
        savingsRate: { type: Number, required: true },
        emergencyFundCoverage: { type: Number, required: true },
        retirementReadiness: { type: Number, required: true },
        financialIndependenceRatio: { type: Number, required: true },
        budgetAllocation: {
            essentialsDiff: { type: Number, required: true },
            discretionaryDiff: { type: Number, required: true },
            savingsDiff: { type: Number, required: true },
        },
        overallFinancialHealthScore: { type: Number, required: true },
        echoImprovementPotential: { type: Number, required: true },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('FinancialData', financialDataSchema);
