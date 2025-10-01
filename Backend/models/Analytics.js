const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  queue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  hourlyStats: [{
    hour: { type: Number, min: 0, max: 23 },
    usersJoined: { type: Number, default: 0 },
    usersServed: { type: Number, default: 0 },
    averageWaitTime: { type: Number, default: 0 },
    peakUsers: { type: Number, default: 0 }
  }],
  dailyStats: {
    totalUsers: { type: Number, default: 0 },
    totalServed: { type: Number, default: 0 },
    averageWaitTime: { type: Number, default: 0 },
    peakHour: { type: Number },
    peakUsers: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 } // percentage
  },
  categoryStats: {
    category: { type: String },
    totalQueues: { type: Number, default: 0 },
    totalUsers: { type: Number, default: 0 },
    averageWaitTime: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
analyticsSchema.index({ queue: 1, date: 1 });
analyticsSchema.index({ date: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);

