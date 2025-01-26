// testOpenAI.js (CommonJS style)

// 1. Load the OpenAI Node Shim + .env
require("openai/shims/node");
require("dotenv").config();

// 2. Import the new OpenAI client
const { OpenAI } = require("openai");

/**
 * Jest automatically discovers files in __tests__ or *.test.js.
 * This file now includes a proper "describe/test" block so
 * Jest will run it like a normal test suite.
 */
describe("OpenAI API Integration", () => {
  // We wrap our logic in a 'test' so Jest knows what to run.
  test("should list available models", async () => {
    // 3. Initialize the OpenAI client with your env key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("OPENAI_API_KEY (in test):", process.env.OPENAI_API_KEY);

    try {
      // 4. Fetch the list of models
      const response = await openai.models.list();
      console.log("Number of models returned:", response.data.length);

      // 5. Add an assertion so the test can pass/fail meaningfully
      // For instance, we ensure there's at least one model returned
      expect(response.data.length).toBeGreaterThan(0);
    } catch (error) {
      // 6. If an error occurs, the test will fail
      console.error("API Key Test Failed:", error.message);
      // Rethrow to fail the test
      throw error;
    }
  });
});
