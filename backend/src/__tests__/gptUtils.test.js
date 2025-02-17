// src/__tests__/gptUtils.test.js

// Ensure the Node fetch shim is loaded (if required by OpenAI)
require('openai/shims/node');

const { callOpenAIForAnalysis } = require('../utils/gptUtils');

// Mock the openaiClient module, which is used within gptUtils.js.
jest.mock('../utils/openaiClient', () => ({
  chat: {
    completions: {
      create: jest.fn()
    }
  }
}));

const openaiClient = require('../utils/openaiClient');

describe('callOpenAIForAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the analysis text on a successful API call', async () => {
    // Arrange: set up sample data and prompt.
    const sampleAnalysisData = { sample: "data" };
    const samplePrompt = "Test prompt";

    // Simulate a successful API response.
    openaiClient.chat.completions.create.mockResolvedValue({
      choices: [
        { message: { content: "Mock analysis text" } }
      ]
    });

    // Act: call the utility function.
    const result = await callOpenAIForAnalysis(sampleAnalysisData, samplePrompt);

    // Assert: check that the returned result is as expected.
    expect(result).toBe("Mock analysis text");
    expect(openaiClient.chat.completions.create).toHaveBeenCalledTimes(1);
    expect(openaiClient.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: expect.any(String),
        messages: expect.any(Array),
        max_tokens: expect.any(Number),
        temperature: expect.any(Number),
      })
    );
  });

  it('should throw an error when the OpenAI API call fails', async () => {
    // Arrange.
    const sampleAnalysisData = { sample: "data" };
    const samplePrompt = "Test prompt";

    // Simulate an API failure.
    openaiClient.chat.completions.create.mockRejectedValue(new Error("OpenAI API failure"));

    // Act & Assert: expect the function to reject with a specific error message.
    await expect(callOpenAIForAnalysis(sampleAnalysisData, samplePrompt))
      .rejects
      .toThrow("Failed to get financial data analysis from OpenAI.");
  });
});
