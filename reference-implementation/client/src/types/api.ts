import { Task, TaskStats } from './task';

// API Response interfaces
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  details?: string[];
  timestamp: string;
}

// Specific API response types
export interface GetTasksResponse {
  tasks: Task[];
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  timestamp: string;
}

export interface GetTaskResponse {
  task: Task;
  timestamp: string;
}

export interface CreateTaskResponse {
  task: Task;
  message: string;
  timestamp: string;
}

export interface UpdateTaskResponse {
  task: Task;
  message: string;
  timestamp: string;
}

export interface DeleteTaskResponse {
  message: string;
  timestamp: string;
}

export interface GetStatsResponse {
  stats: TaskStats;
  timestamp: string;
}

// Error response interface
export interface ApiError {
  error: string;
  details?: string[];
  timestamp: string;
  status?: number;
}

// API client configuration
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
}

// Query parameters for GET /api/tasks
export interface GetTasksParams {
  category?: string;
  completed?: string;
  search?: string;
}