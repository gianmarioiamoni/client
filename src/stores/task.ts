import { create } from "zustand";
import type { TaskState, Task } from "@/types";

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: {},
  isLoading: false,
  error: null,

  setTasks: (columnId: string, tasks: Task[]) => {
    set((state) => ({
      tasks: {
        ...state.tasks,
        [columnId]: tasks.sort((a, b) => a.position - b.position),
      },
    }));
  },

  addTask: (task: Task) => {
    set((state) => {
      const columnTasks = state.tasks[task.columnId] || [];
      const updatedTasks = [...columnTasks, task].sort(
        (a, b) => a.position - b.position
      );

      return {
        tasks: {
          ...state.tasks,
          [task.columnId]: updatedTasks,
        },
      };
    });
  },

  updateTask: (updatedTask: Task) => {
    set((state) => {
      const columnTasks = state.tasks[updatedTask.columnId] || [];
      const updatedTasks = columnTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );

      return {
        tasks: {
          ...state.tasks,
          [updatedTask.columnId]: updatedTasks,
        },
      };
    });
  },

  deleteTask: (taskId: string) => {
    set((state) => {
      const newTasks = { ...state.tasks };

      // Find and remove task from its column
      Object.keys(newTasks).forEach((columnId) => {
        newTasks[columnId] = newTasks[columnId].filter(
          (task) => task.id !== taskId
        );
      });

      return { tasks: newTasks };
    });
  },

  moveTask: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    position: number
  ) => {
    set((state) => {
      const newTasks = { ...state.tasks };

      // Find the task to move
      const fromTasks = newTasks[fromColumnId] || [];
      const taskToMove = fromTasks.find((task) => task.id === taskId);

      if (!taskToMove) return state;

      // Remove task from source column
      newTasks[fromColumnId] = fromTasks.filter((task) => task.id !== taskId);

      // Update task with new column and position
      const updatedTask = { ...taskToMove, columnId: toColumnId, position };

      // Add task to target column
      const toTasks = newTasks[toColumnId] || [];
      newTasks[toColumnId] = [...toTasks, updatedTask].sort(
        (a, b) => a.position - b.position
      );

      return { tasks: newTasks };
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
