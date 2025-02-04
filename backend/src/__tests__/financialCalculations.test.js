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
            },
            contactInfo: {
                email: 'uniqueuser3@example.com',
                name: 'Jane Smith',
                phone: '987654321',
            },
        };

        const expectedScores = {
            dtiScore: 33,
            savingsScore: 100,
            emergencyFundScore: 100,
            retirementScore: 0,
            growthOpportunityScore: 100,
            potentialForImprovementScore: 33,
            overallFinancialHealthScore: 67,
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
            },
            contactInfo: {
                email: 'zeroDebt@example.com',
                name: 'John Doe',
                phone: '123456789',
            },
        };

        const expectedScores = {
            dtiScore: 100,
            savingsScore: 100,
            emergencyFundScore: 100,
            retirementScore: 0,
            growthOpportunityScore: 100,
            potentialForImprovementScore: 20,
            overallFinancialHealthScore: 80,
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
                totalInvestments: 20000,
                totalDebt: 30000,
            },
            retirementPlanning: {
                retirementAge: 65,
                targetRetirementSavings: 300000,
                adjustForInflation: true,
            },
             contactInfo: {
                email: 'insufficientFunds@example.com',
                name: 'Alice Johnson',
                phone: '555123456',
            },
        };

        const expectedScores = {
            dtiScore: 33,
            savingsScore: 100,
            emergencyFundScore: 67,
            retirementScore: 0,
            growthOpportunityScore: 100,
            potentialForImprovementScore: 40,
            overallFinancialHealthScore: 60,
        };

        const scores = calculateFinancialScores(userData);

        expect(scores).toEqual(expectedScores);
    });

    // Add more test cases as needed to cover different scenarios
});