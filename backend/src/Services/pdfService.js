// src/services/pdfService.js

const PDFDocument = require('pdfkit');
const logger = require('../config/logger'); // Import the logger

/**
 * Generates a financial report PDF.
 *
 * @param {String} userId - The ID of the user.
 * @param {Object} metrics - The financial metrics to include in the report.
 * @returns {Promise<Buffer>} - A promise that resolves to the PDF buffer.
 */
const generateFinancialReport = (userId, metrics) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            let buffers = [];

            // Collect the PDF data chunks
            doc.on('data', buffers.push.bind(buffers));

            // Resolve the promise when PDF generation is complete
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                logger.info(`PDF report generated for user ${userId}`);
                resolve(pdfData);
            });

            // PDF Content
            doc.fontSize(20).text('Financial Health Report', { align: 'center' });
            doc.moveDown();

            doc.fontSize(14).text(`User ID: ${userId}`);
            doc.text(`Date: ${new Date().toLocaleDateString()}`);
            doc.moveDown();

            doc.fontSize(16).text('Core Metrics', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).text(`Net Worth: $${metrics.netWorth.toLocaleString()}`);
            doc.text(`Debt-to-Income Ratio (DTI): ${metrics.dti}%`);
            doc.text(`Savings Rate: ${metrics.savingsRate}%`);
            doc.text(`Emergency Fund Coverage: ${metrics.emergencyFundCoverage} months`);
            doc.text(`Retirement Readiness: ${metrics.retirementReadiness}%`);
            doc.text(`Financial Independence Ratio: ${metrics.financialIndependenceRatio}%`);
            doc.moveDown();

            doc.fontSize(16).text('Advanced Metrics', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).text('Budget Allocation Differences:');
            doc.text(`- Essentials: ${metrics.budgetAllocation.essentialsDiff}%`);
            doc.text(`- Discretionary: ${metrics.budgetAllocation.discretionaryDiff}%`);
            doc.text(`- Savings: ${metrics.budgetAllocation.savingsDiff}%`);
            doc.moveDown();

            doc.fontSize(16).text('Scores', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).text(`Overall Financial Health Score: ${metrics.overallFinancialHealthScore}`);
            doc.text(`Echo Improvement Potential Score: ${metrics.echoImprovementPotential}`);
            doc.moveDown();

            doc.fontSize(16).text('Recommendations', { underline: true });
            doc.moveDown(0.5);
            if (metrics.overallFinancialHealthScore < 70) {
                doc.fontSize(12).text('Consider consulting a financial advisor to improve your financial health.');
            } else {
                doc.fontSize(12).text('Great job! Keep maintaining your financial health.');
            }

            // Finalize the PDF and end the stream
            doc.end();
        } catch (error) {
            logger.error(`Error generating PDF for user ${userId}: ${error.message}`);
            reject(error);
        }
    });
};

module.exports = {
    generateFinancialReport
};
