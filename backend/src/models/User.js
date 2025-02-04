const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    personalDetails: {
        age: { type: Number, required: true },
        annualIncome: { type: Number, required: true },
        incomeFromInterest: { type: Number, default: 0 },
        incomeFromProperty: { type: Number, default: 0 },
    },
    expensesAssets: {
        monthlyExpenses: { type: Number, required: true },
        emergencyFunds: { type: Number, required: true },
        savings: { type: Number, required: true },
        totalDebt: { type: Number, required: true },
        totalInvestments: { type: Number, required: true },
    },
    retirementPlanning: {
        retirementAge: { type: Number, required: true },
        targetRetirementSavings: { type: Number, required: true },
        currentRetirementSavings: { type: Number, required: true }, // <-- ADDED
        adjustForInflation: { type: Boolean, default: false },
    },
    contactInfo: {
        email: { type: String, required: true, /*unique: true*/ }, // unique constraint removed
        name: { type: String, required: true },
        phone: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);