'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface ShippingProgressBarProps {
  subtotal: number;
  threshold: number;
}

export default function ShippingProgressBar({ subtotal, threshold }: ShippingProgressBarProps) {
  if (subtotal <= 0) return null;
  const neededForFreeShipping = threshold - subtotal;
  const progress = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm space-y-3">
      <div className="flex items-start gap-1.5 text-xs">
        <Icon name="truck" size={16} className="text-rose-500 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-slate-600 dark:text-zinc-450 leading-relaxed">
            {neededForFreeShipping > 0 ? (
              <>
                Mua thêm <strong className="text-rose-500 font-bold">{neededForFreeShipping.toLocaleString()}đ</strong> để được miễn phí vận chuyển
              </>
            ) : (
              <span className="text-emerald-500 font-semibold">Đơn hàng của bạn đã được MIỄN PHÍ vận chuyển! 🎉</span>
            )}
          </span>
          <span className="text-slate-400 text-[10px] font-medium shrink-0 sm:text-right">Mức miễn phí: {threshold.toLocaleString()}đ</span>
        </div>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
