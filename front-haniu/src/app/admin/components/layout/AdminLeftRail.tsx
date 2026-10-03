'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/common/Icons';
import { AdminNotificationDrawer } from './AdminNotificationDrawer';

interface AdminLeftRailProps {
  theme: string;
  onToggleTheme: () => void;
  user: any;
  onLogout: () => void;
  collapsed: boolean;
  onToggleSidebar: () => void;
  unreadCount?: number;
  notifications?: any[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

interface MainSection {
  id: string;
  name: string;
  icon: string;
  href: string;
  matchPrefixes: string[];
}

const MAIN_SECTIONS: MainSection[] = [
  {
    id: 'dashboard',
    name: 'Tổng quan',
    icon: 'home',
    href: '/admin',
    matchPrefixes: ['/admin']
  },
  {
    id: 'ecommerce',
    name: 'Cửa hàng',
    icon: 'shopping-bag',
    href: '/admin/orders',
    matchPrefixes: ['/admin/orders', '/admin/products', '/admin/categories', '/admin/collections', '/admin/occasions', '/admin/recipients', '/admin/coupons']
  },
  {
    id: 'photobooth',
    name: 'Photobooth',
    icon: 'camera',
    href: '/admin/photobooth',
    matchPrefixes: ['/admin/photobooth']
  },
  {
    id: 'users',
    name: 'Khách hàng',
    icon: 'users',
    href: '/admin/users',
    matchPrefixes: ['/admin/users']
  },
  {
    id: 'content',
    name: 'Nội dung',
    icon: 'sparkles',
    href: '/admin/posts',
    matchPrefixes: ['/admin/posts', '/admin/testimonials', '/admin/contacts', '/admin/ugc']
  },
  {
    id: 'system',
    name: 'Cấu hình',
    icon: 'settings',
    href: '/admin/layout-config',
    matchPrefixes: ['/admin/layout-config', '/admin/db-rotation']
  }
];

export const AdminLeftRail: React.FC<AdminLeftRailProps> = ({
  theme,
  onToggleTheme,
  user,
  onLogout,
  collapsed,
  onToggleSidebar,
  unreadCount = 0,
  notifications = [],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {}
}) => {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isSectionActive = (section: MainSection) => {
    if (section.id === 'dashboard') {
      return pathname === '/admin';
    }
    return section.matchPrefixes.some(p => pathname.startsWith(p));
  };

  return (
    <div className="w-16 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800/80 flex flex-col items-center justify-between py-4 z-40 shrink-0 select-none transition-colors duration-200">
      {/* Top Logo & Main Navigation Icons */}
      <div className="flex flex-col items-center gap-3.5">
        <Link 
          href="/admin" 
          className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-rose-600/20 hover:scale-105 transition-transform"
          title="Haniu Admin"
        >
          H
        </Link>

        <div className="w-8 h-[1px] bg-slate-200 dark:bg-zinc-800/80" />

        {/* Primary Navigation Icons */}
        <nav className="flex flex-col gap-2">
          {MAIN_SECTIONS.map((section) => {
            const active = isSectionActive(section);
            return (
              <Link
                key={section.id}
                href={section.href}
                className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 group relative ${
                  active
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25 scale-105'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900'
                }`}
                title={section.name}
              >
                <Icon name={section.icon} size={18} />
                
                {/* Tooltip on hover */}
                <span className="absolute left-14 bg-slate-900 dark:bg-zinc-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg whitespace-nowrap z-50 border border-slate-700 dark:border-zinc-700">
                  {section.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Notifications, Theme, Toggle Sidebar, User Profile */}
      <div className="flex flex-col items-center gap-2 relative">
        
        {/* Realtime Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors relative"
            title="Thông báo đơn hàng"
          >
            <Icon name="bell" size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-rose-600 text-[8px] font-black text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute left-16 bottom-0 z-50">
              <AdminNotificationDrawer
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={onMarkAsRead}
                onMarkAllAsRead={onMarkAllAsRead}
                onClose={() => setNotifOpen(false)}
              />
            </div>
          )}
        </div>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 flex items-center justify-center transition-colors"
          title="Xem Website Bán Hàng"
        >
          <Icon name="shopping-bag" size={16} />
        </Link>

        {/* Dark/Light Switch */}
        <button
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 flex items-center justify-center cursor-pointer transition-colors"
          title={theme === 'dark' ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
        </button>

        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          title={collapsed ? "Mở rộng danh mục" : "Thu gọn danh mục"}
        >
          <Icon name={collapsed ? "chevron-right" : "chevron-left"} size={16} />
        </button>

        <div className="w-8 h-[1px] bg-slate-200 dark:bg-zinc-800/80 my-0.5" />

        {/* User Avatar & Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer shadow-xs hover:ring-2 hover:ring-rose-500 transition-all"
            title={user?.fullName || 'Admin'}
          >
            {user?.fullName?.charAt(0) || 'A'}
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute left-16 bottom-0 w-52 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 rounded-2xl shadow-2xl z-50 py-1 text-xs animate-in fade-in slide-in-from-left-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-zinc-800">
                  <p className="font-black text-slate-900 dark:text-zinc-100">{user?.fullName || 'Admin Haniu'}</p>
                  <p className="text-slate-400 dark:text-zinc-400 text-[10px] font-mono truncate">{user?.email || 'admin@haniu.vn'}</p>
                </div>

                <Link 
                  href="/" 
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold"
                  onClick={() => setProfileOpen(false)}
                >
                  <Icon name="shopping-bag" size={14} className="text-rose-500" /> 
                  <span>Xem Website Khách Hàng</span>
                </Link>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold border-t border-slate-100 dark:border-zinc-800 cursor-pointer"
                >
                  <Icon name="close" size={14} /> 
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
