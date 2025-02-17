// src/__tests__/financialAnalysis.test.js

// Use the Node fetch shim required by OpenAI (this works in your gpt.test.js)
require('openai/shims/node');

const request = require('supertest');
const express = require('express');
const app = express();
const financialAnalysisRouter = require('../routes/financialAnalysis'); // Adjust path if needed
app.use(express.json());
app.use('/api/financial-analysis', financialAnalysisRouter);

// Mock the GPT utility function (similar to gpt.test.js)
jest.mock('../utils/gptUtils', () => {
  return {
    callOpenAIForAnalysis: jest.fn(),
  };
});
const { callOpenAIForAnalysis } = require('../utils/gptUtils');

describe('Financial Analysis API Endpoint Integration', () => {
  let server;
  beforeAll(() => {
    server = app.listen(3001);
  });
  afterAll(() => {
    server.close();
  });
  beforeEach(() => {
    callOpenAIForAnalysis.mockClear();
  });

  it('should return an analysis report from OpenAI', async () => {
    // Simulate a successful API response.
    callOpenAIForAnalysis.mockResolvedValue("Test analysis response");

    const sampleData = {
      originalData: {
        personalDetails: { age: 30, annualIncome: 50000, incomeFromInterest: 1000, incomeFromProperty: 5000 },
        expensesAssets: { monthlyExpenses: 2000, emergencyFunds: 10000, savings: 5000, totalDebt: 10000, totalInvestments: 2000 },
        retirementPlanning: { currentRetirementSavings: 15000, retirementAge: 65, targetRetirementSavings: 300000, adjustForInflation: true }
      },
      calculatedMetrics: {
        monthsOfEmergencyFundCoverage: 5,
        savingsRatePercentage: 10,
        investmentGap: 48000,
        yearsToRetirement: 35,
        debtToIncomeRatio: 20
      }
    };

    const res = await request(app)
      .post('/api/financial-analysis')
      .send(sampleData)
      .expect(200);

    expect(res.body).toHaveProperty('analysis', "Test analysis response");
    expect(callOpenAIForAnalysis).toHaveBeenCalledTimes(1);
  });

  it('should return an error when invalid data is provided', async () => {
    // Simulate an API error.
    callOpenAIForAnalysis.mockRejectedValue(new Error("OpenAI API error"));

    const invalidData = {}; // Missing required structure.
    await request(app)
      .post('/api/financial-analysis')
      .send(invalidData)
      .expect(500);

    expect(callOpenAIForAnalysis).toHaveBeenCalledTimes(1);
  });
});
