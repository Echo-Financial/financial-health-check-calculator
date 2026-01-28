// backend/src/utils/gptUtils.js
const { generateText } = require('./openaiClient');
const { calculateCompleteFinancialProfile } = require('../utils/financialCalculations');
const logger = require('../logger');

/**
 * Extract and standardise client first name from any known payload shape.
 */
function extractClientName(data) {
  const candidates = [
    data?.contactInfo?.name,
    data?.personalDetails?.name,
    data?.originalData?.contactInfo?.name,
    data?.originalData?.personalDetails?.name,
  ];

  const full = candidates.find((v) => typeof v === 'string' && v.trim())?.trim() || '';
  if (!full) return '';
  return full.split(/\s+/)[0]; // first name only
}

/**
 * Standardise / enrich data used in prompts when running legacy paths.
 * NOTE: For marketing, we do NOT allow placeholders—marketing MUST use real computed values.
 */
function standardizeFinancialData(data) {
  const standardized = { ...data };

  if (!standardized.personalDetails) standardized.personalDetails = {};
  if (!standardized.calculatedMetrics) standardized.calculatedMetrics = {};

  // Avoid magic defaults where possible
  const pd = standardized.personalDetails;

  const age = Number(pd.age);
  if (!Number.isFinite(age) || age <= 0) pd.age = 35;

  // retirementAge might be nested in retirementPlanning
  const rpAge =
    standardized?.retirementPlanning?.retirementAge ??
    standardized?.originalData?.retirementPlanning?.retirementAge;

  const retirementAge = Number(rpAge);
  pd.retirementAge = Number.isFinite(retirementAge) && retirementAge > 0 ? retirementAge : 65;

  // clamp at 0 so we never generate negative years
  standardized.calculatedMetrics.yearsToRetirement = Math.max(0, pd.retirementAge - pd.age);

  // retirement target (optional)
  const rt =
    standardized?.retirementPlanning?.targetRetirementSavings ??
    standardized?.originalData?.retirementPlanning?.targetRetirementSavings;

  if (rt !== undefined && rt !== null && rt !== '') {
    const n = Number(rt);
    if (Number.isFinite(n) && n >= 0) standardized.calculatedMetrics.retirementTarget = n;
  }

  return standardized;
}

/**
 * Calls OpenAI to generate the detailed financial analysis report.
 * Returns plain text.
 */
async function callOpenAIForAnalysis(analysisData, analysisPrompt) {
  try {
    logger.info('[gptUtils] Calling OpenAI for detailed analysis...');
    const formattedAnalysisData = JSON.stringify(analysisData, null, 2);
    const input = `${analysisPrompt}\n\n${formattedAnalysisData}`;

    const text = await generateText({
      model: 'gpt-5',
      input,
      temperature: 0.7,
      max_output_tokens: 900,
    });

    if (!text) throw new Error('Empty analysis response from model');
    return text;
  } catch (error) {
    logger.error('[gptUtils] Error calling OpenAI for analysis:', error);
    throw new Error('Failed to get financial data analysis from OpenAI.');
  }
}

/**
 * Constructs prompt for personalised marketing email content.
 * HARD REQUIREMENT: marketing must use a real financialProfile (no placeholders).
 */
