const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Queue = require('../models/Queue');
const QueueHistory = require('../models/QueueHistory');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching profile' 
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().trim().isLength({ min: 10, max: 15 }).withMessage('Phone must be between 10 and 15 characters'),
  body('preferences.notifications.email').optional().isBoolean().withMessage('Email notification preference must be boolean'),
  body('preferences.notifications.push').optional().isBoolean().withMessage('Push notification preference must be boolean'),
  body('preferences.notifications.sms').optional().isBoolean().withMessage('SMS notification preference must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const allowedUpdates = ['name', 'phone', 'avatar', 'preferences'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while updating profile' 
    });
  }
});

// @route   GET /api/users/my-queues
// @desc    Get user's current queues
// @access  Private
router.get('/my-queues', async (req, res) => {
  try {
    const queues = await Queue.find({
      'currentUsers.user': req.user._id,
      'currentUsers.status': 'waiting'
    })
    .populate('admin', 'name email')
    .select('name description category location status settings currentUsers');

    const userQueues = queues.map(queue => {
      const userInQueue = queue.currentUsers.find(u => 
        u.user.toString() === req.user._id.toString() && u.status === 'waiting'
      );
      
      return {
        ...queue.toObject(),
        userPosition: userInQueue.position,
        estimatedWaitTime: userInQueue.estimatedWaitTime,
        joinedAt: userInQueue.joinedAt
      };
    });

    res.json({
      success: true,
      data: userQueues
    });
  } catch (error) {
    console.error('Get my queues error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching your queues' 
    });
  }
});

// @route   GET /api/users/history
// @desc    Get user's queue history
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const history = await QueueHistory.find(query)
      .populate('queue', 'name category location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await QueueHistory.countDocuments(query);

    res.json({
      success: true,
      data: history,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching history' 
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get queue history stats
    const historyStats = await QueueHistory.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalQueues: { $sum: 1 },
          totalWaitTime: { $sum: '$waitTime' },
          averageWaitTime: { $avg: '$waitTime' },
          servedQueues: {
            $sum: { $cond: [{ $eq: ['$status', 'served'] }, 1, 0] }
          },
          leftQueues: {
            $sum: { $cond: [{ $eq: ['$status', 'left'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get current queue count
    const currentQueues = await Queue.countDocuments({
      'currentUsers.user': userId,
      'currentUsers.status': 'waiting'
    });

    // Get category breakdown
    const categoryStats = await QueueHistory.aggregate([
      { $match: { user: userId } },
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
          count: { $sum: 1 },
          averageWaitTime: { $avg: '$waitTime' }
        }
      }
    ]);

    const stats = {
      queuesJoined: historyStats[0]?.totalQueues || 0,
      currentQueues,
      totalWaitTime: historyStats[0]?.totalWaitTime || 0,
      averageWaitTime: Math.round(historyStats[0]?.averageWaitTime || 0),
      servedQueues: historyStats[0]?.servedQueues || 0,
      leftQueues: historyStats[0]?.leftQueues || 0,
      timeSaved: Math.round((historyStats[0]?.totalWaitTime || 0) * 0.3), // Assume 30% time saved
      categoryBreakdown: categoryStats
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching stats' 
    });
  }
});

// @route   POST /api/users/rate-queue
// @desc    Rate a queue after being served
// @access  Private
router.post('/rate-queue', [
  body('queueId').isMongoId().withMessage('Valid queue ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim().isLength({ max: 500 }).withMessage('Feedback cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { queueId, rating, feedback } = req.body;

    // Find the queue history record
    const queueHistory = await QueueHistory.findOne({
      user: req.user._id,
      queue: queueId,
      status: 'served'
    });

    if (!queueHistory) {
      return res.status(400).json({ 
        success: false, 
        error: 'No served queue found to rate' 
      });
    }

    // Update the rating
    queueHistory.rating = rating;
    if (feedback) {
      queueHistory.feedback = feedback;
    }
    await queueHistory.save();

    // Update queue's average rating
    const queue = await Queue.findById(queueId);
    if (queue) {
      const allRatings = await QueueHistory.find({
        queue: queueId,
        rating: { $exists: true }
      });

      const averageRating = allRatings.reduce((sum, record) => sum + record.rating, 0) / allRatings.length;
      
      queue.rating.average = Math.round(averageRating * 10) / 10;
      queue.rating.count = allRatings.length;
      await queue.save();
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Rate queue error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while submitting rating' 
    });
  }
});

// @route   GET /api/users/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', async (req, res) => {
  try {
    // This would typically come from a notifications collection
    // For now, we'll return mock data
    const notifications = [
      {
        id: '1',
        type: 'queue_update',
        title: 'Your turn is coming up!',
        message: 'You are #2 in the Food Court queue',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        type: 'queue_served',
        title: 'You have been served',
        message: 'Thank you for using fastQ!',
        timestamp: new Date(Date.now() - 3600000),
        read: true
      }
    ];

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching notifications' 
    });
  }
});

module.exports = router;

