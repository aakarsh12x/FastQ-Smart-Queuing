/**
 * Debug Frontend-Backend Connection
 * Tests the exact same request the frontend would make
 */

const https = require('https');

const BACKEND_URL = 'https://fastq-smart-queuing-2.onrender.com/api';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
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

async function testRegistration() {
  console.log('🔍 Testing Registration Endpoint...\n');
  
  // Test 1: Valid registration (should work)
  console.log('Test 1: Valid Registration');
  const timestamp = Date.now();
  const validUser = {
    name: 'Test User',
    email: `test${timestamp}@example.com`,
    password: 'password123',
    role: 'user'
  };
  
  console.log('Request Body:', JSON.stringify(validUser, null, 2));
  
  try {
    const result = await makeRequest(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validUser)
    });
    
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.status === 201) {
      console.log('✅ Valid registration works!\n');
    } else {
      console.log('❌ Valid registration failed!\n');
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }
  
  // Test 2: Missing name (should fail with 400)
  console.log('Test 2: Missing Name');
  const invalidUser1 = {
    email: `test${timestamp + 1}@example.com`,
    password: 'password123',
    role: 'user'
  };
  
  console.log('Request Body:', JSON.stringify(invalidUser1, null, 2));
  
  try {
    const result = await makeRequest(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidUser1)
    });
    
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.status === 400) {
      console.log('✅ Missing name correctly rejected!\n');
    } else {
      console.log('❌ Missing name should have been rejected!\n');
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }
  
  // Test 3: Short password (should fail with 400)
  console.log('Test 3: Short Password');
  const invalidUser2 = {
    name: 'Test User',
    email: `test${timestamp + 2}@example.com`,
    password: '123',
    role: 'user'
  };
  
  console.log('Request Body:', JSON.stringify(invalidUser2, null, 2));
  
  try {
    const result = await makeRequest(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidUser2)
    });
    
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.status === 400) {
      console.log('✅ Short password correctly rejected!\n');
    } else {
      console.log('❌ Short password should have been rejected!\n');
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }
  
  // Test 4: Duplicate email (should fail with 400)
  console.log('Test 4: Duplicate Email');
  const duplicateUser = {
    name: 'Test User',
    email: `test${timestamp}@example.com`, // Same as Test 1
    password: 'password123',
    role: 'user'
  };
  
  console.log('Request Body:', JSON.stringify(duplicateUser, null, 2));
  
  try {
    const result = await makeRequest(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicateUser)
    });
    
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.status === 400) {
      console.log('✅ Duplicate email correctly rejected!\n');
    } else {
      console.log('❌ Duplicate email should have been rejected!\n');
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }
  
  // Test 5: Frontend-style request (exactly what frontend sends)
  console.log('Test 5: Frontend-Style Request');
  const frontendUser = {
    name: 'User', // This is what frontend sends when fullName is empty
    email: `frontend${timestamp}@example.com`,
    password: 'password123',
    role: 'user'
  };
  
  console.log('Request Body:', JSON.stringify(frontendUser, null, 2));
  
  try {
    const result = await makeRequest(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(frontendUser)
    });
    
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.status === 201) {
      console.log('✅ Frontend-style request works!\n');
    } else {
      console.log('❌ Frontend-style request failed!\n');
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }
}

async function testCORS() {
  console.log('🔍 Testing CORS Configuration...\n');
  
  try {
    const result = await makeRequest(`${BACKEND_URL}/test`, {
      method: 'GET',
      headers: {
        'Origin': 'https://fastq-i93fjdrv5-aakarsh12xs-projects.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': result.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': result.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': result.headers['access-control-allow-headers']
    });
    
    if (result.status === 200) {
      console.log('✅ CORS test passed!\n');
    } else {
      console.log('❌ CORS test failed!\n');
    }
  } catch (error) {
    console.log('❌ CORS Error:', error.message, '\n');
  }
}

async function runDebug() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  Frontend-Backend Connection Debug');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Backend: ${BACKEND_URL}`);
  console.log('═══════════════════════════════════════════════════\n');
  
  await testCORS();
  await testRegistration();
  
  console.log('═══════════════════════════════════════════════════');
  console.log('  Debug Complete');
  console.log('═══════════════════════════════════════════════════');
}

// Run the debug
runDebug().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
