'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout as logoutApi, clearAuthCookies, type UserDto } from '@/services/api';

interface UseAuthReturn {
  user: UserDto | null;
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore logout errors
    } finally {
      clearAuthCookies();
      setUser(null);
      router.push('/');
      router.refresh();
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Redirect to login if trying to access protected route
  useEffect(() => {
    if (!loading && !user) {
      const protectedRoutes = ['/orders', '/wishlist', '/checkout', '/admin'];
      if (protectedRoutes.some(route => pathname.startsWith(route))) {
        router.push('/login');
      }
    }
  }, [loading, user, pathname, router]);

  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    isLoading: loading,
    error,
    isAuthenticated,
    isAdmin,
    logout,
    refreshUser,
  };
}
