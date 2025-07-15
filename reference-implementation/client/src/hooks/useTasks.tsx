import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { 
  Task, 
  CreateTaskData, 
  UpdateTaskData, 
  TaskFilters, 
  TaskStats 
} from '../types/task';

export interface UseTasksReturn {
  // State
  tasks: Task[];
  stats: TaskStats | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  completedCount: number;
  pendingCount: number;

  // Actions
  refreshTasks: () => Promise<void>;
  refreshStats: () => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: number, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskCompletion: (id: number, completed: boolean) => Promise<void>;
}

const defaultStats: TaskStats = {
  total: 0,
  completed: 0,
  pending: 0,
  byCategory: {
    WORK: 0,
    PERSONAL: 0,
    SHOPPING: 0,
    HEALTH: 0,
    OTHER: 0
  },
  byPriority: {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0
  }
};

export function useTasks(): UseTasksReturn {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  // Fetch all tasks
  const refreshTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getTasks({});
      setTasks(response.tasks);
      setCounts({
        total: response.totalCount,
        completed: response.completedCount,
        pending: response.pendingCount
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch task statistics
  const refreshStats = useCallback(async () => {
    try {
      const response = await apiClient.getStats();
      setStats(response.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Don't set error state for stats failures, just use defaults
      setStats(defaultStats);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (data: CreateTaskData) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.createTask(data);
      // Refresh tasks and stats after creation
      await Promise.all([refreshTasks(), refreshStats()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err; // Re-throw so the UI can handle it
    } finally {
      setIsLoading(false);
    }
  }, [refreshTasks, refreshStats]);

  // Update an existing task
  const updateTask = useCallback(async (id: number, data: UpdateTaskData) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.updateTask(id, data);
      // Refresh tasks and stats after update
      await Promise.all([refreshTasks(), refreshStats()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err; // Re-throw so the UI can handle it
    } finally {
      setIsLoading(false);
    }
  }, [refreshTasks, refreshStats]);

  // Delete a task
  const deleteTask = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.deleteTask(id);
      // Refresh tasks and stats after deletion
      await Promise.all([refreshTasks(), refreshStats()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err; // Re-throw so the UI can handle it
    } finally {
      setIsLoading(false);
    }
  }, [refreshTasks, refreshStats]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback(async (id: number, completed: boolean) => {
    setError(null);

    try {
      await apiClient.toggleTaskCompletion(id, completed);
      // Refresh tasks and stats after toggle
      await Promise.all([refreshTasks(), refreshStats()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err; // Re-throw so the UI can handle it
    }
  }, [refreshTasks, refreshStats]);


  // Initial data fetch
  useEffect(() => {
    refreshTasks();
    refreshStats();
  }, [refreshTasks, refreshStats]);

  return {
    // State
    tasks,
    stats,
    isLoading,
    error,
    totalCount: counts.total,
    completedCount: counts.completed,
    pendingCount: counts.pending,

    // Actions
    refreshTasks,
    refreshStats,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };
}