// backend/src/utils/gptUtils.js
const openaiClient = require('./openaiClient'); // Import OpenAI client
const logger = require('../logger');

async function callOpenAIForAnalysis(analysisData, analysisPrompt) { // Changed parameter name
  try {
    logger.info('Calling OpenAI API for financial data analysis...');

    // Log the analysisData to verify it's being received correctly
    console.log('analysisData in callOpenAIForAnalysis:', analysisData);

    // Construct the message content.  Format the JSON nicely.
    const formattedAnalysisData = JSON.stringify(analysisData, null, 2); // Stringify analysisData
    const messageContent = `${analysisPrompt}\n\n${formattedAnalysisData}`;

    // Log the complete message content being sent to OpenAI
    console.log('Message content sent to OpenAI:', messageContent);

    const chatCompletion = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: messageContent }], // Use the combined content
      max_tokens: 700,
      temperature: 0.7,

    });

    const analysisText = chatCompletion.choices[0].message.content;
    logger.info('Successfully received financial data analysis from OpenAI.');
    return analysisText;

  } catch (error) {
    logger.error('Error calling OpenAI API for analysis:', error);
    if (error.response) {
      logger.error('OpenAI API response error:', error.response.status, error.response.data);
    }
    throw new Error('Failed to get financial data analysis from OpenAI.');
  }
}

module.exports = { callOpenAIForAnalysis };