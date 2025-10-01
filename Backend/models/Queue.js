const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Queue name is required'],
    trim: true,
    maxlength: [100, 'Queue name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'medical', 'admin', 'education', 'shopping', 'transport', 'other'],
    default: 'other'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin is required']
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed'],
    default: 'active'
  },
  settings: {
    maxUsers: { type: Number, default: 100 },
    estimatedWaitTime: { type: Number, default: 5 }, // in minutes per person
    allowJoin: { type: Boolean, default: true },
    autoClose: { type: Boolean, default: false },
    closeTime: { type: String }, // HH:MM format
    workingDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
    workingHours: {
      start: { type: String }, // HH:MM format
      end: { type: String }    // HH:MM format
    }
  },
  currentUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    estimatedWaitTime: {
      type: Number // in minutes
    },
    status: {
      type: String,
      enum: ['waiting', 'served', 'left'],
      default: 'waiting'
    }
  }],
  stats: {
    totalServed: { type: Number, default: 0 },
    averageWaitTime: { type: Number, default: 0 }, // in minutes
    peakHour: { type: String },
    totalUsers: { type: Number, default: 0 }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
queueSchema.index({ category: 1, status: 1 });
queueSchema.index({ admin: 1 });
queueSchema.index({ 'currentUsers.user': 1 });

// Virtual for current queue length
queueSchema.virtual('queueLength').get(function() {
  return this.currentUsers.filter(user => user.status === 'waiting').length;
});

// Virtual for next position
queueSchema.virtual('nextPosition').get(function() {
  const waitingUsers = this.currentUsers.filter(user => user.status === 'waiting');
  return waitingUsers.length > 0 ? Math.max(...waitingUsers.map(u => u.position)) + 1 : 1;
});

// Method to add user to queue
queueSchema.methods.addUser = function(userId) {
  const nextPos = this.nextPosition;
  const estimatedWait = nextPos * this.settings.estimatedWaitTime;
  
  this.currentUsers.push({
    user: userId,
    position: nextPos,
    estimatedWaitTime: estimatedWait,
    status: 'waiting'
  });
  
  this.stats.totalUsers += 1;
  return this.save();
};

// Method to remove user from queue
queueSchema.methods.removeUser = function(userId) {
  const userIndex = this.currentUsers.findIndex(u => u.user.toString() === userId.toString());
  if (userIndex === -1) return false;
  
  const removedUser = this.currentUsers[userIndex];
  this.currentUsers.splice(userIndex, 1);
  
  // Update positions of remaining users
  this.currentUsers.forEach(user => {
    if (user.position > removedUser.position) {
      user.position -= 1;
      user.estimatedWaitTime = user.position * this.settings.estimatedWaitTime;
    }
  });
  
  return this.save();
};

// Method to serve next user
queueSchema.methods.serveNextUser = function() {
  const waitingUsers = this.currentUsers.filter(u => u.status === 'waiting');
  if (waitingUsers.length === 0) return null;
  
  const nextUser = waitingUsers.reduce((min, user) => 
    user.position < min.position ? user : min
  );
  
  nextUser.status = 'served';
  this.stats.totalServed += 1;
  
  // Update positions of remaining users
  this.currentUsers.forEach(user => {
    if (user.position > nextUser.position && user.status === 'waiting') {
      user.position -= 1;
      user.estimatedWaitTime = user.position * this.settings.estimatedWaitTime;
    }
  });
  
  return this.save();
};

// Method to get user position in queue
queueSchema.methods.getUserPosition = function(userId) {
  const user = this.currentUsers.find(u => 
    u.user.toString() === userId.toString() && u.status === 'waiting'
  );
  return user ? user.position : null;
};

// Method to check if user is in queue
queueSchema.methods.isUserInQueue = function(userId) {
  return this.currentUsers.some(u => 
    u.user.toString() === userId.toString() && u.status === 'waiting'
  );
};

module.exports = mongoose.model('Queue', queueSchema);

