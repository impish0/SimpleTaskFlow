import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/tasksController';
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateTaskQuery,
  handleValidationErrors
} from '../middleware/validation';

const router = Router();

// GET /api/tasks/stats - Get task statistics
router.get('/stats', getTaskStats);

// GET /api/tasks - Get all tasks with optional filtering
router.get(
  '/',
  validateTaskQuery,
  handleValidationErrors,
  getTasks
);

// GET /api/tasks/:id - Get a single task by ID
router.get(
  '/:id',
  validateTaskId,
  handleValidationErrors,
  getTaskById
);

// POST /api/tasks - Create a new task
router.post(
  '/',
  validateCreateTask,
  handleValidationErrors,
  createTask
);

// PUT /api/tasks/:id - Update an existing task
router.put(
  '/:id',
  validateUpdateTask,
  handleValidationErrors,
  updateTask
);

// DELETE /api/tasks/:id - Delete a task
router.delete(
  '/:id',
  validateTaskId,
  handleValidationErrors,
  deleteTask
);

export default router;