// src/models/FinancialData.js

const mongoose = require('mongoose');

/**
 * Updated FinancialData Schema
 * 
 * This schema defines the structure for the simplified financial data
 * set and the new calculated metrics.
 */

const financialDataSchema = new mongoose.Schema(
    {
        // Removed user field since authentication is not implemented
        age: { type: Number, required: true },
        annualIncome: { type: Number, required: true },
        monthlyExpenses: { type: Number, required: true },
        totalDebt: { type: Number, required: true },
        totalAssets: { type: Number, required: true },
        emergencyFunds: { type: Number, required: true },
        currentRetirementSavings: { type: Number, required: true },
        targetRetirementSavings: { type: Number, required: true },
        retirementAge: { type: Number, required: true },
        expectedAnnualIncomeInRetirement: { type: Number, required: true },
        creditScore: { type: Number, required: true },
        netWorth: { type: Number, required: true },
        emergencyFundCoverage: { type: Number, required: true },
        retirementReadiness: { type: Number, required: true },
        creditHealthScore: { type: Number, required: true },
        overallFinancialHealthScore: { type: Number, required: true }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('FinancialData', financialDataSchema);
