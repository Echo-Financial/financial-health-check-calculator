// backend/src/routes/gpt.js

const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const logger = require('../logger');
require('dotenv').config({ path: './.env' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-o7BnJ50AOw4fqmu0UdbmTFbt",
  project: "proj_smoQRZKFchodKimx4S59JuND"
});

// Import the helper for client name extraction from gptUtils
const { extractClientName } = require('../utils/gptUtils');

/**
 * Generates more nuanced feedback for metrics with 5 tiers instead of 3.
 * For "Growth Opportunity" and "Potential for Improvement":
 *   - Lower scores are good (inverse metrics).
 * For all other metrics:
 *   - Higher scores are good.
 */
const generateFeedback = (metricName, score) => {
  // Handle inverse metrics (where lower scores are better)
  if (metricName === "Growth Opportunity" || metricName === "Potential for Improvement") {
    if (score < 20) {
      return `A score of ${score} for ${metricName} is exceptional. Your investment levels are very well aligned with recommended targets, indicating minimal room for improvement.`;
    } else if (score < 40) {
      return `A score of ${score} for ${metricName} is strong. Your investment strategy shows good alignment with targets, with only minor adjustments potentially needed.`;
    } else if (score < 60) {
      return `A score of ${score} for ${metricName} is moderate. There is meaningful room to enhance your investment strategy to better align with recommended targets for your profile.`;
    } else if (score < 80) {
      return `A score of ${score} for ${metricName} indicates a significant gap. Your current investment levels are considerably below recommended targets—focused attention in this area could substantially improve your long-term outcomes.`;
    } else {
      return `A score of ${score} for ${metricName} signals a critical gap. Your investment levels are substantially below recommended targets—prioritising this area could dramatically transform your financial trajectory.`;
    }
  }
  
  // Handle standard metrics (where higher scores are better)
  if (score >= 90) {
    return `A score of ${score} for ${metricName} is exceptional. This represents outstanding financial management that positions you strongly for the future.`;
  } else if (score >= 70) {
    return `A score of ${score} for ${metricName} is strong. You've established good practices in this area, with potential for further optimisation.`;
  } else if (score >= 50) {
    return `A score of ${score} for ${metricName} is moderate. While adequate, there's meaningful room for enhancement that could strengthen your overall financial position.`;
  } else if (score >= 30) {
    return `A score of ${score} for ${metricName} is concerning. This area requires attention to align with recommended financial practices and reduce potential vulnerability.`;
  } else {
    return `A score of ${score} for ${metricName} is critical and requires urgent attention. Immediate action in this area should be prioritised to establish financial stability.`;
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

  // Get personalised feedback for each metric
  const dtiFeedback = generateFeedback("Debt to Income Ratio", dtiScore);
  const savingsFeedback = generateFeedback("Savings", savingsScore);
  const emergencyFeedback = generateFeedback("Emergency Fund", emergencyFundScore);
  const retirementFeedback = generateFeedback("Retirement Preparedness", retirementScore);
  const growthFeedback = generateFeedback("Growth Opportunity", growthOpportunityScore);
  const improvementFeedback = generateFeedback("Potential for Improvement", potentialForImprovementScore);

  // Identify key strength and weakness areas
  const strengths = [];
  const weaknesses = [];
  
  // For standard metrics (higher is better)
  if (dtiScore >= 70) strengths.push("Debt to Income Ratio");
  else if (dtiScore < 40) weaknesses.push("Debt to Income Ratio");
  
  if (savingsScore >= 70) strengths.push("Savings");
  else if (savingsScore < 40) weaknesses.push("Savings");
  
  if (emergencyFundScore >= 70) strengths.push("Emergency Fund");
  else if (emergencyFundScore < 40) weaknesses.push("Emergency Fund");
  
  if (retirementScore >= 70) strengths.push("Retirement Preparedness");
  else if (retirementScore < 40) weaknesses.push("Retirement Preparedness");
  
  // For inverse metrics (lower is better)
  if (growthOpportunityScore < 30) strengths.push("Investment Alignment");
  else if (growthOpportunityScore > 60) weaknesses.push("Investment Alignment");
  
  if (potentialForImprovementScore < 30) strengths.push("Overall Strategy");
  else if (potentialForImprovementScore > 60) weaknesses.push("Overall Strategy");

  // Determine if investment/retirement focus is needed
  const needsInvestmentFocus = growthOpportunityScore > 50 || retirementScore < 50;
  const retirementUrgency = retirementScore < 40 ? "high" : (retirementScore < 70 ? "medium" : "low");

  // Use helper function for client name extraction
  const clientName = extractClientName(data);

  return `  
Disclaimer: This is a general financial assessment based on the information provided. For personalised advice, please consult with a licensed financial advisor.
-------------
The following information is provided for general educational purposes only and does not constitute professional financial advice. Please consult with a licensed financial advisor for personalised advice.

Context:
-------------
Please note that Echo Financial Advisors is a solo operation business SPECIALISING IN INVESTMENT STRATEGIES AND RETIREMENT PLANNING.

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

Client Name: ${clientName || "(Not provided)"}

IMPORTANT SCORE INTERPRETATION:
- For Retirement Score, Emergency Fund Score, and most metrics: HIGHER scores (closer to 100) are BETTER
- For Growth Opportunity Score and Potential for Improvement Score: HIGHER scores are WORSE (indicate MORE room for improvement)
- Debt-to-Income Score: This is a SCORE, not a percentage. Higher scores are better (73 is good, not 73%)

Key Strengths: ${strengths.join(', ') || 'None identified'}
Key Areas Needing Attention: ${weaknesses.join(', ') || 'None identified'}
Investment & Retirement Focus Needed: ${needsInvestmentFocus ? 'Yes (Priority)' : 'Yes (Maintenance)'}
Retirement Planning Urgency: ${retirementUrgency}

**Financial Benchmarks and Guidelines:**

- **Emergency Fund:** Should cover 3–6 months of living expenses.
- **Savings Rate:**
  - Under 30: 10% of income
  - 30–40: 15% of income
  - 40–50: 20% of income
  - 50+: 25% or more
- **Debt-to-Income Ratio (DTI):** Below 36 (excluding mortgage) is healthy; above 43 is concerning.
- **Retirement Savings:** Evaluate based on your retirement score, with a focus on long-term growth strategies.
- **Investment Target (as a Multiple of Annual Income):**
  - Under 30: 0.5× annual income
  - 30–40: 1× annual income
  - 40–50: 2× annual income
  - 50–60: 3× annual income
  - 60+: 5× annual income

Instructions:
-------------
Create a FINANCIAL REPORT (not an email) with these exact section headings:

1. **SECTION HEADING: "Personalised Financial Assessment"**
   - If client name is available, start with "${clientName}, your Overall Financial Health Score..."
   - If no client name is available, simply start with "Your Overall Financial Health Score..."
   - DO NOT use any email-style greetings like "Hi" or "Hello" or "I hope this finds you well"
   - DO NOT include any signature, sign-off, or contact information at the end
   - This is a REPORT PAGE, not an email message

2. **SECTION HEADING: "Analysis"**
   - Provide a balanced analysis of the financial situation using a supportive tone
   - IMPORTANT: When mentioning the Debt-to-Income ratio, remember that a score of 73 is GOOD (it does NOT mean the client has 73% debt-to-income)
   - Clearly explain what the scores mean, particularly for Growth Opportunity where higher is worse
   - Highlight the relationship between different financial metrics

3. **SECTION HEADING: "Actionable Insights"**
   - Provide specific, concrete recommendations but use percentage-based examples rather than actual dollar amounts
   - For example: "Establish an emergency fund covering 3-6 months of expenses" (without specifying dollar figures)
   - For savings recommendations, use the age-based percentages: "If you are 40-50, aim to save 20% of your income"
   - For investment recommendations, use the age-based multiples: "If you are 40-50, target investments equal to 2× your annual income"
   - Focus on investment and retirement planning strategies
   - Present these as bullet points for clarity
   
4. **SECTION HEADING: "Recommendations"**
   - Suggest a consultation focused on investment and retirement strategies
   - Use encouraging language emphasizing opportunity rather than urgency
   - Frame this as a partnership opportunity
   - DO NOT include any advisor signature, name, or contact information

FORMAT REQUIREMENTS:
- This is a FINANCIAL REPORT displayed on a webpage, not an email
- Use UK English spelling throughout (e.g., "personalised" not "personalized")
- Use the exact section headings specified above
- Total length should be 250-300 words
- NEVER include any email-style signatures or sign-offs
- Include the disclaimer at the top of the report
- DO NOT use specific dollar amounts from the client's data in your examples (use percentages and multipliers instead)

Ensure the tone is professional, empathetic, and encouraging while maintaining clear educational focus.
`;
};

router.post('/gpt', async (req, res) => {
  try {
    logger.info('Received POST /api/gpt request');
    const prompt = buildDynamicPrompt(req.body);
    // Log only the prompt length to avoid exposing full content
    logger.info(`Prompt built with length: ${prompt.length} characters`);

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
    res.status(500).json({ error: 'Submission failed. Please try again.' });
  }
});

module.exports = router;