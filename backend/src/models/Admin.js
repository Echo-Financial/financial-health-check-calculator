// backend/src/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Pre-save hook to hash the password if it is modified
adminSchema.pre('save', async function(next) {
  if (!this.isModified('hashedPassword')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to validate password
adminSchema.methods.validatePassword = async function(password) {
  return bcrypt.compare(password, this.hashedPassword);
};

module.exports = mongoose.model('Admin', adminSchema);
