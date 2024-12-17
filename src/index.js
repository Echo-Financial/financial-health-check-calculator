// src/index.js

// Load environment variables from .env file
require('dotenv').config();

// Optional: Log only essential environment variables to avoid exposing sensitive information
console.log('ENV FILE LOADED:', process.env.MONGO_URI ? 'YES' : 'NO');
// It's recommended to avoid logging all environment variables in production
// console.log('ALL ENV VARIABLES:', process.env);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // For HTTP request logging
const helmet = require('helmet'); // For securing HTTP headers
const app = require('./app');
const logger = require('./config/logger'); // Import the logger

// Middleware
app.use(helmet()); // Adds security-related HTTP headers
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests
app.use(morgan('dev')); // Logs HTTP requests in development mode

// Import Routes
const submitRoute = require('./routes/submit');
const authRoute = require('./routes/auth'); // Importing Authentication Routes
const healthRoute = require('./routes/health'); // Import other routes as needed

// Use Routes
app.use('/api/auth', authRoute); // Authentication routes
app.use('/api/submit', submitRoute); // Submit financial data routes
app.use('/api/health', healthRoute); // Health check routes

// Error Handling Middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler); // Should be the last middleware

// Retrieve environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Validate essential environment variables
if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined. Check your .env file.');
    process.exit(1); // Exit the application if MONGO_URI is missing
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // Remove this option if using Mongoose 6 or above
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');

        // Start the server only after a successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the application if DB connection fails
    });

// Handle Mongoose connection events (without duplicates)
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Optional: Gracefully handle application termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
});

