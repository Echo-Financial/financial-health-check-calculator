// backend/src/routes/generate-marketing.js
const express = require('express');
const { prepareMarketingPrompt, callOpenAIForMarketing } = require('../utils/gptUtils');
const { calculateRequiredContribution } = require('../utils/financialCalculations');
const logger = require('../logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const financialData = req.body;
    const { analysisText } = financialData;
    
    if (!analysisText) {
      return res.status(400).json({ error: 'Missing analysisText in payload.' });
    }
    
    // Calculate the required monthly contribution if possible
    let dynamicMonthlyContribution = "a recommended amount";
    try {
      // Extract necessary data for calculation
      if (financialData.originalData && 
          financialData.originalData.personalDetails && 
          financialData.originalData.retirementPlanning) {
        
        const { personalDetails, retirementPlanning } = financialData.originalData;
        const age = personalDetails.age || 35;
        const retirementAge = retirementPlanning.retirementAge || 65;
        const N = retirementAge - age;
        const PV = retirementPlanning.currentRetirementSavings || 0;
        const FV = retirementPlanning.targetRetirementSavings || 0;
        
        // Calculate the required annual contribution, then derive monthly contribution
        const requiredAnnualContribution = calculateRequiredContribution(PV, FV, N, 0.05);
        dynamicMonthlyContribution = `$${(requiredAnnualContribution / 12).toFixed(2)}`;
      }
    } catch (calcError) {
      logger.error('Error calculating monthly contribution:', calcError);
      // Fall back to text if calculation fails
    }
    
    const marketingPrompt = prepareMarketingPrompt(financialData, analysisText, dynamicMonthlyContribution);
    logger.info("Marketing prompt generated with length:", marketingPrompt.length);
    
    const marketingContent = await callOpenAIForMarketing(marketingPrompt);
    res.json(marketingContent);
  } catch (error) {
    logger.error('Error in /api/generate-marketing:', error);
    res.status(500).json({ error: 'Failed to generate marketing content.' });
  }
});

module.exports = router;