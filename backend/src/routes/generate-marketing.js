// backend/src/routes/generate-marketing.js 
const express = require('express');
const { prepareMarketingPrompt, callOpenAIForMarketing } = require('../utils/gptUtils');
const { calculateCompleteFinancialProfile } = require('../utils/financialCalculations');
const { logAdviceGeneration, requiresManualReview } = require('../utils/complianceUtils');
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
    
    // If financialProfile doesn't exist, calculate it
    if (!financialData.financialProfile && financialData.originalData) {
      financialData.financialProfile = calculateCompleteFinancialProfile(financialData.originalData);
      logger.info('Financial profile calculated for marketing content');
    }
    
    // Generate the marketing prompt
    const marketingPrompt = prepareMarketingPrompt(financialData, analysisText);
    logger.info("Marketing prompt generated with length:", marketingPrompt.length);
    
    // Generate marketing content
    const marketingContent = await callOpenAIForMarketing(marketingPrompt);
    
    // Extract key recommendation data for compliance logging
    const recommendations = {
      monthlyInvestment: financialData.financialProfile.recommendations.monthlyInvestment,
      monthlyRetirementContribution: financialData.financialProfile.recommendations.monthlyRetirementContribution,
      adviceType: 'marketing'
    };
    
    // Log the marketing email for compliance purposes
    await logAdviceGeneration(
      'marketing',
      financialData,
      recommendations,
      JSON.stringify(marketingContent)
    );
    
    // Check if this marketing email needs review
    const needsReview = await requiresManualReview(
      financialData,
      recommendations,
      JSON.stringify(marketingContent),
      'marketing'
    );
    
    // Include the financial profile and compliance metadata in the response
    res.json({
      ...marketingContent,
      financialProfile: financialData.financialProfile,
      _compliance: {
        needsReview,
        adviceLogged: true,
        adviceType: 'marketing'
      }
    });
  } catch (error) {
    logger.error('Error in /api/generate-marketing:', error);
    res.status(500).json({ error: 'Failed to generate marketing content.' });
  }
});

module.exports = router;