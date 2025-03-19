/**
 * Calculates multiple financial scores and provides dynamic growth projections
 * based on each user's specific financial situation.
 */

// Dynamic target for savings rate based on age.
const targetSavingsRate = (age) => {
  if (age < 30) return 10;   // Reasonable for young savers
  if (age < 40) return 15;   // Moderate for mid-career
  if (age < 50) return 20;   // Higher for established career
  if (age < 60) return 25;   // Strong for pre-retirement
  return 30;                 // Highest for near-retirement
};

// Dynamic target for investment multiple based on age.
const targetInvestmentMultiple = (age) => {
  if (age < 30) return 0.5; // For users in their 20s, target is 0.5× annual income
  if (age < 40) return 1;   // For users in their 30s, target is 1× annual income
  if (age < 50) return 2;   // For users in their 40s, target is 2× annual income
  if (age < 60) return 3;   // For users in their 50s, target is 3× annual income
  return 5;                // For users 60 and above, target is 5× annual income
};

// More nuanced scoring curve for DTI
const calculateDTIScore = (debtToIncomeRatio) => {
  if (debtToIncomeRatio <= 0) return 100; // 0% debt = 100 points
  if (debtToIncomeRatio <= 15) return 90 + ((15 - debtToIncomeRatio) / 15) * 10; // 15% debt = 90 points
  if (debtToIncomeRatio <= 28) return 80 + ((28 - debtToIncomeRatio) / 13) * 10; // 28% debt = 80 points
  if (debtToIncomeRatio <= 36) return 70 + ((36 - debtToIncomeRatio) / 8) * 10; // 36% debt = 70 points
  if (debtToIncomeRatio <= 43) return 50 + ((43 - debtToIncomeRatio) / 7) * 20; // 43% debt = 50 points
  if (debtToIncomeRatio <= 50) return ((50 - debtToIncomeRatio) / 7) * 50; // 50%+ debt = 0 points
  return 0;
};

const calculateFinancialScores = (userData) => {
  // Extract relevant user data
  const { personalDetails, expensesAssets, retirementPlanning } = userData;
  // Destructure income-related fields, defaulting additional incomes to 0 if not provided.
  const { age, annualIncome, incomeFromInterest = 0, incomeFromProperty = 0 } = personalDetails;
  // Aggregate total annual income
  const totalAnnualIncome = annualIncome + incomeFromInterest + incomeFromProperty;
  
  const { monthlyExpenses, emergencyFunds, savings, totalDebt, totalInvestments } = expensesAssets;
  const currentRetirementSavings = retirementPlanning.currentRetirementSavings || 0;
  const { retirementAge, targetRetirementSavings, adjustForInflation } = retirementPlanning;

  // -------------------------------------------
  // 1. Debt-to-Income (DTI) Score
  // -------------------------------------------
  let debtToIncomeRatio = (totalDebt / totalAnnualIncome) * 100;
  if (debtToIncomeRatio < 0) debtToIncomeRatio = 0;
  let dtiScore = 100 - (debtToIncomeRatio * 2);
  if (dtiScore < 0) dtiScore = 0;
  if (dtiScore > 100) dtiScore = 100;

  // -------------------------------------------
  // 2. Savings Rate Score (Dynamic Benchmark)
  // -------------------------------------------
  let savingsRate = ((savings + emergencyFunds) / totalAnnualIncome) * 100;
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
    // Use totalAnnualIncome for annual contribution calculation
    const annualContribution = totalAnnualIncome * 0.10;
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
  const currentMultiple = totalInvestments / totalAnnualIncome;
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
    // Add retirementTarget to scores object for consistent reference
    retirementTarget: targetRetirementSavings
  };
};

/**
 * Calculates the required periodic contribution to achieve a target retirement savings
 */
function calculateRequiredContribution(PV, FV, N, r = 0.05) {
  if (!N || N <= 0) return 0;
  const compoundFactor = Math.pow(1 + r, N);
  if (PV * compoundFactor >= FV) {
    return 0;
  }
  const numerator = (FV - PV * compoundFactor) * r;
  const denominator = compoundFactor - 1;
  return numerator / denominator;
}

/**
 * Calculates the future value of regular periodic investments.
 */
