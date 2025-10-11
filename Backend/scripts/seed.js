require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Queue = require('../models/Queue');
const QueueHistory = require('../models/QueueHistory');

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}

async function reset() {
  await Promise.all([
    User.deleteMany({}),
    Queue.deleteMany({}),
    QueueHistory.deleteMany({}),
  ]);
  console.log('Cleared collections');
}

async function seed() {
  // Users - let the User model handle password hashing
  const admin = await User.create({
    name: 'Seed Admin',
    email: `admin_seed@fastq.dev`,
    password: 'admin123',
    role: 'admin',
  });

  const user = await User.create({
    name: 'Seed User',
    email: `user_seed@fastq.dev`,
    password: 'password123',
    role: 'user',
  });

  // Queues (idempotent upsert on name)
  const queueItems = [
    { name: 'Main Canteen', location: 'Building A - Level 1', category: 'food', status: 'active', description: 'Fresh meals and daily specials' },
    { name: 'Medical Center', location: 'Health Block - Reception', category: 'medical', status: 'active', description: 'General consultation and check-ups' },
    { name: 'Admin Office', location: 'Building C - Level 2', category: 'admin', status: 'paused', description: 'Student services and documentation' },
    { name: 'Library Desk', location: 'Central Library - Ground', category: 'education', status: 'active', description: 'Book reservations and research assistance' },
    { name: 'Pharmacy', location: 'Health Block - Pharmacy Counter', category: 'medical', status: 'active', description: 'Prescription pickup and consultation' },
    { name: 'IT Helpdesk', location: 'Building D - Level 1', category: 'admin', status: 'active', description: 'Technical support and assistance' },
  ];

  let upserted = 0;
  for (const q of queueItems) {
    const res = await Queue.updateOne({ name: q.name }, { $setOnInsert: { ...q, admin: admin._id } }, { upsert: true });
    if (res.upsertedCount && res.upsertedCount > 0) upserted += res.upsertedCount;
  }

  const totalQueues = await Queue.countDocuments();
  console.log(`Seeded queues: +${upserted} (total ${totalQueues}). Users: ${admin.email}, ${user.email}`);
}

(async () => {
  try {
    await connect();
    if (process.argv.includes('--reset')) {
      await reset();
    }
    await seed();
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  }
})();


