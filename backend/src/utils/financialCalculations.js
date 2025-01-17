
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

    // Retirement Score based on the ability to meet retirement goals
    const retirementScore = retirementPlanning.expectedAnnualIncome >= (personalDetails.annualIncome * 0.7)
       ? 100 : (retirementPlanning.expectedAnnualIncome / (personalDetails.annualIncome * 0.7)) * 100;

     // Growth Opportunity Score (Dynamic based on savings, emergency funds and investments)
    const growthOpportunityScore = ((expensesAssets.savings + expensesAssets.emergencyFunds + expensesAssets.totalInvestments) / personalDetails.annualIncome) * 100;
        const scaledGrowthOpportunityScore = growthOpportunityScore < 5 ? 20 :
            (growthOpportunityScore >= 5 && growthOpportunityScore <= 10) ? 50 :
            (growthOpportunityScore > 10 && growthOpportunityScore <= 20) ? 80 : 100;

    // Potential for Improvement Score (Considering all factors)
    const potentialForImprovementScore = ((100 - dtiScore) + (100 - savingsScore) + (100 - emergencyFundScore) + (100 - retirementScore) + (100 - scaledGrowthOpportunityScore)) / 5;


    const overallFinancialHealthScore = (dtiScore + savingsScore + emergencyFundScore + retirementScore + scaledGrowthOpportunityScore + potentialForImprovementScore) / 6;

    return {
        dtiScore: Math.round(dtiScore),
        savingsScore: Math.round(savingsScore),
        emergencyFundScore: Math.round(emergencyFundScore),
        retirementScore: Math.round(retirementScore),
        growthOpportunityScore: Math.round(scaledGrowthOpportunityScore),
        potentialForImprovementScore: Math.round(potentialForImprovementScore),
        overallFinancialHealthScore: Math.round(overallFinancialHealthScore),
    };
};

module.exports = { calculateFinancialScores };