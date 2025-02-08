/**
 * Calculates multiple financial scores:
 * 1. DTI Score
 * 2. Savings Rate Score (with a dynamic target based on age)
 * 3. Emergency Fund Score
 * 4. Retirement Score (enhanced with compound growth and inflation adjustment)
 * 5. Growth Opportunity Score (reflects the gap between current investments and a target of 20% of annual income; lower is better)
 * 6. Overall Financial Health Score (average of the five main scores)
 * 7. Potential for Improvement Score (100 minus the overall score)
 */

// Dynamic target for savings rate based on age.
const targetSavingsRate = (age) => {
  if (age < 30) return 10;   // Younger individuals: 10%
  if (age < 40) return 20;   // In their 30s: 20%
  if (age < 50) return 40;   // In their 40s: 40%
  if (age < 60) return 80;   // In their 50s: 80%
  return 100;                // 60 and above: 100%
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
  const target = targetSavingsRate(age);
  let savingsScore = savingsRate >= target ? 100 : (savingsRate / target) * 100;
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
  // 5. Growth Opportunity Score
  // -------------------------------------------
  // Reflects the gap between current investments and a realistic target (20% of annual income).
  // Lower values indicate better performance.
  const targetInvestmentFraction = 0.2;
  const targetInvestment = annualIncome * targetInvestmentFraction;
  let growthOpportunityScore = ((targetInvestment - totalInvestments) / targetInvestment) * 100;
  if (growthOpportunityScore < 0) growthOpportunityScore = 0;
  if (growthOpportunityScore > 100) growthOpportunityScore = 100;

  // -------------------------------------------
  // 6. Overall Financial Health Score
  // -------------------------------------------
  let overallFinancialHealthScore = (
    dtiScore +
    savingsScore +
    emergencyFundScore +
    retirementScore +
    growthOpportunityScore
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

module.exports = { calculateFinancialScores };
