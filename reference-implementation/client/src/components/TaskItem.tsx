import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/task';
import { getCategoryClasses, getPriorityClasses } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  layout?: 'grid' | 'list';
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete, layout = 'grid' }: TaskItemProps) {
  const handleToggleComplete = () => {
    onToggleComplete(task.id, !task.completed);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const baseClasses = "bg-card border rounded-lg p-4 hover:shadow-md transition-shadow";
  const layoutClasses = layout === 'list' ? '' : 'h-full';
  const opacityClasses = task.completed ? 'opacity-75' : '';

  return (
    <div className={`${baseClasses} ${layoutClasses} ${opacityClasses}`}>
      <div className={layout === 'list' ? 'flex items-start gap-3' : 'space-y-3'}>
        {/* Checkbox and Content */}
        <div className={layout === 'list' ? 'flex items-start gap-3 flex-1' : 'flex items-start justify-between'}>
          <div className={layout === 'list' ? 'flex items-start gap-3 flex-1' : 'flex items-start gap-3 flex-1'}>
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-card-foreground ${
                task.completed ? 'line-through' : ''
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
              <span className="sr-only">Edit task</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        </div>

        {/* Meta information */}
        <div className={`flex items-center gap-3 text-xs ${layout === 'list' ? 'mt-3' : 'mt-2'}`}>
          {/* Priority dot */}
          <div className="flex items-center gap-1">
            <div className={getPriorityClasses(task.priority)} />
            <span className="text-muted-foreground capitalize">{task.priority.toLowerCase()}</span>
          </div>

          {/* Category */}
          <span className={`px-2 py-1 text-xs font-medium ${getCategoryClasses(task.category)}`}>
            {task.category}
          </span>

          {/* Due date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}