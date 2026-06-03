'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { useHomeLayoutStore } from '@/store/homeLayout';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useHomeLayoutStore.persist.rehydrate();
    useAuthStore.getState().initializeAuth();
    useThemeStore.getState().initializeTheme();
    useHomeLayoutStore.getState().fetchConfigFromServer();

    // Check and refresh token silently every 60 seconds
    const interval = setInterval(() => {
      useAuthStore.getState().checkAndRefreshToken();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
