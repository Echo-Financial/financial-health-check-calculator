// backend/src/__tests__/gpt.test.js
jest.setTimeout(30000); // Increase timeout to 15 seconds

require('openai/shims/node'); // Use require for Node fetch shim

const request = require('supertest');
const express = require('express');
const app = express();
const gptRouter = require('../routes/gpt'); // Adjust path if necessary
app.use(express.json());
app.use('/api/gpt', gptRouter);

// Instead of mocking the 'openai' constructor, mock the openaiClient instance directly:
jest.mock('../utils/openaiClient', () => ({
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
}));

// Now you can import your openaiClient (if needed) but it will be the mocked version.
const openaiClient = require('../utils/openaiClient');

describe('GPT API Endpoint Integration', () => {
  beforeEach(() => {
    openaiClient.chat.completions.create.mockClear();
  });

  it('should return a 200 status and a valid response from GPT API', async () => {
    openaiClient.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: 'Test GPT Response' } }],
    });
    const userData = {
      dti: 60,
      savingsRate: 50,
      emergencyFund: 8,
      retirement: 15,
      growthOpportunity: 30,
      potentialForImprovement: 67,
      overallFinancialHealth: 33,
    };

    const response = await request(app)
      .post('/api/gpt/gpt')
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body.response).toBe('Test GPT Response');
    expect(openaiClient.chat.completions.create).toHaveBeenCalledTimes(1);
  });

  it('should return a 500 status when there is an error from GPT API', async () => {
    openaiClient.chat.completions.create.mockRejectedValue(new Error('OpenAI API error'));
    const userData = {
      dti: 60,
      savingsRate: 50,
      emergencyFund: 8,
      retirement: 15,
      growthOpportunity: 30,
      potentialForImprovement: 67,
      overallFinancialHealth: 33,
    };

    const response = await request(app)
      .post('/api/gpt/gpt')
      .send(userData);

    expect(response.statusCode).toBe(500);
    expect(openaiClient.chat.completions.create).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ error: 'Submission failed. Please try again.' });
  });

  it('should call the OpenAI API with the correct prompt', async () => {
    openaiClient.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: 'Test GPT Response' } }],
    });
    const userData = {
      dti: 60,
      savingsRate: 50,
      emergencyFund: 8,
      retirement: 15,
      growthOpportunity: 30,
      potentialForImprovement: 67,
      overallFinancialHealth: 33,
    };

    await request(app)
      .post('/api/gpt/gpt')
      .send(userData);

    // Check that the prompt contains key substrings.
    expect(openaiClient.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o',
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining('Disclaimer:'),
          }),
        ],
      })
    );
  });
});
