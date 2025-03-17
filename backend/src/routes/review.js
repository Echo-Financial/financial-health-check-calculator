const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const logger = require('../logger');
const { sendReviewNotification } = require('../emailNotification');

// Get all reviews (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { status, adviceType, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (adviceType) query.adviceType = adviceType;
    
    // Execute query with pagination
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    // Count total for pagination
    const total = await Review.countDocuments(query);
    
    res.json({
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get a single review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    logger.error(`Error fetching review ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// Update review status (approve, reject, modify)
router.post('/:id/status', async (req, res) => {
  try {
    const { status, notes, modifiedAdvice } = req.body;

    if (!['approved', 'rejected', 'modified'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update review
    review.status = status;
    review.reviewedAt = new Date();
    if (notes) review.reviewerNotes = notes;
    if (status === 'modified' && modifiedAdvice) {
      review.modifiedAdvice = modifiedAdvice;
    }

    await review.save();
    logger.info(`Review ${req.params.id} updated to status: ${status}`);

    // Send a confirmation notification email after an action is taken
    await sendReviewNotification({
      reviewId: review._id,
      adviceType: review.adviceType,
      status: review.status,
      reviewerNotes: review.reviewerNotes || "No additional notes."
    });
    logger.info('Post-action notification email sent.');

    res.json({ success: true, review });
  } catch (error) {
    logger.error(`Error updating review ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

module.exports = router;
