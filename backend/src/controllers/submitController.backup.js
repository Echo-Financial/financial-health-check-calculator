submitController.backup.js

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
const PDFDocument = require('pdfkit'); // Import pdfkit
const stream = require('stream'); // Node.js stream module

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

        // Generate PDF Report
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res
                .writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment;filename=Financial_Report.pdf',
                })
                .end(pdfData);
        });

        // PDF Content
        doc.fontSize(20).text('Financial Health Report', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text(`User ID: ${userId}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        doc.fontSize(16).text('Core Metrics', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Net Worth: $${netWorth.toLocaleString()}`);
        doc.text(`Debt-to-Income Ratio (DTI): ${dti}%`);
        doc.text(`Savings Rate: ${savingsRate}%`);
        doc.text(`Emergency Fund Coverage: ${emergencyFundCoverage} months`);
        doc.text(`Retirement Readiness: ${retirementReadiness}%`);
        doc.text(`Financial Independence Ratio: ${financialIndependenceRatio}%`);
        doc.moveDown();

        doc.fontSize(16).text('Advanced Metrics', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Budget Allocation Differences:`);
        doc.text(`- Essentials: ${budgetAllocation.essentialsDiff}%`);
        doc.text(`- Discretionary: ${budgetAllocation.discretionaryDiff}%`);
        doc.text(`- Savings: ${budgetAllocation.savingsDiff}%`);
        doc.moveDown();

        doc.fontSize(16).text('Scores', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Overall Financial Health Score: ${overallFinancialHealthScore}`);
        doc.text(`Echo Improvement Potential Score: ${echoImprovementPotential}`);
        doc.moveDown();

        doc.fontSize(16).text('Recommendations', { underline: true });
        doc.moveDown(0.5);
        if (overallFinancialHealthScore < 70) {
            doc.fontSize(12).text('Consider consulting a financial advisor to improve your financial health.');
        } else {
            doc.fontSize(12).text('Great job! Keep maintaining your financial health.');
        }

        // Finalize PDF file
        doc.end();

    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitFinancialData
};
