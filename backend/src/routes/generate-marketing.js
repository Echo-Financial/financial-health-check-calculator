// backend/src/routes/generate-marketing.js
const express = require('express');
const { prepareMarketingPrompt, callOpenAIForMarketing } = require('../utils/gptUtils');
const { calculateCompleteFinancialProfile } = require('../utils/financialCalculations');
const logger = require('../logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    logger.info('Received POST /api/generate-marketing request');
    
    const financialData = req.body;
    const { analysisText } = financialData;
    
    if (!analysisText) {
      return res.status(400).json({ error: 'Missing analysisText in payload.' });
    }
    
    // Check if we already have a financial profile
    if (!financialData.financialProfile && financialData.originalData) {
      // Calculate complete financial profile to ensure consistency across outputs
      logger.info('Calculating complete financial profile for marketing content');
      financialData.financialProfile = calculateCompleteFinancialProfile(financialData.originalData);
    }
    
    // Use the updated prepareMarketingPrompt function which now accepts the financial profile
    const marketingPrompt = prepareMarketingPrompt(
      financialData, 
      analysisText
    );
    
    logger.info("Marketing prompt generated with length:", marketingPrompt.length);
    
    // Generate marketing content
    const marketingContent = await callOpenAIForMarketing(marketingPrompt);
    
    // Return both the marketing content and the financial profile for frontend reference
    res.json({
      ...marketingContent,
      financialProfile: financialData.financialProfile
    });
  } catch (error) {
    logger.error('Error in /api/generate-marketing:', error);
    // Provide more detailed error information
    const errorDetails = error.message || 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to generate marketing content.',
      details: errorDetails
    });
  }
});

module.exports = router;