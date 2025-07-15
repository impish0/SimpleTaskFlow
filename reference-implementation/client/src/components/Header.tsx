import React from 'react';
import { CheckSquare, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface HeaderProps {
  totalTasks?: number;
  completedToday?: number;
}

export function Header({ totalTasks = 0, completedToday = 0 }: HeaderProps) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* App Title and Icon */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <CheckSquare className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                My Task Manager
              </h1>
              <p className="text-blue-100 text-sm">
                Stay organized and productive
              </p>
            </div>
          </div>

          {/* Date and Quick Stats */}
          <div className="flex items-center space-x-6">
            {/* Current Date */}
            <div className="flex items-center space-x-2 text-blue-100">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">
                {formattedDate}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              <div className="bg-white/10 px-3 py-1 rounded-full">
                <span className="font-semibold">{totalTasks}</span>
                <span className="ml-1">total tasks</span>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-full">
                <span className="font-semibold">{completedToday}</span>
                <span className="ml-1">completed today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="sm:hidden mt-4 flex space-x-3 text-sm">
          <div className="bg-white/10 px-3 py-1 rounded-full flex-1 text-center">
            <span className="font-semibold">{totalTasks}</span>
            <span className="ml-1">total</span>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-full flex-1 text-center">
            <span className="font-semibold">{completedToday}</span>
            <span className="ml-1">today</span>
          </div>
        </div>
      </div>
    </header>
  );
}