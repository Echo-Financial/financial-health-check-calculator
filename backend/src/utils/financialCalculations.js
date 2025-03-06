/**
 * Calculates multiple financial scores:
 * 1. DTI Score
 * 2. Savings Rate Score (with a dynamic target based on age)
 * 3. Emergency Fund Score
 * 4. Retirement Score (enhanced with compound growth and inflation adjustment)
 * 5. Growth Opportunity Score (measures the gap between current investments and a dynamic target expressed as an investment multiple)
 * 6. Overall Financial Health Score (average of the five main scores, with Growth Opportunity inverted)
 * 7. Potential for Improvement Score (100 minus the overall score)
 */

// Dynamic target for savings rate based on age.
const targetSavingsRate = (age) => {
  if (age < 30) return 10;   // Unchanged: reasonable for young savers
  if (age < 40) return 15;   // Reduced from 20% to more achievable 15%
  if (age < 50) return 20;   // Reduced from 40% to realistic 20%
  if (age < 60) return 25;   // Reduced from 80% to achievable 25%
  return 30;                 // Reduced from 100% to realistic 30%
};

// Dynamic target for investment multiple based on age.
// This represents the ideal accumulation of investments as a multiple of annual income.
const targetInvestmentMultiple = (age) => {
  if (age < 30) return 0.5; // For users in their 20s, target is 0.5× annual income.
  if (age < 40) return 1;   // For users in their 30s, target is 1× annual income.
  if (age < 50) return 2;   // For users in their 40s, target is 2× annual income.
  if (age < 60) return 3;   // For users in their 50s, target is 3× annual income.
  return 5;                // For users 60 and above, target is 5× annual income.
};

// More nuanced scoring curve:
const calculateDTIScore = (debtToIncomeRatio) => {
  if (debtToIncomeRatio <= 0) return 100; // 0% debt = 100 points
  if (debtToIncomeRatio <= 15) return 90 + ((15 - debtToIncomeRatio) / 15) * 10; // 15% debt = 90 points
  if (debtToIncomeRatio <= 28) return 80 + ((28 - debtToIncomeRatio) / 13) * 10; // 28% debt = 80 points (standard mortgage qualification threshold)
  if (debtToIncomeRatio <= 36) return 70 + ((36 - debtToIncomeRatio) / 8) * 10; // 36% debt = 70 points (upper acceptable limit per financial advisors)
  if (debtToIncomeRatio <= 43) return 50 + ((43 - debtToIncomeRatio) / 7) * 20; // 43% debt = 50 points (maximum for qualified mortgages)
  if (debtToIncomeRatio <= 50) return ((50 - debtToIncomeRatio) / 7) * 50; // 50%+ debt = 0 points
  return 0;
};

