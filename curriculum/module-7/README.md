# Module 7: Advanced UI Components and Features

**Duration:** 2 days | **Week:** 4

## What You'll Build
By the end of this module, you'll have advanced features like bulk operations, keyboard shortcuts, drag-and-drop sorting, and performance optimizations that make your app feel professional.

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

**You should see:** All components from Module 6: `TaskForm.tsx`, `TaskDialogs.tsx`, `TaskFilters.tsx`, etc.

---

### Step 2: Create Keyboard Shortcuts Hook (10 minutes)

**Do this:** Create a hook for managing keyboard shortcuts:

```bash
cd ../hooks
touch useKeyboardShortcuts.ts
code useKeyboardShortcuts.ts
```

**Type exactly this:**
```typescript
import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  description: string;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    // Find matching shortcut
    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.metaKey === event.metaKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.callback();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return shortcuts;
}

// Predefined common shortcuts
export const createCommonShortcuts = (callbacks: {
  onNewTask?: () => void;
  onSearch?: () => void;
  onRefresh?: () => void;
  onToggleView?: () => void;
  onToggleTheme?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [];

  if (callbacks.onNewTask) {
    shortcuts.push({
      key: 'n',
      ctrlKey: true,
      callback: callbacks.onNewTask,
      description: 'Create new task'
    });
  }

  if (callbacks.onSearch) {
    shortcuts.push({
      key: '/',
      callback: callbacks.onSearch,
      description: 'Focus search'
    });
  }

  if (callbacks.onRefresh) {
    shortcuts.push({
      key: 'r',
      ctrlKey: true,
      callback: callbacks.onRefresh,
      description: 'Refresh tasks'
    });
  }

  if (callbacks.onToggleView) {
    shortcuts.push({
      key: 'v',
      ctrlKey: true,
      callback: callbacks.onToggleView,
      description: 'Toggle view mode'
    });
  }

  if (callbacks.onToggleTheme) {
    shortcuts.push({
      key: 't',
      ctrlKey: true,
      callback: callbacks.onToggleTheme,
      description: 'Toggle theme'
    });
  }

  return shortcuts;
};
```

**Save the file.**

**What this hook does:**
- Manages keyboard shortcuts throughout the app
- Prevents shortcuts when typing in inputs
- Supports modifier keys (Ctrl, Shift, Alt, Meta)
- Includes common predefined shortcuts
- Can be enabled/disabled dynamically

---

### Step 3: Create Help Modal Component (12 minutes)

**Do this:** Create a component to show keyboard shortcuts and help:

```bash
cd ../components
touch HelpModal.tsx
code HelpModal.tsx
```

**Type exactly this:**
```typescript
import React from 'react';
import { HelpCircle, Keyboard } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export function HelpModal({ isOpen, onClose, shortcuts }: HelpModalProps) {
  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const parts = [];
    
    if (shortcut.ctrlKey || shortcut.metaKey) {
      parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
    }
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.altKey) parts.push('Alt');
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help & Shortcuts" className="max-w-2xl">
      <div className="space-y-6">
        {/* Keyboard Shortcuts */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Keyboard className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
          </div>
          
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded">
                <span className="text-sm">{shortcut.description}</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-background border rounded">
                  {formatShortcut(shortcut)}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* General Help */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">How to Use</h3>
          </div>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Creating Tasks</h4>
              <p>Click the "Add Task" button or press Ctrl+N to create a new task. Fill in the title (required), description, category, priority, and due date.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Managing Tasks</h4>
              <p>Click the circle icon to mark tasks complete, use the edit icon to modify tasks, or the trash icon to delete them.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Organizing Tasks</h4>
              <p>Use the search bar to find specific tasks, or use filters to show tasks by category or completion status.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">View Options</h4>
              <p>Switch between grid and list views using the toggle buttons. Your preference is automatically saved.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Themes</h4>
              <p>Choose between light, dark, or system themes using the theme toggle. The system option automatically matches your device preference.</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Got it!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

**Save the file.**

**What this component does:**
- Shows keyboard shortcuts in a formatted list
- Provides general help and usage instructions
- Automatically detects Mac vs PC for key display
- Includes comprehensive usage guide
- Professional styling with icons

---

### Step 4: Create Bulk Operations Component (15 minutes)

**Do this:** Create a component for bulk task operations:

```bash
touch BulkOperations.tsx
code BulkOperations.tsx
```

**Type exactly this:**
```typescript
import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, Archive, MoreHorizontal } from 'lucide-react';
import { Task } from '../types/task';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface BulkOperationsProps {
  tasks: Task[];
  selectedTaskIds: number[];
  onSelectionChange: (taskIds: number[]) => void;
  onBulkComplete: (taskIds: number[], completed: boolean) => Promise<void>;
  onBulkDelete: (taskIds: number[]) => Promise<void>;
  isLoading: boolean;
}

