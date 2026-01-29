// backend/src/routes/financialAnalysis.js
const express = require('express');
const router = express.Router();

const { callOpenAIForAnalysis } = require('../utils/gptUtils');
const { calculateCompleteFinancialProfile } = require('../utils/financialCalculations');
const { logAdviceGeneration, requiresManualReview } = require('../utils/complianceUtils');
const logger = require('../logger');
const { ok, fail } = require('../utils/apiResponse');

const safeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const scoreBand = (score) => {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'stable';
  if (score >= 40) return 'needs attention';
  return 'critical';
};

const tryParseJson = (rawResponse) => {
  try {
    return JSON.parse(rawResponse);
  } catch (err) {
    const first = rawResponse?.indexOf('{');
    const last = rawResponse?.lastIndexOf('}');
    if (first === -1 || last === -1 || last <= first) return null;
    const slice = rawResponse.slice(first, last + 1);
    try {
      return JSON.parse(slice);
    } catch (innerErr) {
      return null;
    }
  }
};

const buildFallbackReport = (financialProfile) => {
  const scores = financialProfile?.scores || {};
  const overall = Math.round(safeNumber(scores.overallFinancialHealthScore));
  const dti = Math.round(safeNumber(scores.dtiScore));
  const savings = Math.round(safeNumber(scores.savingsScore));
  const emergency = Math.round(safeNumber(scores.emergencyFundScore));
  const retirement = Math.round(safeNumber(scores.retirementScore));
  const growth = Math.round(safeNumber(scores.growthOpportunityScore));

  const summary = `Your overall financial health score is ${overall}. Your debt‑to‑income score is ${dti} (this is a score, not a percentage), savings score is ${savings}, emergency fund score is ${emergency}, retirement score is ${retirement}, and growth opportunity score is ${growth}. Based on these results, your overall position is ${scoreBand(overall)}, with the most immediate attention typically placed on the lowest scoring area. A higher growth opportunity score indicates more room to improve investment strategy and long‑term planning.`;

  const analysis = `Your scores provide a balanced view of current stability versus long‑term readiness. Debt‑to‑income, savings, and emergency fund scores help indicate short‑term resilience, while retirement and growth opportunity scores reflect long‑term positioning. Where a score is lower, it points to the area that will create the most leverage if improved. Growth opportunity and potential for improvement are scored such that higher values indicate more room to improve, and debt‑to‑income is a score rather than a percentage.

Important information: This report provides general information only and does not take account of your personal circumstances. It is designed for long‑term investment horizons (7–10+ years) and markets can be volatile in the short term. You should consider seeking independent financial, tax, and legal advice before acting.

Turning these insights into a coordinated investment and retirement strategy would be the focus of an initial consultation.`;

  return { summary, analysis };
};

/**
 * Single prompt that returns:
 *  - Executive Summary (conversion-focused)
 *  - Detailed Financial Analysis (authority + depth)
 */
const unifiedAnalysisPrompt = (financialProfile) => {
  const { formatted } = financialProfile;

  return `
You are a senior financial advisor at Echo Financial Advisors (New Zealand),
specialising in **investment strategies and retirement planning**.

IMPORTANT:
- This is a SINGLE financial report rendered on a webpage.
- Tone must convey authority, clarity, and trust.
- No hype. No fluff. No sales clichés.

===== REQUIRED OUTPUT FORMAT =====
Return VALID JSON only, with the following structure:

{
  "summary": "250–300 words. Executive-level summary designed to build confidence and naturally lead to a consultation.",
  "analysis": "400–500 words. Deeper analysis explaining the scores, trade-offs, risks, and long-term implications."
}

===== CONTEXT =====

Use the financial profile scores provided by the system. Do NOT include numerical projections or promises of future performance.

If you must include any illustrative figures, they MUST be clearly labelled as hypothetical examples only and MUST include the assumptions used (return, contributions, fees, tax, inflation) plus a clear statement that actual results will vary and are not guaranteed.

===== GUIDELINES =====

1. SUMMARY SECTION
- Written for a smart but non-financial reader
- Emphasise:
  - What is working
  - Where risk or opportunity exists
  - Why inaction has a cost
- Include this IMPORTANT INFORMATION paragraph near the top (verbatim):
  "Important information: This report provides general information only and does not take account of your personal circumstances. It is designed for long‑term investment horizons (7–10+ years) and markets can be volatile in the short term. You should consider seeking independent financial, tax, and legal advice before acting."
- End with:
  “Turning these insights into a coordinated investment and retirement strategy would be the focus of an initial consultation.”

2. ANALYSIS SECTION
- Explain the *why* behind the scores
- Clarify:
  - Growth Opportunity & Potential for Improvement → higher is worse
  - Debt-to-Income → score, not %
- Frame volatility and long-term investing correctly
- Maintain NZ context and UK English spelling

Required clauses to include once in the analysis:
- General information only (not personal advice)
- Long-term horizon and normal short-term volatility
- Encourage independent financial/tax/legal advice

Do NOT:
- Include greetings
- Include signatures
- Mention AI
- Mention compliance explicitly
`;
};

router.post('/', async (req, res) => {
  try {
    logger.info('POST /api/financial-analysis');

    if (!req.body?.originalData) {
      return fail(res, 400, 'VALIDATION_ERROR', 'originalData is required');
    }

    // Centralised calculation
    const financialProfile = calculateCompleteFinancialProfile(req.body.originalData);

    // Build prompt
    const prompt = unifiedAnalysisPrompt(financialProfile);

    let summary;
    let analysis;
    let usedFallback = false;

    try {
      // SINGLE GPT-5 CALL
      const rawResponse = await callOpenAIForAnalysis(req.body, prompt);

      // Parse JSON safely
      const parsed = tryParseJson(rawResponse);

      if (!parsed?.summary || !parsed?.analysis) {
        throw new Error('Incomplete or invalid analysis response');
      }

      summary = parsed.summary;
      analysis = parsed.analysis;
    } catch (err) {
      logger.error('Analysis generation failed, using fallback report', err);
      const fallback = buildFallbackReport(financialProfile);
      summary = fallback.summary;
      analysis = fallback.analysis;
      usedFallback = true;
    }

    // Compliance logging
    await logAdviceGeneration(
      'financial-health-check',
      req.body,
      {
        monthlyInvestment: financialProfile.recommendations.monthlyInvestment,
        monthlyRetirementContribution: financialProfile.recommendations.monthlyRetirementContribution,
        adviceType: 'combined-report',
      },
      `${summary}\n\n${analysis}`
    );

    const needsReview = await requiresManualReview(
      req.body,
      financialProfile.recommendations,
      `${summary}\n\n${analysis}`,
      'combined-report'
    );

    return ok(res, {
      summary,
      analysis,
      financialProfile,
      _fallback: usedFallback,
      _compliance: {
        adviceLogged: true,
        needsReview,
        adviceType: 'combined-report',
      },
    });
  } catch (error) {
    logger.error('Financial analysis error', error);
    return fail(res, 500, 'INTERNAL_ERROR', 'Failed to generate financial report');
  }
});

module.exports = router;
