'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
    useThemeStore.getState().initializeTheme();
  }, []);

  return <>{children}</>;
}
