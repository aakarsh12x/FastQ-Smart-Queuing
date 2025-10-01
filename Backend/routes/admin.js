const express = require('express');
const { body, validationResult } = require('express-validator');
const Queue = require('../models/Queue');
const QueueHistory = require('../models/QueueHistory');
const User = require('../models/User');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const adminId = req.user._id;

    // Get admin's queues
    const queues = await Queue.find({ admin: adminId })
      .populate('currentUsers.user', 'name email')
      .sort({ createdAt: -1 });

    // Calculate dashboard stats
    const totalQueues = queues.length;
    const activeQueues = queues.filter(q => q.status === 'active').length;
    const totalUsers = queues.reduce((sum, queue) => sum + queue.currentUsers.filter(u => u.status === 'waiting').length, 0);
    const totalServed = queues.reduce((sum, queue) => sum + queue.stats.totalServed, 0);

    // Get today's served count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayServed = await QueueHistory.countDocuments({
      queue: { $in: queues.map(q => q._id) },
      status: 'served',
      servedAt: { $gte: today, $lt: tomorrow }
    });

    // Calculate average wait time
    const avgWaitTime = queues.reduce((sum, queue) => sum + queue.stats.averageWaitTime, 0) / totalQueues || 0;

    const dashboardData = {
      stats: {
        totalQueues,
        activeQueues,
        totalUsers,
        totalServed,
        todayServed,
        averageWaitTime: Math.round(avgWaitTime)
      },
      queues: queues.map(queue => ({
        ...queue.toObject(),
        queueLength: queue.queueLength,
        nextPosition: queue.nextPosition
      }))
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching dashboard data' 
    });
  }
});

// @route   GET /api/admin/queues
// @desc    Get all queues managed by admin
// @access  Private (Admin)
router.get('/queues', requireAdmin, async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const adminId = req.user._id;

    let query = { admin: adminId };
    
    if (status) {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const queues = await Queue.find(query)
      .populate('currentUsers.user', 'name email')
      .sort({ createdAt: -1 });

    const queuesWithStats = queues.map(queue => ({
      ...queue.toObject(),
      queueLength: queue.queueLength,
      nextPosition: queue.nextPosition
    }));

    res.json({
      success: true,
      data: queuesWithStats
    });
  } catch (error) {
    console.error('Get admin queues error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching queues' 
    });
  }
});

// @route   GET /api/admin/queues/:id
// @desc    Get detailed queue information
// @access  Private (Admin)
router.get('/queues/:id', requireAdmin, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('currentUsers.user', 'name email phone');

    if (!queue) {
      return res.status(404).json({ 
        success: false, 
        error: 'Queue not found' 
      });
    }

    // Check if user is the admin of this queue
    if (queue.admin._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to view this queue' 
      });
    }

    res.json({
      success: true,
      data: queue
    });
  } catch (error) {
    console.error('Get queue details error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching queue details' 
    });
  }
});

// @route   POST /api/admin/queues/:id/serve-next
// @desc    Serve the next user in queue
// @access  Private (Admin)
router.post('/queues/:id/serve-next', requireAdmin, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ 
        success: false, 
        error: 'Queue not found' 
      });
    }

    // Check if user is the admin of this queue
    if (queue.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to manage this queue' 
      });
    }

    const servedUser = await queue.serveNextUser();

    if (!servedUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'No users waiting in queue' 
      });
    }

    // Update queue history
    await QueueHistory.findOneAndUpdate(
      { 
        user: servedUser.user, 
        queue: queue._id, 
        status: 'waiting' 
      },
      { 
        status: 'served', 
        servedAt: new Date() 
      }
    );

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`queue-${queue._id}`).emit('queue-updated', {
      queueId: queue._id,
      queueLength: queue.queueLength,
      servedUser: servedUser.user
    });

    // Emit notification to the served user
    io.to(`user-${servedUser.user}`).emit('user-served', {
      queueId: queue._id,
      queueName: queue.name
    });

    res.json({
      success: true,
      message: 'User served successfully',
      data: {
        servedUser: servedUser.user,
        newQueueLength: queue.queueLength
      }
    });
  } catch (error) {
    console.error('Serve next user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while serving user' 
    });
  }
});

// @route   POST /api/admin/queues/:id/remove-user
// @desc    Remove a specific user from queue
// @access  Private (Admin)
router.post('/queues/:id/remove-user', requireAdmin, [
  body('userId').isMongoId().withMessage('Valid user ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { userId } = req.body;
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ 
        success: false, 
        error: 'Queue not found' 
      });
    }

    // Check if user is the admin of this queue
    if (queue.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to manage this queue' 
      });
    }

    // Check if user is in queue
    if (!queue.isUserInQueue(userId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'User is not in this queue' 
      });
    }

    // Remove user from queue
    await queue.removeUser(userId);

    // Update queue history
    await QueueHistory.findOneAndUpdate(
      { user: userId, queue: queue._id, status: 'waiting' },
      { 
        status: 'left', 
        leftAt: new Date() 
      }
    );

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`queue-${queue._id}`).emit('queue-updated', {
      queueId: queue._id,
      queueLength: queue.queueLength,
      removedUser: userId
    });

    res.json({
      success: true,
      message: 'User removed from queue successfully'
    });
  } catch (error) {
    console.error('Remove user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while removing user' 
    });
  }
});

// @route   PUT /api/admin/queues/:id/status
// @desc    Update queue status
// @access  Private (Admin)
router.put('/queues/:id/status', requireAdmin, [
  body('status').isIn(['active', 'paused', 'closed']).withMessage('Status must be active, paused, or closed')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { status } = req.body;
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({ 
        success: false, 
        error: 'Queue not found' 
      });
    }

    // Check if user is the admin of this queue
    if (queue.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to manage this queue' 
      });
    }

    queue.status = status;
    await queue.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`queue-${queue._id}`).emit('queue-status-updated', {
      queueId: queue._id,
      status: status
    });

    res.json({
      success: true,
      message: 'Queue status updated successfully',
      data: { status }
    });
  } catch (error) {
    console.error('Update queue status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while updating queue status' 
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (for admin management)
// @access  Private (Admin)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching users' 
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin)
router.put('/users/:id/status', requireAdmin, [
  body('isActive').isBoolean().withMessage('isActive must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while updating user status' 
    });
  }
});

module.exports = router;

