import { create } from "zustand";
import type { BoardState, Board } from "@/types";

export const useBoardStore = create<BoardState>((set, get) => ({
  currentBoard: null,
  boards: [],
  isLoading: false,
  error: null,

  setCurrentBoard: (board: Board | null) => {
    set({ currentBoard: board });
  },

  setBoards: (boards: Board[]) => {
    set({ boards });
  },

  addBoard: (board: Board) => {
    set((state) => ({
      boards: [...state.boards, board],
    }));
  },

  updateBoard: (updatedBoard: Board) => {
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === updatedBoard.id ? updatedBoard : board
      ),
      currentBoard:
        state.currentBoard?.id === updatedBoard.id
          ? updatedBoard
          : state.currentBoard,
    }));
  },

  deleteBoard: (boardId: string) => {
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== boardId),
      currentBoard:
        state.currentBoard?.id === boardId ? null : state.currentBoard,
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
