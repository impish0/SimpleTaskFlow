import { Request, Response } from 'express';
import { Category, Priority } from '@prisma/client';
import { prisma } from '../utils/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTaskRequest,
  GetTasksRequest,
  DeleteTaskRequest
} from '../types/express';
import { TaskFilters, TaskStats } from '../types/task';

// Get all tasks with optional filtering
export const getTasks = asyncHandler(async (req: GetTasksRequest, res: Response) => {
  const { category, completed, search } = req.query;

  // Build filter object
  const filters: any = {};

  // Category filter
  if (category && category !== 'ALL') {
    if (Object.values(Category).includes(category as Category)) {
      filters.category = category as Category;
    }
  }

  // Completion status filter
  if (completed && completed !== 'ALL') {
    filters.completed = completed === 'true';
  }

  // Search filter (title or description)
  if (search && search.trim()) {
    filters.OR = [
      {
        title: {
          contains: search.trim(),
          mode: 'insensitive'
        }
      },
      {
        description: {
          contains: search.trim(),
          mode: 'insensitive'
        }
      }
    ];
  }

  // Fetch tasks from database
  const tasks = await prisma.task.findMany({
    where: filters,
    orderBy: [
      { completed: 'asc' }, // Incomplete tasks first
      { priority: 'desc' },  // High priority first
      { dueDate: 'asc' },    // Earliest due date first
      { id: 'asc' }          // Consistent order by creation sequence
    ]
  });

  // Calculate statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = totalCount - completedCount;

  res.status(200).json({
    tasks,
    totalCount,
    completedCount,
    pendingCount,
    timestamp: new Date().toISOString()
  });
});

// Get a single task by ID
export const getTaskById = asyncHandler(async (req: GetTaskRequest, res: Response) => {
  const taskId = parseInt(req.params.id);

  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    task,
    timestamp: new Date().toISOString()
  });
});

// Create a new task
export const createTask = asyncHandler(async (req: CreateTaskRequest, res: Response) => {
  const { title, description, category, priority, dueDate } = req.body;

  // Parse due date if provided
  const parsedDueDate = dueDate ? new Date(dueDate) : null;

  // Validate due date is not in the past (optional check)
  if (parsedDueDate && parsedDueDate < new Date()) {
    console.warn('Warning: Due date is in the past');
  }

  // Create task in database
  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      category,
      priority,
      dueDate: parsedDueDate,
      completed: false
    }
  });

  res.status(201).json({
    task,
    message: 'Task created successfully',
    timestamp: new Date().toISOString()
  });
});

// Update an existing task
export const updateTask = asyncHandler(async (req: UpdateTaskRequest, res: Response) => {
  const taskId = parseInt(req.params.id);
  const { title, description, category, priority, dueDate, completed } = req.body;

  // Check if task exists
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!existingTask) {
    throw new AppError('Task not found', 404);
  }

  // Parse due date if provided
  const parsedDueDate = dueDate ? new Date(dueDate) : null;

  // Update task in database
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      category,
      priority,
      dueDate: parsedDueDate,
      completed
    }
  });

  res.status(200).json({
    task,
    message: 'Task updated successfully',
    timestamp: new Date().toISOString()
  });
});

// Delete a task
export const deleteTask = asyncHandler(async (req: DeleteTaskRequest, res: Response) => {
  const taskId = parseInt(req.params.id);

  // Check if task exists
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!existingTask) {
    throw new AppError('Task not found', 404);
  }

  // Delete task from database
  await prisma.task.delete({
    where: { id: taskId }
  });

  res.status(200).json({
    message: 'Task deleted successfully',
    timestamp: new Date().toISOString()
  });
});

// Get task statistics
export const getTaskStats = asyncHandler(async (req: Request, res: Response) => {
  // Get all tasks
  const allTasks = await prisma.task.findMany();

  // Calculate basic statistics
  const total = allTasks.length;
  const completed = allTasks.filter(task => task.completed).length;
  const pending = total - completed;

  // Calculate statistics by category
  const byCategory: Record<Category, number> = {
    WORK: 0,
    PERSONAL: 0,
    SHOPPING: 0,
    HEALTH: 0,
    OTHER: 0
  };

  // Calculate statistics by priority
  const byPriority: Record<Priority, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0
  };

  // Count tasks by category and priority
  allTasks.forEach(task => {
    byCategory[task.category]++;
    byPriority[task.priority]++;
  });

  const stats: TaskStats = {
    total,
    completed,
    pending,
    byCategory,
    byPriority
  };

  res.status(200).json({
    stats,
    timestamp: new Date().toISOString()
  });
});