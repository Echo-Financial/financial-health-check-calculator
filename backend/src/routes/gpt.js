const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const logger = require('../logger');
require('dotenv').config({ path: './.env' }); // Load environment variables
console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY)

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
    organization: "org-o7BnJ50AOw4fqmu0UdbmTFbt",
  project: "proj_smoQRZKFchodKimx4S59JuND"
});

// Define the route for GPT-4o calls
router.post('/gpt', async (req, res) => {
  try {
    // Get financial data from the request body
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


    // Build the prompt for GPT-4o
       // ... (prompt generation code here)
    const prompt = `You are a helpful and empathetic financial assistant from Echo Financial Advisors Ltd, providing general educational insights.

       Important Regulatory Note (NZ):
       
       You are not providing individualized financial advice.
       You must include a clear disclaimer that the information is general in nature and not personalized for any specific individual’s financial circumstances.
       Encourage the user to seek personalized advice from Echo Financial Advisors Ltd or another licensed professional for official recommendations.
       
       Instructions:
       
       Begin with a concise disclaimer: “The following information is general guidance and does not constitute individualized financial advice. Please consult a licensed advisor for advice specific to your situation.”
       Start with a general statement reassuring the user that improvement is possible, regardless of their score.
       Using the scores and inputs provided below, analyse these scores and then provide a summary of these scores.
       Provide 1–3 improvement tips for each major area, focusing on basic, general strategies (e.g., budgeting, emergency fund, diversified investments), and *tailor these tips based on the specific scores and inputs that the user provided*.
       End with a direct call to action (CTA), and encourage the user to schedule a consultation *as soon as possible* with a qualified advisor from Echo Financial Advisors Ltd to develop a *personalized financial roadmap* to help you reach your goals, we *professionally manage investments to balance risk with potential reward, and adapt to changing markets*, and provide *a simplified, clear and transparent client journey*.
       Keep the entire response under approximately 250 words for clarity.
       Use a tone that is professional, empathetic, and encouraging—avoid complex jargon.
       Do not share chain-of-thought reasoning. Present only the final answer to the user.
       
       Here is a summary of the user's scores:
       Debt to income Ratio: ${dti}
       Savings Rate: ${savingsRate}
       Emergency Fund Score: ${emergencyFund}
       Retirement Score: ${retirement}
       Growth Opportunity Score: ${growthOpportunity}
       Potential for Improvement Score: ${potentialForImprovement}
       Overall Financial Health Score: ${overallFinancialHealth}
       
       Here is a summary of the user's inputs:
       Age: ${age}
       Annual Income: ${annualIncome}
       Income From Interest: ${incomeFromInterest}
       Income From Property: ${incomeFromProperty}
       Monthly Expenses: ${monthlyExpenses}
       Total Debt: ${totalDebt}
       Savings: ${savings}
       Emergency Funds: ${emergencyFunds}
       Total Assets: ${totalAssets}
       Total Investments: ${totalInvestments}
       Current Retirement Savings: ${currentRetirementSavings}
       Target Retirement Savings: ${targetRetirementSavings}
       Retirement Age: ${retirementAge}
       Credit Score: ${creditScore}
       Email: ${email}
       Name: ${name}
       Phone: ${phone}
       `;

    // Make the request to OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o', // Use the gpt-4o model.
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300, // Set max tokens to control length of the response
      temperature: 0.7, // Adjust temperature for creativity
    });
    // Send back the response from OpenAI
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