export function BulkOperations({
  tasks,
  selectedTaskIds,
  onSelectionChange,
  onBulkComplete,
  onBulkDelete,
  isLoading
}: BulkOperationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const allTaskIds = tasks.map(task => task.id);
  const isAllSelected = allTaskIds.length > 0 && allTaskIds.every(id => selectedTaskIds.includes(id));
  const isPartiallySelected = selectedTaskIds.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allTaskIds);
    }
  };

  const handleBulkComplete = async () => {
    if (selectedTaskIds.length === 0) return;
    
    // Determine if we should mark as complete or incomplete
    const selectedTasks = tasks.filter(task => selectedTaskIds.includes(task.id));
    const allCompleted = selectedTasks.every(task => task.completed);
    
    await onBulkComplete(selectedTaskIds, !allCompleted);
    onSelectionChange([]);
  };

  const handleBulkDelete = async () => {
    if (selectedTaskIds.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedTaskIds.length} task${selectedTaskIds.length === 1 ? '' : 's'}?`
    );
    
    if (confirmed) {
      await onBulkDelete(selectedTaskIds);
      onSelectionChange([]);
    }
  };

  if (tasks.length === 0) return null;

  return (
    <div className="border rounded-lg bg-card">
      <div className="flex items-center justify-between p-4">
        {/* Selection Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center gap-2"
          >
            {isAllSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className={cn(
                "h-4 w-4",
                isPartiallySelected && "text-primary"
              )} />
            )}
            <span className="text-sm">
              {selectedTaskIds.length > 0 
                ? `${selectedTaskIds.length} selected`
                : 'Select all'
              }
            </span>
          </Button>

          {selectedTaskIds.length > 0 && (
            <div className="text-sm text-muted-foreground">
              of {tasks.length} task{tasks.length === 1 ? '' : 's'}
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          {selectedTaskIds.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkComplete}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {tasks.filter(task => selectedTaskIds.includes(task.id)).every(task => task.completed)
                    ? 'Mark Incomplete'
                    : 'Mark Complete'
                  }
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                disabled={isLoading}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Options */}
      {isExpanded && (
        <div className="border-t p-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center justify-between">
              <span>Total tasks:</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Completed:</span>
              <span className="font-medium text-green-600">
                {tasks.filter(task => task.completed).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pending:</span>
              <span className="font-medium text-orange-600">
                {tasks.filter(task => !task.completed).length}
              </span>
            </div>
            {selectedTaskIds.length > 0 && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span>Selected:</span>
                <span className="font-medium text-primary">{selectedTaskIds.length}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Save the file.**

**What this component does:**
- Provides select all/none functionality
- Shows selection count and status
- Offers bulk complete/incomplete operations
- Includes bulk delete with confirmation
- Shows expanded stats when requested
- Handles partial selection states

---

### Step 5: Create Enhanced Task Item with Selection (10 minutes)

**Do this:** Update TaskItem to support selection:

```bash
code TaskItem.tsx
```

**Add the selection interface at the top, after the imports:**

```typescript
interface TaskItemProps {
  task: Task;
  viewMode: ViewMode;
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  // New selection props
  isSelected?: boolean;
  onSelectionChange?: (id: number, selected: boolean) => void;
  showSelection?: boolean;
}
```

**Then update the TaskItem function signature and add selection logic at the beginning:**

```typescript
export function TaskItem({
  task,
  viewMode,
  onToggleComplete,
  onEdit,
  onDelete,
  isSelected = false,
  onSelectionChange,
  showSelection = false,
}: TaskItemProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const handleSelectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange?.(task.id, !isSelected);
  };
```

**Then find the list view JSX and update the beginning of the Card content to include selection:**

```typescript
<CardContent className="p-4">
  <div className="flex items-center gap-4">
    {/* Selection Checkbox */}
    {showSelection && (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSelectionClick}
        className="flex-shrink-0"
      >
        {isSelected ? (
          <CheckSquare className="h-4 w-4 text-primary" />
        ) : (
          <Square className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    )}

    {/* Completion Toggle */}
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onToggleComplete(task.id)}
      className="flex-shrink-0"
    >
      {task.completed ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground" />
      )}
    </Button>
