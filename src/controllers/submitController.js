// src/controllers/submitController.js

const FinancialData = require('../models/FinancialData'); // Import the FinancialData model
const {
    calculateNetWorth,
    calculateEmergencyFundCoverage,
    calculateRetirementReadiness,
    calculateCreditHealthScore,
    calculateOverallFinancialHealthScore
} = require('../utils/financialCalculations'); // Import calculation utilities
const { generateFinancialReport } = require('../services/pdfService'); // Import the PDF service

/**
 * Controller to handle financial data submission.
 */
const submitFinancialData = async (req, res, next) => {
    try {
        const {
            age,
            annualIncome,
            monthlyExpenses,
            totalDebt,
            totalAssets,
            emergencyFunds,
            currentRetirementSavings,
            targetRetirementSavings,
            retirementAge,
            expectedAnnualIncomeInRetirement,
            creditScore
        } = req.body;

        // Core Metrics Calculations
        const netWorth = calculateNetWorth(totalAssets, totalDebt);
        const emergencyFundCoverage = calculateEmergencyFundCoverage(emergencyFunds, monthlyExpenses);
        const retirementReadiness = calculateRetirementReadiness(currentRetirementSavings, targetRetirementSavings);
        const creditHealthScore = calculateCreditHealthScore(creditScore);

        // Financial Health Score
        const overallFinancialHealthScore = calculateOverallFinancialHealthScore({
            netWorth,
            emergencyFundCoverage,
            retirementReadiness,
            creditHealthScore
        });

        // Save the data and scores to the database
        const financialData = new FinancialData({
            age,
            annualIncome,
            monthlyExpenses,
            totalDebt,
            totalAssets,
            emergencyFunds,
            currentRetirementSavings,
            targetRetirementSavings,
            retirementAge,
            expectedAnnualIncomeInRetirement,
            creditScore,
            netWorth,
            emergencyFundCoverage,
            retirementReadiness,
            creditHealthScore,
            overallFinancialHealthScore
        });

        await financialData.save(); // Removed duplicate save

        // Generate PDF Report using the PDF Service
        const pdfData = await generateFinancialReport(null, { // no userId if no auth
            netWorth,
            emergencyFundCoverage, // Corrected typo
            retirementReadiness,
            creditHealthScore,
            overallFinancialHealthScore
        });

        // Optionally, you can send the PDF as a response or handle it as needed
        // For simplicity, we'll just send a success response with the data
        return res.status(200).json({
            success: true,
            message: 'Submission successful',
            data: {
                netWorth,
                emergencyFundCoverage,
                retirementReadiness,
                creditHealthScore,
                overallFinancialHealthScore
            }
        });
    } catch (error) {
        console.error("Error in submitFinancialData:", error);
        res.status(500).json({ message: "An internal server error occurred.", error: error.message });
    }
};

module.exports = {
    submitFinancialData
};
