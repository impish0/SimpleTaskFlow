import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { connectDatabase } from './utils/database';
import taskRoutes from './routes/tasks';

// Create Express application
const app: Application = express();

// Database connection
connectDatabase();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/tasks', taskRoutes);

// Handle 404 errors
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;