```

**Similarly, update the grid view section to include selection at the top:**

```typescript
{/* Header with selection, completion toggle and actions */}
<div className="flex items-start justify-between">
  <div className="flex items-center gap-1">
    {/* Selection Checkbox */}
    {showSelection && (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSelectionClick}
        className="flex-shrink-0 h-8 w-8"
      >
        {isSelected ? (
          <CheckSquare className="h-4 w-4 text-primary" />
        ) : (
          <Square className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    )}

    <Button
      variant="ghost"
      size="icon"
      onClick={() => onToggleComplete(task.id)}
      className="flex-shrink-0"
    >
      {task.completed ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground" />
      )}
    </Button>
  </div>
```

**Add the missing import at the top:**

```typescript
import { CheckCircle2, Circle, Clock, Edit, Trash2, CheckSquare, Square } from 'lucide-react';
```

**Save the file.**

---

### Step 6: Create Performance Optimization Hook (8 minutes)

**Do this:** Create a hook for performance optimizations:

```bash
cd ../hooks
touch useVirtualization.ts
code useVirtualization.ts
```

**Type exactly this:**
```typescript
import { useState, useEffect, useMemo } from 'react';

interface UseVirtualizationProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualization({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: UseVirtualizationProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStartIndex - overscan);
  const endIndex = Math.min(items.length - 1, visibleEndIndex + overscan);

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
    startIndex,
    endIndex
  };
}

// Hook for debouncing values (useful for search)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for local storage with type safety
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

**Save the file.**

**What these hooks do:**
- `useVirtualization`: Optimizes rendering of large lists
- `useDebounce`: Prevents excessive API calls during search
- `useLocalStorage`: Type-safe localStorage management
- All include proper error handling

---

### Step 7: Create Task Statistics Component (12 minutes)

**Do this:** Create an advanced statistics component:

```bash
cd ../components
touch TaskStats.tsx
code TaskStats.tsx
```

