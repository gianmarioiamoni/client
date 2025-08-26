import { create } from "zustand";
import type { UserPresenceState, UserPresence } from "@/types";

export const usePresenceStore = create<UserPresenceState>((set, get) => ({
  onlineUsers: [],
  userCursors: {},

  setOnlineUsers: (users: UserPresence[]) => {
    set({ onlineUsers: users });
  },

  addUser: (user: UserPresence) => {
    set((state) => {
      // Check if user already exists
      const existingIndex = state.onlineUsers.findIndex(
        (u) => u.userId === user.userId
      );

      if (existingIndex >= 0) {
        // Update existing user
        const updatedUsers = [...state.onlineUsers];
        updatedUsers[existingIndex] = user;
        return { onlineUsers: updatedUsers };
      } else {
        // Add new user
        return { onlineUsers: [...state.onlineUsers, user] };
      }
    });
  },

  removeUser: (userId: string) => {
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((user) => user.userId !== userId),
      userCursors: Object.fromEntries(
        Object.entries(state.userCursors).filter(([id]) => id !== userId)
      ),
    }));
  },

  updateUserCursor: (cursor: UserPresence) => {
    set((state) => ({
      userCursors: {
        ...state.userCursors,
        [cursor.userId]: cursor,
      },
    }));
  },
}));
