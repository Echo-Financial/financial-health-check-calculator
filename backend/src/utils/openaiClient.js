// backend/src/utils/openaiClient.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Gets API key from environment variable
});

module.exports = openai;