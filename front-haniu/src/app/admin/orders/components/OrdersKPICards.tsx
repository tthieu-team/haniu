'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface OrdersKPICardsProps {
  metrics: {
    totalOrders: number;
    pendingCount: number;
    processingCount: number;
    deliveredCount: number;
    totalRevenue: number;
  };
  formatVND: (amount: number | undefined | null) => string;
}

export const OrdersKPICards: React.FC<OrdersKPICardsProps> = ({ metrics, formatVND }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Total Orders */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Tổng số đơn
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Icon name="shopping-bag" size={15} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{metrics.totalOrders}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">toàn thời gian</span>
        </div>
      </div>

      {/* Pending Confirmation */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Chờ xác nhận
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Icon name="hourglass" size={15} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{metrics.pendingCount}</span>
          <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-bold">cần xử lý</span>
        </div>
      </div>

      {/* Processing & Shipping */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Đang giao / Xử lý
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Icon name="truck" size={15} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{metrics.processingCount}</span>
          <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-bold">đang vận chuyển</span>
        </div>
      </div>

      {/* Realized Revenue */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Doanh thu thực thu
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Icon name="shopping-bag" size={15} />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
            {formatVND(metrics.totalRevenue)}
          </span>
        </div>
      </div>
    </div>
  );
};
