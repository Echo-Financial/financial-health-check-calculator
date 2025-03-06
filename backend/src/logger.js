const winston = require('winston');

const logger = winston.createLogger({
    level: 'error', // Set the default logging level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        // Add other transports (e.g., file transport) here if needed
    ],
});

module.exports = logger;