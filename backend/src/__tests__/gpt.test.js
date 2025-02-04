require("dotenv").config();
const request = require('supertest');
const express = require('express');
const gptRouter = require('../routes/gpt');
const { OpenAI } = require("openai");
const logger = require('../logger');

// Mock logger
jest.mock('../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Create a mock Express app
const app = express();
app.use(express.json());
app.use('/api', gptRouter); // Use your actual API endpoint for GPT

// Mock OpenAI client
jest.mock('openai', () => {
    const mockChatCompletionCreate = jest.fn();
    return {
        OpenAI: jest.fn(() => ({
             chat: {
                completions: {
                   create: mockChatCompletionCreate,
                 },
            },
        })),
    };
});

describe('GPT API Endpoint Integration', () => {
    const mockOpenAI = new OpenAI();
  beforeEach(() => {
    jest.clearAllMocks();
  });

   test('should return a 200 status and a valid response from GPT API', async () => {
     // Mock the GPT response
         const mockChatCompletion = {
            choices: [{ message: { content: 'Test GPT response' } }],
         };
        mockOpenAI.chat.completions.create.mockResolvedValue(mockChatCompletion);


        const response = await request(app)
            .post('/api/gpt')
             .send({
                dti: 60,
                savingsRate: 50,
                emergencyFund: 8,
                retirement: 15,
                growthOpportunity: 30,
                potentialForImprovement: 67,
                overallFinancialHealth: 33,
                 age: 30,
                 annualIncome: 60000,
                 incomeFromInterest: 3000,
                 incomeFromProperty: 8000,
                 monthlyExpenses: 1800,
                 totalDebt: 20000,
                 savings: 40000,
                 emergencyFunds: 12000,
                 totalAssets: 60000,
                 totalInvestments: 20000,
                 currentRetirementSavings: 10000,
                 targetRetirementSavings: 500000,
                 retirementAge: 60,
                 creditScore: 750,
                 email: 'test@example.com',
                 name: 'Test User',
                 phone: '123-456-7890',
             });

        expect(response.statusCode).toBe(200);
         expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
       expect(response.body).toEqual({ response: 'Test GPT response' });
    });

  test('should return a 500 status when there is an error from GPT API', async () => {
    mockOpenAI.chat.completions.create.mockRejectedValue(new Error('OpenAI API error'));
    const response = await request(app)
      .post('/api/gpt')
            .send({
                dti: 60,
                savingsRate: 50,
                emergencyFund: 8,
                retirement: 15,
                growthOpportunity: 30,
                potentialForImprovement: 67,
                overallFinancialHealth: 33,
                 age: 30,
                 annualIncome: 60000,
                 incomeFromInterest: 3000,
                 incomeFromProperty: 8000,
                 monthlyExpenses: 1800,
                 totalDebt: 20000,
                 savings: 40000,
                 emergencyFunds: 12000,
                 totalAssets: 60000,
                 totalInvestments: 20000,
                 currentRetirementSavings: 10000,
                 targetRetirementSavings: 500000,
                 retirementAge: 60,
                 creditScore: 750,
                 email: 'test@example.com',
                 name: 'Test User',
                 phone: '123-456-7890',
            });

    expect(response.statusCode).toBe(500);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ error: 'Failed to generate insights' });
  });


    test('should call the OpenAI API with the correct prompt', async () => {
         const mockChatCompletion = {
            choices: [{ message: { content: 'Test GPT response' } }],
         };
      mockOpenAI.chat.completions.create.mockResolvedValue(mockChatCompletion);
      const requestBody = {
         dti: 60,
         savingsRate: 50,
         emergencyFund: 8,
          retirement: 15,
         growthOpportunity: 30,
          potentialForImprovement: 67,
         overallFinancialHealth: 33,
          age: 30,
         annualIncome: 60000,
         incomeFromInterest: 3000,
         incomeFromProperty: 8000,
          monthlyExpenses: 1800,
          totalDebt: 20000,
         savings: 40000,
         emergencyFunds: 12000,
          totalAssets: 60000,
         totalInvestments: 20000,
          currentRetirementSavings: 10000,
          targetRetirementSavings: 500000,
        retirementAge: 60,
          creditScore: 750,
          email: 'test@example.com',
          name: 'Test User',
         phone: '123-456-7890',
       };

        await request(app)
            .post('/api/gpt')
            .send(requestBody);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1);
        const expectedPrompt = `You are a professional and empathetic financial assistant from Echo Financial Advisors Ltd. Your role is to provide general educational insights based on the financial scores provided. You must not refer to a team of advisors, and should refer to the advisor in the singular.

IMPORTANT REGULATORY NOTE (NZ):
"The following information is general guidance and does not constitute individualized financial advice. Please consult a licensed advisor for advice specific to your situation."

Instructions:
1. Begin with the above disclaimer.
2. Provide a brief summary of the user's financial scores, noting areas of strength and weakness, and use numerical values in your summarization.
3. For each major area (Debt to Income, Savings, Emergency Fund, Retirement, Growth Opportunity, and Potential for Improvement), provide 1-3 clear and concise improvement tips.
4. Ensure the entire response is professionally formatted with clear section headings and bullet lists.
5. End with a complete, persuasive call-to-action (CTA) that encourages the user to schedule a consultation with the qualified advisor at Echo Financial Advisors Ltd.
6.  Use the heading "Recommendations" before the call to action.
7.  Ensure the language used in the "Recommendations" section is unique and does not duplicate the language used in the "Next Steps" section.
8.  Do not use the phrase "our expert advisors" or any other language that suggests a team of advisors. Ensure the language used refers to a single advisor.
9. Keep the final response under 250 words and ensure it does not end abruptly.

User's Scores (out of 100, where 0 is the lowest and 100 is the highest):
- Debt to Income Ratio Score: 60 (A low score indicates higher debt relative to income, and a high score indicates lower debt relative to income)
- Savings Rate Score: 50 (A low score indicates a low savings rate, and a high score indicates a high savings rate)
- Emergency Fund Score: 8 (A low score indicates a small emergency fund relative to expenses, and a high score indicates a large emergency fund relative to expenses)
- Retirement Score: 15 (A low score indicates a low preparedness for retirement, and a high score indicates a high preparedness for retirement)
- Growth Opportunity Score: 30 (A low score indicates fewer assets available for growth, and a high score indicates more assets available for growth)
- Potential for Improvement Score: 67 (A high score indicates a high potential for improvement across the other score areas, and a low score indicates less scope for improvement)
- Overall Financial Health Score: 33 (A low score indicates a lower overall financial health, and a high score indicates a high overall financial health)


Please generate a complete, professionally formatted response that includes:
- A brief summary of the financial assessment that focuses on the numerical values of each score.
- Improvement tips for each major area in a numbered list that is relevant to the numerical values of the score.
- Use the heading "Recommendations" before the call to action.
- Ensure the language used in the "Recommendations" section is unique and does not duplicate the language used in the "Next Steps" section.
- Do not use the phrase "our expert advisors" or any other language that suggests a team of advisors.
- A persuasive and complete final sentence inviting the user to schedule a consultation with the qualified advisor.
`;
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: expectedPrompt }],
        max_tokens: 500,
        temperature: 0.7
      });
    });
});