// src/controllers/submitController.js

const FinancialData = require('../models/FinancialData'); // Import the FinancialData model
const {
    calculateNetWorth,
    calculateDTI,
    calculateSavingsRate,
    calculateEmergencyFundCoverage,
    calculateRetirementReadiness,
    calculateFinancialIndependenceRatio,
    calculateBudgetAllocationCheck,
    calculateOverallFinancialHealthScore,
    calculateEchoImprovementPotential
} = require('../utils/financialCalculations'); // Import calculation utilities
const { generateFinancialReport } = require('../services/pdfService'); // Import the PDF service

/**
 * Controller to handle financial data submission.
 * Associates the data with the authenticated user's ID.
 */
const submitFinancialData = async (req, res, next) => {
    try {
        const userId = req.user.id; // Retrieved from authenticate middleware

        const {
            totalAssets,
            totalLiabilities,
            totalMonthlyDebtPayments,
            grossMonthlyIncome,
            annualSavings,
            grossIncome,
            savings,
            monthlyExpenses,
            currentRetirementSavings,
            targetRetirementSavings,
            passiveIncome,
            essentials,
            discretionary,
            savingsAllocation,
            creditHealth
        } = req.body;

        // Core Metrics Calculations
        const netWorth = calculateNetWorth(totalAssets, totalLiabilities);
        const dti = calculateDTI(totalMonthlyDebtPayments, grossMonthlyIncome);
        const savingsRate = calculateSavingsRate(annualSavings, grossIncome);
        const emergencyFundCoverage = calculateEmergencyFundCoverage(savings, monthlyExpenses);
        const retirementReadiness = calculateRetirementReadiness(currentRetirementSavings, targetRetirementSavings);
        const financialIndependenceRatio = calculateFinancialIndependenceRatio(passiveIncome, monthlyExpenses);

        // Advanced Metrics
        const budgetAllocation = calculateBudgetAllocationCheck(essentials, discretionary, savingsAllocation);

        // Financial Health Score
        const overallFinancialHealthScore = calculateOverallFinancialHealthScore({
            netWorth,
            dti,
            savingsRate,
            emergencyFundCoverage,
            retirementReadiness,
            financialIndependenceRatio,
            budgetAllocation,
            creditHealth
        });

        // Echo Improvement Potential Score
        const echoImprovementPotential = calculateEchoImprovementPotential({
            netWorth,
            dti,
            savingsRate,
            emergencyFundCoverage,
            retirementReadiness,
            financialIndependenceRatio,
            budgetAllocation,
            creditHealth
        });

        // Save the data and scores to the database
        const financialData = new FinancialData({
            user: userId,
            totalAssets,
            totalLiabilities,
            totalMonthlyDebtPayments,
            grossMonthlyIncome,
            annualSavings,
            grossIncome,
            savings,
            monthlyExpenses,
            currentRetirementSavings,
            targetRetirementSavings,
            passiveIncome,
            essentials,
            discretionary,
            savingsAllocation,
            creditHealth,
            netWorth,
            dti,
            savingsRate,
            emergencyFundCoverage,
            retirementReadiness,
            financialIndependenceRatio,
            budgetAllocation,
            overallFinancialHealthScore,
            echoImprovementPotential
        });

        await financialData.save();

        // Generate PDF Report using the PDF Service
        const pdfData = await generateFinancialReport(userId, {
            netWorth,
            dti,
            savingsRate,
            emergencyFundCoverage,
            retirementReadiness,
            financialIndependenceRatio,
            budgetAllocation,
            overallFinancialHealthScore,
            echoImprovementPotential
        });

        // Set response headers for PDF download
        res.set({
            'Content-Length': Buffer.byteLength(pdfData),
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename=Financial_Report.pdf',
        }).status(200).send(pdfData);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitFinancialData
};
