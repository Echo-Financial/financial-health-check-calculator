const { calculateFinancialScores } = require('../utils/financialCalculations');

describe('calculateFinancialScores', () => {
  it('should return correct scores for a typical user', () => {
    const userData = {
      personalDetails: {
        age: 28,
        annualIncome: 60000,
        incomeFromInterest: 3000,
        incomeFromProperty: 8000,
      },
      expensesAssets: {
        monthlyExpenses: 1800,
        emergencyFunds: 12000,
        savings: 40000,
        totalInvestments: 20000,
        totalDebt: 20000,
      },
      retirementPlanning: {
        retirementAge: 60,
        targetRetirementSavings: 100000,
        adjustForInflation: false,
        // currentRetirementSavings is intentionally left undefined (defaults to 0)
      },
      contactInfo: {
        email: 'uniqueuser3@example.com',
        name: 'Jane Smith',
        phone: '987654321',
      },
    };

    const expectedScores = {
      dtiScore: 33,                     // 100 - ((20000/60000*100)*2) ≈ 33
      savingsScore: 100,                // Savings rate far exceeds a target of 10%
      emergencyFundScore: 100,          // emergencyFunds exceeds 6 months' expenses (1800*6=10800)
      retirementScore: 100,             // Enhanced logic yields a value > target (capped to 100)
      growthOpportunityScore: 0,        // Investments exceed 20% target (60000*0.2=12000)
      overallFinancialHealthScore: 67,  // Average of: (33 + 100 + 100 + 100 + 0) / 5 ≈ 67
      potentialForImprovementScore: 33, // 100 - 67 = 33
    };

    const scores = calculateFinancialScores(userData);
    expect(scores).toEqual(expectedScores);
  });

  it('should handle zero debt correctly', () => {
    const userData = {
      personalDetails: {
        age: 35,
        annualIncome: 80000,
        incomeFromInterest: 4000,
        incomeFromProperty: 10000,
      },
      expensesAssets: {
        monthlyExpenses: 2000,
        emergencyFunds: 15000,
        savings: 50000,
        totalInvestments: 30000,
        totalDebt: 0,
      },
      retirementPlanning: {
        retirementAge: 65,
        targetRetirementSavings: 200000,
        adjustForInflation: true,
        // currentRetirementSavings defaults to 0
      },
      contactInfo: {
        email: 'zeroDebt@example.com',
        name: 'John Doe',
        phone: '123456789',
      },
    };

    const expectedScores = {
      dtiScore: 100,                    // No debt yields a perfect score
      savingsScore: 100,                // Savings rate is well above the target
      emergencyFundScore: 100,          // emergencyFunds exceed required 6 months expenses (2000*6=12000)
      retirementScore: 100,             // Enhanced calculation yields a value > target (capped to 100)
      growthOpportunityScore: 0,        // Investments exceed the 20% target (80000*0.2=16000)
      overallFinancialHealthScore: 80,  // Average of: (100 + 100 + 100 + 100 + 0) / 5 = 80
      potentialForImprovementScore: 20, // 100 - 80 = 20
    };

    const scores = calculateFinancialScores(userData);
    expect(scores).toEqual(expectedScores);
  });

  it('should handle insufficient emergency funds', () => {
    const userData = {
      personalDetails: {
        age: 40,
        annualIncome: 90000,
        incomeFromInterest: 5000,
        incomeFromProperty: 12000,
      },
      expensesAssets: {
        monthlyExpenses: 2500,
        emergencyFunds: 10000, // Less than required for 6 months (2500*6=15000)
        savings: 60000,
        totalInvestments: 20000,
        totalDebt: 30000,
      },
      retirementPlanning: {
        retirementAge: 65,
        targetRetirementSavings: 300000,
        adjustForInflation: true,
        // currentRetirementSavings defaults to 0
      },
      contactInfo: {
        email: 'insufficientFunds@example.com',
        name: 'Alice Johnson',
        phone: '555123456',
      },
    };

    const expectedScores = {
      dtiScore: 33,                     // Calculated as 100 - ((30000/90000*100)*2) ≈ 33
      savingsScore: 100,                // Savings rate is above the target (for age 40, target is 40)
      emergencyFundScore: 67,           // (10000/15000)*100 ≈ 67
      retirementScore: 100,             // Enhanced calculation yields a value > target (capped to 100)
      growthOpportunityScore: 0,        // Investments exceed the 20% target (90000*0.2=18000)
      overallFinancialHealthScore: 60,  // Average of: (33 + 100 + 67 + 100 + 0) / 5 = 60
      potentialForImprovementScore: 40, // 100 - 60 = 40
    };

    const scores = calculateFinancialScores(userData);
    expect(scores).toEqual(expectedScores);
  });
});
