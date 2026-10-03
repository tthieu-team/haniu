'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icons';

export interface SortOption {
  value: string;
  label: string;
}

export interface AdminSearchToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  sortBy?: string;
  onSortChange?: (val: string) => void;
  sortOptions?: SortOption[];
  loading?: boolean;
  onRefresh?: () => void;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: string;
  };
  children?: React.ReactNode;
}

export const AdminSearchToolbar: React.FC<AdminSearchToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  sortBy,
  onSortChange,
  sortOptions,
  loading = false,
  onRefresh,
  primaryAction,
  children,
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
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-medium transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
            title="Xóa tìm kiếm"
          >
            <Icon name="close" size={12} />
          </button>
        )}
      </div>

      {/* Sorter & Actions */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {sortOptions && onSortChange && (
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-200 focus:outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {children}

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <Icon name="rotate" size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        )}

        {primaryAction && (
          primaryAction.href ? (
            <Link
              href={primaryAction.href}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold shadow-sm shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Icon name={primaryAction.icon || 'plus'} size={13} />
              <span>{primaryAction.label}</span>
            </Link>
          ) : (
            <button
              onClick={primaryAction.onClick}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold shadow-sm shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Icon name={primaryAction.icon || 'plus'} size={13} />
              <span>{primaryAction.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
