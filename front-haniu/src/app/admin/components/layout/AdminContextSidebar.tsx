'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/common/Icons';

interface AdminContextSidebarProps {
  collapsed: boolean;
}

interface MenuGroup {
  groupName: string;
  items: {
    name: string;
    href: string;
    icon: string;
    badge?: string;
  }[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    groupName: 'Tổng quan & Báo cáo',
    items: [
      { name: 'Bảng điều khiển KPI', href: '/admin', icon: 'home' },
    ]
  },
  {
    groupName: 'Thương mại Điện tử',
    items: [
      { name: 'Quản lý Đơn hàng', href: '/admin/orders', icon: 'shopping-bag' },
      { name: 'Sản phẩm & Kho', href: '/admin/products', icon: 'gift' },
      { name: 'Danh mục quà tặng', href: '/admin/categories', icon: 'list' },
      { name: 'Bộ sưu tập', href: '/admin/collections', icon: 'sparkles' },
      { name: 'Dịp lễ & Sự kiện', href: '/admin/occasions', icon: 'cake' },
      { name: 'Đối tượng người nhận', href: '/admin/recipients', icon: 'users' },
      { name: 'Mã giảm giá (Coupons)', href: '/admin/coupons', icon: 'star' },
    ]
  },
  {
    groupName: 'Studio Chụp ảnh',
    items: [
      { name: 'Photobooth Studio', href: '/admin/photobooth', icon: 'camera' },
    ]
  },
  {
    groupName: 'Khách hàng & Người dùng',
    items: [
      { name: 'Danh sách Người dùng', href: '/admin/users', icon: 'users' },
    ]
  },
  {
    groupName: 'Nội dung & Truyền thông',
    items: [
      { name: 'Bài viết & Tin tức', href: '/admin/posts', icon: 'edit' },
      { name: 'Đánh giá Khách hàng', href: '/admin/testimonials', icon: 'star' },
      { name: 'Hộp thư Liên hệ', href: '/admin/contacts', icon: 'mail' },
      { name: 'Instagram Feed (UGC)', href: '/admin/ugc', icon: 'camera' },
    ]
  },
  {
    groupName: 'Hệ thống & Cài đặt',
    items: [
      { name: 'Cấu hình Giao diện', href: '/admin/layout-config', icon: 'palette' },
      { name: 'Xoay vòng Database', href: '/admin/db-rotation', icon: 'settings' },
    ]
  }
];

export const AdminContextSidebar: React.FC<AdminContextSidebarProps> = ({ collapsed }) => {
  const pathname = usePathname();
  const [filterQuery, setFilterQuery] = useState('');

  if (collapsed) {
    return null;
  }

  // Filter menu items by search query
  const filteredGroups = MENU_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.name.toLowerCase().includes(filterQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <aside className="w-60 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800/80 flex flex-col shrink-0 z-30 transition-all duration-300 select-none">
      {/* Sidebar Header & Quick Filter */}
      <div className="p-3.5 border-b border-slate-100 dark:border-zinc-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm tính năng..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent dark:border-zinc-700/60 rounded-xl text-xs font-semibold text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500">
            <Icon name="search" size={13} />
          </span>
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
            >
              <Icon name="close" size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-none">
        {filteredGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              {group.groupName}
            </div>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.href === '/admin' 
                  ? pathname === '/admin' 
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-extrabold border border-rose-200/60 dark:border-rose-900/40 shadow-xs'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`shrink-0 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-zinc-500'}`}>
                        <Icon name={item.icon} size={15} />
                      </span>
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Branding Mini */}
      <div className="p-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
        <span className="font-mono text-[10px]">Haniu Admin v2.5</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" title="Hệ thống trực tuyến" />
      </div>
    </aside>
  );
};