**Type exactly this:**
```typescript
import React from 'react';
import { BarChart3, Calendar, TrendingUp, Target } from 'lucide-react';
import { Task, Category, Priority } from '../types/task';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { getCategoryLabel, getPriorityLabel, getCategoryClass, getPriorityClass } from '../lib/utils';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  // Calculate various statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Overdue tasks
  const now = new Date();
  const overdueTasks = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) < now
  ).length;

  // Due soon (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const dueSoonTasks = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) >= now &&
    new Date(task.dueDate) <= nextWeek
  ).length;

  // Category breakdown
  const categoryStats = Object.values(Category).map(category => {
    const categoryTasks = tasks.filter(task => task.category === category);
    const completed = categoryTasks.filter(task => task.completed).length;
    return {
      category,
      total: categoryTasks.length,
      completed,
      percentage: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0
    };
  }).filter(stat => stat.total > 0);

  // Priority breakdown
  const priorityStats = Object.values(Priority).map(priority => {
    const priorityTasks = tasks.filter(task => task.priority === priority);
    const completed = priorityTasks.filter(task => task.completed).length;
    return {
      priority,
      total: priorityTasks.length,
      completed,
      pending: priorityTasks.length - completed
    };
  }).filter(stat => stat.total > 0);

  if (totalTasks === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No tasks yet. Create your first task to see statistics!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-destructive" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Overdue</p>
                <p className="text-2xl font-bold text-destructive">{overdueTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Due Soon</p>
                <p className="text-2xl font-bold text-orange-500">{dueSoonTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map(stat => (
              <div key={stat.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryClass(stat.category)}>
                      {getCategoryLabel(stat.category)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {stat.completed}/{stat.total} tasks
                    </span>
                  </div>
                  <span className="text-sm font-medium">{stat.percentage}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorityStats.map(stat => (
              <div key={stat.priority} className="text-center space-y-2">
                <h4 className={`font-medium ${getPriorityClass(stat.priority)}`}>
                  {getPriorityLabel(stat.priority)}
                </h4>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stat.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.completed} completed • {stat.pending} pending
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Save the file.**

**What this component does:**
- Calculates comprehensive task statistics
- Shows completion rates and overdue tasks
- Provides category-wise progress bars
- Displays priority breakdown
- Includes visual indicators and progress bars
- Handles empty state gracefully

---

### Step 8: Update Main App with Advanced Features (18 minutes)

**Do this:** Update App.tsx to include all new features:

```bash
cd .. # Go back to src folder
code App.tsx
```

**Replace everything with exactly this:**
```typescript
import React, { useState, useRef, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTasks } from './hooks/useTasks';
import { useViewMode } from './hooks/useViewMode';
import { useKeyboardShortcuts, createCommonShortcuts } from './hooks/useKeyboardShortcuts';
import { Task, CreateTaskData, UpdateTaskData } from './types/task';
import { TaskList } from './components/TaskList';
import { TaskDialogs } from './components/TaskDialogs';
import { TaskFilters } from './components/TaskFilters';
import { BulkOperations } from './components/BulkOperations';
import { TaskStats } from './components/TaskStats';
import { HelpModal } from './components/HelpModal';
import { ThemeToggle } from './components/ThemeToggle';
import { ViewToggle } from './components/ViewToggle';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Plus, RefreshCw, HelpCircle, BarChart3 } from 'lucide-react';

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
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Bulk operations state
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [showBulkMode, setShowBulkMode] = useState(false);

  // Refs for keyboard shortcuts
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  const shortcuts = createCommonShortcuts({
    onNewTask: () => setIsCreateModalOpen(true),
    onSearch: () => searchInputRef.current?.focus(),
    onRefresh: refreshTasks,
    onToggleView: () => setViewMode(viewMode === 'grid' ? 'list' : 'grid'),
  });

  useKeyboardShortcuts({ 
    shortcuts: [
      ...shortcuts,
      {
        key: '?',
        callback: () => setIsHelpModalOpen(true),
        description: 'Show help'
      },
      {
        key: 'b',
        ctrlKey: true,
        callback: () => setShowBulkMode(!showBulkMode),
        description: 'Toggle bulk mode'
      },
      {
        key: 's',
        ctrlKey: true,
        callback: () => setIsStatsModalOpen(true),
        description: 'Show statistics'
      }
    ]
  });

  // Task management handlers
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

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setSelectedTaskIds(prev => prev.filter(taskId => taskId !== id));
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  // Bulk operations handlers
  const handleBulkComplete = async (taskIds: number[], completed: boolean) => {
    try {
      await Promise.all(
        taskIds.map(id => updateTask(id, { completed }))
      );
    } catch (error) {
      console.error('Failed to bulk update tasks:', error);
    }
  };

  const handleBulkDelete = async (taskIds: number[]) => {
    try {
      await Promise.all(taskIds.map(id => deleteTask(id)));
    } catch (error) {
      console.error('Failed to bulk delete tasks:', error);
    }
  };

  const handleTaskSelection = useCallback((taskId: number, selected: boolean) => {
    setSelectedTaskIds(prev => 
      selected 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  }, []);

  // Modal close handlers
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStatsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshTasks}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            <ThemeToggle />
          </div>
        </div>

        {/* Quick Stats */}
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

        {/* Actions and Controls */}
        <div className="space-y-6 mb-6">
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowBulkMode(!showBulkMode)}
                className="flex items-center gap-2"
              >
                Select Multiple
              </Button>
            </div>

            {selectedTaskIds.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedTaskIds.length} task{selectedTaskIds.length === 1 ? '' : 's'} selected
              </div>
            )}
          </div>

          {/* Bulk Operations */}
          {showBulkMode && (
            <BulkOperations
              tasks={tasks}
              selectedTaskIds={selectedTaskIds}
              onSelectionChange={setSelectedTaskIds}
              onBulkComplete={handleBulkComplete}
              onBulkDelete={handleBulkDelete}
              isLoading={isLoading}
            />
          )}

          {/* Filters */}
          <TaskFilters
            ref={searchInputRef}
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
          showSelection={showBulkMode}
          selectedTaskIds={selectedTaskIds}
          onSelectionChange={handleTaskSelection}
        />

        {/* Modals */}
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

        {/* Help Modal */}
        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
          shortcuts={shortcuts}
        />

        {/* Stats Modal */}
        {isStatsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsStatsModalOpen(false)}
            />
            <div className="relative bg-background border rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold">Task Statistics</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsStatsModalOpen(false)}
                  className="h-6 w-6"
                >
                  ×
                </Button>
              </div>
              <div className="p-6">
                <TaskStats tasks={tasks} />
              </div>
            </div>
          </div>
        )}
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

