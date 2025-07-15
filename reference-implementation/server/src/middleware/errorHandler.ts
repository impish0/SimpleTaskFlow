import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/express';

// Custom error class for API errors
export class AppError extends Error implements ApiError {
  public status: number;
  public details?: string[];

  constructor(message: string, status: number = 500, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'AppError';
  }
}

// Global error handling middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let status = 500;
  let message = 'Internal server error';
  let details: string[] | undefined;

  // Handle known error types
  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
  } else if (err.name === 'PrismaClientKnownRequestError') {
    // Handle Prisma errors
    status = 400;
    message = 'Database operation failed';
  } else if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    // Handle JSON parsing errors
    status = 400;
    message = 'Invalid JSON in request body';
  }

  // Send error response
  res.status(status).json({
    error: message,
    details,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

// Middleware to handle 404 errors
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Async error wrapper to catch errors in async route handlers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};