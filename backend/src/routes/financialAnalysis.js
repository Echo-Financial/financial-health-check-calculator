// backend/src/routes/financialAnalysis.js
const express = require('express');
const router = express.Router();
const { callOpenAIForAnalysis } = require('../utils/gptUtils');
const { 
  calculateCompleteFinancialProfile 
} = require('../utils/financialCalculations');
const { logAdviceGeneration, requiresManualReview } = require('../utils/complianceUtils');
const logger = require('../logger');

// Update the analysisPromptDraft9 function to use the financial profile
const analysisPromptDraft9 = (financialProfile) => {
  const { formatted, recommendations, projections } = financialProfile;
  
  return `
You are an expert financial analyst working for Echo Financial Advisors, a solo financial advisory business in New Zealand that SPECIALISES IN INVESTMENT STRATEGIES AND RETIREMENT PLANNING. Your task is to analyze the financial data provided by a user of our Financial Health Check Calculator and produce a detailed, personalised financial health report.

**GROWTH PROJECTIONS TO INCLUDE IN YOUR ANALYSIS:**

INVESTMENT GROWTH (Investing ${formatted.monthlyInvestment}/month with ${formatted.annualReturnPercent} annual return):
- Starting with $${projections.investment.initialInvestment.toLocaleString()}
- Could grow to approximately $${projections.investment.fiveYear.toLocaleString()} in 5 years
- Could grow to approximately $${formatted.tenYearInvestmentGrowth} in 10 years
- Could grow to approximately $${projections.investment.twentyYear.toLocaleString()} in 20 years

RETIREMENT PROJECTION:
- Current retirement savings: $${projections.retirement.currentSavings.toLocaleString()}
- Target retirement amount: ${formatted.retirementTarget}
- Years until retirement: ${projections.retirement.yearsToRetirement}
- Without additional contributions, current savings would grow to: $${projections.retirement.futureValueWithoutContributions.toLocaleString()}
- Shortfall without contributions: $${projections.retirement.shortfall.toLocaleString()} (${projections.retirement.shortfallPercent}% of target)
- Recommended monthly contribution: ${formatted.monthlyRetirementContribution}
- With recommended contributions, projected to reach: $${projections.retirement.totalWithContributions.toLocaleString()}

**Constraints and Guidelines:**

- **New Zealand Context:** Frame your analysis within the New Zealand financial landscape, using UK English spelling and terminology.
- **Solo Advisor Perspective:** Use singular references (e.g., "I" or "your solo advisor") rather than plural forms.
- **Professional Tone:** Provide authoritative, clear, and data-driven analysis.
- **Data-driven Analysis:** Focus on using the RAW FINANCIAL DATA (actual amounts, ages, etc.) rather than just the computed scores.
- **Urgency Elements:** Where appropriate, highlight the cost of delay or inaction (e.g., "Each month of delay potentially reduces your retirement savings by thousands of dollars due to lost compound growth").
- **Next Steps Focus:** Frame recommendations to naturally lead toward a consultation as the logical next step.
- **Score Interpretation:** Pay careful attention to how scores are interpreted:
  - For most metrics (Retirement, Emergency Fund, etc.): HIGHER scores (closer to 100) are BETTER.
  - For Growth Opportunity and Potential for Improvement: HIGHER scores are WORSE (indicate MORE room for improvement).
  - The Debt-to-Income (DTI) Score: This is a SCORE, not a percentage. A high score is GOOD and indicates a healthy debt level.

**Additional Calculation Context:**

Based on the user's retirement data:
- Current Retirement Savings (PV), Target Retirement Savings (FV), and Years Until Retirement (N) are used with an annual growth rate (r) of 5%.
- The required periodic contribution is computed using the formula:  
  PMT = ((FV - PV × (1 + 0.05)^N) × 0.05) / ((1 + 0.05)^N - 1)  
  The result is the annual contribution, which when divided by 12 gives a monthly contribution.
- For this user, the required monthly contribution is approximately ${formatted.monthlyRetirementContribution}.

**Output Structure (Ensure the report is concise and does not exceed 400 words):**

1. **Overall Financial Health Assessment** (2-3 sentences)
2. **Key Strengths** (1-2 areas, PRIORITISE investment/retirement strengths if present)
3. **Areas for Potential Improvement** (2-3 areas, PRIORITISE investment gaps and retirement planning issues)
4. **Summary of Recommended Next Steps:**  
   - Begin with a brief summary statement that encapsulates the overall direction.
   - Follow with 3-4 bullet points of actionable recommendations, each including specific dollar amounts.
   - When discussing investment recommendation, include this EXACT statement: "With monthly contributions of ${formatted.monthlyInvestment} and an annual return of ${formatted.annualReturnPercent}, your investments could grow to approximately ${formatted.tenYearInvestmentGrowth} in 10 years."
   - When discussing retirement recommendation, include this EXACT statement: "By contributing ${formatted.monthlyRetirementContribution} monthly with a ${projections.retirement.annualReturnPercent}% annual return, you could reach your retirement target of ${formatted.retirementTarget} in ${projections.retirement.yearsToRetirement} years."
   - End with a transition sentence such as: "Implementing these recommendations effectively would be the focus of an initial consultation."
`;
};

router.post('/', async (req, res) => {
  // Basic validation: ensure required keys exist
  if (!req.body || !req.body.originalData) {
    logger.error('Invalid request payload for financial analysis');
    return res.status(400).json({ error: 'Invalid request payload. Missing required data.' });
  }

  try {
    logger.info('Received POST /api/financial-analysis request');
    
    const financialData = req.body;
    const userData = financialData.originalData;
    
    // Use the centralized calculation function to ensure consistency
    const financialProfile = calculateCompleteFinancialProfile(userData);
    
    // Build the prompt with the comprehensive financial profile
    const updatedPrompt = analysisPromptDraft9(financialProfile);

    // Generate the analysis text from OpenAI
    const analysisText = await callOpenAIForAnalysis(financialData, updatedPrompt);
    
    // Extract key recommendations for compliance logging
    const recommendations = {
      monthlyContribution: financialProfile.recommendations.monthlyRetirementContribution,
      monthlyInvestment: financialProfile.recommendations.monthlyInvestment
    };
    
    // Log for compliance purposes
    logAdviceGeneration('detailed-analysis', financialData, recommendations);
    
    // Check if this needs review based on recommendation thresholds
    const needsReview = requiresManualReview(financialData, recommendations);
    
    // Return the analysis, financial profile, and compliance metadata
    res.json({
      analysis: analysisText,
      financialProfile: financialProfile,
      _compliance: { needsReview }
    });
  } catch (error) {
    logger.error('Error during report generation:', error);
    res.status(500).json({ error: 'Failed to generate financial analysis report.' });
  }
});

module.exports = router;