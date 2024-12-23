
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const submitRoute = require('./routes/submit');
const authRoute = require('./routes/auth');
const healthRoute = require('./routes/health'); // If implemented
const testRoute = require('./routes/test'); // Optional for testing

const errorHandler = require('./middleware/errorHandler');

console.log('Environment Variables Loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/submit', submitRoute);
app.use('/api/auth', authRoute);
app.use('/api/health', healthRoute); // If implemented
app.use('/api/test', testRoute); // Optional

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
