/**
 * Financial Calculation Utilities
 * 
 * This module contains functions to calculate various financial metrics
 * based on user input data.
 */

/**
 * Calculates various financial scores based on user data.
 *
 * @param {Object} userData - The user's financial data.
 * @returns {Object} - An object containing calculated financial scores.
 */
function calculateFinancialScores(userData) {
    const {
        personalDetails: { age, annualIncome, incomeFromInterest, incomeFromProperty },
        expensesAssets: { monthlyExpenses, emergencyFunds, savings, totalDebt },
        retirementPlanning: { retirementAge, expectedAnnualIncome, adjustForInflation },
        contactInfo: { email, name, phone }
    } = userData;

    // Calculate Emergency Fund Score
    const requiredEmergencyFunds = monthlyExpenses * 6;
    const emergencyFundScore = emergencyFunds >= requiredEmergencyFunds ? 100 : Math.round((emergencyFunds / requiredEmergencyFunds) * 100);

    // Calculate Debt-to-Income (DTI) Score
    const dtiRatio = totalDebt / annualIncome;
    let debtScore;
    if (dtiRatio < 0.3) {
        debtScore = 100;
    } else if (dtiRatio < 0.4) {
        debtScore = 80;
    } else if (dtiRatio < 0.5) {
        debtScore = 60;
    } else {
        debtScore = 40;
    }

    // Calculate Retirement Readiness Score
    const yearsToRetirement = retirementAge - age;
    const retirementScore = yearsToRetirement >= 35 ? 100 : Math.round((yearsToRetirement / 35) * 100);

    // Calculate Growth Opportunity Score
    const growthOpportunityScore = annualIncome > 50000 ? 100 : Math.round((annualIncome / 50000) * 100);

    // Calculate Potential for Improvement Score
    // Assuming that lower debtScore and lower emergencyFundScore indicate higher potential
    const potentialForImprovementScore = Math.round(((100 - debtScore) + (100 - emergencyFundScore)) / 2);

    // Calculate Overall Financial Health Score
    const overallFinancialHealthScore = Math.round((emergencyFundScore + debtScore + retirementScore + growthOpportunityScore + potentialForImprovementScore) / 5);

    return {
        emergencyFundScore,
        debtScore,
        retirementScore,
        growthOpportunityScore,
        potentialForImprovementScore,
        overallFinancialHealthScore
    };
}

/**
 * Calculates Net Worth.
 * @param {number} totalAssets - Total assets owned by the user.
 * @param {number} totalLiabilities - Total liabilities (debts) owed by the user.
 * @returns {number} Net Worth
 */
const calculateNetWorth = (totalAssets, totalLiabilities) => {
    return totalAssets - totalLiabilities;
};

/**
 * Calculates Debt-to-Income Ratio (DTI).
 * @param {number} totalMonthlyDebtPayments - Total monthly debt payments.
 * @param {number} grossMonthlyIncome - Gross monthly income.
 * @returns {number} DTI percentage
 */
const calculateDTI = (totalMonthlyDebtPayments, grossMonthlyIncome) => {
    if (grossMonthlyIncome === 0) return 0;
    return (totalMonthlyDebtPayments / grossMonthlyIncome) * 100;
};

/**
 * Calculates Savings Rate.
 * @param {number} annualSavings - Total annual savings.
 * @param {number} grossIncome - Gross annual income.
 * @returns {number} Savings Rate percentage
 */
const calculateSavingsRate = (annualSavings, grossIncome) => {
    if (grossIncome === 0) return 0;
    return (annualSavings / grossIncome) * 100;
};

/**
 * Calculates Emergency Fund Coverage.
 * @param {number} savings - Total savings.
 * @param {number} monthlyExpenses - Monthly expenses.
 * @returns {number} Emergency Fund Coverage in months
 */
const calculateEmergencyFundCoverage = (savings, monthlyExpenses) => {
    if (monthlyExpenses === 0) return 0;
    return savings / monthlyExpenses;
};

/**
 * Calculates Retirement Preparedness (Retirement Readiness Index).
 * @param {number} currentRetirementSavings - Current retirement savings.
 * @param {number} targetRetirementSavings - Target retirement savings.
 * @returns {number} Retirement Readiness Index percentage
 */
const calculateRetirementReadiness = (currentRetirementSavings, targetRetirementSavings) => {
    if (targetRetirementSavings === 0) return 0;
    return (currentRetirementSavings / targetRetirementSavings) * 100;
};

