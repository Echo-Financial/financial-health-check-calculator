require('dotenv').config();
console.log('ENV FILE LOADED:', process.env.MONGO_URI ? 'YES' : 'NO');
console.log('ALL ENV VARIABLES:', process.env);
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan'); // Optional: For logging

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); // Optional: Logs HTTP requests

// Import Routes
const submitRoute = require('./routes/submit');

// Use Routes
app.use('/api', submitRoute);

// Retrieve environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Log the connection string (mask the password for security)
if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined. Check your .env file.');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Add this option to fix `ensureIndex` deprecation warning
})

    .then(() => {
        console.log('Connected to MongoDB Atlas');
        // Start the server only after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    });

// Handle Mongoose connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
