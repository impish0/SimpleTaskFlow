import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState(prev => ({ ...prev, data: result, isLoading: false }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    execute,
    reset,
  };
}

// Specific hooks for common operations
export function useCreateTask() {
  return useApi(async (data: any) => {
    const { apiClient } = await import('../api/client');
    return apiClient.createTask(data);
  });
}

export function useUpdateTask() {
  return useApi(async (id: number, data: any) => {
    const { apiClient } = await import('../api/client');
    return apiClient.updateTask(id, data);
  });
}

export function useDeleteTask() {
  return useApi(async (id: number) => {
    const { apiClient } = await import('../api/client');
    return apiClient.deleteTask(id);
  });
}

// Toast notification hook
export function useToast() {
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // For now, just use console.log
    // In a real app, you'd integrate with a toast library
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You can replace this with actual toast implementation later
    if (type === 'error') {
      console.error(message);
    }
  }, []);

  return { showToast };
}

// Loading state hook for multiple operations
export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  return { setLoading, isLoading };
}