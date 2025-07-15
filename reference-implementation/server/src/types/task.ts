import { Category, Priority } from '@prisma/client';

export interface CreateTaskData {
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate?: string; // ISO date string
}

export interface UpdateTaskData {
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate?: string; // ISO date string
  completed: boolean;
}

export interface TaskFilters {
  category?: Category;
  completed?: boolean;
  search?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  byCategory: Record<Category, number>;
  byPriority: Record<Priority, number>;
}