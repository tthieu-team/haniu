'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface ProductsKPICardsProps {
  metrics: {
    total: number;
    published: number;
    lowStock: number;
    customizableOrCombo: number;
  };
}

export const ProductsKPICards: React.FC<ProductsKPICardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Card 1: Total Products */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Tổng sản phẩm
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Icon name="gift" size={15} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{metrics.total}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">trong hệ thống</span>
        </div>
      </div>

      {/* Card 2: Published */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Đang mở bán
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Icon name="check" size={15} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{metrics.published}</span>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-bold">hiển thị khách</span>
        </div>
      </div>

      {/* Card 3: Low stock warning */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Cảnh báo tồn kho
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Icon name="alert" size={15} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{metrics.lowStock}</span>
          <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-bold">sắp hết hàng</span>
        </div>
      </div>

      {/* Card 4: Combo & Customizable */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Combo & Khắc chữ
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Icon name="sparkles" size={15} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">{metrics.customizableOrCombo}</span>
          <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80 font-bold">quà cá nhân hóa</span>
        </div>
      </div>
    </div>
  );
};
