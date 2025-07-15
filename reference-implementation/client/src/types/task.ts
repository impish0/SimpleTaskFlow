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

export interface Task {
  id: number;
  title: string;
  description: string | null;
  category: Category;
  priority: Priority;
  dueDate: string | null; // ISO date string
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

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

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  byCategory: Record<Category, number>;
  byPriority: Record<Priority, number>;
}

export interface TaskFilters {
  category?: Category | 'ALL';
  completed?: boolean | 'ALL';
  search?: string;
}

// Form data interfaces for React Hook Form
export interface TaskFormData {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string; // HTML date input format (YYYY-MM-DD)
}

// Display interfaces
export interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => Promise<void>;
}

export interface TaskFormProps {
  task?: Task; // undefined for create, defined for edit
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Category and Priority options for form selects
export const CATEGORY_OPTIONS = [
  { value: Category.WORK, label: 'Work' },
  { value: Category.PERSONAL, label: 'Personal' },
  { value: Category.SHOPPING, label: 'Shopping' },
  { value: Category.HEALTH, label: 'Health' },
  { value: Category.OTHER, label: 'Other' }
];

export const PRIORITY_OPTIONS = [
  { value: Priority.HIGH, label: 'High' },
  { value: Priority.MEDIUM, label: 'Medium' },
  { value: Priority.LOW, label: 'Low' }
];

// Filter options
export const CATEGORY_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Categories' },
  ...CATEGORY_OPTIONS
];

export const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Tasks' },
  { value: true, label: 'Completed' },
  { value: false, label: 'Pending' }
];