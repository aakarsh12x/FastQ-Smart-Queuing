const express = require('express');
const Queue = require('../models/Queue');
const QueueHistory = require('../models/QueueHistory');
const Analytics = require('../models/Analytics');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    let query = {};
    if (!isAdmin) {
      // For regular users, only show their own data
      query = { user: userId };
    }

    // Get basic stats
    const totalQueues = isAdmin ? 
      await Queue.countDocuments() : 
      await QueueHistory.distinct('queue', query).then(queues => queues.length);

    const totalUsers = isAdmin ? 
      await QueueHistory.countDocuments() : 
      await QueueHistory.countDocuments(query);

    const servedUsers = isAdmin ? 
      await QueueHistory.countDocuments({ status: 'served' }) : 
      await QueueHistory.countDocuments({ ...query, status: 'served' });

    // Get average wait time
    const avgWaitTime = await QueueHistory.aggregate([
      { $match: { ...query, waitTime: { $exists: true } } },
      { $group: { _id: null, average: { $avg: '$waitTime' } } }
    ]);

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStats = await QueueHistory.aggregate([
      {
        $match: {
          ...query,
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          joined: { $sum: 1 },
          served: {
            $sum: { $cond: [{ $eq: ['$status', 'served'] }, 1, 0] }
          }
        }
      }
    ]);

    const overview = {
      totalQueues,
      totalUsers,
      servedUsers,
      averageWaitTime: Math.round(avgWaitTime[0]?.average || 0),
      todayJoined: todayStats[0]?.joined || 0,
      todayServed: todayStats[0]?.served || 0,
      completionRate: totalUsers > 0 ? Math.round((servedUsers / totalUsers) * 100) : 0
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching analytics overview' 
    });
  }
});

// @route   GET /api/analytics/queues
// @desc    Get queue analytics
// @access  Private
router.get('/queues', async (req, res) => {
  try {
    const { period = '7d', queueId } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    let matchQuery = {
      createdAt: { $gte: startDate, $lte: endDate }
    };

    if (queueId) {
      matchQuery.queue = queueId;
    }

    if (!isAdmin) {
      matchQuery.user = userId;
    }

    // Get queue performance data
    const queueStats = await QueueHistory.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'queues',
          localField: 'queue',
          foreignField: '_id',
          as: 'queueData'
        }
      },
      { $unwind: '$queueData' },
      {
        $group: {
          _id: '$queue',
          queueName: { $first: '$queueData.name' },
          queueCategory: { $first: '$queueData.category' },
          totalUsers: { $sum: 1 },
          servedUsers: {
            $sum: { $cond: [{ $eq: ['$status', 'served'] }, 1, 0] }
          },
          averageWaitTime: { $avg: '$waitTime' },
          averageRating: { $avg: '$rating' }
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ['$servedUsers', '$totalUsers'] },
              100
            ]
          }
        }
      },
      { $sort: { totalUsers: -1 } }
    ]);

    res.json({
      success: true,
      data: queueStats
    });
  } catch (error) {
    console.error('Get queue analytics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching queue analytics' 
    });
  }
});

// @route   GET /api/analytics/activity
// @desc    Get activity analytics (hourly/daily)
// @access  Private
router.get('/activity', async (req, res) => {
  try {
    const { period = '7d', granularity = 'daily' } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    let matchQuery = {
      createdAt: { $gte: startDate, $lte: endDate }
    };

    if (!isAdmin) {
      matchQuery.user = userId;
    }

    let groupFormat;
    if (granularity === 'hourly') {
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hour: { $hour: '$createdAt' }
      };
    } else {
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    }

    const activityData = await QueueHistory.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupFormat,
          joined: { $sum: 1 },
          served: {
            $sum: { $cond: [{ $eq: ['$status', 'served'] }, 1, 0] }
          },
          left: {
            $sum: { $cond: [{ $eq: ['$status', 'left'] }, 1, 0] }
          },
          averageWaitTime: { $avg: '$waitTime' }
        }
      },
      {
        $addFields: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
              hour: granularity === 'hourly' ? '$_id.hour' : 0
            }
          }
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({
      success: true,
      data: activityData
    });
  } catch (error) {
    console.error('Get activity analytics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching activity analytics' 
    });
  }
});

