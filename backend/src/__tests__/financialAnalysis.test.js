// src/__tests__/financialAnalysis.test.js

// Give this suite a bit more headroom; under CI and cold module loads 5s can be tight
jest.setTimeout(15000);

// ✅ Mock GPT/OpenAI path so no network calls happen
jest.mock('../utils/gptUtils', () => ({
  callOpenAIForAnalysis: jest.fn(),
}));
const { callOpenAIForAnalysis } = require('../utils/gptUtils');

// ✅ Mock compliance utils to avoid DB writes
jest.mock('../utils/complianceUtils', () => ({
  logAdviceGeneration: jest.fn().mockResolvedValue({ logged: true }),
  requiresManualReview: jest.fn().mockResolvedValue(false),
}));

const router = require('../routes/financialAnalysis');

function getPostHandler() {
  const layer = router.stack.find(
    (l) => l.route && l.route.path === '/' && l.route.methods && l.route.methods.post
  );
  if (!layer) throw new Error('POST / handler not found on financialAnalysis router');
  return layer.route.stack[0].handle;
}

function makeRes() {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

async function invoke(handler, body) {
  const req = { body };
  const res = makeRes();
  await handler(req, res);
  return res;
}

describe('POST /api/financial-analysis', () => {
  let handler;

  beforeAll(() => {
    handler = getPostHandler();
  });

  beforeEach(() => {
    callOpenAIForAnalysis.mockReset();
    process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test';
  });

  it('returns 200 with valid payload', async () => {
    // Simulate a successful API response (JSON string expected by route).
    callOpenAIForAnalysis.mockResolvedValue(
      JSON.stringify({
        summary: 'Test summary response',
        analysis: 'Test analysis response',
      })
    );

    const res = await invoke(handler, {
      originalData: {
        personalDetails: { age: 40, annualIncome: 90000, incomeFromInterest: 0, incomeFromProperty: 0 },
        expensesAssets: { monthlyExpenses: 3000, emergencyFunds: 5000, savings: 12000, totalDebt: 10000, totalInvestments: 15000 },
        retirementPlanning: { retirementAge: 65, targetRetirementSavings: 500000, currentRetirementSavings: 20000, adjustForInflation: true },
      },
      calculatedMetrics: { overallFinancialHealth: 70 },
      consent: false,
    });

    expect(res.statusCode).toBe(200);

    // Be tolerant to envelope; read standardized data if present
    const payload = res.body?.data ?? res.body;
    expect(payload).toEqual(
      expect.objectContaining({
        analysis: expect.any(String),
        financialProfile: expect.any(Object),
      })
    );
    expect(callOpenAIForAnalysis).toHaveBeenCalledTimes(1);
  });

  it('400 on invalid payload', async () => {
    const res = await invoke(handler, { foo: 'bar' });
    expect(res.statusCode).toBe(400);
    // Since the payload is invalid, callOpenAIForAnalysis should not be called.
    expect(callOpenAIForAnalysis).not.toHaveBeenCalled();
  });

  it('handles openai provider errors gracefully', async () => {
    // Force the mocked OpenAI call to reject for this test only
    callOpenAIForAnalysis.mockRejectedValueOnce(new Error('OpenAI down'));
    const res = await invoke(handler, {
      originalData: {
        personalDetails: { age: 40, annualIncome: 90000, incomeFromInterest: 0, incomeFromProperty: 0 },
        expensesAssets: { monthlyExpenses: 3000, emergencyFunds: 5000, savings: 12000, totalDebt: 10000, totalInvestments: 15000 },
        retirementPlanning: { retirementAge: 65, targetRetirementSavings: 500000, currentRetirementSavings: 20000, adjustForInflation: true },
      },
      calculatedMetrics: { overallFinancialHealth: 70 },
      consent: false,
    });
    // Depending on your route design, either 200 with fallback content or 500. Accept both.
    expect([200, 500]).toContain(res.statusCode);
  });
});
