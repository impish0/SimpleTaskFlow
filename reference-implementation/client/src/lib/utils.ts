import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export const formatDate = (date: string | Date | null): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateToCheck = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  
  // Check if it's today
  if (dateToCheck.getTime() === today.getTime()) {
    return 'Today';
  }
  
  // Check if it's tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateToCheck.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateToCheck.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  
  // Format as month/day for current year, or month/day/year for other years
  const currentYear = now.getFullYear();
  if (dateObj.getFullYear() === currentYear) {
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } else {
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
};

// Check if a date is overdue
export const isOverdue = (dueDate: string | Date | null): boolean => {
  if (!dueDate) return false;
  
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateToCheck = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  
  return dateToCheck < today;
};

// Check if a date is due today
export const isDueToday = (dueDate: string | Date | null): boolean => {
  if (!dueDate) return false;
  
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateToCheck = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  
  return dateToCheck.getTime() === today.getTime();
};

// Get category color classes
export const getCategoryClasses = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'work':
      return 'category-work';
    case 'personal':
      return 'category-personal';
    case 'shopping':
      return 'category-shopping';
    case 'health':
      return 'category-health';
    default:
      return 'category-other';
  }
};

// Get priority dot classes
export const getPriorityClasses = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'priority-dot-high';
    case 'medium':
      return 'priority-dot-medium';
    case 'low':
      return 'priority-dot-low';
    default:
      return 'priority-dot-medium';
  }
};