/**
 * Calculates Financial Independence Ratio.
 * @param {number} passiveIncome - Monthly passive income.
 * @param {number} monthlyExpenses - Monthly expenses.
 * @returns {number} Financial Independence Ratio percentage
 */
const calculateFinancialIndependenceRatio = (passiveIncome, monthlyExpenses) => {
    if (monthlyExpenses === 0) return 0;
    return (passiveIncome / monthlyExpenses) * 100;
};

/**
 * Calculates Budget Allocation Check based on the 50/30/20 rule.
 * @param {number} essentials - Percentage allocated to essentials.
 * @param {number} discretionary - Percentage allocated to discretionary spending.
 * @param {number} savings - Percentage allocated to savings.
 * @returns {object} Differences from ideal allocation
 */
const calculateBudgetAllocationCheck = (essentials, discretionary, savings) => {
    return {
        essentialsDiff: essentials - 50,
        discretionaryDiff: discretionary - 30,
        savingsDiff: savings - 20
    };
};

/**
 * Calculates Overall Financial Health Score.
 * @param {object} metrics - Object containing all calculated metrics.
 * @returns {number} Overall Financial Health Score (0-100)
 */
const calculateOverallFinancialHealthScore = (metrics) => {
    // Assign weights to each metric
    const weights = {
        netWorth: 10,
        dti: 15,
        savingsRate: 15,
        emergencyFundCoverage: 10,
        retirementReadiness: 15,
        financialIndependenceRatio: 10,
        budgetAllocation: 10,
        creditHealth: 15
    };

    // Normalize and score each metric
    const scores = {
        netWorth: metrics.netWorth >= 0 ? 100 : 0, // Simple binary scoring
        dti: metrics.dti <= 36 ? 100 : 0, // Ideal DTI <= 36%
        savingsRate: metrics.savingsRate >= 20 ? 100 : 0, // Ideal savings rate >=20%
        emergencyFundCoverage: metrics.emergencyFundCoverage >= 6 ? 100 : 0, // 6 months
        retirementReadiness: metrics.retirementReadiness >= 100 ? 100 : Math.round((metrics.retirementReadiness / 100) * 100),
        financialIndependenceRatio: metrics.financialIndependenceRatio >= 100 ? 100 : Math.round((metrics.financialIndependenceRatio / 100) * 100),
        budgetAllocation: (Math.abs(metrics.budgetAllocation.essentialsDiff) <= 10 &&
                            Math.abs(metrics.budgetAllocation.discretionaryDiff) <= 10 &&
                            Math.abs(metrics.budgetAllocation.savingsDiff) <= 10) ? 100 : 0,
        creditHealth: metrics.creditHealth >= 700 ? 100 : Math.round((metrics.creditHealth / 700) * 100) // Assuming 700 as good credit score
    };

    // Calculate weighted score
    let totalScore = 0;
    let totalWeight = 0;
    for (let metric in weights) {
        totalScore += scores[metric] * weights[metric];
        totalWeight += weights[metric];
    }

    return Math.round(totalScore / totalWeight);
};

/**
 * Calculates Echo Improvement Potential Score.
 * @param {object} metrics - Object containing all calculated metrics.
 * @returns {number} Echo Improvement Potential Score (0-100)
 */
const calculateEchoImprovementPotential = (metrics) => {
    // Identify gaps in metrics
    let improvementAreas = 0;
    let maxImprovement = 0;

    if (metrics.netWorth < 0) {
        improvementAreas += 1;
        maxImprovement += 10;
    }
    if (metrics.dti > 36) {
        improvementAreas += 1;
        maxImprovement += 15;
    }
    if (metrics.savingsRate < 20) {
        improvementAreas += 1;
        maxImprovement += 15;
    }
    if (metrics.emergencyFundCoverage < 6) {
        improvementAreas += 1;
        maxImprovement += 10;
    }
    if (metrics.retirementReadiness < 100) {
        improvementAreas += 1;
        maxImprovement += 15;
    }
    if (metrics.financialIndependenceRatio < 100) {
        improvementAreas += 1;
        maxImprovement += 10;
    }
    // Add more areas as needed

    if (maxImprovement === 0) return 0; // No improvement needed

    // Calculate potential based on gaps
    return Math.round((improvementAreas / (maxImprovement / 100)) * 100);
};

module.exports = {
    calculateFinancialScores,
    calculateNetWorth,
    calculateDTI,
    calculateSavingsRate,
    calculateEmergencyFundCoverage,
    calculateRetirementReadiness,
    calculateFinancialIndependenceRatio,
    calculateBudgetAllocationCheck,
    calculateOverallFinancialHealthScore,
    calculateEchoImprovementPotential
};