---

### Step 9: Update TaskList and TaskFilters Components (8 minutes)

**Do this:** Update TaskList to support selection:

```bash
cd components
code TaskList.tsx
```

**Update the TaskListProps interface:**

```typescript
interface TaskListProps {
  tasks: Task[];
  viewMode: ViewMode;
  isLoading: boolean;
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  // New selection props
  showSelection?: boolean;
  selectedTaskIds?: number[];
  onSelectionChange?: (taskId: number, selected: boolean) => void;
}
```

**Update the TaskList function and TaskItem usage:**

```typescript
export function TaskList({
  tasks,
  viewMode,
  isLoading,
  onToggleComplete,
  onEdit,
  onDelete,
  showSelection = false,
  selectedTaskIds = [],
  onSelectionChange,
}: TaskListProps) {
  // ... existing loading and empty states ...

  return (
    <div
      className={cn(
        'gap-4',
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'space-y-4'
      )}
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          viewMode={viewMode}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          showSelection={showSelection}
          isSelected={selectedTaskIds.includes(task.id)}
          onSelectionChange={onSelectionChange}
        />
      ))}
    </div>
  );
}
```

**Now update TaskFilters to support ref:**

```bash
code TaskFilters.tsx
```

**Add React.forwardRef and update the component:**

```typescript
import React, { useState, forwardRef } from 'react';
// ... other imports

interface TaskFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  totalCount: number;
  filteredCount: number;
}

export const TaskFilters = forwardRef<HTMLInputElement, TaskFiltersProps>(({ 
  filters, 
  onFiltersChange, 
  totalCount, 
  filteredCount 
}, ref) => {
  // ... existing state and handlers ...

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {/* ... rest of component unchanged ... */}
      </div>
      {/* ... rest of component unchanged ... */}
    </div>
  );
});

TaskFilters.displayName = 'TaskFilters';
```

**Save both files.**

---

### Step 10: Test All Advanced Features (10 minutes)

**Do this:** Test your enhanced application:

**Make sure both servers are running and open http://localhost:5173**

**Test new features:**

1. **Keyboard Shortcuts:**
   - Press `Ctrl+N` to create new task
   - Press `/` to focus search
   - Press `Ctrl+R` to refresh
   - Press `Ctrl+V` to toggle view
   - Press `?` to show help
   - Press `Ctrl+B` to toggle bulk mode
   - Press `Ctrl+S` to show statistics

2. **Bulk Operations:**
   - Click "Select Multiple"
   - Check multiple tasks
   - Use bulk complete/delete operations
   - Test select all functionality

3. **Advanced Statistics:**
   - Click "Stats" button
   - View detailed statistics and progress bars
   - Check category and priority breakdowns

4. **Help System:**
   - Click "Help" or press `?`
   - Review keyboard shortcuts and usage guide

5. **Performance:**
   - Create many tasks (if possible)
   - Test search responsiveness
   - Verify smooth interactions

---

### Step 11: Commit Your Work (3 minutes)

**Do this:** Save your progress:

