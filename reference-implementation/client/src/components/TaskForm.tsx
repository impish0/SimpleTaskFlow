import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task, CreateTaskData, UpdateTaskData, Category, Priority, CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '@/types/task';

interface TaskFormProps {
  task?: Task; // undefined for create, defined for edit
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  isLoading?: boolean;
}

export function TaskForm({ task, isOpen, onClose, onSubmit, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: Category.OTHER,
    priority: Priority.MEDIUM,
    dueDate: '',
    completed: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (task) {
      // Editing existing task
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', // Convert to YYYY-MM-DD format
        completed: task.completed
      });
    } else {
      // Creating new task
      setFormData({
        title: '',
        description: '',
        category: Category.OTHER,
        priority: Priority.MEDIUM,
        dueDate: '',
        completed: false
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const submitData: CreateTaskData | UpdateTaskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        ...(task && { completed: formData.completed }) // Only include completed for updates
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              disabled={isLoading}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description (optional)"
              disabled={isLoading}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: Category) => setFormData(prev => ({ ...prev, category: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          {/* Completed (only for editing) */}
          {task && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="completed"
                checked={formData.completed}
                onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
                disabled={isLoading}
                className="h-4 w-4"
              />
              <Label htmlFor="completed">Mark as completed</Label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}