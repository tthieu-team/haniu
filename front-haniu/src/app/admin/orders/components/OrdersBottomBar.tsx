'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface OrdersBottomBarProps {
  totalCount: number;
  filteredCount: number;
  onRefresh: () => void;
  loading: boolean;
}

export const OrdersBottomBar: React.FC<OrdersBottomBarProps> = ({
  totalCount,
  filteredCount,
  onRefresh,
  loading
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 px-4 py-3 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      {/* Left: Counts */}
      <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-medium">
        <Icon name="shopping-bag" size={14} className="text-rose-500" />
        <span>
          Đang hiển thị <span className="font-bold text-slate-800 dark:text-zinc-100">{filteredCount}</span> trên tổng số <span className="font-bold text-slate-800 dark:text-zinc-100">{totalCount}</span> đơn hàng
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Icon name="refresh" size={12} className={loading ? 'animate-spin text-rose-500' : ''} />
          <span>Đồng bộ dữ liệu</span>
        </button>
      </div>
    </div>
  );
};
