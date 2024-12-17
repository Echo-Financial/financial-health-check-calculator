
const { calculateFinancialScores } = require('../utils/financialCalculations');

// Increase Jest's default timeout

jest.setTimeout(60000); // Sets timeout to 60,000 ms (60 seconds)

describe('calculateFinancialScores', () => {
    it('should return correct scores for a typical user', () => {
        const userData = {
            personalDetails: {
                age: 28,
                annualIncome: 60000,
                incomeFromInterest: 3000,
                incomeFromProperty: 8000
            },
            expensesAssets: {
                monthlyExpenses: 1800,
                emergencyFunds: 12000,
                savings: 40000,
                totalDebt: 20000
            },
            retirementPlanning: {
                retirementAge: 60,
                expectedAnnualIncome: 35000,
                adjustForInflation: false
            },
            contactInfo: {
                email: 'uniqueuser3@example.com',
                name: 'Jane Smith',
                phone: '987654321'
            }
        };

        const expectedScores = {
            emergencyFundScore: 100, // 12000 >= 1800*6 (10800) => 100
            debtScore: 80,           // 20000 / 60000 = 0.333 => 80
            retirementScore: 91,     // (60 - 28) / 35 * 100 ≈ 91
            growthOpportunityScore: 100, // annualIncome > 50000 => 100
            potentialForImprovementScore: 10, // (100 - 80) + (100 - 100) /2 = 10
            overallFinancialHealthScore: 76 // (100 + 80 + 91 + 100 + 10)/5 = 76.2 ≈ 76
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
                incomeFromProperty: 10000
            },
            expensesAssets: {
                monthlyExpenses: 2000,
                emergencyFunds: 15000,
                savings: 50000,
                totalDebt: 0
            },
            retirementPlanning: {
                retirementAge: 65,
                expectedAnnualIncome: 50000,
                adjustForInflation: true
            },
            contactInfo: {
                email: 'zeroDebt@example.com',
                name: 'John Doe',
                phone: '123456789'
            }
        };

        const expectedScores = {
            emergencyFundScore: 100, // 15000 >= 2000*6 (12000) => 100
            debtScore: 100,           // 0 debt
            retirementScore: 86,     // (65 - 35) / 35 * 100 ≈ 86
            growthOpportunityScore: 100, // annualIncome > 50000 => 100
            potentialForImprovementScore: 0, // (100 - 100) + (100 - 100) /2 = 0
            overallFinancialHealthScore: 77 // (100 + 100 + 86 + 100 + 0)/5 = 77.2 ≈ 77
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
                incomeFromProperty: 12000
            },
            expensesAssets: {
                monthlyExpenses: 2500,
                emergencyFunds: 10000, // Less than 6 months (2500*6 = 15000)
                savings: 60000,
                totalDebt: 30000
            },
            retirementPlanning: {
                retirementAge: 65,
                expectedAnnualIncome: 60000,
                adjustForInflation: true
            },
            contactInfo: {
                email: 'insufficientFunds@example.com',
                name: 'Alice Johnson',
                phone: '555123456'
            }
        };

        const expectedScores = {
            emergencyFundScore: 67, // 10000 / (2500*6) = 0.666... * 100 = 66.666... => 67
            debtScore: 80,           // 30000 / 90000 = 0.333... <0.5 => 80
            retirementScore: 71,     // (65 - 40) / 35 * 100 ≈ 71
            growthOpportunityScore: 100, // annualIncome > 50000 => 100
            potentialForImprovementScore: 27, // ((100 - 80) + (100 - 67))/2 = (20 + 33)/2 = 26.5 => 27
            overallFinancialHealthScore: 69 // (67 + 80 + 71 + 100 + 27)/5 = 69
        };

        const scores = calculateFinancialScores(userData);

        expect(scores).toEqual(expectedScores);
    });

    // Add more test cases as needed to cover different scenarios
});
