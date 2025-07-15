import { 
  Task, 
  CreateTaskData, 
  UpdateTaskData, 
  TaskStats, 
  TaskFilters 
} from '../types/task';
import {
  GetTasksResponse,
  GetTaskResponse,
  CreateTaskResponse,
  UpdateTaskResponse,
  DeleteTaskResponse,
  GetStatsResponse,
  ApiError,
  GetTasksParams
} from '../types/api';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
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
        // Try to get error details from response
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
            timestamp: new Date().toISOString(),
            status: response.status
          };
        }
        
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  // Get all tasks with optional filtering
  async getTasks(filters?: TaskFilters): Promise<GetTasksResponse> {
    const params = new URLSearchParams();
    
    if (filters?.category && filters.category !== 'ALL') {
      params.append('category', filters.category);
    }
    
    if (filters?.completed !== undefined && filters.completed !== 'ALL') {
      params.append('completed', filters.completed.toString());
    }
    
    if (filters?.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }

    const queryString = params.toString();
    const endpoint = `/api/tasks${queryString ? `?${queryString}` : ''}`;

    return this.request<GetTasksResponse>(endpoint);
  }

  // Get a single task by ID
  async getTask(id: number): Promise<GetTaskResponse> {
    return this.request<GetTaskResponse>(`/api/tasks/${id}`);
  }

  // Create a new task
  async createTask(data: CreateTaskData): Promise<CreateTaskResponse> {
    return this.request<CreateTaskResponse>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update an existing task
  async updateTask(id: number, data: UpdateTaskData): Promise<UpdateTaskResponse> {
    return this.request<UpdateTaskResponse>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Delete a task
  async deleteTask(id: number): Promise<DeleteTaskResponse> {
    return this.request<DeleteTaskResponse>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Get task statistics
  async getStats(): Promise<GetStatsResponse> {
    return this.request<GetStatsResponse>('/api/tasks/stats');
  }

  // Toggle task completion (convenience method)
  async toggleTaskCompletion(id: number, completed: boolean): Promise<UpdateTaskResponse> {
    // First get the current task data
    const taskResponse = await this.getTask(id);
    const task = taskResponse.task;

    // Update only the completed status
    const updateData: UpdateTaskData = {
      title: task.title,
      description: task.description || undefined,
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate || undefined,
      completed: completed
    };

    return this.updateTask(id, updateData);
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export the class for potential additional instances
export default ApiClient;