
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
    },
    retirementPlanning: {
        retirementAge: { type: Number, required: true },
        expectedAnnualIncome: { type: Number, required: true },
        adjustForInflation: { type: Boolean, default: false },
    },
    contactInfo: {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        phone: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
