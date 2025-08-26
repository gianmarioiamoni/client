import { create } from "zustand";
import type { ColumnState, Column } from "@/types";

export const useColumnStore = create<ColumnState>((set, get) => ({
  columns: [],
  isLoading: false,
  error: null,

  setColumns: (columns: Column[]) => {
    set({ columns: columns.sort((a, b) => a.position - b.position) });
  },

  addColumn: (column: Column) => {
    set((state) => ({
      columns: [...state.columns, column].sort(
        (a, b) => a.position - b.position
      ),
    }));
  },

  updateColumn: (updatedColumn: Column) => {
    set((state) => ({
      columns: state.columns
        .map((column) =>
          column.id === updatedColumn.id ? updatedColumn : column
        )
        .sort((a, b) => a.position - b.position),
    }));
  },

  deleteColumn: (columnId: string) => {
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== columnId),
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
