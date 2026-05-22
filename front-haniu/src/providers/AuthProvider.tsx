'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return <>{children}</>;
}
