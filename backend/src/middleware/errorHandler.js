const logger = require('../logger');

function errorHandler(err, req, res, next) {
  logger.error('Error handler caught:', err);

  // Decide on the response status code
  const statusCode = err.statusCode || 500;

  // Return a JSON error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
  });
}

module.exports = errorHandler;
