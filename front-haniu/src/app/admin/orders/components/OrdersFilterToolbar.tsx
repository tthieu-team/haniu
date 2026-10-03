'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface OrdersFilterToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterPayment: string;
  onPaymentChange: (val: string) => void;
  sortBy: 'NEWEST' | 'OLDEST' | 'PRICE_DESC' | 'PRICE_ASC';
  onSortChange: (val: 'NEWEST' | 'OLDEST' | 'PRICE_DESC' | 'PRICE_ASC') => void;
  loading: boolean;
  onRefresh: () => void;
}

export const OrdersFilterToolbar: React.FC<OrdersFilterToolbarProps> = ({
  searchTerm,
  onSearchChange,
  filterPayment,
  onPaymentChange,
  sortBy,
  onSortChange,
  loading,
  onRefresh
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
      {/* Search Box */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500">
          <Icon name="search" size={14} />
        </span>
        <input
          type="text"
          placeholder="Tìm mã đơn, tên khách, số điện thoại, email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-medium transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <Icon name="close" size={12} />
          </button>
        )}
      </div>

      {/* Selects & Controls */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {/* Payment Filter */}
        <select
          value={filterPayment}
          onChange={(e) => onPaymentChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-200 focus:outline-none cursor-pointer"
        >
          <option value="ALL">Tất cả thanh toán</option>
          <option value="PAID">Đã thanh toán (PAID)</option>
          <option value="PENDING">Chờ thanh toán (PENDING)</option>
          <option value="FAILED">Thanh toán lỗi (FAILED)</option>
        </select>

        {/* Sorting Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-200 focus:outline-none cursor-pointer"
        >
          <option value="NEWEST">Mới nhất trước</option>
          <option value="OLDEST">Cũ nhất trước</option>
          <option value="PRICE_DESC">Giá trị cao nhất</option>
          <option value="PRICE_ASC">Giá trị thấp nhất</option>
        </select>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
          title="Làm mới danh sách"
        >
          <Icon name="refresh" size={14} className={loading ? 'animate-spin text-rose-500' : ''} />
        </button>
      </div>
    </div>
  );
};