function prepareMarketingPrompt(analysisData, analysisText) {
  // Force compute financialProfile when missing
  const financialProfile =
    analysisData.financialProfile ||
    (analysisData.originalData ? calculateCompleteFinancialProfile(analysisData.originalData) : null);

  if (!financialProfile) {
    // This is deliberate: marketing must not ship “made up” dollar amounts.
    throw new Error('financialProfile is required to generate marketing content');
  }

  const formattedValues = financialProfile.formatted || {};
  const scores = financialProfile.scores || {};
  const projections = financialProfile.projections || {};
  const recommendations = financialProfile.recommendations || {};

  const clientName = extractClientName(analysisData) || 'there';

  const age = Number(analysisData?.originalData?.personalDetails?.age ?? analysisData?.personalDetails?.age);
  const safeAge = Number.isFinite(age) && age > 0 ? age : 35;

  const retirementAge = Number(
    analysisData?.originalData?.personalDetails?.retirementAge ??
      analysisData?.personalDetails?.retirementAge ??
      65
  );
  const safeRetAge = Number.isFinite(retirementAge) && retirementAge > 0 ? retirementAge : 65;

  const yearsToRetirement =
    projections?.retirement?.yearsToRetirement ?? Math.max(0, safeRetAge - safeAge);

  const dtiScore = scores.dtiScore ?? 50;
  const retirementScore = scores.retirementScore ?? 50;
  const growthOpportunityScore = scores.growthOpportunityScore ?? 50;
  const emergencyFundScore = scores.emergencyFundScore ?? 50;
  const overallScore = scores.overallFinancialHealthScore ?? 50;

  // stage
  let careerStage = 'mid career';
  if (safeAge < 35) careerStage = 'early career';
  else if (safeAge >= 50) careerStage = 'late career';

  const retirementUrgency = yearsToRetirement < 15 ? 'high' : yearsToRetirement < 30 ? 'medium' : 'low';

  const additionalPersuasion = `
Retirement Planning Recommendation:
Based on your current inputs, consider reviewing your retirement contributions and goals to ensure they align with your long‑term horizon and risk tolerance.

Investment Strategy Recommendation:
Your current investment position suggests there may be room to refine your strategy, contribution level, and diversification to better align with your objectives.

Important: This information is general in nature and does not take account of your personal circumstances. It is intended for long‑term investing (7–10+ years) and markets can be volatile in the short term. You should consider seeking independent financial, tax, and legal advice before acting.
`.trim();

  const prompt = `
You are an expert marketing copywriter for Echo Financial Advisors, an independent financial advisory service in New Zealand specialising in investment strategies and retirement planning.

**IMPORTANT DISCLOSURE TO INCLUDE:** This email provides general information only and does not take account of your personal circumstances. It is designed for long‑term investment horizons (7–10+ years) and markets can be volatile in the short term. You should consider seeking independent financial, tax, and legal advice before acting.

A client has just completed our Financial Health Check, and here is their detailed analysis report:
"${analysisText}"

Based on the client's financial data:
- Client's first name: "${clientName}" (use only the first name for a personal touch)
- Age: ${safeAge} (${careerStage})
- Retirement Age Goal: ${safeRetAge}
- Years until retirement: ${yearsToRetirement}
- Growth Opportunity Score: ${growthOpportunityScore} (HIGHER indicates MORE room for improvement)
- Retirement Score: ${retirementScore} (HIGHER is BETTER)
- Emergency Fund Score: ${emergencyFundScore} (HIGHER is BETTER)
- Overall Financial Health Score: ${overallScore}
- Debt-to-Income Score: ${dtiScore} (Higher is better; this is a score, not a %)

Their retirement urgency is: ${retirementUrgency}

Additional Context:
${additionalPersuasion}

CRITICAL PERSONALISATION INSTRUCTION:
You MUST personalise this email with the client's first name.
The greeting MUST be "Hi ${clientName},".

Return ONLY a JSON object with keys "subject", "body", and "cta":

{
  "subject": "Must begin with the client's first name (e.g. '${clientName}, ...')",
  "body": "Must begin with 'Hi ${clientName},' and include at least three specific financial details from their analysis (scores only). No signatures or email addresses.",
  "cta": "A clear call-to-action to book a free investment strategy consultation."
}

Do NOT include projections or promises of future performance. Do NOT use generic greetings. Do NOT include "I hope this email finds you well."
`.trim();

  return prompt;
}

/**
 * Calls OpenAI for marketing content.
 * Returns parsed JSON object { subject, body, cta }.
 */
async function callOpenAIForMarketing(prompt) {
  try {
    const text = await generateText({
      model: 'gpt-5',
      input: prompt,
      temperature: 0.7,
      max_output_tokens: 700,
    });

    logger.debug('[gptUtils] Raw OpenAI Response for marketing:', text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not locate JSON boundaries in GPT response.');

    const marketingContent = JSON.parse(jsonMatch[0]);

    if (typeof marketingContent?.subject !== 'string' || typeof marketingContent?.body !== 'string') {
      throw new Error('Invalid marketing JSON schema from GPT');
    }

    return marketingContent;
  } catch (error) {
    logger.error('[gptUtils] Error calling OpenAI for marketing content:', error);
    throw new Error('Failed to generate marketing content from OpenAI.');
  }
}

module.exports = {
  callOpenAIForAnalysis,
  prepareMarketingPrompt,
  callOpenAIForMarketing,
  standardizeFinancialData,
  extractClientName,
};
