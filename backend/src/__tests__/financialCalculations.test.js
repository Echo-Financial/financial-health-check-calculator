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
                totalDebt: 20000,
            },
            retirementPlanning: {
                retirementAge: 60,
                expectedAnnualIncome: 35000,
                adjustForInflation: false,
            },
            contactInfo: {
                email: 'uniqueuser3@example.com',
                name: 'Jane Smith',
                phone: '987654321',
            },
        };

        const expectedScores = {
            dtiScore: 33,                  // Updated logic
            savingsScore: 100,             // Updated logic
            emergencyFundScore: 100,       // Emergency fund >= 6 months
            retirementScore: 83,           // Updated retirement logic
            growthOpportunityScore: 80,    // Income falls in the $50,000-$100,000 range
            potentialForImprovementScore: 27, // Updated logic
            overallFinancialHealthScore: 71, // Average of all scores
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
                totalDebt: 0,
            },
            retirementPlanning: {
                retirementAge: 65,
                expectedAnnualIncome: 50000,
                adjustForInflation: true,
            },
            contactInfo: {
                email: 'zeroDebt@example.com',
                name: 'John Doe',
                phone: '123456789',
            },
        };

        const expectedScores = {
            dtiScore: 100,                 // Zero debt = maximum score
            savingsScore: 100,             // Updated logic
            emergencyFundScore: 100,       // Emergency fund >= 6 months
            retirementScore: 89,           // Updated retirement logic
            growthOpportunityScore: 80,    // Income falls in the $50,000-$100,000 range
            potentialForImprovementScore: 0, // No improvement needed
            overallFinancialHealthScore: 78, // Average of all scores
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
                emergencyFunds: 10000, // Less than 6 months (2500*6 = 15000)
                savings: 60000,
                totalDebt: 30000,
            },
            retirementPlanning: {
                retirementAge: 65,
                expectedAnnualIncome: 60000,
                adjustForInflation: true,
            },
            contactInfo: {
                email: 'insufficientFunds@example.com',
                name: 'Alice Johnson',
                phone: '555123456',
            },
        };

        const expectedScores = {
            dtiScore: 33,                  // Updated logic
            savingsScore: 100,             // Updated logic
            emergencyFundScore: 67,        // Emergency fund < 6 months
            retirementScore: 95,           // Updated retirement logic
            growthOpportunityScore: 80,    // Income falls in the $50,000-$100,000 range
            potentialForImprovementScore: 37, // Updated logic
            overallFinancialHealthScore: 69, // Average of all scores
        };

        const scores = calculateFinancialScores(userData);

        expect(scores).toEqual(expectedScores);
    });

    // Add more test cases as needed to cover different scenarios
});
