# Module 3: Express API Development

**Duration:** 3 days | **Week:** 2

## What You'll Build
By the end of this module, you'll have a complete Express.js API server that can create, read, update, and delete tasks from your database.

## Step-by-Step Instructions

### Step 1: Navigate to Your Server Folder (1 minute)

**Do this:** Make sure you're in the right place:

```bash
cd student-workspace/my-task-manager/server
pwd
```

**You should see:** A path ending with "my-task-manager/server"

**Verify you have the database setup:** 
```bash
ls -la
```

**You should see:** `prisma/` folder, `package.json`, and `src/` folder from Module 2.

---

### Step 2: Create Express App Configuration (8 minutes)

**Do this:** Create the main Express app file:

```bash
touch src/app.ts
code src/app.ts
```

**Type exactly this:**
```typescript
import express from 'express';
import cors from 'cors';
import { taskRoutes } from './routes/tasks';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/tasks', taskRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

export { app };
```

**Save the file.**

**What this does:**
- Sets up Express with all necessary middleware
- Configures CORS to allow frontend communication
- Adds request logging for debugging
- Creates a health check endpoint
- Sets up routes for tasks (we'll create this next)
- Handles errors and 404s

---

### Step 3: Create Server Entry Point (3 minutes)

**Do this:** Create the file that starts your server:

```bash
touch src/server.ts
code src/server.ts
```

**Type exactly this:**
```typescript
import { app } from './app';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API docs: http://localhost:${PORT}/api/tasks`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⏹️  SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⏹️  SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
    process.exit(0);
  });
});
```

**Save the file.**

**What this does:**
- Starts the Express server on port 3001
- Logs helpful startup information
- Handles graceful shutdown when you stop the server

---

### Step 4: Create Error Handling Middleware (5 minutes)

**Do this:** Create error handling for your API:

```bash
touch src/middleware/errorHandler.ts
code src/middleware/errorHandler.ts
```

**Type exactly this:**
```typescript
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('❌ Error:', err.message);
  console.error('📍 Stack:', err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2025') {
    const message = 'Record not found';
    error = new AppError(message, 404);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new AppError(message.join(', '), 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

**Save the file.**

**What this does:**
- Creates custom error handling for better debugging
- Handles different types of errors (database, validation, etc.)
- Logs errors to help you debug issues
- Returns consistent error responses

---

### Step 5: Create Type Definitions (4 minutes)

**Do this:** Create TypeScript types for your API:

```bash
touch src/types/express.ts
code src/types/express.ts
```

**Type exactly this:**
```typescript
import { Request } from 'express';
import { Category, Priority } from '@prisma/client';

// Base task interfaces
export interface CreateTaskData {
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  category?: Category;
  priority?: Priority;
  dueDate?: string | null;
  completed?: boolean;
}

// Request interfaces with typed params and body
export interface CreateTaskRequest extends Request {
  body: CreateTaskData;
}

export interface UpdateTaskRequest extends Request {
  params: {
    id: string;
  };
  body: UpdateTaskData;
}

export interface GetTaskRequest extends Request {
  params: {
    id: string;
  };
}

export interface DeleteTaskRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetTasksRequest extends Request {
  query: {
    category?: string;
    completed?: string;
    search?: string;
  };
}
```

**Save the file.**

**What this does:**
- Defines TypeScript types for all API requests
- Ensures type safety throughout your API
- Makes your code more reliable and easier to debug

---

### Step 6: Create Task Controller (15 minutes)

**Do this:** Create the main logic for handling task operations:

```bash
touch src/controllers/tasksController.ts
code src/controllers/tasksController.ts
```

**Type exactly this:**
```typescript
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

  const stats = {
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
```

**Save the file.**

**What this does:**
- Creates all the functions to handle task operations (create, read, update, delete)
- Includes filtering and search functionality
- Provides statistics about your tasks
- Handles all possible errors gracefully

---

### Step 7: Create API Routes (4 minutes)

**Do this:** Create the routes that connect URLs to controller functions:

```bash
touch src/routes/tasks.ts
code src/routes/tasks.ts
```

**Type exactly this:**
```typescript
import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/tasksController';
import { validateTask, validateTaskUpdate } from '../middleware/validation';

const router = Router();

// GET /api/tasks - Get all tasks (with optional filtering)
router.get('/', getTasks);

// GET /api/tasks/stats - Get task statistics
router.get('/stats', getTaskStats);

// GET /api/tasks/:id - Get a specific task
router.get('/:id', getTaskById);

// POST /api/tasks - Create a new task
router.post('/', validateTask, createTask);

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', validateTaskUpdate, updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

export { router as taskRoutes };
```

**Save the file.**

**What this does:**
- Connects HTTP methods and URLs to your controller functions
- Adds validation middleware (we'll create this next)
- Organizes all your API endpoints in one place

---

### Step 8: Create Validation Middleware (6 minutes)

**Do this:** Create validation to ensure data is correct:

```bash
touch src/middleware/validation.ts
code src/middleware/validation.ts
```

**Type exactly this:**
```typescript
import { Request, Response, NextFunction } from 'express';
import { Category, Priority } from '@prisma/client';
import { AppError } from './errorHandler';

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
  const { title, category, priority } = req.body;

  // Validate required fields
  if (!title || title.trim().length === 0) {
    throw new AppError('Title is required', 400);
  }

  if (title.trim().length > 100) {
    throw new AppError('Title cannot exceed 100 characters', 400);
  }

  // Validate category
  if (!category) {
    throw new AppError('Category is required', 400);
  }

  if (!Object.values(Category).includes(category)) {
    throw new AppError(`Category must be one of: ${Object.values(Category).join(', ')}`, 400);
  }

  // Validate priority
  if (!priority) {
    throw new AppError('Priority is required', 400);
  }

  if (!Object.values(Priority).includes(priority)) {
    throw new AppError(`Priority must be one of: ${Object.values(Priority).join(', ')}`, 400);
  }

  // Validate description length if provided
  if (req.body.description && req.body.description.length > 500) {
    throw new AppError('Description cannot exceed 500 characters', 400);
  }

  // Validate due date format if provided
  if (req.body.dueDate) {
    const dueDate = new Date(req.body.dueDate);
    if (isNaN(dueDate.getTime())) {
      throw new AppError('Invalid due date format', 400);
    }
  }

  next();
};

export const validateTaskUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { title, category, priority, description, dueDate } = req.body;

  // Validate title if provided
  if (title !== undefined) {
    if (!title || title.trim().length === 0) {
      throw new AppError('Title cannot be empty', 400);
    }

    if (title.trim().length > 100) {
      throw new AppError('Title cannot exceed 100 characters', 400);
    }
  }

  // Validate category if provided
  if (category !== undefined && !Object.values(Category).includes(category)) {
    throw new AppError(`Category must be one of: ${Object.values(Category).join(', ')}`, 400);
  }

  // Validate priority if provided
  if (priority !== undefined && !Object.values(Priority).includes(priority)) {
    throw new AppError(`Priority must be one of: ${Object.values(Priority).join(', ')}`, 400);
  }

  // Validate description length if provided
  if (description !== undefined && description && description.length > 500) {
    throw new AppError('Description cannot exceed 500 characters', 400);
  }

  // Validate due date format if provided
  if (dueDate !== undefined && dueDate) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      throw new AppError('Invalid due date format', 400);
    }
  }

  next();
};
```

**Save the file.**

**What this does:**
- Validates all incoming data before saving to database
- Ensures required fields are present
- Checks data formats and lengths
- Provides helpful error messages when validation fails

---

### Step 9: Test Your API Server (5 minutes)

**Do this:** Start your server and test it works:

```bash
npm run dev
```

**You should see:**
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
📋 API docs: http://localhost:3001/api/tasks
🌍 Environment: development
```

**Test the health check:** Open your browser and go to http://localhost:3001/health

**You should see:**
```json
{
  "status": "OK",
  "message": "Task Manager API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

**Test the tasks endpoint:** Go to http://localhost:3001/api/tasks

**You should see:** A JSON response with your sample tasks from the database seed.

**If you see errors:** Check the troubleshooting section below.

---

### Step 10: Test API Endpoints with curl (10 minutes)

**Do this:** Test your API with command line tools:

**Open a new terminal** (keep your server running) and try these commands:

**Get all tasks:**
```bash
curl http://localhost:3001/api/tasks
```

**Create a new task:**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test API Task",
    "description": "Testing my new API",
    "category": "WORK",
    "priority": "HIGH",
    "dueDate": "2024-02-01"
  }'
```

**Get task statistics:**
```bash
curl http://localhost:3001/api/tasks/stats
```

**You should see:** JSON responses for each command showing your data.

---

### Step 11: Commit Your Work (3 minutes)

**Do this:** Save your progress to Git:

```bash
cd ..  # Go back to my-task-manager root
git add .
git status
```

**You should see:** All your new server files being tracked.

```bash
git commit -m "Complete Module 3: Express API implementation

- Created Express app with middleware configuration
- Implemented full CRUD operations for tasks
- Added input validation and error handling
- Created TypeScript types for type safety
- Set up API routes with proper HTTP methods
- Added comprehensive task statistics endpoint
- Tested all endpoints and confirmed working

API Features:
- GET /api/tasks (with filtering and search)
- POST /api/tasks (create new task)
- GET /api/tasks/:id (get specific task)
- PUT /api/tasks/:id (update task)
- DELETE /api/tasks/:id (delete task)
- GET /api/tasks/stats (task statistics)
- GET /health (health check)

Ready for frontend integration in Module 4!"
```

---

## Completion Checklist

✅ **Server Setup**
- [ ] Express app created with proper middleware
- [ ] CORS configured for frontend communication
- [ ] Error handling middleware implemented
- [ ] Request logging working
- [ ] Health check endpoint responding

✅ **API Endpoints**
- [ ] GET /api/tasks returns all tasks with filtering
- [ ] POST /api/tasks creates new tasks
- [ ] GET /api/tasks/:id returns specific task
- [ ] PUT /api/tasks/:id updates existing task
- [ ] DELETE /api/tasks/:id removes task
- [ ] GET /api/tasks/stats returns statistics

✅ **Data Validation**
- [ ] Task creation validates required fields
- [ ] Field length limits enforced
- [ ] Category and Priority enums validated
- [ ] Date format validation working
- [ ] Helpful error messages returned

✅ **Testing**
- [ ] Server starts without errors
- [ ] Health check returns 200 status
- [ ] Can get all tasks from database
- [ ] Can create new task via API
- [ ] Can update existing task
- [ ] Can delete task
- [ ] Statistics endpoint working

✅ **Professional Practices**
- [ ] TypeScript types for all requests
- [ ] Consistent error handling
- [ ] Proper HTTP status codes
- [ ] Code committed to Git with descriptive message

---

## What You Accomplished

🏆 **You built a complete REST API!**

You now have:
- **Full CRUD operations** - Create, Read, Update, Delete tasks
- **Professional error handling** - Graceful failure with helpful messages
- **Input validation** - Data integrity and security
- **Type safety** - Fewer bugs with TypeScript
- **Search and filtering** - Advanced query capabilities
- **Statistics** - Data insights for your app
- **Health monitoring** - Production-ready status checks

**Next:** In Module 4, you'll create the React frontend that uses this API to build the complete user interface.

---

## Troubleshooting

**Problem:** Server won't start
**Solution:** Check that you're in the server directory and ran `npm install`. Look at the error message carefully.

**Problem:** "Cannot find module" errors
**Solution:** Make sure all your files are saved and paths in import statements match your file structure exactly.

**Problem:** Database connection errors
**Solution:** Ensure you completed Module 2 and the database file exists in `prisma/dev.db`.

**Problem:** CORS errors when testing
**Solution:** Make sure your Express app has the CORS middleware configured correctly.

**Problem:** API returns 404 for all routes
**Solution:** Check that your routes are properly imported in `app.ts` and mounted on `/api/tasks`.

---

**Need Help?** Ask your Claude tutor specific questions about any step you're stuck on. Include the exact error message you're seeing!