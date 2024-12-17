// src/app.js

const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const submitRoutes = require('./routes/submit'); // Assuming existing routes
const healthRoutes = require('./routes/health'); // Assuming existing routes
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/submit', submitRoutes);
app.use('/api/health', healthRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;

