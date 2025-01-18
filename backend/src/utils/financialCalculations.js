const calculateFinancialScores = (userData) => {
    const { personalDetails, expensesAssets, retirementPlanning } = userData;

    // Debt-to-Income Ratio (DTI)
    const debtToIncomeRatio = (expensesAssets.totalDebt / personalDetails.annualIncome) * 100;
    const dtiScore = debtToIncomeRatio > 40 ? 20 : 100 - (debtToIncomeRatio / 40) * 80; // Scale from 20 to 100

    // Savings Rate
    const savingsRate = ((expensesAssets.savings + expensesAssets.emergencyFunds) / personalDetails.annualIncome) * 100;
    const savingsScore = savingsRate > 20 ? 100 : (savingsRate / 20) * 100; // Scale up to a maximum of 100

    // Emergency Fund Score
    const emergencyFundScore = expensesAssets.emergencyFunds >= (expensesAssets.monthlyExpenses * 6)
        ? 100
        : (expensesAssets.emergencyFunds / (expensesAssets.monthlyExpenses * 6)) * 100;

    // Retirement Score
    const currentRetirementSavings = expensesAssets.savings + expensesAssets.emergencyFunds + expensesAssets.totalInvestments;
    const savingsGap = retirementPlanning.targetRetirementSavings - currentRetirementSavings;
    const yearsToRetirement = retirementPlanning.retirementAge - personalDetails.age;
    const debtCost = expensesAssets.totalDebt / 10; // an estimated cost of debt
    const costOfLiving = personalDetails.annualIncome / 10; // an estimated cost of living, we may want to expand this later
    const savingsRateForRetirement = ((personalDetails.annualIncome - expensesAssets.monthlyExpenses - debtCost - costOfLiving) / personalDetails.annualIncome) * 100;
    let retirementScore = 0;

    if (currentRetirementSavings >= retirementPlanning.targetRetirementSavings){
        retirementScore = 100;
    } else if (savingsRateForRetirement >= 10) {
        retirementScore = (currentRetirementSavings / retirementPlanning.targetRetirementSavings) * 100;
    } else if (savingsRateForRetirement <= 5) {
        retirementScore = (savingsRateForRetirement / 5) * 50;
    }

    // Ensure score is not higher than 100
    if (retirementScore > 100) {
        retirementScore = 100;
    }
    if (retirementScore < 0) {
        retirementScore = 0;
    }


    // Growth Opportunity Score (Dynamic based on savings, emergency funds and investments)
    const growthOpportunityScore = ((expensesAssets.savings + expensesAssets.emergencyFunds + expensesAssets.totalInvestments) / personalDetails.annualIncome) * 100;

    // Potential for Improvement Score (Considering all factors)
    const potentialForImprovementScore = ((100 - dtiScore) + (100 - savingsScore) + (100 - emergencyFundScore) + (100 - retirementScore) + (100 - growthOpportunityScore)) / 5;


    const overallFinancialHealthScore = (dtiScore + savingsScore + emergencyFundScore + retirementScore + growthOpportunityScore + potentialForImprovementScore) / 6;

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