```bash
cd ../../.. # Go back to my-task-manager root
git add .
git commit -m "Complete Module 7: Advanced UI components and features

- Created comprehensive keyboard shortcuts system with useKeyboardShortcuts hook
- Built HelpModal component with shortcuts guide and usage instructions
- Implemented BulkOperations component for selecting and managing multiple tasks
- Enhanced TaskItem component with selection checkbox support
- Created TaskStats component with detailed analytics and progress visualization
- Added performance optimization hooks (virtualization, debounce, localStorage)
- Updated main App with advanced features and keyboard shortcuts integration
- Enhanced TaskList and TaskFilters to support selection and refs

Advanced Features Added:
✅ Keyboard shortcuts (Ctrl+N, /, Ctrl+R, Ctrl+V, ?, Ctrl+B, Ctrl+S)
✅ Bulk task operations (select, complete, delete multiple tasks)
✅ Advanced statistics with progress bars and category breakdowns
✅ Help system with shortcuts guide and usage instructions
✅ Performance optimizations for large task lists
✅ Enhanced user experience with better interactions
✅ Professional keyboard navigation throughout the app

The app now feels like a professional task management tool with:
- Complete keyboard navigation support
- Bulk operations for power users
- Detailed analytics and progress tracking
- Context-sensitive help system
- Optimized performance for large datasets
- Modern UI interactions and feedback

Next: Module 8 will add final polish and integration features!"
```

---

## Completion Checklist

✅ **Keyboard Shortcuts**
- [ ] useKeyboardShortcuts hook created with modifier key support
- [ ] Common shortcuts defined (Ctrl+N, /, Ctrl+R, Ctrl+V, ?, etc.)
- [ ] Shortcuts disabled when typing in inputs
- [ ] Help modal shows all available shortcuts

✅ **Bulk Operations**
- [ ] BulkOperations component for multi-select functionality
- [ ] Select all/none with partial selection states
- [ ] Bulk complete/incomplete operations
- [ ] Bulk delete with confirmation
- [ ] Selection state management

✅ **Advanced Statistics**
- [ ] TaskStats component with comprehensive analytics
- [ ] Completion rates and overdue task tracking
- [ ] Category progress bars with percentages
- [ ] Priority breakdown visualization
- [ ] Empty state handling

✅ **Performance Optimizations**
- [ ] useVirtualization hook for large lists
- [ ] useDebounce hook for search optimization
- [ ] useLocalStorage hook with type safety
- [ ] Efficient re-rendering strategies

✅ **Enhanced User Experience**
- [ ] Help modal with usage guide
- [ ] Professional keyboard navigation
- [ ] Context-sensitive help content
- [ ] Responsive design for all new components
- [ ] Loading states and error handling

✅ **Component Integration**
- [ ] TaskItem supports selection mode
- [ ] TaskList passes selection props
- [ ] TaskFilters supports ref forwarding
- [ ] All components work together seamlessly

---

## What You Accomplished

🏆 **You built a professional-grade task management application with advanced features!**

Your app now includes:
- **Complete keyboard navigation** - Professional shortcuts for all major actions
- **Bulk operations** - Select and manage multiple tasks efficiently
- **Advanced analytics** - Detailed statistics and progress tracking
- **Help system** - Built-in guidance and shortcut reference
- **Performance optimizations** - Smooth experience even with many tasks
- **Professional UX** - Modern interactions and visual feedback

**Advanced Features:**
- Keyboard shortcuts with modifier key support
- Multi-select with bulk complete/delete operations
- Detailed statistics with progress visualization
- Context-sensitive help and usage guides
- Performance hooks for optimization
- Enhanced accessibility and navigation

**Your task manager now rivals commercial applications with:**
- Professional keyboard shortcuts
- Power user bulk operations
- Beautiful analytics and insights
- Comprehensive help system
- Optimized performance
- Modern, responsive design

**Next:** In Module 8, you'll add the final polish with animations, error boundaries, and deployment preparation.

---

## Troubleshooting

**Problem:** Keyboard shortcuts not working
**Solution:** Check that you're not typing in an input field. Shortcuts are disabled during text input.

**Problem:** Bulk selection not working
**Solution:** Make sure "Select Multiple" mode is enabled and TaskItem components receive selection props.

**Problem:** Statistics not updating
**Solution:** Verify that the TaskStats component receives the current tasks array and statistics calculations are correct.

**Problem:** Help modal not showing shortcuts
**Solution:** Check that the shortcuts array is properly passed to the HelpModal component.

**Problem:** Performance issues with many tasks
**Solution:** Implement the useVirtualization hook for the TaskList component if you have a large number of tasks.

---

**Need Help?** Ask your Claude tutor specific questions about any step you're stuck on!