require('openai/shims/node'); // Use require for Node fetch shim

// Declare the standalone mock function variable before it's used.
let mockedCreate;

const request = require('supertest');
const express = require('express');
const app = express();
const gptRouter = require('../routes/gpt'); // Adjust path if necessary
app.use(express.json());
app.use('/api/gpt', gptRouter);

// Mock the OpenAI module.
jest.mock('openai', () => {
  const originalModule = jest.requireActual('openai');
  // Initialize the mock function here.
  mockedCreate = jest.fn();
  return {
    ...originalModule,
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockedCreate, // Use our standalone mock function
        },
      },
    })),
  };
});
const { OpenAI } = require('openai');

describe('GPT API Endpoint Integration', () => {
  let server;
  beforeAll(() => {
    server = app.listen(3001);
  });
  afterAll(() => {
    server.close();
  });
  beforeEach(() => {
    mockedCreate.mockClear();
  });

  it('should return a 200 status and a valid response from GPT API', async () => {
    mockedCreate.mockResolvedValue({
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
    expect(mockedCreate).toHaveBeenCalledTimes(1);
  });

  it('should return a 500 status when there is an error from GPT API', async () => {
    mockedCreate.mockRejectedValue(new Error('OpenAI API error'));
    const userData = {
      dti: 60,
      savingsRate: 50,
      emergencyFund: 8,
      retirement: 15,
      growthOpportunity: 30,
      potentialForImprovement: 67,
      overallFinancialHealth: 33,
    };

    const response = await request(app).post('/api/gpt/gpt')
      .send(userData);

    expect(response.statusCode).toBe(500);
    expect(mockedCreate).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ error: 'Submission failed. Please try again.' });
  });

  it('should call the OpenAI API with the correct prompt', async () => {
    mockedCreate.mockResolvedValue({
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

    await request(app).post('/api/gpt/gpt').send(userData);

    // Instead of matching the entire prompt, check for expected substrings.
    expect(mockedCreate).toHaveBeenCalledWith(
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