// @route   GET /api/analytics/categories
// @desc    Get category analytics
// @access  Private
router.get('/categories', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    let matchQuery = {
      createdAt: { $gte: startDate, $lte: endDate }
    };

    if (!isAdmin) {
      matchQuery.user = userId;
    }

    const categoryStats = await QueueHistory.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'queues',
          localField: 'queue',
          foreignField: '_id',
          as: 'queueData'
        }
      },
      { $unwind: '$queueData' },
      {
        $group: {
          _id: '$queueData.category',
          totalUsers: { $sum: 1 },
          servedUsers: {
            $sum: { $cond: [{ $eq: ['$status', 'served'] }, 1, 0] }
          },
          averageWaitTime: { $avg: '$waitTime' },
          averageRating: { $avg: '$rating' },
          totalQueues: { $addToSet: '$queue' }
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ['$servedUsers', '$totalUsers'] },
              100
            ]
          },
          uniqueQueues: { $size: '$totalQueues' }
        }
      },
      { $sort: { totalUsers: -1 } }
    ]);

    res.json({
      success: true,
      data: categoryStats
    });
  } catch (error) {
    console.error('Get category analytics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching category analytics' 
    });
  }
});

// @route   GET /api/analytics/reports
// @desc    Generate analytics reports
// @access  Private (Admin)
router.get('/reports', requireAdmin, async (req, res) => {
  try {
    const { type = 'summary', startDate, endDate, format = 'json' } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let reportData = {};

    switch (type) {
      case 'summary':
        reportData = await generateSummaryReport(start, end);
        break;
      case 'performance':
        reportData = await generatePerformanceReport(start, end);
        break;
      case 'user':
        reportData = await generateUserReport(start, end);
        break;
      default:
        reportData = await generateSummaryReport(start, end);
    }

    res.json({
      success: true,
      data: {
        type,
        period: { start, end },
        generatedAt: new Date(),
        ...reportData
      }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while generating report' 
    });
  }
});

// Helper functions for report generation
async function generateSummaryReport(startDate, endDate) {
  const totalQueues = await Queue.countDocuments();
  const totalUsers = await QueueHistory.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  });
  const servedUsers = await QueueHistory.countDocuments({
    status: 'served',
    createdAt: { $gte: startDate, $lte: endDate }
  });

  const avgWaitTime = await QueueHistory.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        waitTime: { $exists: true }
      }
    },
    { $group: { _id: null, average: { $avg: '$waitTime' } } }
  ]);

  return {
    totalQueues,
    totalUsers,
    servedUsers,
    averageWaitTime: Math.round(avgWaitTime[0]?.average || 0),
    completionRate: totalUsers > 0 ? Math.round((servedUsers / totalUsers) * 100) : 0
  };
}

async function generatePerformanceReport(startDate, endDate) {
  return await QueueHistory.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $lookup: {
        from: 'queues',
        localField: 'queue',
        foreignField: '_id',
        as: 'queueData'
      }
    },
    { $unwind: '$queueData' },
    {
      $group: {
        _id: '$queue',
        queueName: { $first: '$queueData.name' },
        totalUsers: { $sum: 1 },
        servedUsers: {
          $sum: { $cond: [{ $eq: ['$status', 'served'] }, 1, 0] }
        },
        averageWaitTime: { $avg: '$waitTime' },
        averageRating: { $avg: '$rating' }
      }
    },
    { $sort: { totalUsers: -1 } }
  ]);
}

async function generateUserReport(startDate, endDate) {
  return await QueueHistory.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userData'
      }
    },
    { $unwind: '$userData' },
    {
      $group: {
        _id: '$user',
        userName: { $first: '$userData.name' },
        userEmail: { $first: '$userData.email' },
        totalQueues: { $sum: 1 },
        servedQueues: {
          $sum: { $cond: [{ $eq: ['$status', 'served'] }, 1, 0] }
        },
        totalWaitTime: { $sum: '$waitTime' },
        averageRating: { $avg: '$rating' }
      }
    },
    { $sort: { totalQueues: -1 } },
    { $limit: 50 }
  ]);
}

module.exports = router;

