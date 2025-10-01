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
  // Users
  const passwordHashAdmin = await bcrypt.hash('admin123', 10);
  const passwordHashUser = await bcrypt.hash('password123', 10);

  const admin = await User.create({
    name: 'Seed Admin',
    email: `admin_seed@fastq.dev`,
    password: passwordHashAdmin,
    role: 'admin',
  });

  const user = await User.create({
    name: 'Seed User',
    email: `user_seed@fastq.dev`,
    password: passwordHashUser,
    role: 'user',
  });

  // Queues (idempotent upsert on name)
  const queueItems = [
    { name: 'Main Canteen', location: 'Building A - Level 1', category: 'Food', status: 'active', averageWaitTime: 12 },
    { name: 'Medical Center', location: 'Health Block - Reception', category: 'Medical', status: 'active', averageWaitTime: 25 },
    { name: 'Admin Office', location: 'Building C - Level 2', category: 'Administrative', status: 'paused', averageWaitTime: 15 },
    { name: 'Library Desk', location: 'Central Library - Ground', category: 'Education', status: 'active', averageWaitTime: 8 },
    { name: 'Pharmacy', location: 'Health Block - Pharmacy Counter', category: 'Medical', status: 'active', averageWaitTime: 10 },
    { name: 'IT Helpdesk', location: 'Building D - Level 1', category: 'Administrative', status: 'active', averageWaitTime: 14 },
  ];

  let upserted = 0;
  for (const q of queueItems) {
    const res = await Queue.updateOne({ name: q.name }, { $setOnInsert: q }, { upsert: true });
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


