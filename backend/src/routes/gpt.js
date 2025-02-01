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
    const prompt = `You are a professional and empathetic financial assistant from Echo Financial Advisors Ltd. Your role is to provide general educational insights based on the financial scores and inputs provided. 

IMPORTANT REGULATORY NOTE (NZ):
"The following information is general guidance and does not constitute individualized financial advice. Please consult a licensed advisor for advice specific to your situation." 

Instructions:
1. Begin with the above disclaimer.
2. Provide a brief summary of the user's financial scores and inputs.
3. For each major area (Debt to Income, Savings, Emergency Fund, Retirement, Growth Opportunity, and Potential for Improvement), provide 1–3 clear and concise improvement tips. Format these tips as a numbered list.
4. Ensure the entire response is professionally formatted with clear section headings.
5. End with a complete, persuasive call-to-action (CTA) that encourages the user to schedule a consultation with a qualified advisor at Echo Financial Advisors Ltd.
6. Keep the final response under 250 words and ensure it does not end abruptly.

User's Scores:
- Debt to Income Ratio: ${dti}
- Savings Rate: ${savingsRate}
- Emergency Fund Score: ${emergencyFund}
- Retirement Score: ${retirement}
- Growth Opportunity Score: ${growthOpportunity}
- Potential for Improvement Score: ${potentialForImprovement}
- Overall Financial Health Score: ${overallFinancialHealth}

User's Inputs:
- Age: ${age}
- Annual Income: ${annualIncome}
- Income From Interest: ${incomeFromInterest}
- Income From Property: ${incomeFromProperty}
- Monthly Expenses: ${monthlyExpenses}
- Total Debt: ${totalDebt}
- Savings: ${savings}
- Emergency Funds: ${emergencyFunds}
- Total Assets: ${totalAssets}
- Total Investments: ${totalInvestments}
- Current Retirement Savings: ${currentRetirementSavings}
- Target Retirement Savings: ${targetRetirementSavings}
- Retirement Age: ${retirementAge}
- Credit Score: ${creditScore}
- Email: ${email}
- Name: ${name}
- Phone: ${phone}

Please generate a complete, professionally formatted response that includes:
- A brief summary of the financial assessment.
- Improvement tips for each major area in a numbered list.
- A persuasive and complete final sentence inviting the user to schedule a consultation.
- Please generate a complete response in Markdown format with clear headings, bullet lists for improvement tips, and a final call to action.
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
