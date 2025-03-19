// backend/src/__tests__/financialCalculations.test.js
const {
  calculateFinancialScores,
  calculateRequiredContribution,
  calculateInvestmentGrowth,
  getInvestmentProjections,
  getRetirementProjections,
  calculateCompleteFinancialProfile,
  calculateRecommendedDebtPayment
} = require('../utils/financialCalculations');


describe("Financial Calculations", () => {
  // Sample user data for testing
  const sampleUserData = {
    personalDetails: {
      age: 40,
      annualIncome: 60000,
      incomeFromInterest: 2000,
      incomeFromProperty: 4000,
      name: "Test User"
    },
    expensesAssets: {
      monthlyExpenses: 2500,
      emergencyFunds: 5000,
      savings: 10000,
      totalDebt: 15000,
      totalInvestments: 20000,
    },
    retirementPlanning: {
      retirementAge: 65,
      targetRetirementSavings: 1000000,
      currentRetirementSavings: 50000,
      adjustForInflation: true,
    },
    contactInfo: {
      email: "test@example.com",
      name: "Test User",
      phone: "1234567890"
    }
  };

  test("calculateFinancialScores returns expected keys", () => {
    const scores = calculateFinancialScores(sampleUserData);
    expect(scores).toHaveProperty("dtiScore");
    expect(scores).toHaveProperty("savingsScore");
    expect(scores).toHaveProperty("emergencyFundScore");
    expect(scores).toHaveProperty("retirementScore");
    expect(scores).toHaveProperty("growthOpportunityScore");
    expect(scores).toHaveProperty("overallFinancialHealthScore");
    expect(scores).toHaveProperty("potentialForImprovementScore");
    expect(scores).toHaveProperty("retirementTarget");
  });

  test("getInvestmentProjections calculates monthlyAmount within expected range", () => {
    // Compute total annual income including interest and property income
    const totalAnnualIncome = sampleUserData.personalDetails.annualIncome +
                              sampleUserData.personalDetails.incomeFromInterest +
                              sampleUserData.personalDetails.incomeFromProperty;
    const projections = getInvestmentProjections(
      sampleUserData.expensesAssets.totalInvestments,
      totalAnnualIncome,
      sampleUserData.personalDetails.age,
      sampleUserData.expensesAssets.totalDebt,
      0.05
    );
    // Expect monthly investment amount to be between 100 and 2000
    expect(projections.monthlyAmount).toBeGreaterThanOrEqual(100);
    expect(projections.monthlyAmount).toBeLessThanOrEqual(2000);
  });

  test("getRetirementProjections returns reasonable estimates", () => {
    const totalAnnualIncome = sampleUserData.personalDetails.annualIncome +
                              sampleUserData.personalDetails.incomeFromInterest +
                              sampleUserData.personalDetails.incomeFromProperty;
    const yearsToRetirement = sampleUserData.retirementPlanning.retirementAge - sampleUserData.personalDetails.age;
    const retirementProj = getRetirementProjections(
      sampleUserData.retirementPlanning.currentRetirementSavings,
      sampleUserData.retirementPlanning.targetRetirementSavings,
      yearsToRetirement,
      totalAnnualIncome,
      sampleUserData.personalDetails.age,
      0.05
    );
    // Check that the monthly contribution is a positive number
    expect(parseFloat(retirementProj.monthlyContribution)).toBeGreaterThan(0);
    // Check that the future value without contributions is calculated
    expect(retirementProj.futureValueWithoutContributions).toBeGreaterThan(0);
  });

  test("calculateCompleteFinancialProfile returns complete structure", () => {
    const profile = calculateCompleteFinancialProfile(sampleUserData);
    expect(profile).toHaveProperty("scores");
    expect(profile).toHaveProperty("recommendations");
    expect(profile).toHaveProperty("projections");
    expect(profile).toHaveProperty("formatted");
  });
});
