// backend/src/utils/gptUtils.js
const openaiClient = require('./openaiClient');
const { calculateRequiredContribution } = require('../utils/financialCalculations');
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
 * This prompt now distinguishes between investment growth and retirement planning,
 * and it uses a dynamic calculated required monthly contribution.
 *
 * @param {Object} analysisData - The raw financial data.
 * @param {string} analysisText - The detailed financial analysis report.
 * @param {string} dynamicMonthlyContribution - The computed required monthly retirement contribution (e.g., "$200.45").
 * @returns {string} - The complete prompt to be sent to OpenAI.
 */
function prepareMarketingPrompt(analysisData, analysisText, dynamicMonthlyContribution) {
  // Standardise data to ensure consistency
  const standardizedData = standardizeFinancialData(analysisData);
  const { personalDetails, calculatedMetrics } = standardizedData;
  
  // Use only the first name for personalization
  const clientName = extractClientName(standardizedData) || "Client";
  
  // Extract detailed financial metrics
  const age = personalDetails.age || 35;
  const annualIncome = personalDetails.annualIncome 
    ? `$${Number(personalDetails.annualIncome).toLocaleString()}`
    : "your current income";
  const retirementAge = personalDetails.retirementAge || 65;
  const yearsToRetirement = calculatedMetrics.yearsToRetirement || (retirementAge - age);
  
  // FIX: Use dynamic retirement target from data with a text fallback instead of numeric fallback
  const retirementTarget = calculatedMetrics.retirementTarget;
  const formattedRetirementTarget = retirementTarget !== undefined 
    ? `$${Number(retirementTarget).toLocaleString()}`
    : "your retirement savings goal";
  
  // Compute a standard suggested monthly investment (fallback for general investments)
  const suggestedMonthlyInvestment = personalDetails.annualIncome 
    ? Math.round((personalDetails.annualIncome * 0.15) / 12)
    : 500;
  const formattedMonthlyInvestment = `$${Number(suggestedMonthlyInvestment).toLocaleString()}`;
  
  // Determine overall financial situation, retirement urgency, and investment focus
  let financialSituation = "moderate";
  const dtiScore = calculatedMetrics.dtiScore || calculatedMetrics.dti || 50;
  const retirementScore = calculatedMetrics.retirementScore || calculatedMetrics.retirement || 50;
  const growthOpportunityScore = calculatedMetrics.growthOpportunityScore || calculatedMetrics.growthOpportunity || 50;
  const emergencyFundScore = calculatedMetrics.emergencyFundScore || calculatedMetrics.emergencyFund || 50;
  const overallScore = calculatedMetrics.overallFinancialHealthScore || calculatedMetrics.overallFinancialHealth || 50;
  
  if ((retirementScore < 40 && emergencyFundScore < 40) || dtiScore < 30 || overallScore < 40 || growthOpportunityScore > 70) {
    financialSituation = "critical";
  } else if ((retirementScore > 70 && emergencyFundScore > 70 && dtiScore > 70 && overallScore > 70) && (growthOpportunityScore < 30)) {
    financialSituation = "strong";
  }
  
  const retirementUrgency = yearsToRetirement < 15 ? "high" : (yearsToRetirement < 30 ? "medium" : "low");
  
  let investmentFocus = "balanced";
  if (growthOpportunityScore > 70) {
    investmentFocus = "significant-opportunity";
  } else if (growthOpportunityScore > 40) {
    investmentFocus = "moderate-opportunity";
  } else {
    investmentFocus = "optimisation";
  }
  
  let careerStage = "";
  if (age < 35) careerStage = "early career";
  else if (age < 50) careerStage = "mid career";
  else careerStage = "late career";
  
  // Additional persuasion guidance with a clear distinction:
  const additionalPersuasion = `
Retirement Planning Recommendation:
Based on your current savings, target, and the time remaining until retirement, our calculations suggest that you should increase your monthly retirement contributions by approximately ${dynamicMonthlyContribution} to meet your retirement goal.

Investment Strategy Recommendation:
Additionally, your current investment portfolio is below the benchmark for your age group. We recommend evaluating your investment allocations to potentially increase your overall investments, ensuring they align with your long-term growth objectives.

Remember: Making incremental changes can prevent significant future losses. Many Kiwis have already secured a better financial future by taking these steps.
`;
  
  const prompt = `
You are an expert marketing copywriter for Echo Financial Advisors, an independent financial advisory service in New Zealand specialising in investment strategies and retirement planning.
A client has just completed our Financial Health Check, and here is their detailed analysis report:
"${analysisText}"

Based on the client's financial data:
- Client's first name: "${clientName}" (use only the first name for a personal touch)
- Age: ${age} (${careerStage})
- Annual Income: ${annualIncome}
- Retirement Age Goal: ${retirementAge}
- Years until retirement: ${yearsToRetirement}
- Retirement savings target: ${formattedRetirementTarget}
- Retirement Score: ${retirementScore} (HIGHER is BETTER)
- Growth Opportunity Score: ${growthOpportunityScore} (HIGHER indicates MORE room for improvement)
- Suggested monthly investment for general growth (standard): ${formattedMonthlyInvestment}

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
1. Include a SPECIFIC DOLLAR AMOUNT calculation showing potential growth:
   - For example: "Based on your current situation, increasing your monthly retirement contributions by just ${dynamicMonthlyContribution} could potentially grow your portfolio significantly by your retirement age of ${retirementAge}."
2. Include an EARLY/MID/LATE CAREER context based on their age.
3. Create ONE SPECIFIC "AHA" INSIGHT about their situation, comparing their investment rate to peers or highlighting a unique imbalance in their profile.

IMPORTANT MESSAGING GUIDELINES:
1. INVESTMENT & RETIREMENT EMPHASIS:
   - Focus on investment strategies and retirement planning as the core theme.
   - Highlight that proper investment strategies are essential for a secure retirement.
   - Mention Echo's expertise in crafting personalised investment portfolios aligned with retirement goals.
2. Adapt your messaging based on the client's retirement timeline:
   - High urgency: Emphasise phrases like "crucial adjustment period" and "strategic shifts needed now."
   - Medium urgency: Use phrases like "significant growth opportunity" and "time to build momentum."
   - Low urgency: Highlight "the extraordinary potential of compounding" and "early advantages."
3. Tailor investment messaging based on their Growth Opportunity score:
   - If Score > 70: "Your investment portfolio has substantial room for strategic enhancement..."
   - If Score between 40 and 70: "With some strategic adjustments, you could strengthen your position..."
   - If Score < 40: "Fine-tuning your already solid investment foundation could maximise returns..."
4. Select the appropriate CTA based on their financial health:
   - Critical: "Schedule your urgent investment & retirement strategy review"
   - Improvement needed: "Book your personalised investment portfolio analysis"
   - Strong position: "Explore retirement optimisation strategies with a complimentary consultation"
5. The subject line must directly address investment potential or retirement readiness and include the client's first name.

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