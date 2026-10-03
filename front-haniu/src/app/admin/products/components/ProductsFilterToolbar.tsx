'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icons';

interface ProductsFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  loading: boolean;
  onRefresh: () => void;
}

export const ProductsFilterToolbar: React.FC<ProductsFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  loading,
  onRefresh
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500">
          <Icon name="search" size={14} />
        </span>
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm, mã SKU, danh mục..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-medium transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <Icon name="close" size={12} />
          </button>
        )}
      </div>

      {/* Sorter & Actions */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-200 focus:outline-none cursor-pointer"
        >
          <option value="NEWEST">Mới tạo gần đây</option>
          <option value="PRICE_ASC">Giá: Thấp đến Cao</option>
          <option value="PRICE_DESC">Giá: Cao đến Thấp</option>
          <option value="STOCK_ASC">Tồn kho: Ít đến Nhiều</option>
        </select>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
          title="Làm mới danh sách"
        >
          <Icon name="refresh" size={14} className={loading ? 'animate-spin text-rose-500' : ''} />
        </button>

        <Link
          href="/admin/products/new"
          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Icon name="plus" size={13} />
          <span>Thêm mới</span>
        </Link>
      </div>
    </div>
  );
};
