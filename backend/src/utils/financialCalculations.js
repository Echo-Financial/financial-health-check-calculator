
const calculateFinancialScores = (userData) => {
    const { personalDetails, expensesAssets, retirementPlanning } = userData;

    // Example calculations (replace with your actual logic)
    const emergencyFundScore = expensesAssets.emergencyFunds >= (expensesAssets.monthlyExpenses * 6) ? 100 : (expensesAssets.emergencyFunds / (expensesAssets.monthlyExpenses * 6)) * 100;
    const debtScore = expensesAssets.totalDebt === 0 ? 100 : (1 - (expensesAssets.totalDebt / personalDetails.annualIncome)) * 100;
    const retirementScore = retirementPlanning.expectedAnnualIncome >= (personalDetails.annualIncome * 0.6) ? 100 : (retirementPlanning.expectedAnnualIncome / (personalDetails.annualIncome * 0.6)) * 100;
    const growthOpportunityScore = personalDetails.annualIncome > 50000 ? 80 : 60;
    const potentialForImprovementScore = (100 - emergencyFundScore) + (100 - debtScore);
    const overallFinancialHealthScore = (emergencyFundScore + debtScore + retirementScore + growthOpportunityScore) / 4;

    return {
        emergencyFundScore: Math.round(emergencyFundScore),
        debtScore: Math.round(debtScore),
        retirementScore: Math.round(retirementScore),
        growthOpportunityScore: Math.round(growthOpportunityScore),
        potentialForImprovementScore: Math.round(potentialForImprovementScore),
        overallFinancialHealthScore: Math.round(overallFinancialHealthScore),
    };
};

module.exports = { calculateFinancialScores };
