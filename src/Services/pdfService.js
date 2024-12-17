// src/services/pdfService.js

const PDFDocument = require('pdfkit');
const logger = require('../config/logger'); // Import the logger

/**
 * Generates a financial report PDF based on the simplified metrics.
 *
 * @param {String} userId - The ID of the user.
 * @param {Object} metrics - The financial metrics to include in the report.
 * Expected metrics: { netWorth, emergencyFundCoverage, retirementReadiness, creditHealthScore, overallFinancialHealthScore }
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
            doc.fontSize(12)
                .text(`Net Worth: $${metrics.netWorth.toLocaleString()}`)
                .text(`Emergency Fund Coverage: ${metrics.emergencyFundCoverage.toFixed(2)} months`)
                .text(`Retirement Readiness: ${metrics.retirementReadiness.toFixed(2)}%`)
                .text(`Credit Health Score: ${metrics.creditHealthScore}`)
                .text(`Overall Financial Health Score: ${metrics.overallFinancialHealthScore}`)
                .moveDown();

            doc.fontSize(16).text('Recommendations', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12);

            if (metrics.overallFinancialHealthScore < 70) {
                doc.text('Consider consulting a financial advisor or reviewing your budget and savings strategies to improve your financial health.');
            } else {
                doc.text('Great job! Your financial health is in good shape. Keep maintaining your current strategies.');
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
