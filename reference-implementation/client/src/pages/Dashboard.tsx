import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskItem } from '@/components/TaskItem';
import { TaskForm } from '@/components/TaskForm';
import { TaskStats } from '@/components/TaskStats';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ViewToggle } from '@/components/ViewToggle';
import { useTasks } from '@/hooks/useTasks';
import { useViewMode } from '@/hooks/useViewMode';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';

export function Dashboard() {
  const {
    tasks,
    stats,
    isLoading,
    error,
    totalCount,
    completedCount,
    pendingCount,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask
  } = useTasks();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useViewMode();

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleFormSubmit = async (data: CreateTaskData | UpdateTaskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, data as UpdateTaskData);
      } else {
        // Create new task
        await createTask(data as CreateTaskData);
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormClose = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Error loading tasks
        </div>
        <div className="text-gray-600 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      {/* Compact Header with Inline Stats */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Task Manager</h1>
            <p className="text-primary-foreground/80 text-sm">Stay organized and productive</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-center">
              <div>
                <div className="text-xl font-bold">{totalCount}</div>
                <div className="text-primary-foreground/70 text-xs">Total</div>
              </div>
              <div>
                <div className="text-xl font-bold">{completedCount}</div>
                <div className="text-primary-foreground/70 text-xs">Done</div>
              </div>
              <div>
                <div className="text-xl font-bold">{pendingCount}</div>
                <div className="text-primary-foreground/70 text-xs">Pending</div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <TaskStats stats={stats} isLoading={isLoading} />

      {/* Controls Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ViewToggle view={viewMode} onViewChange={setViewMode} />
        </div>
        <Button onClick={handleCreateTask} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </div>

      {/* Tasks Section Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Your Tasks {tasks.length > 0 && `(${tasks.length})`}
        </h2>
      </div>

      {/* Tasks Display */}
      {isLoading ? (
        <LoadingSpinner text="Loading tasks..." className="py-12" />
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">No tasks found</div>
          <Button onClick={handleCreateTask} variant="outline">
            Create your first task
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
        }>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              layout={viewMode}
              onToggleComplete={toggleTaskCompletion}
              onEdit={handleEditTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Form Dialog */}
      <TaskForm
        task={editingTask || undefined}
        isOpen={showTaskForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />
      </div>
    </div>
  );
}