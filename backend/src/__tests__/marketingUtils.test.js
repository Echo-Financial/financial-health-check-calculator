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
      // Pass a dynamic monthly contribution value (for example: "$200.45")
      const prompt = prepareMarketingPrompt(analysisData, analysisText, "$200.45");

      // Verify key details are present with expected formatting:
      expect(prompt).toContain("30");
      expect(prompt).toContain("$50,000"); // now expects formatted annual income
      expect(prompt).toContain("50");      // retirement score
      // Instead of "10000", check for the retirement planning section header
      expect(prompt).toContain("Retirement Planning Recommendation:");
      // Ensure the dynamic monthly contribution is included
      expect(prompt).toContain("$200.45");
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

