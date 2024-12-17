// src/utils/financialCalculations.js

/**
 * Calculates Net Worth.
 * @param {number} totalAssets - User's total assets
 * @param {number} totalDebt - User's total debt
 * @returns {number} netWorth
 */
function calculateNetWorth(totalAssets, totalDebt) {
  return totalAssets - totalDebt;
}

/**
* Calculates Emergency Fund Coverage in months.
* @param {number} emergencyFunds - Amount in emergency funds
* @param {number} monthlyExpenses - User's monthly expenses
* @returns {number} months of coverage
*/
function calculateEmergencyFundCoverage(emergencyFunds, monthlyExpenses) {
  if (monthlyExpenses === 0) return 0;
  return emergencyFunds / monthlyExpenses;
}

/**
* Calculates Retirement Readiness as a percentage.
* (How close the user is to their target retirement savings)
* @param {number} currentRetirementSavings - Current retirement savings
* @param {number} targetRetirementSavings - Target retirement savings
* @returns {number} Retirement readiness percentage (0-100+)
*/
function calculateRetirementReadiness(currentRetirementSavings, targetRetirementSavings) {
  if (targetRetirementSavings === 0) return 0;
  return (currentRetirementSavings / targetRetirementSavings) * 100;
}

/**
* Calculates Credit Health Score based on credit score.
* - If creditScore >= 700 => score = 100
* - Else score = (creditScore / 700) * 100 (rounded)
*
* @param {number} creditScore - User's credit score
* @returns {number} Credit Health Score (0-100)
*/
function calculateCreditHealthScore(creditScore) {
  if (creditScore >= 700) return 100;
  return Math.round((creditScore / 700) * 100);
}

/**
* Calculates Overall Financial Health Score by averaging four components:
* - Net Worth Score: If netWorth >= 0 => 100, else 0
* - Emergency Fund Score: If coverage >= 6 months => 100, else (coverage/6)*100
* - Retirement Score: If retirementReadiness >= 100 => 100 else retirementReadiness
* - Credit Health Score: As calculated by creditHealthScore
*
* @param {object} metrics - { netWorth, emergencyFundCoverage, retirementReadiness, creditHealthScore }
* @returns {number} Overall Financial Health Score (0-100)
*/
function calculateOverallFinancialHealthScore({ netWorth, emergencyFundCoverage, retirementReadiness, creditHealthScore }) {
  const netWorthScore = netWorth >= 0 ? 100 : 0;
  const emergencyFundScore = emergencyFundCoverage >= 6 ? 100 : Math.round((emergencyFundCoverage / 6) * 100);
  const retirementScore = retirementReadiness >= 100 ? 100 : Math.round(retirementReadiness);

  const total = netWorthScore + emergencyFundScore + retirementScore + creditHealthScore;
  return Math.round(total / 4);
}

module.exports = {
  calculateNetWorth,
  calculateEmergencyFundCoverage,
  calculateRetirementReadiness,
  calculateCreditHealthScore,
  calculateOverallFinancialHealthScore,
};
