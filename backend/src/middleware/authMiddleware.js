
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT Secret
 * 
 * Ensure that the JWT_SECRET is defined in your .env file.
 * Example: JWT_SECRET=your_jwt_secret_key
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Authentication Middleware
 * 
 * This middleware verifies the JWT token sent in the Authorization header.
 * If valid, it attaches the user object to the request and allows access to the route.
 * If invalid or absent, it responds with an unauthorized error.
 */

const authenticate = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or malformed' });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach the user to the request object
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
