// backend/src/routes/gpt.js

const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const logger = require('../logger');
require('dotenv').config({ path: './.env' });
console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-o7BnJ50AOw4fqmu0UdbmTFbt",
  project: "proj_smoQRZKFchodKimx4S59JuND"
});

/**
 * Generates feedback for metrics.
 * For "Growth Opportunity" and "Potential for Improvement":
 *   - Lower scores are good.
 * For all other metrics:
 *   - Higher scores are good.
 */
const generateFeedback = (metricName, score) => {
  if (metricName === "Growth Opportunity" || metricName === "Potential for Improvement") {
    if (score < 40) {
      return `A score of ${score} for ${metricName} is outstanding. It indicates very little room for further improvement.`;
    } else if (score >= 40 && score <= 70) {
      return `A score of ${score} for ${metricName} suggests there is some room for improvement.`;
    } else {
      return `A score of ${score} for ${metricName} indicates a significant gap relative to the target—consider taking focused actions to boost your investment levels.`;
    }
  }
  
  if (score < 40) {
    return `A score of ${score} for ${metricName} is concerning and indicates an urgent need for improvement. Immediate action is recommended.`;
  } else if (score >= 40 && score <= 70) {
    return `A score of ${score} for ${metricName} suggests there is potential for improvement. Consider incremental adjustments to strengthen this area.`;
  } else {
    return `A score of ${score} for ${metricName} is outstanding. Continue with your current strategy to maintain this excellent performance.`;
  }
};

const buildDynamicPrompt = (data) => {
  const dtiScore = data.dtiScore || data.dti;
  const savingsScore = data.savingsScore || data.savingsRate;
  const emergencyFundScore = data.emergencyFundScore || data.emergencyFund;
  const retirementScore = data.retirementScore || data.retirement;
  const growthOpportunityScore = data.growthOpportunityScore || data.growthOpportunity;
  const potentialForImprovementScore = data.potentialForImprovementScore || data.potentialForImprovement;
  const overallFinancialHealthScore = data.overallFinancialHealthScore || data.overallFinancialHealth;

  const dtiFeedback = generateFeedback("Debt to Income Ratio", dtiScore);
  const savingsFeedback = generateFeedback("Savings", savingsScore);
  const emergencyFeedback = generateFeedback("Emergency Fund", emergencyFundScore);
  const retirementFeedback = generateFeedback("Retirement Preparedness", retirementScore);
  const growthFeedback = generateFeedback("Growth Opportunity", growthOpportunityScore);
  const improvementFeedback = generateFeedback("Potential for Improvement", potentialForImprovementScore);

  return `
Disclaimer:
-------------
The following information is provided for general educational purposes only and does not constitute professional financial advice. It is not tailored to your specific circumstances. Please consult with a licensed financial advisor for personalised advice.

Context:
-------------
Please note that Echo Financial Advisors is a solo operation business. When crafting your narrative, use singular references (e.g. "I" or "your solo advisor") rather than plural references like "our advisors."

Financial Assessment Summary:
------------------------------
Based on your input, here are your personalised financial scores along with detailed feedback:

• Debt to Income Ratio Score: ${dtiScore}
  - ${dtiFeedback}

• Savings Score: ${savingsScore}
  - ${savingsFeedback}

• Emergency Fund Score: ${emergencyFundScore}
  - ${emergencyFeedback}

• Retirement Preparedness Score: ${retirementScore}
  - ${retirementFeedback}

• Growth Opportunity Score: ${growthOpportunityScore}
  - ${growthFeedback}

• Potential for Improvement Score: ${potentialForImprovementScore}
  - ${improvementFeedback}

Overall Financial Health Score: ${overallFinancialHealthScore}

Instructions:
-------------
Please craft a professional, authoritative narrative tailored for the New Zealand market (using UK English). Your narrative should include:

1. **Analysis:**
   - Provide a concise summary of the user's financial situation, utilising the Overall Financial Health Score.
   - Highlight key strengths (e.g. a Debt to Income Ratio score of 100 is exceptional) and note that scores above 90 are outstanding, while scores below 20 require immediate attention.
   - Clearly explain that a high Growth Opportunity Score indicates that the user's investment levels are significantly below the recommended target and represent a major area for improvement.

2. **Actionable Insights:**
   - For each metric with a low score (or, in the case of Growth Opportunity, a high score), provide 1-2 specific, actionable tips.
   - For metrics with excellent scores, include a brief congratulatory note and advice to maintain that strength.

3. **Recommendations:**
   - Conclude with a clear call-to-action recommending that the user book a consultation with Echo Financial Advisors for personalised advice.
   - **Important:** If the user's retirement score is very high (indicating strong retirement readiness) and the Growth Opportunity score is very low (indicating investments are well aligned with targets), suggest that the consultation is primarily for maintenance and optimisation. Conversely, if the retirement score is low or the Growth Opportunity score is high, emphasise the need for proactive, urgent advice.

Output Format: The narrative must be in plain text using UK English, well-organised with clear headings (such as "Analysis", "Actionable Insights", and "Recommendations"), use bullet points where appropriate, and be under 250 words.
`;
};

router.post('/gpt', async (req, res) => {
  try {
    logger.info('Received POST /api/gpt request');
    const prompt = buildDynamicPrompt(req.body);
    logger.info("Prompt built:", prompt);

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    logger.info('Successfully fetched GPT Insights');
    res.json({ response: chatCompletion.choices[0].message.content });
  } catch (error) {
    logger.error('Error calling OpenAI:', error);
    if (error.response) {
      logger.error('OpenAI response error:', error.response.status, error.response.data);
    }
    console.error('Error details:', error);
    res.status(500).json({ error: 'Submission failed. Please try again.' });
  }
});

module.exports = router;
