// backend/src/controllers/adminAuthController.js
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Admin Login Controller
 * Expects: { email, password }
 * Returns a JWT token if credentials are valid.
 */
async function adminLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // Validate password using the model's method
    const isValid = await admin.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // Sign a JWT token with role included
const token = jwt.sign(
  { adminId: admin._id, email: admin.email, role: admin.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
);
    return res.json({ token, message: 'Login successful.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login.' });
  }
}

module.exports = { adminLogin };
