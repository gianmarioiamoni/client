import React from "react";
import useSWR from "swr";
import { useAuthStore } from "@/stores/auth";
import { useBoardStore } from "@/stores/board";
import type { Board, CreateBoardRequest, UpdateBoardRequest } from "@/types";
import { apiService } from "@/services/api";

/**
 * Hook per ottenere tutti i boards dell'utente
 */
export const useBoards = () => {
  const { isAuthenticated } = useAuthStore();
  const { setBoards, setLoading, setError } = useBoardStore();

  const { data, error, isLoading, mutate } = useSWR<Board[]>(
    isAuthenticated ? "/boards" : null,
    {
      // Refresh boards every 30 seconds (moderate frequency)
      refreshInterval: 30 * 1000,

      // Cache for 1 minute to avoid excessive requests
      dedupingInterval: 60 * 1000,

      // Revalidate on focus to get latest boards
      revalidateOnFocus: true,

      // Custom error handling
      onError: (err) => {
        console.error("Failed to fetch boards:", err);
        setError(err.message);
      },

      // Update store on success
      onSuccess: (boards) => {
        setBoards(boards);
        setError(null);
      },
    }
  );

  // Sync loading state with store
  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return {
    boards: data ?? [],
    isLoading,
    error,
    mutate,

    // Optimistic mutations
    createBoard: async (boardData: CreateBoardRequest) => {
      try {
        const newBoard = await apiService.createBoard(boardData);

        // Optimistically update cache
        mutate([...(data ?? []), newBoard], false);

        return newBoard;
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },

    deleteBoard: async (boardId: string) => {
      try {
        await apiService.deleteBoard(boardId);

        // Optimistically remove from cache
        mutate(
          (data ?? []).filter((board) => board.id !== boardId),
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
 * Hook per ottenere un board specifico con i suoi dati completi
 */
export const useBoard = (boardId: string | null) => {
  const { isAuthenticated } = useAuthStore();
  const { setCurrentBoard, setError } = useBoardStore();

  const { data, error, isLoading, mutate } = useSWR<Board>(
    isAuthenticated && boardId ? `/boards/${boardId}` : null,
    {
      // Don't refresh single board too often (WebSocket handles real-time updates)
      refreshInterval: 0,

      // Cache single board for 5 minutes
      dedupingInterval: 5 * 60 * 1000,

      // Revalidate when focusing tab
      revalidateOnFocus: true,
      revalidateOnReconnect: true,

      // Handle errors
      onError: (err) => {
        console.error(`Failed to fetch board ${boardId}:`, err);
        setError(err.message);
        setCurrentBoard(null);
      },

      // Update store on success
      onSuccess: (board) => {
        setCurrentBoard(board);
        setError(null);
      },
    }
  );

  return {
    board: data,
    isLoading,
    error,
    mutate,

    // Optimistic update for board
    updateBoard: async (updates: UpdateBoardRequest) => {
      if (!data) return;

      const optimisticBoard = { ...data, ...updates };

      try {
        // Optimistically update
        mutate(optimisticBoard, false);

        // Make API call
        const updatedBoard = await apiService.updateBoard(data.id, updates);

        // Update with real data
        mutate(updatedBoard);

        return updatedBoard;
      } catch (error) {
        // Revert on error
        mutate();
        throw error;
      }
    },
  };
};

/**
 * Hook per board metadata (statistics, activity)
 */
export const useBoardStats = (boardId: string | null) => {
  const { isAuthenticated } = useAuthStore();

  const { data, error, isLoading } = useSWR<{
    totalTasks: number;
    completedTasks: number;
    activeUsers: number;
    lastActivity: string;
  }>(isAuthenticated && boardId ? `/boards/${boardId}/stats` : null, {
    // Refresh stats every minute
    refreshInterval: 60 * 1000,

    // Cache stats for 30 seconds
    dedupingInterval: 30 * 1000,

    // Don't revalidate stats on focus (not critical)
    revalidateOnFocus: false,
  });

  return {
    stats: data,
    isLoading,
    error,
  };
};
