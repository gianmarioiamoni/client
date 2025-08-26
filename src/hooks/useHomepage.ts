import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { getNavigation } from '@/lib/homepage-utils';

/**
 * Custom hook for homepage logic and navigation
 */
export const useHomepage = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const navigation = getNavigation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push(navigation.routes.dashboard);
    }
  }, [isAuthenticated, router, navigation.routes.dashboard]);

  const navigateToLogin = () => router.push(navigation.routes.login);
  const navigateToRegister = () => router.push(navigation.routes.register);
  const navigateToDemo = () => router.push(navigation.routes.demo);

  return {
    navigation: {
      toLogin: navigateToLogin,
      toRegister: navigateToRegister,
      toDemo: navigateToDemo
    },
    appInfo: navigation.appInfo
  };
};
