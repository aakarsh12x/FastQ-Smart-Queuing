/**
 * Smart Queue Service
 * Provides AI-powered recommendations, predictions, and analytics
 */

const Queue = require('../models/Queue');
const QueueHistory = require('../models/QueueHistory');
const moment = require('moment');

/**
 * Get personalized queue recommendations for a user
 * Uses scoring algorithm based on wait time, distance, and historical data
 */
async function getQueueRecommendations(userId) {
  try {
    // Get all active queues
    const queues = await Queue.find({ status: 'active' }).lean();
    
    if (queues.length === 0) {
      return [];
    }
    
    // Calculate recommendations with scoring
    const recommendations = await Promise.all(
      queues.map(async (queue) => {
        const score = await calculateQueueScore(queue, userId);
        const isPeakHour = await isQueuePeakHour(queue._id);
        
        return {
          queueId: queue._id.toString(),
          name: queue.name,
          category: queue.category,
          location: queue.location,
          currentUsers: queue.currentUsers.length,
          estimatedWait: formatWaitTime(queue.settings.estimatedWaitTime),
          estimatedWaitMinutes: queue.settings.estimatedWaitTime,
          score: score,
          isPeakHour: isPeakHour,
          recommendation: generateRecommendation(score, isPeakHour, queue),
          confidence: getConfidenceLevel(score)
        };
      })
    );
    
    // Sort by score (highest first)
    recommendations.sort((a, b) => b.score - a.score);
    
    // Return top 6 recommendations
    return recommendations.slice(0, 6);
  } catch (error) {
    console.error('Error getting queue recommendations:', error);
    throw error;
  }
}

/**
 * Calculate a score for a queue (0-100)
 * Higher score = better recommendation
 */
