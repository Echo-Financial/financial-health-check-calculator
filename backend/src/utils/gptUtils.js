// backend/src/utils/gptUtils.js
const openaiClient = require('./openaiClient');
const { calculateRequiredContribution, calculateCompleteFinancialProfile } = require('../utils/financialCalculations');
const logger = require('../logger');

/**
 * Extracts and standardises client name from provided data.
 */
function extractClientName(data) {
  let name = "";
  // Check contactInfo first, since the "Name" input is stored there.
  if (data.contactInfo && typeof data.contactInfo.name === 'string' && data.contactInfo.name.trim()) {
    name = data.contactInfo.name.trim();
  } 
  // Fallback to personalDetails
  else if (data.personalDetails && typeof data.personalDetails.name === 'string' && data.personalDetails.name.trim()) {
    name = data.personalDetails.name.trim();
  } 
  // Check originalData for contactInfo
  else if (data.originalData && data.originalData.contactInfo && typeof data.originalData.contactInfo.name === 'string' && data.originalData.contactInfo.name.trim()) {
    name = data.originalData.contactInfo.name.trim();
  } 
  // Lastly, check originalData for personalDetails
  else if (data.originalData && data.originalData.personalDetails && typeof data.originalData.personalDetails.name === 'string' && data.originalData.personalDetails.name.trim()) {
    name = data.originalData.personalDetails.name.trim();
  }
  // Use only the first name for personalization (if available)
  return name.split(" ")[0] || name;
}

/**
 * Standardises financial data extraction to ensure consistency across prompts.
 */
function standardizeFinancialData(data) {
  // Create shallow copy to avoid modifying the original
  const standardized = { ...data };
  
  // Ensure proper structure exists
  if (!standardized.personalDetails) standardized.personalDetails = {};
  if (!standardized.calculatedMetrics) standardized.calculatedMetrics = {};
  
  // Standardise personal details
  const pd = standardized.personalDetails;
  pd.age = pd.age || 35;
  
  // Extract retirement age from either location
  if (standardized.retirementPlanning && standardized.retirementPlanning.retirementAge) {
    pd.retirementAge = standardized.retirementPlanning.retirementAge;
  } else if (standardized.originalData && standardized.originalData.retirementPlanning && standardized.originalData.retirementPlanning.retirementAge) {
    pd.retirementAge = standardized.originalData.retirementPlanning.retirementAge;
  } else {
    pd.retirementAge = 65;
  }
  
  // Calculate years to retirement
  standardized.calculatedMetrics.yearsToRetirement = pd.retirementAge - pd.age;
  
  // Extract retirement target from all possible data paths
  let retirementTarget = null;
  
  // Try all possible data paths where retirement target might be stored
  if (standardized.retirementPlanning && standardized.retirementPlanning.targetRetirementSavings !== undefined) {
    retirementTarget = standardized.retirementPlanning.targetRetirementSavings;
  } else if (standardized.originalData && standardized.originalData.retirementPlanning && 
      standardized.originalData.retirementPlanning.targetRetirementSavings !== undefined) {
    retirementTarget = standardized.originalData.retirementPlanning.targetRetirementSavings;
  }
  
  // Only set if we found a value (otherwise leave undefined for API consumers to handle)
  if (retirementTarget !== null) {
    standardized.calculatedMetrics.retirementTarget = retirementTarget;
  }
  
  return standardized;
}

/**
 * Calls the OpenAI API to generate a detailed financial analysis report.
 */
