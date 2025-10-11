const Queue = require('../models/Queue');
const QueueHistory = require('../models/QueueHistory');

/**
 * Smart Queue Service
 * Handles AI-powered queue analytics, predictions, and recommendations
 */

class SmartQueueService {
  /**
   * Get peak hours analysis for a queue
   */
  async getPeakHours(queueId, daysBack = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);

      const peakData = await QueueHistory.aggregate([
        {
          $match: {
            queue: queueId,
            joinedAt: { $gte: cutoffDate },
          },
        },
        {
          $project: {
            hour: { $hour: '$joinedAt' },
            dayOfWeek: { $dayOfWeek: '$joinedAt' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$joinedAt' } },
          },
        },
        {
          $group: {
            _id: { hour: '$hour', dayOfWeek: '$dayOfWeek' },
            count: { $sum: 1 },
            dates: { $addToSet: '$date' },
          },
        },
        {
          $project: {
            hour: '$_id.hour',
            dayOfWeek: '$_id.dayOfWeek',
            avgUsersPerDay: { $divide: ['$count', { $size: '$dates' }] },
            totalVisits: '$count',
          },
        },
        {
          $sort: { avgUsersPerDay: -1 },
        },
      ]);

      // Group by day of week
      const peakByDay = {};
      peakData.forEach((item) => {
        const day = this.getDayName(item.dayOfWeek);
        if (!peakByDay[day]) peakByDay[day] = [];
        peakByDay[day].push({
          hour: item.hour,
          avgUsers: Math.round(item.avgUsersPerDay * 10) / 10,
          totalVisits: item.totalVisits,
        });
      });

      // Find overall peak hours
      const topPeakHours = peakData.slice(0, 5).map((item) => ({
        hour: item.hour,
        day: this.getDayName(item.dayOfWeek),
        avgUsers: Math.round(item.avgUsersPerDay * 10) / 10,
        timeRange: `${this.formatHour(item.hour)} - ${this.formatHour(item.hour + 1)}`,
      }));

      return {
        peakByDay,
        topPeakHours,
        analysisRange: daysBack,
      };
    } catch (error) {
      throw new Error(`Peak hours analysis failed: ${error.message}`);
    }
  }

  /**
   * Predict dynamic wait time based on historical patterns
   */
  async predictWaitTime(queueId) {
    try {
      const queue = await Queue.findById(queueId);
      if (!queue) throw new Error('Queue not found');

      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay() + 1; // MongoDB dayOfWeek starts at 1 (Sunday)

      // Get historical data for same hour and day
      const historicalData = await QueueHistory.aggregate([
        {
          $match: {
            queue: queueId,
            leftAt: { $ne: null },
          },
        },
        {
          $project: {
            hour: { $hour: '$joinedAt' },
            dayOfWeek: { $dayOfWeek: '$joinedAt' },
            waitTime: {
              $divide: [{ $subtract: ['$leftAt', '$joinedAt'] }, 60000], // in minutes
            },
          },
        },
        {
          $match: {
            hour: currentHour,
            dayOfWeek: currentDay,
          },
        },
        {
          $group: {
            _id: null,
            avgWaitTime: { $avg: '$waitTime' },
            minWaitTime: { $min: '$waitTime' },
            maxWaitTime: { $max: '$waitTime' },
            count: { $sum: 1 },
          },
        },
      ]);

      let predictedWaitTime = queue.settings?.estimatedWaitTime || 5;
      let confidence = 'low';

      if (historicalData.length > 0 && historicalData[0].count >= 5) {
        predictedWaitTime = Math.round(historicalData[0].avgWaitTime);
        confidence = historicalData[0].count >= 20 ? 'high' : 'medium';
      }

      // Adjust based on current queue length
      const currentLoad = queue.currentUsers.length;
      if (currentLoad > 10) {
        predictedWaitTime = Math.round(predictedWaitTime * 1.3);
      } else if (currentLoad > 5) {
        predictedWaitTime = Math.round(predictedWaitTime * 1.15);
      }

      return {
        estimatedWaitMinutes: predictedWaitTime,
        estimatedWaitDisplay: this.formatWaitTime(predictedWaitTime),
        confidence,
        currentQueueLength: currentLoad,
        historicalSamples: historicalData[0]?.count || 0,
        range: historicalData[0]
          ? {
              min: Math.round(historicalData[0].minWaitTime),
              max: Math.round(historicalData[0].maxWaitTime),
            }
          : null,
      };
    } catch (error) {
      throw new Error(`Wait time prediction failed: ${error.message}`);
    }
  }

  /**
   * Get queue recommendations for a user
   */
  async getQueueRecommendations(userId, category = null, limit = 5) {
    try {
      // Get user's queue history to understand preferences
      const userHistory = await QueueHistory.find({ user: userId })
        .populate('queue')
        .sort({ joinedAt: -1 })
        .limit(50);

      const preferredCategories = {};
      userHistory.forEach((record) => {
        if (record.queue?.category) {
          preferredCategories[record.queue.category] =
            (preferredCategories[record.queue.category] || 0) + 1;
        }
      });

      // Build query
      const query = { status: 'active' };
      if (category) {
        query.category = category;
      }

      const queues = await Queue.find(query);

      // Score each queue
      const scoredQueues = await Promise.all(
        queues.map(async (queue) => {
          let score = 100;

          // Factor 1: Current queue length (lower is better)
          const queueLength = queue.currentUsers.length;
          score -= queueLength * 3;

          // Factor 2: User preference (has used similar queues)
          const categoryPreference = preferredCategories[queue.category] || 0;
          score += categoryPreference * 10;

          // Factor 3: Wait time prediction
          const waitPrediction = await this.predictWaitTime(queue._id);
          score -= waitPrediction.estimatedWaitMinutes * 2;

          // Factor 4: Peak hour adjustment
          const now = new Date();
          const peakHours = await this.getPeakHours(queue._id, 7);
          const currentHour = now.getHours();
          const isPeakHour = peakHours.topPeakHours.some(
            (peak) => peak.hour === currentHour
          );
          if (isPeakHour) {
            score -= 20;
          } else {
            score += 10;
          }

          // Factor 5: Recent activity (queues with recent activity are preferred)
          const recentActivity = await QueueHistory.countDocuments({
            queue: queue._id,
            joinedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          });
          score += Math.min(recentActivity * 2, 20);

          return {
            queue,
            score: Math.max(0, score),
            waitPrediction,
            isPeakHour,
            recommendation: this.getRecommendationReason(
              score,
              queueLength,
              isPeakHour,
              waitPrediction.estimatedWaitMinutes
            ),
          };
        })
      );

      // Sort by score and return top recommendations
      scoredQueues.sort((a, b) => b.score - a.score);

      return scoredQueues.slice(0, limit).map((item) => ({
        queueId: item.queue._id,
        name: item.queue.name,
        category: item.queue.category,
        location: item.queue.location,
        currentUsers: item.queue.currentUsers.length,
        estimatedWait: item.waitPrediction.estimatedWaitDisplay,
        estimatedWaitMinutes: item.waitPrediction.estimatedWaitMinutes,
        score: Math.round(item.score),
        isPeakHour: item.isPeakHour,
        recommendation: item.recommendation,
        confidence: item.waitPrediction.confidence,
      }));
    } catch (error) {
      throw new Error(`Queue recommendations failed: ${error.message}`);
    }
  }

  /**
   * Get best time to visit a queue
   */
  async getBestTimeToVisit(queueId) {
    try {
      const peakData = await this.getPeakHours(queueId, 30);

      // Find hours with lowest traffic
      const allHours = [];
      Object.values(peakData.peakByDay).forEach((dayHours) => {
        allHours.push(...dayHours);
      });

      allHours.sort((a, b) => a.avgUsers - b.avgUsers);

      const bestTimes = allHours.slice(0, 5).map((item) => ({
        hour: item.hour,
        timeRange: `${this.formatHour(item.hour)} - ${this.formatHour(item.hour + 1)}`,
        avgUsers: item.avgUsers,
        traffic: this.getTrafficLevel(item.avgUsers),
      }));

      return {
        bestTimes,
        worstTimes: peakData.topPeakHours,
      };
    } catch (error) {
      throw new Error(`Best time analysis failed: ${error.message}`);
    }
  }

  // Helper methods
  getDayName(dayOfWeek) {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[dayOfWeek - 1] || 'Unknown';
  }

  formatHour(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  formatWaitTime(minutes) {
    if (minutes < 1) return 'Less than 1 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  getTrafficLevel(avgUsers) {
    if (avgUsers < 2) return 'Very Low';
    if (avgUsers < 5) return 'Low';
    if (avgUsers < 10) return 'Medium';
    if (avgUsers < 15) return 'High';
    return 'Very High';
  }

  getRecommendationReason(score, queueLength, isPeakHour, waitTime) {
    if (score >= 80) {
      return 'Excellent choice! Low wait time and not peak hour.';
    }
    if (score >= 60) {
      return 'Good option with moderate wait time.';
    }
    if (isPeakHour) {
      return 'Currently peak hour. Consider visiting later.';
    }
    if (queueLength > 10) {
      return 'High traffic right now. May want to wait.';
    }
    if (waitTime > 30) {
      return 'Long wait time expected. Alternative queues recommended.';
    }
    return 'Average wait time expected.';
  }
}

module.exports = new SmartQueueService();

