import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Category, Priority } from '@prisma/client';

// Validation rules for creating a task
export const validateCreateTask = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('category')
    .isIn(Object.values(Category))
    .withMessage(`Category must be one of: ${Object.values(Category).join(', ')}`),
  
  body('priority')
    .isIn(Object.values(Priority))
    .withMessage(`Priority must be one of: ${Object.values(Priority).join(', ')}`),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO date string'),
];

// Validation rules for updating a task
export const validateUpdateTask = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),
  
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('category')
    .isIn(Object.values(Category))
    .withMessage(`Category must be one of: ${Object.values(Category).join(', ')}`),
  
  body('priority')
    .isIn(Object.values(Priority))
    .withMessage(`Priority must be one of: ${Object.values(Priority).join(', ')}`),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO date string'),
  
  body('completed')
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
];

// Validation rules for task ID parameter
export const validateTaskId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),
];

// Validation rules for query parameters
export const validateTaskQuery = [
  query('category')
    .optional()
    .isIn([...Object.values(Category), 'ALL'])
    .withMessage(`Category must be one of: ${Object.values(Category).join(', ')}, ALL`),
  
  query('completed')
    .optional()
    .isIn(['true', 'false', 'ALL'])
    .withMessage('Completed must be true, false, or ALL'),
  
  query('search')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
];

// Middleware to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({
      error: 'Validation failed',
      details: errorMessages,
      timestamp: new Date().toISOString()
    });
    return;
  }
  
  next();
};