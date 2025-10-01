const mongoose = require('mongoose');

const queueHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  queue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue',
    required: true
  },
  joinedAt: {
    type: Date,
    required: true
  },
  servedAt: {
    type: Date
  },
  leftAt: {
    type: Date
  },
  position: {
    type: Number,
    required: true
  },
  waitTime: {
    type: Number // in minutes
  },
  status: {
    type: String,
    enum: ['waiting', 'served', 'left', 'expired'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
queueHistorySchema.index({ user: 1, createdAt: -1 });
queueHistorySchema.index({ queue: 1, createdAt: -1 });
queueHistorySchema.index({ status: 1 });

// Calculate wait time before saving
queueHistorySchema.pre('save', function(next) {
  if (this.servedAt && this.joinedAt) {
    this.waitTime = Math.round((this.servedAt - this.joinedAt) / (1000 * 60)); // Convert to minutes
  } else if (this.leftAt && this.joinedAt) {
    this.waitTime = Math.round((this.leftAt - this.joinedAt) / (1000 * 60));
  }
  next();
});

module.exports = mongoose.model('QueueHistory', queueHistorySchema);

