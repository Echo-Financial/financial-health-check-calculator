// backend/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const submitRoute = require('./routes/submit');
const authRoute = require('./routes/auth');
const healthRoute = require('./routes/health');
const gptRoute = require('./routes/gpt');
const financialAnalysisRoute = require('./routes/financialAnalysis');
const generateMarketingRouter = require('./routes/generate-marketing');
const sendMarketingEmailRouter = require('./routes/sendMarketingEmail');
const reviewRouter = require('./routes/review');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/submit', submitRoute);
app.use('/api/auth', authRoute);
app.use('/api/health', healthRoute);
app.use('/api', gptRoute);
app.use('/api/financial-analysis', financialAnalysisRoute);
app.use('/api/generate-marketing', generateMarketingRouter);
app.use('/api/send-marketing-email', sendMarketingEmailRouter);
app.use('/api/reviews', reviewRouter);
app.use(errorHandler);

module.exports = app;