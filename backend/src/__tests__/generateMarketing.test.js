// backend/src/__tests__/generateMarketing.test.js

require('openai/shims/node'); // Ensure Request and fetch are defined

const request = require('supertest');
const app = require('../app'); // Ensure app is exported from backend/src/app.js

// Mock the GPT utility functions used in the endpoint.
jest.mock('../utils/gptUtils', () => ({
  prepareMarketingPrompt: jest.fn(),
  callOpenAIForMarketing: jest.fn(),
}));

const { prepareMarketingPrompt, callOpenAIForMarketing } = require('../utils/gptUtils');

describe('POST /api/generate-marketing', () => {
  beforeEach(() => {
    prepareMarketingPrompt.mockClear();
    callOpenAIForMarketing.mockClear();
  });

  it('should return marketing content when valid data is provided', async () => {
    const fakeMarketingContent = { subject: "Test Subject", body: "Test Body", cta: "Test CTA" };
    prepareMarketingPrompt.mockReturnValue("Generated marketing prompt");
    callOpenAIForMarketing.mockResolvedValue(fakeMarketingContent);

    const payload = {
      personalDetails: { age: 30, annualIncome: 50000 },
      expensesAssets: { monthlyExpenses: 2000, emergencyFunds: 10000, savings: 5000, totalDebt: 10000, totalInvestments: 2000 },
      retirementPlanning: { currentRetirementSavings: 15000, retirementAge: 65, targetRetirementSavings: 300000, adjustForInflation: true },
      calculatedMetrics: { retirementScore: 50, investmentGap: 10000 },
      analysisText: "This is a sample analysis report."
    };

    const res = await request(app)
      .post('/api/generate-marketing')
      .send(payload)
      .expect(200);

    expect(prepareMarketingPrompt).toHaveBeenCalledWith(payload, payload.analysisText);
    expect(callOpenAIForMarketing).toHaveBeenCalledWith("Generated marketing prompt");
    expect(res.body).toEqual(fakeMarketingContent);
  });

  it('should return a 400 error if analysisText is missing in payload', async () => {
    const payload = {
      personalDetails: { age: 30, annualIncome: 50000 },
      // Missing analysisText.
    };

    const res = await request(app)
      .post('/api/generate-marketing')
      .send(payload)
      .expect(400);

    expect(res.body).toEqual({ error: 'Missing analysisText in payload.' });
  });

  it('should return a 500 error if an exception occurs', async () => {
    prepareMarketingPrompt.mockReturnValue("Generated marketing prompt");
    callOpenAIForMarketing.mockRejectedValue(new Error("OpenAI API error"));

    const payload = {
      personalDetails: { age: 30, annualIncome: 50000 },
      expensesAssets: { monthlyExpenses: 2000, emergencyFunds: 10000, savings: 5000, totalDebt: 10000, totalInvestments: 2000 },
      retirementPlanning: { currentRetirementSavings: 15000, retirementAge: 65, targetRetirementSavings: 300000, adjustForInflation: true },
      calculatedMetrics: { retirementScore: 50, investmentGap: 10000 },
      analysisText: "This is a sample analysis report."
    };

    const res = await request(app)
      .post('/api/generate-marketing')
      .send(payload)
      .expect(500);

    expect(res.body).toEqual({ error: 'Failed to generate marketing content.' });
  });
});
