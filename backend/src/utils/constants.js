/**
 * Financial Constants and Configuration
 */

const CONSTANTS = {
  // Economic Assumptions
  INFLATION_RATE: 0.025, // 2.5%
  DEFAULT_GROWTH_RATE: 0.05, // 5%
  
  // Retirement Planning
  RETIREMENT_SAVINGS_ALLOCATION: 0.5, // 50% of savings counted towards retirement
  RETIREMENT_INVESTMENT_ALLOCATION: 0.7, // 70% of investments counted towards retirement
  RETIREMENT_CONTRIBUTION_RATE: 0.10, // 10% of income assumed for future contributions
  
  // Debt Management
  DEBT_PAYMENT_INCOME_PERCENTAGE: 0.15, // Max 15% of income for debt repayment
  DEBT_TERM_MONTHS: 36, // Target debt payoff in 3 years
  
  // Emergency Fund
  EMERGENCY_FUND_MONTHS: 6,
  EMERGENCY_CONTRIBUTION_RATE: 0.10, // 10% of income for emergency fund building
  
  // Investment Recommendations
  INVESTMENT_RECOMMENDATION_RATES: {
    UNDER_30: 0.10,
    UNDER_40: 0.12,
    UNDER_50: 0.15,
    DEFAULT: 0.20
  },
  
  // Target Savings Rates (Age -> Percent)
  TARGET_SAVINGS_RATES: [
    { ageLimit: 30, rate: 10 },
    { ageLimit: 40, rate: 15 },
    { ageLimit: 50, rate: 20 },
    { ageLimit: 60, rate: 25 },
    { ageLimit: Infinity, rate: 30 }
  ],
  
  // Target Investment Multiples (Age -> Multiple of Income)
  TARGET_INVESTMENT_MULTIPLES: [
    { ageLimit: 30, multiple: 0.5 },
    { ageLimit: 40, multiple: 1 },
    { ageLimit: 50, multiple: 2 },
    { ageLimit: 60, multiple: 3 },
    { ageLimit: Infinity, multiple: 5 }
  ]
};

module.exports = CONSTANTS;
