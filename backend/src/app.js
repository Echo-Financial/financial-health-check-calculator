require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Routes
const submitRoute = require('./routes/submit');
const authRoute = require('./routes/auth');
const healthRoute = require('./routes/health'); // If implemented
const gptRoute = require('./routes/gpt'); // Add the gpt route
// const testRoute = require('./routes/test');     // Removed

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
app.use('/api/health', healthRoute); // If implemented
app.use('/api', gptRoute); // Add the gpt route
// app.use('/api/test', testRoute);     // Removed

// Error Handling
app.use(errorHandler);

module.exports = app;