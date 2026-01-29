// backend/src/utils/openaiClient.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Gets API key from environment variable
});

/**
 * Wrapper function for generating text with OpenAI
 * @param {Object} options - Configuration options
 * @param {string} options.model - Model name (e.g., 'gpt-4', 'gpt-5')
 * @param {string} options.input - The input/prompt text
 * @param {number} options.temperature - Temperature for randomness
 * @param {number} options.max_output_tokens - Maximum tokens in response
 * @returns {Promise<string>} Generated text
 */
async function generateText({ model, input, temperature, max_output_tokens }) {
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: input }],
    temperature,
    max_tokens: max_output_tokens,
  });
  
  return response.choices[0]?.message?.content || '';
}

module.exports = {
  openai,
  generateText,
};