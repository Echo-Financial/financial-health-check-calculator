// backend/src/__tests__/gpt.test.js
const request = require('supertest');
const express = require('express');

// 1) Top-level OpenAI mock BEFORE requiring the router.
//    This shape matches typical usage: openai.chat.completions.create(...)
const mockCreate = jest.fn().mockResolvedValue({
  choices: [{ message: { content: '### Test Summary\n\nAll good.' } }],
});
jest.mock('openai', () => {
  const ctor = jest.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } },
  }));
  // Support both require('openai') and const { OpenAI } = require('openai')
  ctor.OpenAI = ctor;
  return ctor;
});

// Small helper to mount ONLY the GPT route (faster & fewer side-effects)
function makeApp() {
  const app = express();
  app.use(express.json());
  // Important: require AFTER the mock so the route sees the mocked client
  const gptRouter = require('../routes/gpt');
  app.use('/api', gptRouter);
  return app;
}

// Keep tests resilient to superficial copy changes
const expectMarkdownString = (s) => {
  expect(typeof s).toBe('string');
  expect(s.length).toBeGreaterThan(0);
};

describe('POST /api/gpt', () => {
  let app;
  let server;
  let agent;
  beforeAll(() => {
    process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';
    app = makeApp();
    server = app.listen();
    agent = request(server);
    jest.setTimeout(15000);
  });

  afterAll(async () => {
    if (!server) return;
    await new Promise((resolve) => server.close(resolve));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('happy path – accepts scores and returns Markdown response', async () => {
    const res = await agent
      .post('/api/gpt')
      .send({
        dti: 45,
        savingsRate: 15,
        emergencyFund: 60,
        retirement: 50,
        growthOpportunity: 70,
        potentialForImprovement: 40,
        overallFinancialHealth: 55,
      });

    expect(res.status).toBe(200);
    // Most implementations respond as { response: string } or { response: markdown }
    const out = res.body.response ?? res.body.markdown ?? res.body.data?.response;
    expectMarkdownString(out);
    // Ensure our OpenAI mock was used (shape-agnostic)
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  test('happy path – accepts financialProfile and returns Markdown response', async () => {
    const res = await agent
      .post('/api/gpt')
      .send({
        financialProfile: {
          scores: { overallFinancialHealthScore: 55 },
          recommendations: {},
          projections: {},
          formatted: {},
        },
      });
    expect([200, 201]).toContain(res.status);
    const out = res.body.response ?? res.body.markdown ?? res.body.data?.response;
    expectMarkdownString(out);
  });

  test('error path – bubbles OpenAI errors as a 5xx', async () => {
    mockCreate.mockRejectedValueOnce(new Error('boom'));
    const res = await agent.post('/api/gpt').send({ dti: 40 });
    expect([500, 502]).toContain(res.status);
    expect(res.body).toBeDefined();
  });

  test('validation – missing body yields a 4xx or 200 (if defaults applied)', async () => {
    const res = await agent.post('/api/gpt').send({});
    expect([200, 400, 422]).toContain(res.status);
  });
});
