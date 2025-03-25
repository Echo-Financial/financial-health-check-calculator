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

// Define the allowed origins (make sure they exactly match the incoming request origin)
const allowedOrigins = [
  'http://localhost:3000',  // For local development
  'https://67de4f50c5b0810008c0f0ed--echo-financial.netlify.app',
  'https://your-custom-domain.com' // Replace with your actual custom domain if applicable
];

// Helper function to normalize the origin (remove trailing slash)
function normalizeOrigin(origin) {
  return origin ? origin.replace(/\/$/, "") : origin;
}

// Use CORS middleware with a custom configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl requests)
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.indexOf(normalizedOrigin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  // credentials: true, // Uncomment if your requests require credentials
}));

app.use(express.json());
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
