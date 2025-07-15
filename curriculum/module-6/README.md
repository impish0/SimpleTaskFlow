# Module 6: Forms and Task Creation/Editing

**Duration:** 2 days | **Week:** 3-4

## What You'll Build
By the end of this module, you'll have working forms to create new tasks and edit existing ones, completing your full CRUD (Create, Read, Update, Delete) functionality.

## Step-by-Step Instructions

### Step 1: Navigate to Components Folder (1 minute)

**Do this:** Make sure you're in the right place:

```bash
cd student-workspace/my-task-manager/client/src/components
pwd
```

**You should see:** A path ending with "client/src/components"

**Verify your setup:**
```bash
ls -la
```

**You should see:** Files from Module 5: `TaskItem.tsx`, `TaskList.tsx`, `ThemeToggle.tsx`, `ViewToggle.tsx`, and `ui/` folder

---

### Step 2: Create Form Input Components (12 minutes)

**Do this:** Create reusable form components:

```bash
touch ui/Input.tsx
code ui/Input.tsx
```

**Type exactly this:**
```typescript
import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
```

**Save the file.**

**Create Textarea component:**
```bash
touch ui/Textarea.tsx
code ui/Textarea.tsx
```

**Type exactly this:**
```typescript
import React from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
```

**Save the file.**

**Create Select component:**
```bash
touch ui/Select.tsx
code ui/Select.tsx
```

**Type exactly this:**
```typescript
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  );
}
```

**Save the file.**

**Create Label component:**
```bash
touch ui/Label.tsx
code ui/Label.tsx
```

**Type exactly this:**
```typescript
import React from 'react';
import { cn } from '../../lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
```

**Save the file.**

**What these components do:**
- Provide consistent form inputs with proper styling
- Include focus states and accessibility features
- Support disabled states and proper error styling
- Follow the design system established in previous modules

---

### Step 3: Create Modal Component (8 minutes)

**Do this:** Create a modal for form dialogs:

```bash
touch ui/Modal.tsx
code ui/Modal.tsx
```

**Type exactly this:**
```typescript
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={cn(
          'relative bg-background border rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-auto',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```

**Save the file.**

**What this component does:**
- Creates an accessible modal dialog
- Handles Escape key to close
- Prevents body scrolling when open
- Includes backdrop click to close
- Provides consistent header with close button

---

### Step 4: Create Task Form Component (20 minutes)

**Do this:** Create the main form for creating and editing tasks:

```bash
touch TaskForm.tsx
code TaskForm.tsx
```

**Type exactly this:**
```typescript
import React, { useState, useEffect } from 'react';
import { Task, Category, Priority, CreateTaskData, UpdateTaskData } from '../types/task';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Select } from './ui/Select';
import { Label } from './ui/Label';
import { getCategoryLabel, getPriorityLabel } from '../lib/utils';

interface TaskFormProps {
  task?: Task; // If provided, we're editing; if not, we're creating
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || Category.PERSONAL,
    priority: task?.priority || Priority.MEDIUM,
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '', // Format for date input
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for fair comparison
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isEditing = !!task;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter task title..."
          className={errors.title ? 'border-destructive' : ''}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter task description (optional)..."
          rows={3}
          className={errors.description ? 'border-destructive' : ''}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Category and Priority Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value as Category)}
            disabled={isLoading}
          >
            {Object.values(Category).map((category) => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">
            Priority <span className="text-destructive">*</span>
          </Label>
          <Select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value as Priority)}
            disabled={isLoading}
          >
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>
                {getPriorityLabel(priority)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleInputChange('dueDate', e.target.value)}
          className={errors.dueDate ? 'border-destructive' : ''}
          disabled={isLoading}
        />
        {errors.dueDate && (
          <p className="text-sm text-destructive">{errors.dueDate}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            isEditing ? 'Updating...' : 'Creating...'
          ) : (
            isEditing ? 'Update Task' : 'Create Task'
          )}
        </Button>
      </div>
    </form>
  );
}
```

**Save the file.**

**What this component does:**
- Handles both creating new tasks and editing existing ones
- Includes comprehensive form validation
- Shows character counts and real-time error clearing
- Prevents past dates for due dates
- Provides loading states during submission
- Responsive layout for mobile devices

---

### Step 5: Create Task Dialogs Component (10 minutes)

**Do this:** Create a component to manage task creation and editing modals:

```bash
touch TaskDialogs.tsx
code TaskDialogs.tsx
```