async function calculateQueueScore(queue, userId) {
  let score = 100;
  
  // Factor 1: Queue length (fewer people = higher score)
  const queueLength = queue.currentUsers.length;
  if (queueLength === 0) {
    score += 20; // Bonus for empty queue
  } else if (queueLength < 3) {
    score += 10;
  } else if (queueLength < 5) {
    score -= 5;
  } else if (queueLength < 10) {
    score -= 15;
  } else {
    score -= 30;
  }
  
  // Factor 2: Estimated wait time (shorter = higher score)
  const waitTime = queue.settings.estimatedWaitTime || 5;
  if (waitTime < 5) {
    score += 15;
  } else if (waitTime < 10) {
    score += 5;
  } else if (waitTime < 20) {
    score -= 10;
  } else {
    score -= 20;
  }
  
  // Factor 3: Peak hour analysis (off-peak = higher score)
  const isPeakHour = await isQueuePeakHour(queue._id);
  if (isPeakHour) {
    score -= 15;
  } else {
    score += 10;
  }
  
  // Factor 4: Recent activity (stable queues = higher score)
  const recentActivity = await getRecentActivity(queue._id);
  if (recentActivity < 5) {
    score += 10;
  } else if (recentActivity > 15) {
    score -= 10;
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Check if current time is peak hour for a queue
 */
async function isQueuePeakHour(queueId) {
  try {
    const currentHour = moment().hour();
    
    // Get historical data for this hour
    const history = await QueueHistory.find({
      queue: queueId,
      createdAt: {
        $gte: moment().subtract(7, 'days').toDate()
      }
    }).lean();
    
    if (history.length === 0) {
      return false;
    }
    
    // Count entries for current hour
    const currentHourCount = history.filter(h => 
      moment(h.createdAt).hour() === currentHour
    ).length;
    
    // Calculate average
    const avgCount = history.length / 7;
    
    // Peak if 50% above average
    return currentHourCount > avgCount * 1.5;
  } catch (error) {
    console.error('Error checking peak hour:', error);
    return false;
  }
}

/**
 * Get recent activity count for a queue
 */
async function getRecentActivity(queueId) {
  try {
    const count = await QueueHistory.countDocuments({
      queue: queueId,
      createdAt: {
        $gte: moment().subtract(1, 'hour').toDate()
      }
    });
    return count;
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return 0;
  }
}

/**
 * Analyze peak hours across all queues
 */
async function analyzePeakHours() {
  try {
    // Get data from last 7 days
    const startDate = moment().subtract(7, 'days').toDate();
    
    const history = await QueueHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$createdAt' },
            queue: '$queue'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.hour',
          avgUsers: { $avg: '$count' },
          totalEvents: { $sum: '$count' }
        }
      },
      {
        $sort: { avgUsers: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Format results
    const peakHours = history.map(h => ({
      hour: h._id,
      timeRange: formatHourRange(h._id),
      avgUsers: Math.round(h.avgUsers),
      totalEvents: h.totalEvents,
      level: getPeakLevel(h.avgUsers)
    }));
    
    return peakHours;
  } catch (error) {
    console.error('Error analyzing peak hours:', error);
    return [];
  }
}

/**
 * Predict wait time for a queue
 */
async function predictWaitTime(queueId) {
  try {
    const queue = await Queue.findById(queueId).lean();
    
    if (!queue) {
      throw new Error('Queue not found');
    }
    
    const currentUsers = queue.currentUsers.length;
    const baseWaitTime = queue.settings.estimatedWaitTime || 5;
    const isPeakHour = await isQueuePeakHour(queueId);
    
    // Calculate dynamic wait time
    let predictedWait = baseWaitTime;
    
    // Add time based on queue length
    predictedWait += currentUsers * 2;
    
    // Add time if peak hour
    if (isPeakHour) {
      predictedWait *= 1.3;
    }
    
    // Get recent average service time
    const recentHistory = await QueueHistory.find({
      queue: queueId,
      status: 'completed',
      createdAt: {
        $gte: moment().subtract(1, 'day').toDate()
      }
    }).lean();
    
    if (recentHistory.length > 0) {
      const avgServiceTime = recentHistory.reduce((sum, h) => {
        const duration = moment(h.updatedAt).diff(moment(h.createdAt), 'minutes');
        return sum + duration;
      }, 0) / recentHistory.length;
      
      predictedWait = (predictedWait + avgServiceTime) / 2;
    }
    
    return {
      queueId: queueId,
      currentUsers: currentUsers,
      predictedWaitMinutes: Math.round(predictedWait),
      predictedWait: formatWaitTime(Math.round(predictedWait)),
      confidence: currentUsers > 5 ? 'high' : 'medium',
      isPeakHour: isPeakHour,
      factors: {
        baseTime: baseWaitTime,
        queueLength: currentUsers,
        peakHourMultiplier: isPeakHour ? 1.3 : 1.0
      }
    };
  } catch (error) {
    console.error('Error predicting wait time:', error);
    throw error;
  }
}

/**
 * Helper: Format wait time in minutes to readable string
 */
function formatWaitTime(minutes) {
  if (minutes < 1) return '< 1 min';
  if (minutes === 1) return '1 min';
  if (minutes < 60) return `${minutes} mins`;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
}

/**
 * Helper: Format hour to time range string
 */
function formatHourRange(hour) {
  const start = hour === 0 ? '12' : hour > 12 ? hour - 12 : hour;
  const end = hour === 23 ? '12' : hour >= 12 ? hour - 11 : hour + 1;
  const startPeriod = hour < 12 ? 'AM' : 'PM';
  const endPeriod = hour < 11 || hour === 23 ? 'AM' : 'PM';
  
  return `${start}:00 ${startPeriod} - ${end}:00 ${endPeriod}`;
}

/**
 * Helper: Get peak level description
 */
function getPeakLevel(avgUsers) {
  if (avgUsers > 20) return 'Very High';
  if (avgUsers > 15) return 'High';
  if (avgUsers > 10) return 'Moderate';
  if (avgUsers > 5) return 'Low';
  return 'Very Low';
}

/**
 * Helper: Generate recommendation message
 */
function generateRecommendation(score, isPeakHour, queue) {
  if (score >= 90) {
    return `Excellent choice! ${queue.name} has minimal wait time right now.`;
  } else if (score >= 75) {
    return `Good option. ${queue.name} is moving quickly with a short queue.`;
  } else if (score >= 60) {
    return `Decent choice. ${queue.name} has moderate activity.`;
  } else if (score >= 40) {
    if (isPeakHour) {
      return `Peak hours at ${queue.name}. Consider visiting later for faster service.`;
    }
    return `${queue.name} is busy. Wait time may be longer than usual.`;
  } else {
    return `${queue.name} is very busy right now. Consider alternative options.`;
  }
}

/**
 * Helper: Get confidence level based on score
 */
function getConfidenceLevel(score) {
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

module.exports = {
  getQueueRecommendations,
  analyzePeakHours,
  predictWaitTime
};

