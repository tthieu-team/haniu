'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { useHomeLayoutStore } from '@/store/homeLayout';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
    useThemeStore.getState().initializeTheme();
    useHomeLayoutStore.getState().fetchConfigFromServer();
  }, []);

  return <>{children}</>;
}