**Type exactly this:**
```typescript
import React from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '../types/task';
import { Modal } from './ui/Modal';
import { TaskForm } from './TaskForm';

interface TaskDialogsProps {
  // Create task modal
  isCreateOpen: boolean;
  onCreateClose: () => void;
  onCreateSubmit: (data: CreateTaskData) => Promise<void>;
  isCreateLoading: boolean;

  // Edit task modal
  isEditOpen: boolean;
  editTask: Task | null;
  onEditClose: () => void;
  onEditSubmit: (id: number, data: UpdateTaskData) => Promise<void>;
  isEditLoading: boolean;
}

export function TaskDialogs({
  isCreateOpen,
  onCreateClose,
  onCreateSubmit,
  isCreateLoading,
  isEditOpen,
  editTask,
  onEditClose,
  onEditSubmit,
  isEditLoading,
}: TaskDialogsProps) {
  const handleEditSubmit = async (data: UpdateTaskData) => {
    if (!editTask) return;
    await onEditSubmit(editTask.id, data);
  };

  return (
    <>
      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        title="Create New Task"
        className="max-w-lg"
      >
        <TaskForm
          onSubmit={onCreateSubmit}
          onCancel={onCreateClose}
          isLoading={isCreateLoading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={onEditClose}
        title="Edit Task"
        className="max-w-lg"
      >
        {editTask && (
          <TaskForm
            task={editTask}
            onSubmit={handleEditSubmit}
            onCancel={onEditClose}
            isLoading={isEditLoading}
          />
        )}
      </Modal>
    </>
  );
}
```

**Save the file.**

**What this component does:**
- Manages both create and edit modals in one place
- Handles the different prop requirements for each form
- Keeps modal logic separate from the main dashboard
- Provides consistent modal sizing and behavior

---

### Step 6: Create Search and Filter Component (12 minutes)

**Do this:** Create a component for filtering and searching tasks:

```bash
touch TaskFilters.tsx
code TaskFilters.tsx
```

**Type exactly this:**
```typescript
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Category, TaskFilters as FilterType } from '../types/task';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Label } from './ui/Label';
import { getCategoryLabel } from '../lib/utils';

interface TaskFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  totalCount: number;
  filteredCount: number;
}

export function TaskFilters({ 
  filters, 
  onFiltersChange, 
  totalCount, 
  filteredCount 
}: TaskFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Debounce search updates
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, search: value || undefined });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === 'ALL' ? undefined : (category as Category)
    });
  };

  const handleCompletedChange = (completed: string) => {
    onFiltersChange({
      ...filters,
      completed: completed === 'ALL' ? undefined : completed === 'true'
    });
  };

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.category || filters.completed !== undefined;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchValue('');
              onFiltersChange({ ...filters, search: undefined });
            }}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </Button>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredCount === totalCount ? (
            `${totalCount} task${totalCount === 1 ? '' : 's'}`
          ) : (
            `${filteredCount} of ${totalCount} task${totalCount === 1 ? '' : 's'}`
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select
              id="category-filter"
              value={filters.category || 'ALL'}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {Object.values(Category).map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              id="status-filter"
              value={
                filters.completed === undefined 
                  ? 'ALL' 
                  : filters.completed 
                    ? 'true' 
                    : 'false'
              }
              onChange={(e) => handleCompletedChange(e.target.value)}
            >
              <option value="ALL">All Tasks</option>
              <option value="false">Pending</option>
              <option value="true">Completed</option>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="md:col-span-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

**Save the file.**

**What this component does:**
- Provides search functionality with debouncing
- Offers category and completion status filtering
- Shows active filter count and results count
- Includes expandable filter panel
- Allows clearing individual and all filters

---

### Step 7: Update Main App with Form Integration (15 minutes)

**Do this:** Update App.tsx to include the new form functionality:

```bash
cd .. # Go back to src folder
code App.tsx
```

**Replace everything with exactly this:**
```typescript
import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTasks } from './hooks/useTasks';
import { useViewMode } from './hooks/useViewMode';
import { Task, CreateTaskData, UpdateTaskData } from './types/task';
import { TaskList } from './components/TaskList';
import { TaskDialogs } from './components/TaskDialogs';
import { TaskFilters } from './components/TaskFilters';
import { ThemeToggle } from './components/ThemeToggle';
import { ViewToggle } from './components/ViewToggle';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Plus, RefreshCw } from 'lucide-react';

