// backend/src/routes/generate-marketing.js

const express = require('express');
const { prepareMarketingPrompt, callOpenAIForMarketing } = require('../utils/gptUtils');
const logger = require('../logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const financialData = req.body;
    const { analysisText } = financialData;
    if (!analysisText) {
      return res.status(400).json({ error: 'Missing analysisText in payload.' });
    }
    const marketingPrompt = prepareMarketingPrompt(financialData, analysisText);
    logger.info("Marketing prompt generated:", marketingPrompt);
    const marketingContent = await callOpenAIForMarketing(marketingPrompt);
    res.json(marketingContent);
  } catch (error) {
    logger.error('Error in /api/generate-marketing:', error);
    res.status(500).json({ error: 'Failed to generate marketing content.' });
  }
});

module.exports = router;
