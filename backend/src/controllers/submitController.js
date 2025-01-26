const User = require('../models/User');
const Joi = require('joi');
const { calculateFinancialScores } = require('../utils/financialCalculations');
const logger = require('../logger'); // Import the logger
const { userSchema } = require('../validations');


async function submitUser(req, res, next) {
  logger.info('Received POST /api/submit request:', req.body); // Log request
  try {
     const { error, value } = userSchema.validate(req.body);
        if (error) {
            logger.error('Validation Error:', error.details[0].message);
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
    const userData = value;
    const financialScores = calculateFinancialScores(userData);
    try {
        const user = new User(userData);
        await user.save();
       logger.info('User saved successfully', {userId: user._id, email: user.contactInfo.email});  // log successful save
      res.json({ success: true, scores: financialScores });
    } catch (saveError) {
        if (saveError.code === 11000 && saveError.keyPattern && saveError.keyPattern.email === 1) {
             logger.warn('Duplicate email attempted', {email: userData.contactInfo.email});
          return res.status(400).json({ success: false, message: 'Email already registered.' });
        } else {
            logger.error('Database error during user creation:', saveError); // Log the full error object for debugging.
          return res.status(500).json({ success: false, message: 'Server error during user creation.' });
        }
    }

  } catch (error) {
      logger.error('Validation or calculation error:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { submitUser };