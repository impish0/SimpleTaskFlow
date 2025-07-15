# Module 4: React Frontend Setup

**Duration:** 2 days | **Week:** 3

## What You'll Build
By the end of this module, you'll have a complete React frontend running with TypeScript, Tailwind CSS, and modern tooling that connects to your API.

## Step-by-Step Instructions

### Step 1: Navigate to Client Folder (1 minute)

**Do this:** Move to your frontend folder:

```bash
cd student-workspace/my-task-manager/client
pwd
```

**You should see:** A path ending with "my-task-manager/client"

**Verify you're in the right place:**
```bash
ls -la
```

**You should see:** An empty folder (we'll fill it now).

---

### Step 2: Create React App with Vite (5 minutes)

**Do this:** Set up a modern React app:

```bash
npm create vite@latest . -- --template react-ts
```

**What you'll see:** Questions about overwriting the current directory. Type `y` and press Enter.

**Then install dependencies:**
```bash
npm install
```

**What this does:**
- Creates a React app with TypeScript support
- Uses Vite (faster than Create React App)
- Sets up modern development tools
- Installs all necessary packages

**Test it works:**
```bash
npm run dev
```

**You should see:**
```
Local:   http://localhost:5173/
```

**Open http://localhost:5173 in your browser.** You should see a working React app with the Vite logo.

**Stop the server:** Press `Ctrl+C` in the terminal.

---

### Step 3: Install Additional Dependencies (3 minutes)

**Do this:** Install the packages we'll need:

```bash
npm install @types/react @types/react-dom lucide-react clsx tailwind-merge
```

**Then install dev dependencies:**
```bash
npm install -D tailwindcss postcss autoprefixer @types/node
```

**What these packages do:**
- `@types/react` - TypeScript support for React
- `lucide-react` - Beautiful icons
- `clsx` - Conditional CSS classes
- `tailwind-merge` - Merge Tailwind classes safely
- `tailwindcss` - CSS framework
- `@types/node` - TypeScript support for Node.js

---

### Step 4: Set Up Tailwind CSS (5 minutes)

**Do this:** Initialize Tailwind:

```bash
npx tailwindcss init -p
```

**You should see:** Files created: `tailwind.config.js` and `postcss.config.js`

**Edit the Tailwind config:**
```bash
code tailwind.config.js
```

**Replace the contents with exactly this:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

**Save the file.**

**What this does:**
- Configures Tailwind to scan your React files
- Enables dark mode with CSS classes
- Sets up a professional color system
- Adds consistent border radius variables

---

### Step 5: Set Up Global Styles (4 minutes)

**Do this:** Replace the default CSS with our design system:

```bash
code src/index.css
```

**Replace everything with exactly this:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;

    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom task category styles */
.category-work {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full;
}

.category-personal {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full;
}

.category-shopping {
  @apply bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full;
}

.category-health {
  @apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full;
}

.category-other {
  @apply bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-full;
}

/* Priority styles */
.priority-high {
  @apply text-red-600 dark:text-red-400;
}

.priority-medium {
  @apply text-yellow-600 dark:text-yellow-400;
}

.priority-low {
  @apply text-green-600 dark:text-green-400;
}
```

**Save the file.**

**What this does:**
- Sets up Tailwind CSS framework
- Creates consistent light and dark color themes
- Defines custom category and priority styles
- Provides professional design foundation

---

### Step 6: Create TypeScript Types (5 minutes)

**Do this:** Create type definitions for your frontend:

```bash
mkdir src/types
touch src/types/task.ts
code src/types/task.ts
```

**Type exactly this:**
```typescript
// Enums matching your backend
export enum Category {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  SHOPPING = 'SHOPPING',
  HEALTH = 'HEALTH',
  OTHER = 'OTHER'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

// Task interface
export interface Task {
  id: number;
  title: string;
  description: string | null;
  category: Category;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface TasksResponse {
  tasks: Task[];
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  timestamp: string;
}

export interface TaskResponse {
  task: Task;
  timestamp: string;
}

export interface TaskStatsResponse {
  stats: {
    total: number;
    completed: number;
    pending: number;
    byCategory: Record<Category, number>;
    byPriority: Record<Priority, number>;
  };
  timestamp: string;
}

// Form data types
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

// Filter types
export interface TaskFilters {
  category?: Category | 'ALL';
  completed?: boolean | 'ALL';
  search?: string;
}

// View mode type
export type ViewMode = 'grid' | 'list';
```

**Save the file.**

**What this does:**
- Matches your backend type definitions exactly
- Provides type safety throughout your frontend
- Defines all API response structures
- Sets up form and filter types

---

### Step 7: Create Utility Functions (4 minutes)

**Do this:** Create helper functions you'll use throughout the app:

```bash
mkdir src/lib
touch src/lib/utils.ts
code src/lib/utils.ts
```

**Type exactly this:**
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category, Priority } from "../types/task";

// Utility for combining CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format due date with relative time
export function formatDueDate(dateString: string | null): string {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    return `Overdue by ${Math.abs(diffInDays)} day${Math.abs(diffInDays) === 1 ? '' : 's'}`;
  } else if (diffInDays === 0) {
    return 'Due today';
  } else if (diffInDays === 1) {
    return 'Due tomorrow';
  } else if (diffInDays <= 7) {
    return `Due in ${diffInDays} days`;
  } else {
    return formatDate(dateString);
  }
}

// Get category display name
export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    [Category.WORK]: 'Work',
    [Category.PERSONAL]: 'Personal',
    [Category.SHOPPING]: 'Shopping',
    [Category.HEALTH]: 'Health',
    [Category.OTHER]: 'Other'
  };
  return labels[category];
}

// Get priority display name
export function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    [Priority.HIGH]: 'High',
    [Priority.MEDIUM]: 'Medium',
    [Priority.LOW]: 'Low'
  };
  return labels[priority];
}

// Get category CSS class
export function getCategoryClass(category: Category): string {
  const classes: Record<Category, string> = {
    [Category.WORK]: 'category-work',
    [Category.PERSONAL]: 'category-personal',
    [Category.SHOPPING]: 'category-shopping',
    [Category.HEALTH]: 'category-health',
    [Category.OTHER]: 'category-other'
  };
  return classes[category];
}

// Get priority CSS class
export function getPriorityClass(priority: Priority): string {
  const classes: Record<Priority, string> = {
    [Priority.HIGH]: 'priority-high',
    [Priority.MEDIUM]: 'priority-medium',
    [Priority.LOW]: 'priority-low'
  };
  return classes[priority];
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Sort tasks by priority and due date
export function sortTasks(tasks: any[]) {
  return tasks.sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority (HIGH = 0, MEDIUM = 1, LOW = 2)
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Finally by creation order
    return a.id - b.id;
  });
}
```

**Save the file.**

**What this does:**
- Provides utility functions for styling and data formatting
- Handles date formatting with relative time
- Maps categories and priorities to display labels
- Provides consistent task sorting logic
- Sets up CSS class utilities

---

### Step 8: Create API Client (6 minutes)

**Do this:** Create functions to communicate with your backend:

```bash
mkdir src/api
touch src/api/tasks.ts
code src/api/tasks.ts
```

**Type exactly this:**
```typescript
import {
  Task,
  TasksResponse,
  TaskResponse,
  TaskStatsResponse,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters
} from '../types/task';

// Base API configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

// Get all tasks with optional filtering
export async function getTasks(filters?: TaskFilters): Promise<TasksResponse> {
  const params = new URLSearchParams();
  
  if (filters?.category && filters.category !== 'ALL') {
    params.append('category', filters.category);
  }
  
  if (filters?.completed !== undefined && filters.completed !== 'ALL') {
    params.append('completed', String(filters.completed));
  }
  
  if (filters?.search) {
    params.append('search', filters.search);
  }

  const endpoint = `/tasks${params.toString() ? `?${params.toString()}` : ''}`;
  return apiCall<TasksResponse>(endpoint);
}

// Get a single task by ID
export async function getTaskById(id: number): Promise<TaskResponse> {
  return apiCall<TaskResponse>(`/tasks/${id}`);
}

// Create a new task
export async function createTask(data: CreateTaskData): Promise<TaskResponse> {
  return apiCall<TaskResponse>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update an existing task
export async function updateTask(id: number, data: UpdateTaskData): Promise<TaskResponse> {
  return apiCall<TaskResponse>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Delete a task
export async function deleteTask(id: number): Promise<{ message: string; timestamp: string }> {
  return apiCall<{ message: string; timestamp: string }>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

// Get task statistics
export async function getTaskStats(): Promise<TaskStatsResponse> {
  return apiCall<TaskStatsResponse>('/tasks/stats');
}

// Toggle task completion status
export async function toggleTaskCompletion(id: number, completed: boolean): Promise<TaskResponse> {
  return updateTask(id, { completed });
}
```

**Save the file.**

**What this does:**
- Creates a complete API client for your backend
- Handles all HTTP methods (GET, POST, PUT, DELETE)
- Includes error handling and type safety
- Supports filtering and search parameters
- Provides convenience functions for common operations

---

### Step 9: Clean Up Default Files (2 minutes)

**Do this:** Remove files we don't need and update the main app:

```bash
rm src/App.css
rm src/assets/react.svg
```

**Update the main App component:**
```bash
code src/App.tsx
```

**Replace everything with exactly this:**
```typescript
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Task Manager
        </h1>
        <div className="max-w-md mx-auto">
          <div className="bg-card text-card-foreground rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Frontend Setup Complete!</h2>
            <p className="text-muted-foreground">
              Your React frontend is ready. In the next module, you'll build the task management components.
            </p>
            <div className="mt-4 p-3 bg-secondary rounded">
              <p className="text-sm">
                ✅ React + TypeScript<br/>
                ✅ Tailwind CSS<br/>
                ✅ API Client<br/>
                ✅ Type Definitions<br/>
                ✅ Utility Functions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

**Save the file.**

---

### Step 10: Test Your Frontend (3 minutes)

**Do this:** Start the development server:

```bash
npm run dev
```

**You should see:**
```
Local:   http://localhost:5173/
```

**Open http://localhost:5173** You should see a clean, professional-looking page with:
- "Task Manager" heading
- "Frontend Setup Complete!" card
- Checklist of completed features
- Professional styling

**Test dark mode:** Open browser developer tools (F12), go to Console, and type:
```javascript
document.documentElement.classList.toggle('dark')
```

**You should see:** The page switches between light and dark themes.

**Stop the server:** Press `Ctrl+C`

---

### Step 11: Update Package.json Scripts (2 minutes)

**Do this:** Update the client's package.json with helpful scripts:

```bash
code package.json
```

**Find the "scripts" section and update it to exactly this:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

**Save the file.**

---

### Step 12: Commit Your Work (3 minutes)

**Do this:** Save your progress:

```bash
cd .. # Go back to my-task-manager root
git add .
git status
```

**You should see:** All your new frontend files being tracked.

```bash
git commit -m "Complete Module 4: React frontend setup

- Set up React 18 with TypeScript and Vite
- Configured Tailwind CSS with dark mode support
- Created comprehensive type definitions
- Built complete API client with error handling
- Added utility functions for formatting and styling
- Set up professional color scheme and design system
- Cleaned up default files and created minimal App component
- Tested frontend with light/dark mode switching

Frontend Features:
- Modern React development environment
- Type-safe API communication
- Professional styling foundation
- Dark/light theme support
- Utility functions for data formatting
- Ready for component development

Next: Module 5 will add React components and state management!"
```

---

## Completion Checklist

✅ **Development Environment**
- [ ] Vite React app created with TypeScript
- [ ] Tailwind CSS configured with dark mode
- [ ] All dependencies installed correctly
- [ ] Development server starts without errors
- [ ] Can view app at http://localhost:5173

✅ **Type Safety**
- [ ] Task types match backend exactly
- [ ] API response types defined
- [ ] Form data types created
- [ ] Filter and view mode types set up

✅ **API Integration**
- [ ] Complete API client created
- [ ] All CRUD operations implemented
- [ ] Error handling in place
- [ ] Type-safe API calls
- [ ] Filter and search support

✅ **Utilities & Styling**
- [ ] CSS utility function (cn) working
- [ ] Date formatting functions created
- [ ] Category and priority helpers built
- [ ] Task sorting logic implemented
- [ ] Professional color scheme applied

✅ **Professional Setup**
- [ ] Clean project structure
- [ ] No unused default files
- [ ] Package.json scripts configured
- [ ] Git commit with detailed message
- [ ] Dark/light mode tested

---

## What You Accomplished

🏆 **You built a professional React frontend foundation!**

You now have:
- **Modern React development** - Vite + TypeScript + Tailwind
- **Type safety** - Full TypeScript integration
- **API communication** - Complete client for your backend
- **Professional styling** - Dark/light themes and design system
- **Utility functions** - Helpers for common tasks
- **Clean architecture** - Organized, maintainable code structure

**Next:** In Module 5, you'll create React components to display and manage tasks.

---

## Troubleshooting

**Problem:** npm create vite fails
**Solution:** Make sure you have Node.js 16+ installed. Try `node --version` to check.

**Problem:** Tailwind styles not loading
**Solution:** Make sure you saved `tailwind.config.js` and `src/index.css` correctly.

**Problem:** TypeScript errors
**Solution:** Check that all files are saved and restart your development server.

**Problem:** Can't connect to API
**Solution:** Make sure your backend server is running on port 3001 (from Module 3).

**Problem:** Dark mode toggle not working
**Solution:** Open browser console and check for errors. Make sure CSS variables are defined.

---

**Need Help?** Ask your Claude tutor specific questions about any step you're stuck on. Include error messages and which step you're on!