'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface OrdersTabsHeaderProps {
  filterStatus: string;
  onSelectStatus: (status: string) => void;
  statusCounts: {
    ALL: number;
    PENDING: number;
    CONFIRMED: number;
    SHIPPING: number;
    DELIVERED: number;
    CANCELLED: number;
  };
}

const TABS = [
  { id: 'ALL', label: 'Tất cả', icon: 'shopping-bag' },
  { id: 'PENDING', label: 'Chờ duyệt', icon: 'hourglass' },
  { id: 'CONFIRMED', label: 'Đã xác nhận', icon: 'check' },
  { id: 'SHIPPING', label: 'Đang giao', icon: 'truck' },
  { id: 'DELIVERED', label: 'Hoàn thành', icon: 'star' },
  { id: 'CANCELLED', label: 'Đã hủy', icon: 'close' },
];

export const OrdersTabsHeader: React.FC<OrdersTabsHeaderProps> = ({
  filterStatus,
  onSelectStatus,
  statusCounts
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80 dark:border-zinc-800">
      {TABS.map((tab) => {
        const isActive = filterStatus === tab.id;
        const count = statusCounts[tab.id as keyof typeof statusCounts] || 0;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectStatus(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <Icon name={tab.icon} size={14} className={isActive ? 'text-white' : 'text-slate-400 dark:text-zinc-500'} />
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/70 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
