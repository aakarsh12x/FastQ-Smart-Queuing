// Backend API Test Suite
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let userToken = '';
let queueId = '';
let adminEmail = '';
let userEmail = '';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function test(name, testFn) {
  try {
    await testFn();
    log(`✓ ${name}`, 'green');
    return true;
  } catch (error) {
    log(`✗ ${name}`, 'red');
    if (error.response) {
      log(`  Status: ${error.response.status}`, 'red');
      log(`  Error: ${JSON.stringify(error.response.data)}`, 'red');
    } else {
      log(`  Error: ${error.message}`, 'red');
    }
    return false;
  }
}

async function runTests() {
  log('\n=== FastQ Backend Test Suite ===\n', 'blue');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // 1. Health Check
  results.total++;
  if (await test('Health Check', async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.data.status !== 'OK') throw new Error('Health check failed');
  })) results.passed++; else results.failed++;

  // 2. Admin Registration
  results.total++;
  if (await test('Admin Registration', async () => {
    adminEmail = `admin${Date.now()}@test.com`;
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin'
    });
    if (!res.data.success || !res.data.token) throw new Error('Registration failed');
    adminToken = res.data.token;
  })) results.passed++; else results.failed++;

  // 3. Admin Login
  results.total++;
  if (await test('Admin Login', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: adminEmail,
      password: 'admin123'
    });
    if (!res.data.success || !res.data.token) throw new Error('Login failed');
    adminToken = res.data.token;
  })) results.passed++; else results.failed++;

  // 4. Get Admin Profile
  results.total++;
  if (await test('Get Admin Profile', async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || !res.data.user) throw new Error('Get profile failed');
  })) results.passed++; else results.failed++;

  // 5. Create Queue
  results.total++;
  if (await test('Create Queue (Admin)', async () => {
    const res = await axios.post(`${BASE_URL}/queues`, {
      name: 'Test Food Court',
      description: 'Test queue for lunch',
      category: 'food',
      location: 'Main Hall',
      settings: {
        maxUsers: 50,
        estimatedWaitTime: 5
      }
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || !res.data.data._id) throw new Error('Create queue failed');
    queueId = res.data.data._id;
  })) results.passed++; else results.failed++;

  // 6. Get All Queues
  results.total++;
  if (await test('Get All Queues', async () => {
    const res = await axios.get(`${BASE_URL}/queues`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Get queues failed');
  })) results.passed++; else results.failed++;

  // 7. Get Single Queue
  results.total++;
  if (await test('Get Single Queue', async () => {
    const res = await axios.get(`${BASE_URL}/queues/${queueId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || !res.data.data) throw new Error('Get single queue failed');
  })) results.passed++; else results.failed++;

  // 8. User Registration
  results.total++;
  if (await test('User Registration', async () => {
    userEmail = `user${Date.now()}@test.com`;
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: userEmail,
      password: 'password123',
      role: 'user'
    });
    if (!res.data.success || !res.data.token) throw new Error('User registration failed');
    userToken = res.data.token;
  })) results.passed++; else results.failed++;

  // 9. User Login
  results.total++;
  if (await test('User Login', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: userEmail,
      password: 'password123'
    });
    if (!res.data.success || !res.data.token) throw new Error('User login failed');
    userToken = res.data.token;
  })) results.passed++; else results.failed++;

  // 10. Join Queue
  results.total++;
  if (await test('Join Queue (User)', async () => {
    const res = await axios.post(`${BASE_URL}/queues/${queueId}/join`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!res.data.success) throw new Error('Join queue failed');
  })) results.passed++; else results.failed++;

  // 11. Get Queue Position
  results.total++;
  if (await test('Get Queue Position', async () => {
    const res = await axios.get(`${BASE_URL}/queues/${queueId}/position`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!res.data.success || res.data.data.position === undefined) throw new Error('Get position failed');
  })) results.passed++; else results.failed++;

  // 12. Get User's Queues
  results.total++;
  if (await test('Get My Queues', async () => {
    const res = await axios.get(`${BASE_URL}/users/my-queues`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Get my queues failed');
  })) results.passed++; else results.failed++;

  // 13. Get User Stats
  results.total++;
  if (await test('Get User Stats', async () => {
    const res = await axios.get(`${BASE_URL}/users/stats`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!res.data.success || !res.data.data) throw new Error('Get stats failed');
  })) results.passed++; else results.failed++;

  // 14. Admin Dashboard
  results.total++;
  if (await test('Admin Dashboard', async () => {
    const res = await axios.get(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || !res.data.data.stats) throw new Error('Admin dashboard failed');
  })) results.passed++; else results.failed++;

  // 15. Get Admin Queues
  results.total++;
  if (await test('Get Admin Queues', async () => {
    const res = await axios.get(`${BASE_URL}/admin/queues`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Get admin queues failed');
  })) results.passed++; else results.failed++;

  // 16. Serve Next User
  results.total++;
  if (await test('Serve Next User (Admin)', async () => {
    const res = await axios.post(`${BASE_URL}/admin/queues/${queueId}/serve-next`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success) throw new Error('Serve next failed');
  })) results.passed++; else results.failed++;

  // 17. Analytics Overview
  results.total++;
  if (await test('Analytics Overview', async () => {
    const res = await axios.get(`${BASE_URL}/analytics/overview`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!res.data.success || !res.data.data) throw new Error('Analytics overview failed');
  })) results.passed++; else results.failed++;

  // 18. Queue Analytics
  results.total++;
  if (await test('Queue Analytics', async () => {
    const res = await axios.get(`${BASE_URL}/analytics/queues`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Queue analytics failed');
  })) results.passed++; else results.failed++;

  // 19. Activity Analytics
  results.total++;
  if (await test('Activity Analytics', async () => {
    const res = await axios.get(`${BASE_URL}/analytics/activity`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Activity analytics failed');
  })) results.passed++; else results.failed++;

  // 20. Update User Profile
  results.total++;
  if (await test('Update User Profile', async () => {
    const res = await axios.put(`${BASE_URL}/users/profile`, {
      name: 'Updated User',
      phone: '1234567890'
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!res.data.success) throw new Error('Update profile failed');
  })) results.passed++; else results.failed++;

  // 21. Update Queue Status
  results.total++;
  if (await test('Update Queue Status (Admin)', async () => {
    const res = await axios.put(`${BASE_URL}/admin/queues/${queueId}/status`, {
      status: 'paused'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success) throw new Error('Update queue status failed');
  })) results.passed++; else results.failed++;

  // 22. Get User History
  results.total++;
  if (await test('Get User History', async () => {
    const res = await axios.get(`${BASE_URL}/users/history`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Get history failed');
  })) results.passed++; else results.failed++;

  // 23. Token Refresh
  results.total++;
  if (await test('Token Refresh', async () => {
    const res = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!res.data.success || !res.data.token) throw new Error('Token refresh failed');
  })) results.passed++; else results.failed++;

  // 24. Update Queue Settings
  results.total++;
  if (await test('Update Queue (Admin)', async () => {
    const res = await axios.put(`${BASE_URL}/queues/${queueId}`, {
      settings: {
        maxUsers: 75,
        estimatedWaitTime: 7
      }
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success) throw new Error('Update queue failed');
  })) results.passed++; else results.failed++;

  // 25. Category Analytics
  results.total++;
  if (await test('Category Analytics', async () => {
    const res = await axios.get(`${BASE_URL}/analytics/categories`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.data.success || !Array.isArray(res.data.data)) throw new Error('Category analytics failed');
  })) results.passed++; else results.failed++;

  // Print Results
  log('\n=== Test Results ===\n', 'blue');
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`, 
    results.failed === 0 ? 'green' : 'yellow');
  
  log('\n=== Test Complete ===\n', 'blue');
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  log(`\nFatal Error: ${err.message}`, 'red');
  process.exit(1);
});
