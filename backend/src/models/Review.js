//backend/src/models/Review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Client information
  clientId: String,
  clientName: String,
  clientEmail: String,
  
  // Advice metadata
  adviceType: {
    type: String,
    enum: ['summary', 'analysis', 'marketing'],
    required: true
  },
  flags: [String], // Reasons this was flagged for review
  
  // Review state
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'modified'],
    default: 'pending'
  },
  
  // Content
  originalAdvice: Object, // The original advice content 
  modifiedAdvice: Object, // Modified version if changes were made
  
  // Reference data
  clientFinancialData: Object, // Sanitized financial data
  recommendations: Object, // Key recommendations that were made
  
  // Audit trail
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewerNotes: String,
  
  // For email tracking
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date
});

module.exports = mongoose.model('Review', reviewSchema);