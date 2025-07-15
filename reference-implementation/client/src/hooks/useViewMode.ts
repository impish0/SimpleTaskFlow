import { useState, useEffect } from 'react';
import { ViewMode } from '@/components/ViewToggle';

export function useViewMode(): [ViewMode, (view: ViewMode) => void] {
  const [view, setView] = useState<ViewMode>(() => {
    // Check localStorage for saved preference
    const savedView = localStorage.getItem('taskViewMode') as ViewMode;
    return savedView && ['grid', 'list'].includes(savedView) ? savedView : 'grid';
  });

  const updateView = (newView: ViewMode) => {
    setView(newView);
    localStorage.setItem('taskViewMode', newView);
  };

  return [view, updateView];
}