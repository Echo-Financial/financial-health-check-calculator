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

// Define the allowed origins
const allowedOrigins = [
  'https://67de4f50c5b0810008c0f0ed--echo-financial.netlify.app',
  'https://your-custom-domain.com' // Add any other allowed domain here
];

// Use CORS middleware with a custom configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If the origin is not in the allowed list, return an error
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  // Optionally, set additional options like credentials if needed:
  // credentials: true,
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
