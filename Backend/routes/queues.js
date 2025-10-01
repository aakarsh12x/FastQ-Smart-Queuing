const express = require('express');
const { body, validationResult } = require('express-validator');
const Queue = require('../models/Queue');
const QueueHistory = require('../models/QueueHistory');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/queues
// @desc    Get all active queues
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, search, status = 'active' } = req.query;
    
    let query = { status };
    
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
      .populate('admin', 'name email')
      .sort({ createdAt: -1 });

    // Add queue length to each queue
    const queuesWithLength = queues.map(queue => ({
      ...queue.toObject(),
      queueLength: queue.queueLength,
      nextPosition: queue.nextPosition
    }));

    res.json({
      success: true,
      data: queuesWithLength
    });
  } catch (error) {
    console.error('Get queues error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching queues' 
    });
  }
});

// @route   GET /api/queues/:id
// @desc    Get single queue details
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('currentUsers.user', 'name email');

    if (!queue) {
      return res.status(404).json({ 
        success: false, 
        error: 'Queue not found' 
      });
    }

    res.json({
      success: true,
      data: queue
    });
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching queue' 
    });
  }
});

// @route   POST /api/queues
// @desc    Create new queue (Admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Queue name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('category').isIn(['food', 'medical', 'admin', 'education', 'shopping', 'transport', 'other']).withMessage('Invalid category'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('settings.maxUsers').optional().isInt({ min: 1, max: 1000 }).withMessage('Max users must be between 1 and 1000'),
  body('settings.estimatedWaitTime').optional().isInt({ min: 1, max: 60 }).withMessage('Estimated wait time must be between 1 and 60 minutes')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const queueData = {
      ...req.body,
      admin: req.user._id
    };

    const queue = new Queue(queueData);
    await queue.save();

    await queue.populate('admin', 'name email');

    res.status(201).json({
      success: true,
      data: queue
    });
  } catch (error) {
    console.error('Create queue error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while creating queue' 
    });
  }
});

// @route   PUT /api/queues/:id
// @desc    Update queue (Admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
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
        error: 'Not authorized to update this queue' 
      });
    }

    const updatedQueue = await Queue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('admin', 'name email');

    res.json({
      success: true,
      data: updatedQueue
    });
  } catch (error) {
    console.error('Update queue error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while updating queue' 
    });
  }
});

// @route   DELETE /api/queues/:id
// @desc    Delete queue (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
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
        error: 'Not authorized to delete this queue' 
      });
    }

    await Queue.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Queue deleted successfully'
    });
  } catch (error) {
    console.error('Delete queue error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while deleting queue' 
    });
  }
});

// @route   POST /api/queues/:id/join
// @desc    Join a queue
// @access  Private
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ 
        success: false, 
        error: 'Queue not found' 
      });
    }

    // Ensure settings exists with safe defaults for legacy records
    if (!queue.settings) {
      queue.settings = { maxUsers: 100, estimatedWaitTime: 5, allowJoin: true };
      await queue.save();
    }

    if (queue.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        error: 'Queue is not active' 
      });
    }

    if (queue.settings.allowJoin === false) {
      return res.status(400).json({ 
        success: false, 
        error: 'Queue is not accepting new users' 
      });
    }

    // Check if user is already in queue
    if (queue.isUserInQueue(req.user._id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'You are already in this queue' 
      });
    }

    // Check if queue is full
    if (queue.currentUsers.length >= queue.settings.maxUsers) {
      return res.status(400).json({ 
        success: false, 
        error: 'Queue is full' 
      });
    }

    // Determine position prior to insert (next position)
    const position = queue.nextPosition;
    // Add user to queue
    await queue.addUser(req.user._id);

    // Create queue history record
    const queueHistory = new QueueHistory({
      user: req.user._id,
      queue: queue._id,
      position,
      status: 'waiting',
      joinedAt: new Date()
    });
    await queueHistory.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`queue-${queue._id}`).emit('queue-updated', {
        queueId: queue._id,
        queueLength: queue.queueLength,
        userPosition: position
      });
    }

    res.json({
      success: true,
      message: 'Successfully joined queue',
      data: {
        position,
        estimatedWaitTime: position * queue.settings.estimatedWaitTime
      }
    });
  } catch (error) {
    console.error('Join queue error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while joining queue' 
    });
  }
});

// @route   POST /api/queues/:id/leave
// @desc    Leave a queue
// @access  Private
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ 
        success: false, 
        error: 'Queue not found' 
      });
    }

    // Check if user is in queue
    if (!queue.isUserInQueue(req.user._id)) {
      return res.status(400).json({ 
        success: false, 
        error: 'You are not in this queue' 
      });
    }

    // Remove user from queue
    await queue.removeUser(req.user._id);

    // Update queue history
    await QueueHistory.findOneAndUpdate(
      { user: req.user._id, queue: queue._id, status: 'waiting' },
      { 
        status: 'left', 
        leftAt: new Date() 
      }
    );

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`queue-${queue._id}`).emit('queue-updated', {
        queueId: queue._id,
        queueLength: queue.queueLength
      });
    }

    res.json({
      success: true,
      message: 'Successfully left queue'
    });
  } catch (error) {
    console.error('Leave queue error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while leaving queue' 
    });
  }
});

// @route   GET /api/queues/:id/position
// @desc    Get user's position in queue
// @access  Private
router.get('/:id/position', authenticateToken, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ 
        success: false, 
        error: 'Queue not found' 
      });
    }

    const position = queue.getUserPosition(req.user._id);
    
    if (position === null) {
      return res.status(400).json({ 
        success: false, 
        error: 'You are not in this queue' 
      });
    }

    res.json({
      success: true,
      data: {
        position,
        estimatedWaitTime: position * queue.settings.estimatedWaitTime,
        queueLength: queue.queueLength
      }
    });
  } catch (error) {
    console.error('Get position error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while getting position' 
    });
  }
});

module.exports = router;

