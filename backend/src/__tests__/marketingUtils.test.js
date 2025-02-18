// backend/src/__tests__/marketingUtils.test.js

const { prepareMarketingPrompt, callOpenAIForMarketing } = require('../utils/gptUtils');
const openaiClient = require('../utils/openaiClient');

// Mock the OpenAI client.
jest.mock('../utils/openaiClient', () => ({
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
}));

describe('Marketing Utilities', () => {
  describe('prepareMarketingPrompt', () => {
    it('should construct a prompt that includes key financial data', () => {
      const analysisData = {
        personalDetails: { age: 30, annualIncome: 50000 },
        calculatedMetrics: { retirementScore: 50, investmentGap: 10000 }
      };
      const analysisText = "This is a sample analysis report.";
      const prompt = prepareMarketingPrompt(analysisData, analysisText);

      expect(prompt).toContain("30");
      expect(prompt).toContain("50000");
      expect(prompt).toContain("50");
      expect(prompt).toContain("10000");
      expect(prompt).toContain("This is a sample analysis report");
    });
  });

  describe('callOpenAIForMarketing', () => {
    it('should parse and return marketing content when API call is successful', async () => {
      const fakeResponse = {
        choices: [
          { message: { content: JSON.stringify({ subject: "Test Subject", body: "Test Body", cta: "Test CTA" }) } }
        ]
      };
      openaiClient.chat.completions.create.mockResolvedValue(fakeResponse);
      const prompt = "Test prompt";
      const result = await callOpenAIForMarketing(prompt);
      expect(result).toEqual({ subject: "Test Subject", body: "Test Body", cta: "Test CTA" });
    });

    it('should throw an error when the API call fails', async () => {
      openaiClient.chat.completions.create.mockRejectedValue(new Error("API error"));
      await expect(callOpenAIForMarketing("Test prompt")).rejects.toThrow("Failed to generate marketing content from OpenAI.");
    });
  });
});
