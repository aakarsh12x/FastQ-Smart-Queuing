const express = require('express');
const router = express.Router();
const smartQueueService = require('../services/smartQueue');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   GET /api/smart/peak-hours/:queueId
 * @desc    Get peak hours analysis for a queue
 * @access  Private
 */
router.get('/peak-hours/:queueId', authenticateToken, async (req, res) => {
  try {
    const { queueId } = req.params;
    const { daysBack = 30 } = req.query;

    const peakHours = await smartQueueService.getPeakHours(
      queueId,
      parseInt(daysBack)
    );

    res.json({
      success: true,
      data: peakHours,
    });
  } catch (error) {
    console.error('Peak hours analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/smart/wait-time/:queueId
 * @desc    Predict dynamic wait time for a queue
 * @access  Private
 */
router.get('/wait-time/:queueId', authenticateToken, async (req, res) => {
  try {
    const { queueId } = req.params;

    const waitTime = await smartQueueService.predictWaitTime(queueId);

    res.json({
      success: true,
      data: waitTime,
    });
  } catch (error) {
    console.error('Wait time prediction error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/smart/recommendations
 * @desc    Get personalized queue recommendations
 * @access  Private
 */
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, limit = 5 } = req.query;

    const recommendations = await smartQueueService.getQueueRecommendations(
      userId,
      category,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Queue recommendations error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/smart/best-time/:queueId
 * @desc    Get best time to visit a queue
 * @access  Private
 */
router.get('/best-time/:queueId', authenticateToken, async (req, res) => {
  try {
    const { queueId } = req.params;

    const bestTime = await smartQueueService.getBestTimeToVisit(queueId);

    res.json({
      success: true,
      data: bestTime,
    });
  } catch (error) {
    console.error('Best time analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/smart/insights
 * @desc    Get comprehensive smart insights for user
 * @access  Private
 */
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get recommendations
    const recommendations = await smartQueueService.getQueueRecommendations(
      userId,
      null,
      5
    );

    // Get insights data
    const insights = {
      recommendations,
      totalRecommendations: recommendations.length,
      bestRecommendation: recommendations[0] || null,
      timestamp: new Date(),
    };

    res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Smart insights error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

