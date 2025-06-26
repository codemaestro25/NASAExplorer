const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: port,
    environment: process.env.NODE_ENV || 'development',
    message: 'Server is running!'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'NASA Explorer Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

// Simple APOD endpoint for testing
app.get('/api/apod', async (req, res) => {
  try {
    const axios = require('axios');
    const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
    const NASA_API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';
    
    const response = await axios.get(NASA_APOD_URL, {
      params: { api_key: NASA_API_KEY }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching APOD:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Astronomy Picture of the Day',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.originalUrl
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${port}/health`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 