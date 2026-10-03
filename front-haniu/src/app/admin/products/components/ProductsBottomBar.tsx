'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface ProductsBottomBarProps {
  totalCount: number;
  filteredCount: number;
  currentPageIndex: number;
  hasNext: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  loading: boolean;
}

export const ProductsBottomBar: React.FC<ProductsBottomBarProps> = ({
  totalCount,
  filteredCount,
  currentPageIndex,
  hasNext,
  onPrevPage,
  onNextPage,
  loading
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 px-4 py-3 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      {/* Left: Summary Count */}
      <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-medium">
        <Icon name="gift" size={14} className="text-rose-500" />
        <span>
          Đang hiển thị <span className="font-bold text-slate-800 dark:text-zinc-100">{filteredCount}</span> trên tổng số <span className="font-bold text-slate-800 dark:text-zinc-100">{totalCount}</span> sản phẩm (Trang {currentPageIndex + 1})
        </span>
      </div>

      {/* Right: Pagination Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevPage}
          disabled={currentPageIndex === 0 || loading}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Icon name="chevron-left" size={13} />
          <span>Trang trước</span>
        </button>

        <button
          onClick={onNextPage}
          disabled={!hasNext || loading}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Trang sau</span>
          <Icon name="chevron-right" size={13} />
        </button>
      </div>
    </div>
  );
};
