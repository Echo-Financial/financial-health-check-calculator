require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

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

// Trust proxy to capture correct client IPs behind proxies/load balancers
app.set('trust proxy', 1);

// CORS from environment
const ALLOWED = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin || ALLOWED.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

// Rate limiters (minimal scope)
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
const gptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/submit', submitLimiter);
app.use('/api/gpt', gptLimiter);

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