function calculateFutureValueOfInvestment(PMT, N, r = 0.05, monthly = true) {
  if (!N || N <= 0 || !PMT || PMT <= 0) return 0;
  let periodicRate = r;
  let periods = N;
  if (monthly) {
    periodicRate = r / 12;
    periods = N * 12;
  }
  return PMT * ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate);
}

/**
 * Calculates the future value of monthly investments over specific time periods
 */
function calculateInvestmentGrowth(monthlyAmount, initialInvestment, years, annualRate = 0.05) {
  if (!years || years <= 0) return initialInvestment;
  if (!monthlyAmount) monthlyAmount = 0;
  if (!initialInvestment) initialInvestment = 0;
  const initialGrowth = initialInvestment * Math.pow(1 + annualRate, years);
  const contributionGrowth = calculateFutureValueOfInvestment(monthlyAmount, years, annualRate);
  return Math.round(initialGrowth + contributionGrowth);
}

/**
 * Generates formatted projection statements for investments with dynamic monthly amounts
 * based on user's financial situation
 */
function getInvestmentProjections(initialInvestment, annualIncome, age, currentDebt = 0, annualReturn = 0.05) {
  // Here, annualIncome should represent the total annual income.
  initialInvestment = initialInvestment || 0;
  annualIncome = annualIncome || 50000;
  age = age || 35;
  currentDebt = currentDebt || 0;
  
  let recommendedPercentage;
  if (age < 30) recommendedPercentage = 0.10;
  else if (age < 40) recommendedPercentage = 0.12;
  else if (age < 50) recommendedPercentage = 0.15;
  else recommendedPercentage = 0.20;
  
  const debtToIncomeRatio = (currentDebt / annualIncome);
  if (debtToIncomeRatio > 0.5) {
    recommendedPercentage *= 0.7;
  } else if (debtToIncomeRatio > 0.3) {
    recommendedPercentage *= 0.85;
  }
  
  let monthlyAmount = Math.round((annualIncome * recommendedPercentage) / 12);
  monthlyAmount = Math.max(monthlyAmount, 100);
  monthlyAmount = Math.min(monthlyAmount, 2000);
  monthlyAmount = Math.round(monthlyAmount / 50) * 50;
  
  const fiveYearGrowth = calculateInvestmentGrowth(monthlyAmount, initialInvestment, 5, annualReturn);
  const tenYearGrowth = calculateInvestmentGrowth(monthlyAmount, initialInvestment, 10, annualReturn);
  const twentyYearGrowth = calculateInvestmentGrowth(monthlyAmount, initialInvestment, 20, annualReturn);
  
  return {
    fiveYear: fiveYearGrowth,
    tenYear: tenYearGrowth,
    twentyYear: twentyYearGrowth,
    monthlyAmount: monthlyAmount,
    initialInvestment: initialInvestment,
    annualReturnPercent: annualReturn * 100,
    percentOfIncome: Math.round(recommendedPercentage * 100)
  };
}

/**
 * Generates formatted statements for retirement planning with dynamic contributions
 */
function getRetirementProjections(currentSavings, targetSavings, yearsToRetirement, annualIncome = 50000, age = 35, annualReturn = 0.05) {
  currentSavings = currentSavings || 0;
  
  if (!targetSavings || targetSavings <= 0) {
    targetSavings = annualIncome * 0.8 * 25;
  }
  
  if (!yearsToRetirement || yearsToRetirement <= 0) {
    const estimatedRetirementAge = 65;
    yearsToRetirement = Math.max(1, estimatedRetirementAge - age);
  }
  
  const annualContribution = calculateRequiredContribution(
    currentSavings, 
    targetSavings, 
    yearsToRetirement, 
    annualReturn
  );
  const monthlyContribution = annualContribution / 12;
  
  const maxMonthlyContribution = (annualIncome * 0.25) / 12;
  const cappedMonthlyContribution = Math.min(monthlyContribution, maxMonthlyContribution);
  
  const roundedMonthlyContribution = Math.round(cappedMonthlyContribution / 5) * 5;
  
  const futureValueWithoutContributions = currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);
  
  const shortfall = targetSavings - futureValueWithoutContributions;
  
  const contributionEffect = calculateFutureValueOfInvestment(
    roundedMonthlyContribution, 
    yearsToRetirement, 
    annualReturn
  );
  
  const achievableAmount = futureValueWithoutContributions + contributionEffect;
  
  const achievablePercent = Math.min(100, Math.round((achievableAmount / targetSavings) * 100));
  
  return {
    monthlyContribution: roundedMonthlyContribution.toFixed(2),
    futureValueWithoutContributions: Math.round(futureValueWithoutContributions),
    shortfall: Math.round(shortfall),
    shortfallPercent: Math.round((shortfall / targetSavings) * 100),
    totalWithContributions: Math.round(achievableAmount),
    achievablePercent: achievablePercent,
    yearsToRetirement: yearsToRetirement,
    currentSavings: currentSavings,
    targetSavings: targetSavings,
    annualReturnPercent: annualReturn * 100,
    isAchievable: achievableAmount >= targetSavings
  };
}

