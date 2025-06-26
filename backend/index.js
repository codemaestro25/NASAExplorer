const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

console.log('🚀 Starting NASA Explorer Backend...');
console.log('📡 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', port);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: port,
    environment: process.env.NODE_ENV || 'development',
    message: 'Server is running!',
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint requested');
  res.json({ 
    message: 'NASA Explorer Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      apod: '/api/apod'
    }
  });
});

// Simple APOD endpoint for testing
app.get('/api/apod', async (req, res) => {
  console.log('📸 APOD endpoint requested');
  try {
    const axios = require('axios');
    const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
    const NASA_API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';
    
    const response = await axios.get(NASA_APOD_URL, {
      params: { api_key: NASA_API_KEY }
    });
    
    console.log('✅ APOD data fetched successfully');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching APOD:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Astronomy Picture of the Day',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 Not Found:', req.originalUrl);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.originalUrl
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌐 Health check: http://localhost:${port}/health`);
  console.log(`📡 API root: http://localhost:${port}/`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use`);
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
}); 