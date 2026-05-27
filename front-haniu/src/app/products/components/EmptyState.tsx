'use client';

import Icon from '@/components/common/Icons';

export interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-5 bg-white dark:bg-zinc-900/20 rounded-[32px] border border-dashed border-slate-200 dark:border-zinc-850 p-8 shadow-xs">
      <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center border border-rose-100/50 dark:border-rose-900/30">
        <Icon name="search" size={24} />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-zinc-150">
          Không tìm thấy sản phẩm phù hợp
        </h3>
        <p className="text-xs text-slate-400 dark:text-zinc-550 max-w-xs mx-auto font-light leading-relaxed">
          Vui lòng điều chỉnh lại bộ lọc hoặc thay đổi từ khóa tìm kiếm khác để tìm thấy món quà ưng ý.
        </p>
      </div>
      <button
        onClick={onClearFilters}
        className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-md shadow-rose-500/10 hover:shadow-rose-500/25 active:scale-98 transition-all cursor-pointer"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  );
}
