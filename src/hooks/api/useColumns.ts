import useSWR from "swr";
import { useAuthStore } from "@/stores/auth";
import { useColumnStore } from "@/stores/column";
import type { Column, CreateColumnRequest, UpdateColumnRequest } from "@/types";
import { apiService } from "@/services/api";

/**
 * Hook per ottenere tutte le colonne di un board
 */
export const useBoardColumns = (boardId: string | null) => {
  const { isAuthenticated } = useAuthStore();
  const { setColumns } = useColumnStore();

  const { data, error, isLoading, mutate } = useSWR<Column[]>(
    isAuthenticated && boardId ? `/boards/${boardId}/columns` : null,
    {
      // Don't refresh columns too often (WebSocket handles updates)
      refreshInterval: 0,

      // Cache columns for 5 minutes
      dedupingInterval: 5 * 60 * 1000,

      // Revalidate when user focuses tab
      revalidateOnFocus: true,
      revalidateOnReconnect: true,

      // Update store on success
      onSuccess: (columns) => {
        setColumns(columns);
      },
    }
  );

  return {
    columns: data ?? [],
    isLoading,
    error,
    mutate,

    // Optimistic mutations
    createColumn: async (columnData: CreateColumnRequest) => {
      try {
        const newColumn = await apiService.createColumn(columnData);

        // Optimistically add to cache
        mutate([...(data ?? []), newColumn], false);

        return newColumn;
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },

    updateColumn: async (columnId: string, updates: UpdateColumnRequest) => {
      if (!data) return;

      const columnIndex = data.findIndex((col) => col.id === columnId);
      if (columnIndex === -1) return;

      const optimisticColumn = { ...data[columnIndex], ...updates };
      const optimisticColumns = [...data];
      optimisticColumns[columnIndex] = optimisticColumn;

      try {
        // Optimistically update
        mutate(optimisticColumns, false);

        // Make API call
        const updatedColumn = await apiService.updateColumn(columnId, updates);

        // Update with real data
        const realColumns = [...data];
        realColumns[columnIndex] = updatedColumn;
        mutate(realColumns);

        return updatedColumn;
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },

    deleteColumn: async (columnId: string) => {
      if (!data) return;

      try {
        await apiService.deleteColumn(columnId);

        // Optimistically remove from cache
        mutate(
          data.filter((col) => col.id !== columnId),
          false
        );
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },

    reorderColumns: async (newOrder: string[]) => {
      if (!data) return;

      // Create optimistically reordered columns
      const reorderedColumns = newOrder
        .map((id) => data.find((col) => col.id === id))
        .filter(Boolean) as Column[];

      try {
        // Optimistically update
        mutate(reorderedColumns, false);

        // Make API call
        await apiService.reorderColumns(boardId!, newOrder);

        // Revalidate to ensure consistency
        mutate();
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },
  };
};

/**
 * Hook per ottenere una colonna specifica
 */
export const useColumn = (columnId: string | null) => {
  const { isAuthenticated } = useAuthStore();

  const { data, error, isLoading, mutate } = useSWR<Column>(
    isAuthenticated && columnId ? `/columns/${columnId}` : null,
    {
      // Cache individual column for 10 minutes
      dedupingInterval: 10 * 60 * 1000,

      // Don't refresh individual columns too often
      refreshInterval: 0,

      // Revalidate on focus
      revalidateOnFocus: true,
    }
  );

  return {
    column: data,
    isLoading,
    error,
    mutate,
  };
};
