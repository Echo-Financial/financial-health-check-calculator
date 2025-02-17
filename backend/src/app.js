// backend/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Routes
const submitRoute = require('./routes/submit');
const authRoute = require('./routes/auth');
const healthRoute = require('./routes/health');
const gptRoute = require('./routes/gpt'); // Keep this for the original instant feedback
const financialAnalysisRoute = require('./routes/financialAnalysis'); // <-- ADD THIS LINE: Import the new report route

// Error Handling Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/submit', submitRoute);
app.use('/api/auth', authRoute);
app.use('/api/health', healthRoute);
app.use('/api', gptRoute);          // Keep this for the original instant feedback
app.use('/api/financial-analysis', financialAnalysisRoute); // <-- ADD THIS LINE: Use the new report route

// Error Handling
app.use(errorHandler);

module.exports = app;