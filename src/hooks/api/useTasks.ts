import useSWR from "swr";
import { useAuthStore } from "@/stores/auth";
import { useTaskStore } from "@/stores/task";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types";
import { apiService } from "@/services/api";

/**
 * Hook per ottenere tasks di una colonna specifica
 */
export const useColumnTasks = (columnId: string | null) => {
  const { isAuthenticated } = useAuthStore();
  const { setTasks } = useTaskStore();

  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    isAuthenticated && columnId ? `/columns/${columnId}/tasks` : null,
    {
      // Don't refresh tasks too often (WebSocket handles real-time updates)
      refreshInterval: 0,

      // Cache tasks for 2 minutes
      dedupingInterval: 2 * 60 * 1000,

      // Revalidate when user focuses tab
      revalidateOnFocus: true,

      // Update store on success
      onSuccess: (tasks) => {
        if (columnId) {
          setTasks(columnId, tasks);
        }
      },
    }
  );

  return {
    tasks: data ?? [],
    isLoading,
    error,
    mutate,

    // Optimistic mutations
    createTask: async (taskData: CreateTaskRequest) => {
      if (!columnId) return;

      try {
        const newTask = await apiService.createTask(taskData);

        // Optimistically add to cache
        mutate([...(data ?? []), newTask], false);

        return newTask;
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },

    updateTask: async (taskId: string, updates: UpdateTaskRequest) => {
      if (!data) return;

      const taskIndex = data.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return;

      const optimisticTask = { ...data[taskIndex], ...updates };
      const optimisticTasks = [...data];
      optimisticTasks[taskIndex] = optimisticTask;

      try {
        // Optimistically update
        mutate(optimisticTasks, false);

        // Make API call
        const updatedTask = await apiService.updateTask(taskId, updates);

        // Update with real data
        const realTasks = [...data];
        realTasks[taskIndex] = updatedTask;
        mutate(realTasks);

        return updatedTask;
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },

    deleteTask: async (taskId: string) => {
      if (!data) return;

      try {
        await apiService.deleteTask(taskId);

        // Optimistically remove from cache
        mutate(
          data.filter((task) => task.id !== taskId),
          false
        );
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },
  };
};

/**
 * Hook per ottenere un task specifico
 */
export const useTask = (taskId: string | null) => {
  const { isAuthenticated } = useAuthStore();

  const { data, error, isLoading, mutate } = useSWR<Task>(
    isAuthenticated && taskId ? `/tasks/${taskId}` : null,
    {
      // Cache individual task for 5 minutes
      dedupingInterval: 5 * 60 * 1000,

      // Don't refresh individual tasks too often
      refreshInterval: 0,

      // Revalidate on focus
      revalidateOnFocus: true,
    }
  );

  return {
    task: data,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Hook per ottenere tasks del board corrente raggruppate per colonna
 */
export const useBoardTasks = (boardId: string | null) => {
  const { isAuthenticated } = useAuthStore();

  const { data, error, isLoading, mutate } = useSWR<{
    [columnId: string]: Task[];
  }>(isAuthenticated && boardId ? `/boards/${boardId}/tasks` : null, {
    // Don't refresh too often (WebSocket handles updates)
    refreshInterval: 0,

    // Cache board tasks for 1 minute
    dedupingInterval: 60 * 1000,

    // Revalidate when tab gets focus
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    tasksByColumn: data ?? {},
    isLoading,
    error,
    mutate,

    // Move task between columns (optimistic)
    moveTask: async (
      taskId: string,
      fromColumnId: string,
      toColumnId: string,
      position: number
    ) => {
      if (!data) return;

      // Find the task
      const task = data[fromColumnId]?.find((t) => t.id === taskId);
      if (!task) return;

      // Create optimistic update
      const optimisticData = { ...data };

      // Remove from source column
      optimisticData[fromColumnId] = optimisticData[fromColumnId].filter(
        (t) => t.id !== taskId
      );

      // Add to target column
      const updatedTask = { ...task, columnId: toColumnId, position };
      optimisticData[toColumnId] = [
        ...(optimisticData[toColumnId] || []),
        updatedTask,
      ].sort((a, b) => a.position - b.position);

      try {
        // Optimistically update
        mutate(optimisticData, false);

        // Make API call
        await apiService.moveTask(taskId, toColumnId, position);

        // Revalidate to get accurate data
        mutate();
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },
  };
};
