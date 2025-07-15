import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TaskFilters as TaskFiltersType, CATEGORY_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '@/types/task';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  activeCount?: number;
}

export function TaskFilters({ filters, onFiltersChange, activeCount = 0 }: TaskFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ ...filters, search: value.trim() || undefined });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ 
      ...filters, 
      category: category === 'ALL' ? undefined : category as any 
    });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ 
      ...filters, 
      completed: status === 'ALL' ? undefined : status === 'true' 
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    onFiltersChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeCount} active
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Select
            value={filters.category || 'ALL'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_FILTER_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select
            value={filters.completed === undefined ? 'ALL' : String(filters.completed)}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Tasks" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map(option => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}