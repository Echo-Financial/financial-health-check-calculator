// financialCalculations.js

/**
 * Calculates multiple financial scores:
 * 1. DTI Score
 * 2. Savings Rate Score
 * 3. Emergency Fund Score
 * 4. Retirement Score (synergy approach: currentRetirementSavings + partial from savings/investments)
 * 5. Growth Opportunity Score
 * 6. Potential for Improvement Score (separate dimension)
 * 7. Overall Financial Health Score (excludes potentialForImprovement so it doesn't lower a perfect score)
 */

const calculateFinancialScores = (userData) => {
  const { personalDetails, expensesAssets, retirementPlanning } = userData;

  // Extract relevant fields
  const {
    age,
    annualIncome,
    // optional: incomeFromInterest, incomeFromProperty, etc. if needed
  } = personalDetails;

  const {
    monthlyExpenses,
    emergencyFunds,
    savings,
    totalDebt,
    totalInvestments,
    // totalAssets if needed
  } = expensesAssets;

  const {
    retirementAge,
    targetRetirementSavings,
    currentRetirementSavings,
  } = retirementPlanning;

  // -------------------------------------------
  // 1. Debt-to-Income (DTI) Score
  // -------------------------------------------
  let debtToIncomeRatio = (totalDebt / annualIncome) * 100;
  if (debtToIncomeRatio < 0) debtToIncomeRatio = 0;  // handle odd edge case

  // Example approach: 0% DTI => 100, 50% => 0, clamp
  let dtiScore = 100 - (debtToIncomeRatio * 2);
  if (dtiScore < 0) dtiScore = 0;
  if (dtiScore > 100) dtiScore = 100;

  // -------------------------------------------
  // 2. Savings Rate Score
  // -------------------------------------------
  // The user’s basic savings + emergency are treated as non-retirement short/mid-term
  let savingsRate = ((savings + emergencyFunds) / annualIncome) * 100;
  // Cap at 20% => 100 points, linear below that
  let savingsScore = savingsRate >= 20 
    ? 100
    : (savingsRate / 20) * 100;
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
  // 4. Retirement Score (Synergy Approach)
  // -------------------------------------------
  // We combine:
  //  - 100% of currentRetirementSavings
  //  - a portion of general savings
  //  - a portion of totalInvestments
  // and exclude emergencyFunds.
  const portionOfSavingsAllocated = 0.5;       // 50% of user "savings" is assumed eventually for retirement
  const portionOfInvestmentsAllocated = 0.7;   // 70% of totalInvestments is assumed for retirement

  const userRetirementAssets =
    currentRetirementSavings +
    portionOfSavingsAllocated * savings +
    portionOfInvestmentsAllocated * totalInvestments;

  let retirementScore = 0;
  const yearsToRetirement = retirementAge - age;

  if (userRetirementAssets >= targetRetirementSavings) {
    retirementScore = 100;
  } else if (yearsToRetirement > 0) {
    // Estimate annual needed vs. annual saving
    const gap = targetRetirementSavings - userRetirementAssets;
    // For simplicity, assume user invests 10% of annualIncome each year for retirement
    const assumedAnnualRetirementRate = 0.10;
    const annualNeeded = gap / yearsToRetirement;
    const annualSaving = annualIncome * assumedAnnualRetirementRate;
    const ratio = annualNeeded > 0 ? (annualSaving / annualNeeded) : 0;
    retirementScore = ratio * 100;
  } else {
    // Already at/past retirement age, just see how close
    retirementScore = (userRetirementAssets / targetRetirementSavings) * 100;
  }
  if (retirementScore > 100) retirementScore = 100;
  if (retirementScore < 0) retirementScore = 0;

  // -------------------------------------------
  // 5. Growth Opportunity Score
  // -------------------------------------------
  // measures total assets vs. income, capping at 100
  let growthOpportunityScore =
    ((savings + emergencyFunds + totalInvestments) / annualIncome) * 100;
  if (growthOpportunityScore > 100) growthOpportunityScore = 100;
  if (growthOpportunityScore < 0) growthOpportunityScore = 0;

  // -------------------------------------------
  // 6. Potential for Improvement Score
  // -------------------------------------------
  let potentialForImprovementScore =
    ((100 - dtiScore) +
     (100 - savingsScore) +
     (100 - emergencyFundScore) +
     (100 - retirementScore) +
     (100 - growthOpportunityScore)
    ) / 5;

  if (potentialForImprovementScore > 100) potentialForImprovementScore = 100;
  if (potentialForImprovementScore < 0) potentialForImprovementScore = 0;

  // -------------------------------------------
  // 7. Overall Financial Health Score
  // -------------------------------------------
  // We exclude potentialForImprovementScore from the average 
  // so a perfect user doesn't get penalized with an 0 in improvement.
  let overallFinancialHealthScore = (
    dtiScore +
    savingsScore +
    emergencyFundScore +
    retirementScore +
    growthOpportunityScore
  ) / 5; // average of 5 main categories

  if (overallFinancialHealthScore > 100) overallFinancialHealthScore = 100;
  if (overallFinancialHealthScore < 0) overallFinancialHealthScore = 0;

  // -------------------------------------------
  // Return Final Scores
  // -------------------------------------------
  return {
    dtiScore: Math.round(dtiScore),
    savingsScore: Math.round(savingsScore),
    emergencyFundScore: Math.round(emergencyFundScore),
    retirementScore: Math.round(retirementScore),
    growthOpportunityScore: Math.round(growthOpportunityScore),
    potentialForImprovementScore: Math.round(potentialForImprovementScore),
    overallFinancialHealthScore: Math.round(overallFinancialHealthScore),
  };
};

module.exports = { calculateFinancialScores };
