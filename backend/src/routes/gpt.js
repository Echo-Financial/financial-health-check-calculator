const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const logger = require('../logger');
require('dotenv').config({ path: './.env' });
console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-o7BnJ50AOw4fqmu0UdbmTFbt",
  project: "proj_smoQRZKFchodKimx4S59JuND"
});

// Define the route for GPT-4o calls
router.post('/gpt', async (req, res) => {
  try {
    logger.info('Received POST /api/gpt request');
    const {
      dti,
      savingsRate,
      emergencyFund,
      retirement,
      growthOpportunity,
      potentialForImprovement,
      overallFinancialHealth,
      age,
      annualIncome,
      incomeFromInterest,
      incomeFromProperty,
      monthlyExpenses,
      totalDebt,
      savings,
      emergencyFunds,
      totalAssets,
      totalInvestments,
      currentRetirementSavings,
      targetRetirementSavings,
      retirementAge,
      creditScore,
      email,
      name,
      phone,
    } = req.body;

    // Build the enhanced prompt for GPT-4o
    const prompt = `You are a professional and empathetic financial assistant from Echo Financial Advisors Ltd. Your role is to provide general educational insights based on the financial scores provided. You must not refer to a team of advisors, and should refer to the advisor in the singular.

IMPORTANT REGULATORY NOTE (NZ):
"The following information is general guidance and does not constitute individualized financial advice. Please consult a licensed advisor for advice specific to your situation."

Instructions:
1. Begin with the above disclaimer.
2. Provide a brief summary of the user's financial scores, noting areas of strength and weakness, and use numerical values in your summarization.
3. For each major area (Debt to Income, Savings, Emergency Fund, Retirement, Growth Opportunity, and Potential for Improvement), provide 1-3 clear and concise improvement tips.
4. Ensure the entire response is professionally formatted with clear section headings and bullet lists.
5. End with a complete, persuasive call-to-action (CTA) that encourages the user to schedule a consultation with the qualified advisor at Echo Financial Advisors Ltd.
6.  Use the heading "Recommendations" before the call to action.
7.  Ensure the language used in the "Recommendations" section is unique and does not duplicate the language used in the "Next Steps" section.
8.  Do not use the phrase "our expert advisors" or any other language that suggests a team of advisors. Ensure the language used refers to a single advisor.
9. Keep the final response under 250 words and ensure it does not end abruptly.

User's Scores (out of 100, where 0 is the lowest and 100 is the highest):
- Debt to Income Ratio Score: ${dti} (A low score indicates higher debt relative to income, and a high score indicates lower debt relative to income)
- Savings Rate Score: ${savingsRate} (A low score indicates a low savings rate, and a high score indicates a high savings rate)
- Emergency Fund Score: ${emergencyFund} (A low score indicates a small emergency fund relative to expenses, and a high score indicates a large emergency fund relative to expenses)
- Retirement Score: ${retirement} (A low score indicates a low preparedness for retirement, and a high score indicates a high preparedness for retirement)
- Growth Opportunity Score: ${growthOpportunity} (A low score indicates fewer assets available for growth, and a high score indicates more assets available for growth)
- Potential for Improvement Score: ${potentialForImprovement} (A high score indicates a high potential for improvement across the other score areas, and a low score indicates less scope for improvement)
- Overall Financial Health Score: ${overallFinancialHealth} (A low score indicates a lower overall financial health, and a high score indicates a high overall financial health)


Please generate a complete, professionally formatted response that includes:
- A brief summary of the financial assessment that focuses on the numerical values of each score.
- Improvement tips for each major area in a numbered list that is relevant to the numerical values of the score.
- Use the heading "Recommendations" before the call to action.
- Ensure the language used in the "Recommendations" section is unique and does not duplicate the language used in the "Next Steps" section.
- Do not use the phrase "our expert advisors" or any other language that suggests a team of advisors.
- A persuasive and complete final sentence inviting the user to schedule a consultation with the qualified advisor.
`;

    // Make the request to OpenAI API with increased max_tokens
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500, // Increased token limit to avoid cutoff
      temperature: 0.7,
    });

    logger.info('Successfully fetched GPT Insights');
    res.json({ response: chatCompletion.choices[0].message.content });
  } catch (error) {
    logger.error('Error calling OpenAI:', error);
    console.error('Error calling OpenAI:', error);
    console.error("Error Object:", error);
    console.error('OpenAI Error Details:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

module.exports = router;