function Dashboard() {
  const {
    tasks,
    isLoading,
    error,
    totalCount,
    completedCount,
    pendingCount,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refreshTasks,
    applyFilters,
    filters,
  } = useTasks();

  const { viewMode, setViewMode } = useViewMode();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Handle create task
  const handleCreateTask = async (data: CreateTaskData) => {
    setIsCreateLoading(true);
    try {
      await createTask(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsCreateLoading(false);
    }
  };

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (id: number, data: UpdateTaskData) => {
    setIsEditLoading(true);
    try {
      await updateTask(id, data);
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsEditLoading(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  // Handle modal close
  const handleCreateModalClose = () => {
    if (!isCreateLoading) {
      setIsCreateModalOpen(false);
    }
  };

  const handleEditModalClose = () => {
    if (!isEditLoading) {
      setIsEditModalOpen(false);
      setEditingTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshTasks}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            <ThemeToggle />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              {totalCount > 0 && (
                <div className="text-xs text-muted-foreground">
                  {Math.round((completedCount / totalCount) * 100)}% complete
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="space-y-6 mb-6">
          {/* Add Task Button */}
          <div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* Filters */}
          <TaskFilters
            filters={filters}
            onFiltersChange={applyFilters}
            totalCount={totalCount}
            filteredCount={tasks.length}
          />
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="text-destructive">
                Error: {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          viewMode={viewMode}
          isLoading={isLoading}
          onToggleComplete={toggleTaskCompletion}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        {/* Task Dialogs */}
        <TaskDialogs
          isCreateOpen={isCreateModalOpen}
          onCreateClose={handleCreateModalClose}
          onCreateSubmit={handleCreateTask}
          isCreateLoading={isCreateLoading}
          isEditOpen={isEditModalOpen}
          editTask={editingTask}
          onEditClose={handleEditModalClose}
          onEditSubmit={handleUpdateTask}
          isEditLoading={isEditLoading}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="task-manager-theme">
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
```

**Save the file.**

**What this updated App does:**
- Adds state management for create and edit modals
- Integrates task creation and editing functionality
- Includes search and filtering capabilities
- Adds refresh functionality with loading state
- Shows completion percentage in stats
- Handles loading states for all operations
- Provides better responsive design

---

### Step 8: Test Your Complete CRUD Functionality (8 minutes)

**Do this:** Test all the new features:

**Make sure both servers are running:**

**Terminal 1 (Backend):**
```bash
cd student-workspace/my-task-manager/server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd student-workspace/my-task-manager/client
npm run dev
```

**Open http://localhost:5173**

**Test all features:**

1. **Create a new task:**
   - Click "Add Task" button
   - Fill out the form with title, description, category, priority, due date
   - Click "Create Task"
   - Verify the task appears in the list

2. **Edit an existing task:**
   - Click the edit icon on any task
   - Modify some fields
   - Click "Update Task"
   - Verify changes are saved

3. **Search functionality:**
   - Type in the search box
   - Verify tasks filter as you type

4. **Filter functionality:**
   - Click "Filters" to expand
   - Try different category and status filters
   - Verify the results count updates

5. **Form validation:**
   - Try creating a task without a title
   - Try setting a due date in the past
   - Verify error messages appear

6. **Keyboard shortcuts:**
   - Press Escape in an open modal
   - Verify modal closes

---

### Step 9: Improve Error Handling (6 minutes)

**Do this:** Add better error handling to the form:

```bash
cd components
code TaskForm.tsx
```

**Find the handleSubmit function and replace it with this enhanced version:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  try {
    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
    };

    await onSubmit(submitData);
  } catch (error) {
    console.error('Form submission error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Title')) {
        setErrors(prev => ({ ...prev, title: error.message }));
      } else if (error.message.includes('Description')) {
        setErrors(prev => ({ ...prev, description: error.message }));
      } else if (error.message.includes('Category')) {
        setErrors(prev => ({ ...prev, category: error.message }));
      } else if (error.message.includes('Priority')) {
        setErrors(prev => ({ ...prev, priority: error.message }));
      } else if (error.message.includes('due date')) {
        setErrors(prev => ({ ...prev, dueDate: error.message }));
      } else {
        // Generic error
        setErrors(prev => ({ ...prev, general: 'Failed to save task. Please try again.' }));
      }
    }
  }
};
```

**Then add error display after the form actions div, before the closing form tag:**

```typescript
{/* General Error Display */}
{errors.general && (
  <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-3">
    {errors.general}
  </div>
)}
```

**Save the file.**

---

### Step 10: Add Form Reset Functionality (3 minutes)

**Do this:** Add a function to reset the form when creating new tasks:

**In TaskForm.tsx, add this function after the validateForm function:**

```typescript
const resetForm = () => {
  setFormData({
    title: '',
    description: '',
    category: Category.PERSONAL,
    priority: Priority.MEDIUM,
    dueDate: '',
  });
  setErrors({});
};

// Reset form when switching from edit to create
useEffect(() => {
  if (!task) {
    resetForm();
  }
}, [task]);
```

**Save the file.**

---

### Step 11: Commit Your Work (3 minutes)

**Do this:** Save your progress:

```bash
cd ../../.. # Go back to my-task-manager root
git add .
git commit -m "Complete Module 6: Forms and task creation/editing

- Created comprehensive form input components (Input, Textarea, Select, Label)
- Built accessible Modal component with keyboard support
- Implemented TaskForm with full validation and error handling
- Added TaskDialogs component for managing create/edit modals
- Created TaskFilters component with search and filtering
- Updated main App with complete CRUD functionality
- Added form reset and enhanced error handling
- Integrated search with debouncing for better performance

New Features:
- Create new tasks with full form validation
- Edit existing tasks in modal dialogs
- Search tasks by title and description
- Filter by category and completion status
- Real-time validation with helpful error messages
- Keyboard shortcuts (Escape to close modals)
- Loading states for all operations
- Character counters and input limits
- Past date validation for due dates
- Responsive form layouts

Complete CRUD functionality now working:
✅ Create - Add new tasks with forms
✅ Read - View tasks in grid/list with filtering
✅ Update - Edit tasks with validation
✅ Delete - Remove tasks with confirmation

Next: Module 7 will add advanced UI features and polish!"
```

---

## Completion Checklist

✅ **Form Components**
- [ ] Input, Textarea, Select, and Label components created
- [ ] All components follow design system
- [ ] Proper focus states and accessibility
- [ ] Consistent styling and variants

✅ **Modal System**
- [ ] Modal component with backdrop and keyboard support
- [ ] Escape key closes modals
- [ ] Body scroll prevention when open
- [ ] Accessible close button

✅ **Task Forms**
- [ ] TaskForm handles both create and edit modes
- [ ] Comprehensive validation with real-time error clearing
- [ ] Character limits and counters
- [ ] Past date validation for due dates
- [ ] Loading states during submission

✅ **Search and Filtering**
- [ ] Search with debouncing for performance
- [ ] Category and status filtering
- [ ] Active filter indicators
- [ ] Results count display
- [ ] Clear filters functionality

✅ **CRUD Operations**
- [ ] Create new tasks with validation
- [ ] Edit existing tasks in modals
- [ ] Delete tasks with confirmation
- [ ] Toggle task completion
- [ ] Refresh data functionality

✅ **User Experience**
- [ ] Loading states for all operations
- [ ] Error handling with specific messages
- [ ] Form reset between operations
- [ ] Responsive design for mobile
- [ ] Keyboard shortcuts working

---

## What You Accomplished

🏆 **You built a complete task management system with full CRUD functionality!**

You now have:
- **Complete form system** - Professional forms with validation
- **Modal dialogs** - Accessible modals for create/edit operations
- **Search and filtering** - Find tasks quickly with multiple filter options
- **Full CRUD operations** - Create, Read, Update, Delete all working
- **Professional UX** - Loading states, error handling, keyboard shortcuts
- **Responsive design** - Works perfectly on mobile and desktop
- **Data validation** - Comprehensive client-side validation with helpful errors

**Your app now includes:**
- Task creation with full validation
- Task editing in modal dialogs
- Real-time search with debouncing
- Category and status filtering
- Character limits and counters
- Due date validation
- Loading states for all operations
- Error handling with specific messages
- Keyboard shortcuts (Escape to close)
- Mobile-responsive forms

**Next:** In Module 7, you'll add advanced features like bulk operations, keyboard shortcuts, and performance optimizations.

---

## Troubleshooting

**Problem:** Modal doesn't open when clicking Add Task
**Solution:** Check browser console for errors. Ensure all component imports are correct.

**Problem:** Form validation not working
**Solution:** Check that all form fields have proper names and the validation function is called on submit.

**Problem:** Search not filtering tasks
**Solution:** Verify the debouncing is working and check the network tab to see if API calls are being made.

**Problem:** Date picker showing wrong format
**Solution:** Ensure you're using type="date" on the input and formatting the date correctly for the value.

**Problem:** Modal stays open after form submission
**Solution:** Check that the onSubmit function is properly awaiting the API call and then closing the modal.

---

**Need Help?** Ask your Claude tutor specific questions about any step you're stuck on!