const calculateFinancialScores = (userData) => {
  const { personalDetails, expensesAssets, retirementPlanning } = userData;
  // Extract relevant fields
  const { age, annualIncome } = personalDetails;
  const { monthlyExpenses, emergencyFunds, savings, totalDebt, totalInvestments } = expensesAssets;
  const currentRetirementSavings = retirementPlanning.currentRetirementSavings || 0;
  const { retirementAge, targetRetirementSavings, adjustForInflation } = retirementPlanning;

  // -------------------------------------------
  // 1. Debt-to-Income (DTI) Score
  // -------------------------------------------
  let debtToIncomeRatio = (totalDebt / annualIncome) * 100;
  if (debtToIncomeRatio < 0) debtToIncomeRatio = 0;
  let dtiScore = 100 - (debtToIncomeRatio * 2);
  if (dtiScore < 0) dtiScore = 0;
  if (dtiScore > 100) dtiScore = 100;

  // -------------------------------------------
  // 2. Savings Rate Score (Dynamic Benchmark)
  // -------------------------------------------
  let savingsRate = ((savings + emergencyFunds) / annualIncome) * 100;
  const targetSavings = targetSavingsRate(age);
  let savingsScore = savingsRate >= targetSavings ? 100 : (savingsRate / targetSavings) * 100;
  if (savingsScore < 0) savingsScore = 0;
  if (savingsScore > 100) savingsScore = 100;

  // -------------------------------------------
  // 3. Emergency Fund Score
  // -------------------------------------------
  const sixMonthsExpenses = monthlyExpenses * 6;
  let emergencyFundScore = (emergencyFunds / sixMonthsExpenses) * 100;
  if (emergencyFundScore > 100) emergencyFundScore = 100;
  if (emergencyFundScore < 0) emergencyFundScore = 0;

  // -------------------------------------------
  // 4. Retirement Score (Enhanced with Compound Growth & Inflation Adjustment)
  // -------------------------------------------
  const yearsToRetirement = retirementAge - age;
  const r = 0.05; // assumed annual growth rate (5%)
  const inflationRate = 0.025; // assumed annual inflation rate (2.5%)

  // Adjust target retirement savings for inflation if needed.
  let adjustedTargetRetirementSavings = targetRetirementSavings;
  if (yearsToRetirement > 0 && adjustForInflation) {
    adjustedTargetRetirementSavings = targetRetirementSavings * Math.pow(1 + inflationRate, yearsToRetirement);
  }

  let estimatedRetirementAssets = 0;
  if (yearsToRetirement > 0) {
    const futureRetirementSavings = currentRetirementSavings * Math.pow(1 + r, yearsToRetirement);
    const portionOfSavingsAllocated = 0.5;
    const portionOfInvestmentsAllocated = 0.7;
    const allocatedAssets = (portionOfSavingsAllocated * savings) + (portionOfInvestmentsAllocated * totalInvestments);
    const futureAllocatedAssets = allocatedAssets * Math.pow(1 + r, yearsToRetirement);
    const annualContribution = annualIncome * 0.10;
    const futureContributions = annualContribution * ((Math.pow(1 + r, yearsToRetirement) - 1) / r);
    estimatedRetirementAssets = futureRetirementSavings + futureAllocatedAssets + futureContributions;
  } else {
    const portionOfSavingsAllocated = 0.5;
    const portionOfInvestmentsAllocated = 0.7;
    estimatedRetirementAssets = currentRetirementSavings + (portionOfSavingsAllocated * savings) + (portionOfInvestmentsAllocated * totalInvestments);
  }
  let retirementScore = (estimatedRetirementAssets / adjustedTargetRetirementSavings) * 100;
  if (retirementScore > 100) retirementScore = 100;
  if (retirementScore < 0) retirementScore = 0;

  // -------------------------------------------
  // 5. Growth Opportunity Score (Dynamic Investment Multiple Approach)
  // -------------------------------------------
  const targetMultiple = targetInvestmentMultiple(age);
  const currentMultiple = totalInvestments / annualIncome;
  let growthOpportunityScore = ((targetMultiple - currentMultiple) / targetMultiple) * 100;
  if (growthOpportunityScore < 0) growthOpportunityScore = 0;
  if (growthOpportunityScore > 100) growthOpportunityScore = 100;

  // -------------------------------------------
  // 6. Overall Financial Health Score
  // -------------------------------------------
  // Invert the Growth Opportunity Score so that all metrics point in the same "higher is better" direction.
  let overallFinancialHealthScore = (
    dtiScore +
    savingsScore +
    emergencyFundScore +
    retirementScore +
    (100 - growthOpportunityScore)
  ) / 5;
  if (overallFinancialHealthScore > 100) overallFinancialHealthScore = 100;
  if (overallFinancialHealthScore < 0) overallFinancialHealthScore = 0;

  // -------------------------------------------
  // 7. Potential for Improvement Score
  // -------------------------------------------
  let potentialForImprovementScore = 100 - overallFinancialHealthScore;
  if (potentialForImprovementScore > 100) potentialForImprovementScore = 100;
  if (potentialForImprovementScore < 0) potentialForImprovementScore = 0;

  return {
    dtiScore: Math.round(dtiScore),
    savingsScore: Math.round(savingsScore),
    emergencyFundScore: Math.round(emergencyFundScore),
    retirementScore: Math.round(retirementScore),
    growthOpportunityScore: Math.round(growthOpportunityScore),
    overallFinancialHealthScore: Math.round(overallFinancialHealthScore),
    potentialForImprovementScore: Math.round(potentialForImprovementScore),
  };
};

/**
 * Calculates the required periodic contribution (PMT) to achieve a target future value (FV)
 * given the present value (PV), number of years (N), and a fixed annual interest rate (r).
 *
 * Formula:
 *   PMT = ((FV - PV * (1 + r)^N) * r) / ((1 + r)^N - 1)
 *
 * @param {number} PV - Present Value (current savings)
 * @param {number} FV - Future Value (target retirement savings)
 * @param {number} N - Number of years until retirement (retirement age - current age)
 * @param {number} r - Annual interest rate (default 0.05 for 5%)
 * @returns {number} - The required annual contribution (PMT). Divide by 12 for monthly.
 */
function calculateRequiredContribution(PV, FV, N, r = 0.05) {
  const compoundFactor = Math.pow(1 + r, N);
  // If current savings already exceed or meet the target, no additional contributions are required.
  if (PV * compoundFactor >= FV) {
    return 0;
  }
  const numerator = (FV - PV * compoundFactor) * r;
  const denominator = compoundFactor - 1;
  return numerator / denominator;
}

module.exports = {
  calculateFinancialScores,
  calculateRequiredContribution,
};
