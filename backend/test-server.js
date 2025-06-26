// Simple test script to verify server functionality
const axios = require('axios');

async function testServer() {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing server endpoints...');
  
  try {
    // Test health endpoint
    console.log('1. Testing /health...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test root endpoint
    console.log('2. Testing /...');
    const rootResponse = await axios.get(`${baseURL}/`);
    console.log('✅ Root endpoint passed:', rootResponse.data);
    
    // Test APOD endpoint
    console.log('3. Testing /api/apod...');
    const apodResponse = await axios.get(`${baseURL}/api/apod`);
    console.log('✅ APOD endpoint passed:', apodResponse.data.title);
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testServer();
}

module.exports = testServer; 