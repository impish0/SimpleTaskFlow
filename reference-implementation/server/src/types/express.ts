import { Request } from 'express';
import { CreateTaskData, UpdateTaskData, TaskFilters } from './task';

export interface CreateTaskRequest extends Request {
  body: CreateTaskData;
}

export interface UpdateTaskRequest extends Request {
  body: UpdateTaskData;
  params: {
    id: string;
  };
}

export interface GetTaskRequest extends Request {
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

export interface DeleteTaskRequest extends Request {
  params: {
    id: string;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  details?: string[];
}

export interface ApiError extends Error {
  status?: number;
  details?: string[];
}