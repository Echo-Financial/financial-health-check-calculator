// src/__tests__/gptUtils.test.js

// Mock openaiClient BEFORE importing gptUtils
jest.mock('../utils/openaiClient', () => ({
  generateText: jest.fn(),
}));

const { callOpenAIForAnalysis } = require('../utils/gptUtils');
const { generateText } = require('../utils/openaiClient');

describe('callOpenAIForAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the analysis text on a successful API call', async () => {
    // Arrange: set up sample data and prompt.
    const sampleAnalysisData = { sample: "data" };
    const samplePrompt = "Test prompt";

    // Simulate a successful API response.
    generateText.mockResolvedValue("Mock analysis text");

    // Act: call the utility function.
    const result = await callOpenAIForAnalysis(sampleAnalysisData, samplePrompt);

    // Assert: check that the returned result is as expected.
    expect(result).toBe("Mock analysis text");
    expect(generateText).toHaveBeenCalledTimes(1);
    expect(generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: expect.any(String),
        input: expect.any(String),
        max_output_tokens: expect.any(Number),
        temperature: expect.any(Number),
      })
    );
  });

  it('should throw an error when the OpenAI API call fails', async () => {
    // Arrange.
    const sampleAnalysisData = { sample: "data" };
    const samplePrompt = "Test prompt";

    // Simulate an API failure.
    generateText.mockRejectedValue(new Error("OpenAI API failure"));

    // Act & Assert: expect the function to reject with a specific error message.
    await expect(callOpenAIForAnalysis(sampleAnalysisData, samplePrompt))
      .rejects
      .toThrow("Failed to get financial data analysis from OpenAI.");

    expect(generateText).toHaveBeenCalledTimes(1);
  });
});
