/**
 * FastQ Production Testing Script
 * Tests both backend and frontend in production
 */

const https = require('https');
const http = require('http');

const BACKEND_URL = 'https://fastq-backend.onrender.com';
const FRONTEND_URL = 'https://fastq-6c406c7r0-aakarsh12xs-projects.vercel.app';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testBackendHealth() {
  log('\n🔍 Testing Backend Health...', 'cyan');
  
  try {
    // Test root endpoint
    log('Testing: GET /', 'blue');
    const rootRes = await makeRequest(`${BACKEND_URL}/`);
    log(`Status: ${rootRes.status}`, rootRes.status === 200 ? 'green' : 'red');
    if (rootRes.data) log(`Response: ${JSON.stringify(rootRes.data)}`, 'yellow');
    
    // Test /api/test endpoint
    log('\nTesting: GET /api/test', 'blue');
    const testRes = await makeRequest(`${BACKEND_URL}/api/test`);
    log(`Status: ${testRes.status}`, testRes.status === 200 ? 'green' : 'red');
    if (testRes.data) log(`Response: ${JSON.stringify(testRes.data)}`, 'yellow');
    
    return testRes.status === 200;
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testAuth() {
  log('\n🔐 Testing Authentication...', 'cyan');
  
  try {
    // Test registration
    log('Testing: POST /api/auth/register', 'blue');
    const timestamp = Date.now();
    const testUser = {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123'
    };
    
    const registerRes = await makeRequest(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    log(`Status: ${registerRes.status}`, registerRes.status === 200 || registerRes.status === 201 ? 'green' : 'red');
    if (registerRes.data) {
      log(`Response: ${JSON.stringify(registerRes.data)}`, 'yellow');
      
      if (registerRes.data.success && registerRes.data.data?.token) {
        log('✅ Registration successful!', 'green');
        return registerRes.data.data.token;
      }
    }
    
    // If registration failed, try login with seeded user
    log('\nTrying login with seeded user...', 'blue');
    const loginRes = await makeRequest(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user_seed@fastq.dev',
        password: 'password123'
      })
    });
    
    log(`Status: ${loginRes.status}`, loginRes.status === 200 ? 'green' : 'red');
    if (loginRes.data) {
      log(`Response: ${JSON.stringify(loginRes.data)}`, 'yellow');
      if (loginRes.data.success && loginRes.data.data?.token) {
        log('✅ Login successful!', 'green');
        return loginRes.data.data.token;
      }
    }
    
    return null;
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return null;
  }
}

async function testQueues(token) {
  log('\n📋 Testing Queues...', 'cyan');
  
  if (!token) {
    log('⚠️ No token available, skipping queue tests', 'yellow');
    return false;
  }
  
  try {
    log('Testing: GET /api/queues?status=active', 'blue');
    const queuesRes = await makeRequest(`${BACKEND_URL}/api/queues?status=active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    log(`Status: ${queuesRes.status}`, queuesRes.status === 200 ? 'green' : 'red');
    if (queuesRes.data) {
      if (queuesRes.data.success) {
        log(`✅ Found ${queuesRes.data.data.length} active queues`, 'green');
        return true;
      } else {
        log(`Response: ${JSON.stringify(queuesRes.data)}`, 'yellow');
      }
    }
    
    return false;
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testSmartFeatures(token) {
  log('\n🧠 Testing Smart Features...', 'cyan');
  
  if (!token) {
    log('⚠️ No token available, skipping smart features tests', 'yellow');
    return false;
  }
  
  try {
    // Test recommendations
    log('Testing: GET /api/smart/recommendations', 'blue');
    const recRes = await makeRequest(`${BACKEND_URL}/api/smart/recommendations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    log(`Status: ${recRes.status}`, recRes.status === 200 ? 'green' : 'red');
    if (recRes.data && recRes.data.success) {
      log(`✅ Got ${recRes.data.data.length} recommendations`, 'green');
    }
    
    // Test peak hours
    log('\nTesting: GET /api/smart/peak-hours', 'blue');
    const peakRes = await makeRequest(`${BACKEND_URL}/api/smart/peak-hours`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    log(`Status: ${peakRes.status}`, peakRes.status === 200 ? 'green' : 'red');
    if (peakRes.data && peakRes.data.success) {
      log(`✅ Got peak hours data`, 'green');
    }
    
    return true;
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testFrontend() {
  log('\n🌐 Testing Frontend...', 'cyan');
  
  try {
    log('Testing: Frontend loads', 'blue');
    const frontendRes = await makeRequest(FRONTEND_URL);
    log(`Status: ${frontendRes.status}`, frontendRes.status === 200 ? 'green' : 'red');
    
    if (frontendRes.status === 200) {
      log('✅ Frontend is accessible!', 'green');
      return true;
    }
    
    return false;
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('═══════════════════════════════════════════════════', 'cyan');
  log('  FastQ Production Testing', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  log(`Backend: ${BACKEND_URL}`, 'blue');
  log(`Frontend: ${FRONTEND_URL}`, 'blue');
  log('═══════════════════════════════════════════════════\n', 'cyan');
  
  const results = {
    backendHealth: false,
    auth: false,
    queues: false,
    smartFeatures: false,
    frontend: false
  };
  
  // Test backend health
  results.backendHealth = await testBackendHealth();
  
  // Test authentication
  const token = await testAuth();
  results.auth = !!token;
  
  // Test queues
  results.queues = await testQueues(token);
  
  // Test smart features
  results.smartFeatures = await testSmartFeatures(token);
  
  // Test frontend
  results.frontend = await testFrontend();
  
  // Print summary
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log('  Test Results Summary', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  
  const tests = [
    { name: 'Backend Health', result: results.backendHealth },
    { name: 'Authentication', result: results.auth },
    { name: 'Queues API', result: results.queues },
    { name: 'Smart Features', result: results.smartFeatures },
    { name: 'Frontend', result: results.frontend }
  ];
  
  tests.forEach(test => {
    const icon = test.result ? '✅' : '❌';
    const color = test.result ? 'green' : 'red';
    log(`${icon} ${test.name}`, color);
  });
  
  const passedCount = Object.values(results).filter(r => r).length;
  const totalCount = Object.keys(results).length;
  
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log(`Passed: ${passedCount}/${totalCount}`, passedCount === totalCount ? 'green' : 'yellow');
  log('═══════════════════════════════════════════════════\n', 'cyan');
  
  if (passedCount === totalCount) {
    log('🎉 All tests passed! System is fully operational!', 'green');
  } else if (passedCount > 0) {
    log('⚠️ Some tests failed. Check the output above for details.', 'yellow');
  } else {
    log('❌ All tests failed. Please check your deployment configuration.', 'red');
  }
}

// Run the tests
runTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

