import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './route';

dotenv.config();

const app: Express = express();
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
    environment: process.env.NODE_ENV || 'development'
  });
});

// root endpoint (deploymenmt debug)
app.get('/', (req, res) => {
  res.json({ 
    message: 'NASA Explorer Backend API',
    version: '1.0.0',
    endpoints: {
      apod: '/api/apod',
      mars: '/mars/rovers',
      eonet: '/eonet/events',
      neo: '/neo/feed'
    }
  });
});

// API routes
app.use('/', router);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${port}/health`);
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
