'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { useRealtimeStore } from '@/store/realtime';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { authService } from '@/services/auth.service';

interface SidebarItem {
  name: string;
  href: string;
  icon: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

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
          <svg className="animate-spin h-8 w-8 text-rose-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
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

  const menuItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/admin', icon: 'grid' },
    { name: 'Sản phẩm', href: '/admin/products', icon: 'gift' },
    { name: 'Danh mục', href: '/admin/categories', icon: 'list' },
    { name: 'Bộ sưu tập', href: '/admin/collections', icon: 'sparkles' },
    { name: 'Dịp lễ', href: '/admin/occasions', icon: 'cake' },
    { name: 'Người nhận', href: '/admin/recipients', icon: 'users' },
    { name: 'Đơn hàng', href: '/admin/orders', icon: 'bag' },
    { name: 'Mã giảm giá', href: '/admin/coupons', icon: 'star' },
    { name: 'Bài viết', href: '/admin/posts', icon: 'edit' },
    { name: 'Đánh giá KH', href: '/admin/testimonials', icon: 'star' },
    { name: 'Thư liên hệ', href: '/admin/contacts', icon: 'mail' },
    { name: 'Instagram Feed', href: '/admin/ugc', icon: 'camera' },
    { name: 'Quản lý Photobooth', href: '/admin/photobooth', icon: 'camera' },
    { name: 'Cấu hình giao diện', href: '/admin/layout-config', icon: 'palette' },
    { name: 'Xoay vòng Database', href: '/admin/db-rotation', icon: 'settings' },
  ];

  // Breadcrumbs calculation
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    const name = part.charAt(0).toUpperCase() + part.slice(1);
    return { name, href };
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f5f7fb] text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
      
      {/* 1. SIDEBAR */}
      <aside 
        className={`flex flex-col bg-slate-900 text-slate-300 dark:bg-zinc-900 border-r border-slate-800 dark:border-zinc-800 transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-[70px]' : 'w-[240px]'
        }`}
      >
        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 dark:border-zinc-850">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-base font-black tracking-widest text-white uppercase bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                HANIU ADMIN
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 mx-auto flex items-center justify-center font-bold text-white text-xs">
              H
            </div>
          )}
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-none px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/10'
                    : 'hover:bg-slate-850 dark:hover:bg-zinc-800/50 hover:text-white text-slate-400'
                } ${collapsed ? 'justify-center' : ''}`}
                title={item.name}
              >
                <span className="shrink-0">
                  <Icon name={item.icon} size={collapsed ? 18 : 16} />
                </span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-800 dark:border-zinc-850 flex flex-col items-center gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-zinc-800 hover:bg-slate-700 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer transition-colors"
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            <Icon name={collapsed ? "arrow-right" : "arrow-left"} size={14} className="text-slate-400" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN APP SHELL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-6 z-20 shadow-sm shrink-0">
          
          {/* Header Left (Breadcrumbs) */}
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-zinc-500">
              <Link href="/admin" className="hover:text-rose-500 transition-colors">Admin</Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.href}>
                  <span className="text-slate-300 dark:text-zinc-700">/</span>
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-slate-700 dark:text-zinc-200 font-bold">{crumb.name === 'Admin' ? 'Dashboard' : crumb.name}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-rose-500 transition-colors">
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-4">
            
            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Thay đổi giao diện"
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative"
              >
                <Icon name="star" size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[12px] h-[12px] px-0.5 rounded-full bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Thông báo đơn hàng</h4>
                      {unreadCount > 0 && (
                        <button 
                          onClick={() => markAllAsRead()}
                          className="text-[10px] text-rose-500 hover:underline font-semibold cursor-pointer"
                        >
                          Đọc tất cả
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 text-xs max-h-60 overflow-y-auto scrollbar-none">
                      {notifications.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">Chưa có thông báo đơn hàng nào</p>
                      ) : (
                        notifications.map((item) => (
                          <div 
                            key={item.id} 
                            onClick={() => {
                              markAsRead(item.id);
                              setNotifOpen(false);
                              router.push('/admin/orders');
                            }}
                            className={`p-2 rounded-xl cursor-pointer transition-colors ${
                              item.unread 
                                ? 'bg-rose-50 dark:bg-rose-950/20 border-l-2 border-rose-500' 
                                : 'bg-slate-50 dark:bg-zinc-850'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <p className="font-semibold text-slate-800 dark:text-zinc-200">Đơn hàng mới #{item.orderCode}</p>
                              {item.unread && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1" />}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">Khách hàng: {item.customerName}</p>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400">Tổng tiền: {item.totalPrice.toLocaleString('vi-VN')} đ</p>
                            <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1">
                              {new Date(item.orderedAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-xs">
                  {user?.fullName.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{user?.fullName || 'Admin Haniu'}</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Quản trị viên</p>
                </div>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-1 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-800">
                      <p className="font-bold">{user?.fullName}</p>
                      <p className="text-slate-400 text-[10px] truncate">admin@haniu.vn</p>
                    </div>
                    <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300">
                      <Icon name="cart" size={14} /> Xem Cửa hàng
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 cursor-pointer"
                    >
                      <Icon name="close" size={14} /> Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-none">
          {children}
        </main>
      </div>

    </div>
  );
}
