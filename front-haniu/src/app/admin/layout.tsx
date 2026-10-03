'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { useRealtimeStore } from '@/store/realtime';
import { authService } from '@/services/auth.service';
import { AdminLeftRail } from './components/layout/AdminLeftRail';
import { AdminContextSidebar } from './components/layout/AdminContextSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { notifications, unreadCount, initSocket, disconnectSocket, markAsRead, markAllAsRead } = useRealtimeStore();

  useEffect(() => {
    if (isInitialized && isAuthenticated && user?.role === 'ADMIN') {
      initSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [isInitialized, isAuthenticated, user, initSocket, disconnectSocket]);

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/auth/login');
    }
  }, [isInitialized, isAuthenticated, user, router]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Đang tải trang quản trị...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user?.role !== 'ADMIN') {
    return null;
  }

  const handleLogout = async () => {
    await authService.logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-200">
      
      {/* 1. LEFT RAIL (Icon Bar ~64px: Navigation, Notifications, Theme, User) */}
      <AdminLeftRail
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        unreadCount={unreadCount}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />

      {/* 2. CONTEXT SIDEBAR (Secondary Category Panel ~240px) */}
      <AdminContextSidebar collapsed={sidebarCollapsed} />

      {/* 3. MAIN WORKSPACE CONTENT CANVAS */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-none min-w-0">
        {children}
      </main>

    </div>
  );
}
