import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiService } from "@/services/api";
import { socketService } from "@/services/socket";
import type { AuthState, User, LoginRequest, RegisterRequest } from "@/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });

        try {
          const response = await apiService.login(credentials);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Connect to socket
          socketService.connect(response.token);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true });

        try {
          const response = await apiService.register(data);

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Connect to socket
          socketService.connect(response.token);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Disconnect socket
        socketService.disconnect();

        // Clear API token
        apiService.clearToken();

        // Reset auth state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Call logout endpoint (fire and forget)
        apiService.logout().catch(console.error);
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token });
        apiService.setToken(token);
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore API token when rehydrating
        if (state?.token) {
          apiService.setToken(state.token);

          // Reconnect socket if we have a token
          socketService.connect(state.token);
        }
      },
    }
  )
);
