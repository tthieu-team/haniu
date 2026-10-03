'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/common/Icons';
import { AdminNotificationDrawer } from './AdminNotificationDrawer';

interface AdminTopHeaderProps {
  user: any;
  unreadCount: number;
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onLogout: () => void;
}

export const AdminTopHeader: React.FC<AdminTopHeaderProps> = ({
  user,
  unreadCount,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onLogout
}) => {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Dynamic breadcrumb generator
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    let name = part;
    if (part === 'admin') name = 'Dashboard';
    else if (part === 'orders') name = 'Đơn hàng';
    else if (part === 'products') name = 'Sản phẩm';
    else if (part === 'photobooth') name = 'Photobooth Studio';
    else if (part === 'users') name = 'Khách hàng';
    else if (part === 'categories') name = 'Danh mục';
    else if (part === 'collections') name = 'Bộ sưu tập';
    else if (part === 'occasions') name = 'Dịp lễ';
    else if (part === 'recipients') name = 'Người nhận';
    else if (part === 'coupons') name = 'Mã giảm giá';
    else if (part === 'posts') name = 'Bài viết';
    else if (part === 'testimonials') name = 'Đánh giá';
    else if (part === 'contacts') name = 'Liên hệ';
    else if (part === 'ugc') name = 'Instagram Feed';
    else if (part === 'layout-config') name = 'Cấu hình giao diện';
    else if (part === 'db-rotation') name = 'Xoay vòng Database';
    else name = part.charAt(0).toUpperCase() + part.slice(1);
    
    return { name, href };
  });

  return (
    <header className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-6 z-20 shrink-0 select-none shadow-xs">
      {/* Left: Breadcrumbs navigation */}
      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-zinc-400">
          <Link 
            href="/admin" 
            className="flex items-center gap-1 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <Icon name="home" size={14} />
            <span>Admin</span>
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              <span className="text-slate-300 dark:text-zinc-600 font-normal">/</span>
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-slate-800 dark:text-zinc-100 font-black">
                  {crumb.name}
                </span>
              ) : (
                <Link 
                  href={crumb.href} 
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right Tools & Profile actions */}
      <div className="flex items-center gap-3">
        {/* Link to storefront */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
          title="Xem trang web bán hàng"
        >
          <Icon name="shopping-bag" size={13} className="text-rose-500" />
          <span>Xem Cửa hàng</span>
          <Icon name="arrow-right" size={11} className="opacity-60" />
        </Link>

        {/* Realtime Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 flex items-center justify-center cursor-pointer transition-colors relative"
            title="Thông báo"
          >
            <Icon name="bell" size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-600 text-[9px] font-black text-white flex items-center justify-center shadow-xs animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <AdminNotificationDrawer
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={onMarkAsRead}
              onMarkAllAsRead={onMarkAllAsRead}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        {/* User Profile Pill Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 pl-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/80 rounded-2xl cursor-pointer transition-all"
          >
            <div className="text-right hidden md:block leading-tight">
              <p className="text-xs font-black text-slate-800 dark:text-zinc-100 truncate max-w-[120px]">
                {user?.fullName || 'Quản trị viên'}
              </p>
              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
                {user?.role || 'ADMIN'}
              </p>
            </div>

            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-xs shadow-xs">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-12 w-52 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 rounded-2xl shadow-2xl z-50 py-1 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
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
    </header>
  );
};