/**
 * Calculates all financial metrics and recommendations in one centralized function
 * to ensure consistency across all outputs
 * 
 * @param {Object} userData - The user's raw financial data
 * @returns {Object} - A complete package of scores, recommendations, and projections
 */
function calculateCompleteFinancialProfile(userData) {
  const { personalDetails, expensesAssets, retirementPlanning } = userData;
  const { age, annualIncome, incomeFromInterest = 0, incomeFromProperty = 0 } = personalDetails;
  // Aggregate total annual income including additional income sources.
  const totalAnnualIncome = annualIncome + incomeFromInterest + incomeFromProperty;
  
  const { totalInvestments, totalDebt, emergencyFunds } = expensesAssets;
  const { currentRetirementSavings, targetRetirementSavings, retirementAge } = retirementPlanning;
  const yearsToRetirement = retirementAge - age;
  
  const scores = calculateFinancialScores(userData);
  const investmentProj = getInvestmentProjections(
    totalInvestments, 
    totalAnnualIncome, 
    age, 
    totalDebt
  );
  
  const retirementProj = getRetirementProjections(
    currentRetirementSavings, 
    targetRetirementSavings, 
    yearsToRetirement, 
    totalAnnualIncome, 
    age
  );
  
  let recommendedDebtPayment = 0;
  if (totalDebt > 0) {
    recommendedDebtPayment = Math.min(Math.ceil(totalDebt / 36), totalAnnualIncome * 0.15 / 12);
    recommendedDebtPayment = Math.round(recommendedDebtPayment / 25) * 25;
  }
  
  const monthlyExpenses = expensesAssets.monthlyExpenses;
  const targetEmergencyFund = monthlyExpenses * 6;
  const emergencyFundGap = Math.max(0, targetEmergencyFund - emergencyFunds);
  const recommendedEmergencyContribution = emergencyFundGap > 0 
    ? Math.min(Math.ceil(emergencyFundGap / 12), totalAnnualIncome * 0.1 / 12) 
    : 0;
  
  return {
    scores: scores,
    recommendations: {
      monthlyInvestment: investmentProj.monthlyAmount,
      monthlyRetirementContribution: parseFloat(retirementProj.monthlyContribution),
      monthlyDebtPayment: recommendedDebtPayment,
      monthlyEmergencyFundContribution: Math.round(recommendedEmergencyContribution)
    },
    projections: {
      investment: investmentProj,
      retirement: retirementProj
    },
    formatted: {
      monthlyInvestment: `$${investmentProj.monthlyAmount}`,
      tenYearInvestmentGrowth: `$${investmentProj.tenYear.toLocaleString()}`,
      monthlyRetirementContribution: `$${retirementProj.monthlyContribution}`,
      retirementTarget: `$${retirementProj.targetSavings.toLocaleString()}`,
      annualReturnPercent: `${investmentProj.annualReturnPercent}%`
    }
  };
}

// Function to calculate recommended debt payment based on debt-to-income ratio
function calculateRecommendedDebtPayment(totalDebt, annualIncome) {
  if (!totalDebt || totalDebt <= 0) return 0;
  const monthlyPayment = Math.min(Math.ceil(totalDebt / 36), annualIncome * 0.15 / 12);
  return Math.round(monthlyPayment / 25) * 25;
}

module.exports = {
  calculateFinancialScores,
  calculateRequiredContribution,
  calculateInvestmentGrowth,
  getInvestmentProjections,
  getRetirementProjections,
  calculateCompleteFinancialProfile,
  calculateRecommendedDebtPayment
};
