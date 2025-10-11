/**
 * Smart Queue Features Routes
 * Handles AI-powered recommendations, predictions, and analytics
 */

const express = require('express');
const router = express.Router();
const smartQueueService = require('../services/smartQueue');

/**
 * GET /api/smart/recommendations
 * Get personalized queue recommendations for the user
 */
router.get('/recommendations', async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await smartQueueService.getQueueRecommendations(userId);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get recommendations'
    });
  }
});

/**
 * GET /api/smart/peak-hours
 * Get peak hour analysis for queues
 */
router.get('/peak-hours', async (req, res) => {
  try {
    const peakHours = await smartQueueService.analyzePeakHours();
    
    res.json({
      success: true,
      data: peakHours
    });
  } catch (error) {
    console.error('Error analyzing peak hours:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze peak hours'
    });
  }
});

/**
 * GET /api/smart/wait-time
 * Get dynamic wait time prediction for a specific queue
 * Query params: queueId
 */
router.get('/wait-time', async (req, res) => {
  try {
    const { queueId } = req.query;
    
    if (!queueId) {
      return res.status(400).json({
        success: false,
        error: 'Queue ID is required'
      });
    }
    
    const prediction = await smartQueueService.predictWaitTime(queueId);
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Error predicting wait time:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to predict wait time'
    });
  }
});

/**
 * GET /api/smart/insights
 * Get comprehensive smart insights and analytics
 */
router.get('/insights', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all smart features data
    const [recommendations, peakHours] = await Promise.all([
      smartQueueService.getQueueRecommendations(userId),
      smartQueueService.analyzePeakHours()
    ]);
    
    res.json({
      success: true,
      data: {
        recommendations,
        peakHours,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting insights:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get insights'
    });
  }
});

module.exports = router;