async function callOpenAIForAnalysis(analysisData, analysisPrompt) {
  try {
    logger.info('Calling OpenAI API for financial data analysis...');
    const formattedAnalysisData = JSON.stringify(analysisData, null, 2);
    const messageContent = `${analysisPrompt}\n\n${formattedAnalysisData}`;
    const chatCompletion = await openaiClient.chat.completions.create({
      model: 'gpt-4o', // Ensure the model name is up-to-date
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
 * Uses centralized calculated values for consistency when available, with fallback to legacy approach.
 *
 * @param {Object} analysisData - The raw financial data including financialProfile or originalData
 * @param {string} analysisText - The detailed financial analysis report
 * @param {string} [dynamicMonthlyContribution] - Optional: Monthly contribution amount (legacy parameter)
 * @returns {string} - The complete prompt to be sent to OpenAI
 */
function prepareMarketingPrompt(analysisData, analysisText, dynamicMonthlyContribution) {
  // Try to use the financialProfile if available, otherwise calculate it
  const financialProfile = analysisData.financialProfile || 
    (analysisData.originalData ? calculateCompleteFinancialProfile(analysisData.originalData) : null);
  
  let formattedValues = {};
  let scores = {};
  let projections = {};
  let recommendations = {};
  
  // If we have financial profile, use its formatted values and scores
  if (financialProfile) {
    formattedValues = financialProfile.formatted;
    scores = financialProfile.scores;
    projections = financialProfile.projections;
    recommendations = financialProfile.recommendations;
    logger.info('Using centralized financial profile data for marketing prompt');
  } else {
    // Legacy approach - use standardizedData
    logger.info('Using legacy data standardization for marketing prompt');
    const standardizedData = standardizeFinancialData(analysisData);
    scores = standardizedData.calculatedMetrics;
    
    // For backward compatibility - use the provided dynamicMonthlyContribution
    if (dynamicMonthlyContribution === undefined) {
      dynamicMonthlyContribution = "a recommended amount";
    }
    
    // Create minimal formatted values from standardized data
    const retirementTarget = scores.retirementTarget;
    formattedValues = {
      monthlyRetirementContribution: dynamicMonthlyContribution,
      retirementTarget: retirementTarget !== undefined 
        ? `$${Number(retirementTarget).toLocaleString()}`
        : "your retirement savings goal",
      monthlyInvestment: "$500", // Default value
      tenYearInvestmentGrowth: "$80,000", // Default approximation
      annualReturnPercent: "5%" // Standard assumption
    };
  }
  
  // Extract client name
  const clientName = extractClientName(analysisData) || "Client";
  
  // Extract personal details for age-based messaging
  const personalDetails = analysisData.originalData?.personalDetails || 
                        analysisData.personalDetails || {};
  const age = personalDetails.age || 35;
  const retirementAge = personalDetails.retirementAge || 65;
  
  // Determine career stage based on age
  let careerStage = "";
  if (age < 35) careerStage = "early career";
  else if (age < 50) careerStage = "mid career";
  else careerStage = "late career";
  
  // Extract financial scores for situational assessment
  const dtiScore = scores.dtiScore || scores.dti || 50;
  const retirementScore = scores.retirementScore || scores.retirement || 50;
  const growthOpportunityScore = scores.growthOpportunityScore || scores.growthOpportunity || 50;
  const emergencyFundScore = scores.emergencyFundScore || scores.emergencyFund || 50;
  const overallScore = scores.overallFinancialHealthScore || scores.overallFinancialHealth || 50;
  
  // Determine financial situation based on scores
  let financialSituation = "moderate";
  if ((retirementScore < 40 && emergencyFundScore < 40) || dtiScore < 30 || overallScore < 40 || growthOpportunityScore > 70) {
    financialSituation = "critical";
  } else if ((retirementScore > 70 && emergencyFundScore > 70 && dtiScore > 70 && overallScore > 70) && (growthOpportunityScore < 30)) {
    financialSituation = "strong";
  }
  
  // Determine retirement urgency
  const yearsToRetirement = projections.retirement?.yearsToRetirement || (retirementAge - age);
  const retirementUrgency = yearsToRetirement < 15 ? "high" : (yearsToRetirement < 30 ? "medium" : "low");
  
  // Determine investment focus
  let investmentFocus = "balanced";
  if (growthOpportunityScore > 70) {
    investmentFocus = "significant-opportunity";
  } else if (growthOpportunityScore > 40) {
    investmentFocus = "moderate-opportunity";
  } else {
    investmentFocus = "optimisation";
  }
  
  // Additional financial context for the prompt
  const additionalPersuasion = `
Retirement Planning Recommendation:
Based on your current savings, target, and the time remaining until retirement, our calculations suggest that you should increase your monthly retirement contributions by ${formattedValues.monthlyRetirementContribution} to meet your retirement goal.

Investment Strategy Recommendation:
Additionally, your current investment portfolio is below the benchmark for your age group. We recommend increasing your investments by ${formattedValues.monthlyInvestment} per month, ensuring they align with your long-term growth objectives.

Remember: Making incremental changes can prevent significant future losses. Many Kiwis have already secured a better financial future by taking these steps.
`;
  
  const prompt = `
You are an expert marketing copywriter for Echo Financial Advisors, an independent financial advisory service in New Zealand specialising in investment strategies and retirement planning.

**IMPORTANT DISCLOSURE TO INCLUDE:** The personalised insights provided are generated based on the information you've supplied and should be used for guidance only. While this tool offers valuable direction, it cannot replace the comprehensive advice of a financial professional who can consider your complete financial circumstances. We recommend discussing these results with an advisor before implementation.

A client has just completed our Financial Health Check, and here is their detailed analysis report:
"${analysisText}"

Based on the client's financial data:
- Client's first name: "${clientName}" (use only the first name for a personal touch)
- Age: ${age} (${careerStage})
- Retirement Age Goal: ${retirementAge}
- Years until retirement: ${yearsToRetirement}
- Growth Opportunity Score: ${growthOpportunityScore} (HIGHER indicates MORE room for improvement)
- Retirement Score: ${retirementScore} (HIGHER is BETTER)
- Emergency Fund Score: ${emergencyFundScore} (HIGHER is BETTER)
- Overall Financial Health Score: ${overallScore}

The client's overall financial situation appears to be: ${financialSituation}
Their retirement urgency is: ${retirementUrgency}
Their investment opportunity profile is: ${investmentFocus}

Additional Context:
${additionalPersuasion}

CRITICAL PERSONALISATION INSTRUCTION: You MUST personalise this email with the client's first name. The greeting MUST be "Hi ${clientName}," - do NOT use generic greetings like "Hi there." IF YOU FAIL TO USE THE CLIENT'S NAME, YOUR RESPONSE WILL BE REJECTED ENTIRELY.

Using this information, craft a personalized marketing email that sounds genuinely written by a human advisor. The email should aim to convert the client and must follow this JSON structure exactly (return only a JSON object with keys "subject", "body", and "cta"):

{
  "subject": "A compelling subject line that references a SPECIFIC aspect of the client's financial situation, and MUST begin with the client's first name (e.g. 'John, ...')",
  "body": "An engaging email body that MUST begin with 'Hi ${clientName},' and include AT LEAST THREE SPECIFIC FINANCIAL DETAILS from their analysis (e.g. specific dollar amounts, percentages, or years until retirement). The email should reference their Financial Health Check results, highlight key insights, and explain how I, as an independent financial advisor specialising in investment strategies and retirement planning, can help enhance their financial future. Include a local touch such as 'Join Kiwis from across New Zealand who have taken control of their retirement destiny through strategic investing.' Do NOT include email addresses or signatures in this response.",
  "cta": "A clear call-to-action, such as 'Click below to schedule a free investment strategy consultation and take the first step towards securing your retirement future.'"
}

To make this email truly persuasive and personalised:
1. Include THESE EXACT FINANCIAL RECOMMENDATIONS with specific dollar amounts:
   - Investment recommendation: "With a monthly investment of ${formattedValues.monthlyInvestment} and a ${formattedValues.annualReturnPercent} annual return, your portfolio could grow to approximately ${formattedValues.tenYearInvestmentGrowth} in 10 years."
   - Retirement recommendation: "By contributing ${formattedValues.monthlyRetirementContribution} monthly, you could reach your retirement target of ${formattedValues.retirementTarget} in ${yearsToRetirement} years."
   - DO NOT replace these specific dollar amounts with vague phrases like 'a recommended amount' or 'increasing your contributions'.
2. Include an EARLY/MID/LATE CAREER context based on their age.
3. Create ONE SPECIFIC "AHA" INSIGHT about their situation, comparing their investment rate to peers or highlighting a unique imbalance in their profile.

IMPORTANT MESSAGING GUIDELINES:
1. INVESTMENT & RETIREMENT EMPHASIS:
   - Focus on investment strategies and retirement planning as the core theme.
   - Highlight that proper investment strategies are essential for a secure retirement.
   - Mention Echo's expertise in crafting personalised investment portfolios aligned with retirement goals.
2. Adapt your messaging based on the client's retirement timeline:
   - High urgency: Emphasise phrases like "crucial adjustment period," "strategic shifts needed now," and "each month of delay could cost thousands in potential retirement savings."
   - Medium urgency: Use phrases like "significant growth opportunity," "time to build momentum," and "the sooner you act, the greater the potential benefit."
   - Low urgency: Highlight "the extraordinary potential of compounding," "early advantages," and "setting the foundation now can yield significant results later."
3. UNIQUE VALUE PROPOSITION:
   - Emphasize that Echo Financial Advisors offers "AI-powered insights with licensed professional expertise"
   - Mention the benefit of receiving "sophisticated financial analysis with personalized implementation guidance"
4. The subject line must directly address investment potential or retirement readiness and include the client's first name.

Ensure the tone is professional, empathetic, and encouraging. Craft a personalized marketing email that feels genuinely written by a human advisor, focused on Echo's specialities in investments and retirement planning. Do NOT include generic statements such as "I hope this email finds you well."
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
      max_tokens: 500,  // Increased from 300 to allow for more personalised content
      temperature: 0.7,
    });

    let responseText = chatCompletion.choices[0].message.content;
    logger.debug("Raw OpenAI Response for marketing:", responseText);

    // Use regex to extract valid JSON from the response.
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not locate JSON boundaries in GPT response.');
    }
    const jsonString = jsonMatch[0];
    let marketingContent;
    try {
      marketingContent = JSON.parse(jsonString);
    } catch (parseError) {
      logger.error('Error parsing JSON from GPT response:', parseError);
      throw new Error('Failed to parse JSON from GPT response.');
    }
    
    // Verify that the content starts with the client's name
    if (!marketingContent.body.startsWith('Hi ') && !marketingContent.body.startsWith('Hello ')) {
      logger.warn('Marketing email does not begin with proper personalised greeting');
    }
    
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
  standardizeFinancialData,
  extractClientName
};