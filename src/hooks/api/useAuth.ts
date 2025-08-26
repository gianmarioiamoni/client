import useSWR from "swr";
import { useAuthStore } from "@/stores/auth";
import type { User } from "@/types";

/**
 * Hook per gestire i dati utente con SWR
 * Fornisce cache, revalidation automatica e stato di loading/error
 */
export const useCurrentUser = () => {
  const { token, isAuthenticated } = useAuthStore();

  const { data, error, isLoading, mutate } = useSWR<User>(
    isAuthenticated && token ? "/auth/me" : null,
    {
      // Revalidate user data every 5 minutes
      refreshInterval: 5 * 60 * 1000,

      // Don't retry on auth errors
      errorRetryCount: 1,

      // Revalidate when tab becomes visible
      revalidateOnFocus: true,
    }
  );

  return {
    user: data,
    isLoading,
    error,
    mutate, // For manual revalidation
    isAuthenticated: isAuthenticated && !error,
  };
};

/**
 * Hook per verificare lo stato di autenticazione
 */
export const useAuthStatus = () => {
  const { token, isAuthenticated } = useAuthStore();

  const { data, error, isLoading } = useSWR<{ valid: boolean; user: User }>(
    token ? "/auth/verify" : null,
    {
      // Check auth status every 10 minutes
      refreshInterval: 10 * 60 * 1000,

      // Don't retry auth verification too aggressively
      errorRetryCount: 2,
      errorRetryInterval: 10000,

      // Important: revalidate when user switches tabs
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    isValid: data?.valid ?? false,
    user: data?.user,
    isLoading,
    error,
    isAuthenticated: isAuthenticated && data?.valid,
  };
};

/**
 * Hook per ottenere i permessi utente
 */
export const useUserPermissions = (boardId?: string) => {
  const { isAuthenticated } = useAuthStore();

  const { data, error, isLoading } = useSWR<{
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
    role: string;
  }>(isAuthenticated && boardId ? `/boards/${boardId}/permissions` : null, {
    // Cache permissions for 2 minutes
    dedupingInterval: 2 * 60 * 1000,

    // Don't revalidate permissions too often
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  return {
    permissions: data,
    isLoading,
    error,
    canEdit: data?.canEdit ?? false,
    canDelete: data?.canDelete ?? false,
    canInvite: data?.canInvite ?? false,
    role: data?.role,
  };
};
