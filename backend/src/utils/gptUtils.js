// backend/src/utils/gptUtils.js

const openaiClient = require('./openaiClient'); // Ensure this is correctly set up
const logger = require('../logger');

/**
 * Calls the OpenAI API to generate a detailed financial analysis report.
 */
async function callOpenAIForAnalysis(analysisData, analysisPrompt) {
  try {
    logger.info('Calling OpenAI API for financial data analysis...');
    const formattedAnalysisData = JSON.stringify(analysisData, null, 2);
    const messageContent = `${analysisPrompt}\n\n${formattedAnalysisData}`;
    const chatCompletion = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: messageContent }],
      max_tokens: 700,
      temperature: 0.7,
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    logger.error('Error calling OpenAI API for analysis:', error);
    throw new Error('Failed to get financial data analysis from OpenAI.');
  }
}

/**
 * Constructs a prompt for generating personalized marketing email content.
 */
function prepareMarketingPrompt(analysisData, analysisText) {
  const { personalDetails, calculatedMetrics } = analysisData;
  const { age, annualIncome, name } = personalDetails;
  const { retirementScore, investmentGap } = calculatedMetrics;
  
  // Use the provided name if it's non-empty; otherwise default to "there"
  const clientName = name && name.trim() ? name.trim() : "there";

  const prompt = `
You are an expert marketing copywriter for Echo Financial Advisors, an independent financial advisory service based in New Zealand.
A client has just completed our Financial Health Check, and here is their detailed analysis report:
"${analysisText}"

Based on the client's financial data:
- Name: ${clientName}
- Age: ${age}
- Annual Income: ${annualIncome}
- Retirement Score: ${retirementScore}
- Investment Gap: ${investmentGap}

Using this information, craft a personalized marketing email that sounds genuinely written by a human advisor. Avoid generic openings like "I hope this message finds you well." Instead, begin with a personalized greeting using the client's name (for example, "Hi ${clientName},"). The email should aim to convert the client and must follow this JSON structure exactly (return only a JSON object with no additional text):

{
  "subject": "A compelling subject line that highlights a key benefit (e.g., 'Unlock a Stronger Retirement Strategy Today')",
  "body": "An engaging email body that includes a personalized greeting, a brief introduction referencing their Financial Health Check, a personalized section highlighting key insights from the analysis report, and an explanation of how I, as an independent financial advisor, can help enhance their financial future. Include a local touch such as 'Join Kiwis from across New Zealand who have taken control of their financial destiny.'",
  "cta": "A clear call-to-action, such as 'Book a Free Consultation Now'"
}

Ensure the tone is professional, empathetic, and encouraging.
  `;
  return prompt.trim();
}
/**
 * Calls the OpenAI API to generate personalized marketing content using the provided prompt.
 */
async function callOpenAIForMarketing(prompt) {
  try {
    const chatCompletion = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    let responseText = chatCompletion.choices[0].message.content;
    console.log("Raw OpenAI Response:", responseText);

    // Attempt to extract valid JSON from the response.
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Could not locate JSON boundaries in GPT response.');
    }
    const jsonString = responseText.slice(jsonStart, jsonEnd + 1);
    const marketingContent = JSON.parse(jsonString);
    logger.info('Successfully generated marketing content from OpenAI.');
    return marketingContent;
  } catch (error) {
    logger.error('Error calling OpenAI API for marketing content:', error);
    throw new Error('Failed to generate marketing content from OpenAI.');
  }
}




module.exports = {
  callOpenAIForAnalysis,
  prepareMarketingPrompt,
  callOpenAIForMarketing,
};
