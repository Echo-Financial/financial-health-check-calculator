// jest.setup.js

const fetch = require('node-fetch'); // Ensure you're using node-fetch v2
global.fetch = fetch;              // Define global fetch for the OpenAI library
global.Response = fetch.Response;  // Also define global Response

require('dotenv').config();

global.Response = require('node-fetch').Response; // Or your chosen fetch polyfill

