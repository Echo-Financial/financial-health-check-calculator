// backend/src/utils/complianceUtils.js
const logger = require('../logger');
const Review = require('../models/Review');
const { sendReviewNotification } = require('../emailNotification');

/**
 * Logs advice generation for compliance purposes and persists the record in MongoDB.
 * Sends an immediate notification if the review is flagged.
 * @param {string} adviceType - Type of advice (summary, analysis, marketing)
 * @param {object} userData - User data (sanitized of sensitive information)
 * @param {object} recommendations - Key recommendations provided
 * @param {object|string} adviceContent - The generated advice content 
 */
async function logAdviceGeneration(adviceType, userData, recommendations = {}, adviceContent = null) {
  try {
    // Create sanitized version of user data for logging
    const sanitizedUserData = {
      age: userData.originalData?.personalDetails?.age || userData.personalDetails?.age,
      hasRetirementSavings: !!userData.originalData?.retirementPlanning?.currentRetirementSavings,
      hasEmergencyFund: !!userData.originalData?.expensesAssets?.emergencyFunds,
      scores: {
        overallFinancialHealth: userData.calculatedMetrics?.overallFinancialHealthScore,
        retirement: userData.calculatedMetrics?.retirementScore,
        emergencyFund: userData.calculatedMetrics?.emergencyFundScore,
        growthOpportunity: userData.calculatedMetrics?.growthOpportunityScore,
        dti: userData.calculatedMetrics?.dtiScore
      }
    };

    logger.info(`Compliance: Generated ${adviceType} advice`, {
      adviceType,
      userData: sanitizedUserData,
      keyRecommendations: recommendations,
      timestamp: new Date().toISOString()
    });

    // Extract contact info from originalData or fallback to top-level contactInfo
    const contact = userData.originalData?.contactInfo || userData.contactInfo || {};
    console.log("Extracted contact info:", contact);
    const email = contact.email || 'unknown';
    const name = contact.name || 'unknown';

    // Create a new review record in MongoDB using the extracted contact info
    const newReview = new Review({
      clientId: email,         // using email as clientId for now
      clientName: name,
      clientEmail: email,
      adviceType: adviceType,  // use the provided adviceType parameter
      flags: [],
      status: "pending",
      originalAdvice: adviceContent,
      clientFinancialData: userData,
      recommendations: recommendations,
      emailSent: false
    });

    await newReview.save();
    logger.info('Review record saved to database.');

    // Check if this review should be flagged for manual review
    const needsReview = await requiresManualReview(userData, recommendations, adviceContent, adviceType);
    if (needsReview) {
      // Notify admin that a review requires attention
      await sendReviewNotification({
        reviewId: newReview._id,
        adviceType: adviceType,
        status: newReview.status,
        reviewerNotes: "Review requires your attention."
      });
      logger.info('Pre-approval notification email sent.');
    }

    logger.info(`Compliance logging for ${adviceType} complete.`);
    return { logged: true };
  } catch (error) {
    logger.error('Error during compliance logging:', error);
    return { logged: false, error: error.message };
  }
}

/**
 * Checks if the recommendations require manual review based on thresholds.
 */
async function requiresManualReview(userData, recommendations = {}, adviceContent = null, adviceType = 'unknown') {
  try {
    const flags = [];

    if (recommendations.monthlyContribution && parseFloat(recommendations.monthlyContribution) > 1000) {
      flags.push('High monthly contribution');
    }
    if (recommendations.monthlyInvestment && parseFloat(recommendations.monthlyInvestment) > 1500) {
      flags.push('High monthly investment');
    }
    if ((userData.calculatedMetrics?.emergencyFundScore < 10) &&
        (userData.calculatedMetrics?.retirementScore < 20)) {
      flags.push('Multiple critical scores');
    }
    const targetRetirementSavings = userData.originalData?.retirementPlanning?.targetRetirementSavings;
    if (targetRetirementSavings && targetRetirementSavings > 2000000) {
      flags.push('High retirement target');
    }
    
    if (flags.length > 0) {
      logger.warn('Compliance: Recommendation flagged for review', { 
        flags,
        adviceType,
        timestamp: new Date().toISOString()
      });
      logger.info(`Review needed: ${flags.join(', ')}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Error checking if review is needed:', error);
    return false;
  }
}

module.exports = {
  logAdviceGeneration,
  requiresManualReview
};
