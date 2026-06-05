'use client';

import Icon from '@/components/common/Icons';

export interface ProductToolbarProps {
  onOpenFilters: () => void;
  sortOption: string;
  setSortOption: (opt: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortOptions: Array<{ name: string; value: string }>;
  totalCount: number;
}

export default function ProductToolbar({
  onOpenFilters,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  sortOptions,
  totalCount,
}: ProductToolbarProps) {
  return (
    <div className="sticky top-20 z-30 flex flex-col sm:flex-row sm:items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md p-4 sm:px-6 sm:py-3 border border-slate-200/60 dark:border-zinc-800 rounded-2xl sm:rounded-3xl gap-y-0 gap-x-3 w-full shadow-xs">
      {/* Left side: Filter toggle (mobile) & Product Count Display */}
      <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto pb-3 sm:pb-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenFilters}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs"
          >
            <Icon name="filter" size={11} className="text-rose-500" />
            <span>Bộ lọc</span>
          </button>

          <div className="text-[11px] sm:text-xs text-slate-400 dark:text-zinc-450 font-medium flex items-center gap-1">
            <span>Tìm thấy</span>
            <span className="font-black text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px]">
              {totalCount}
            </span>
            <span>sản phẩm</span>
          </div>
        </div>
      </div>

      {/* Right side: Sorting & View Mode Toggle */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto sm:ml-auto border-t sm:border-t-0 pt-3.5 sm:pt-0 border-slate-150 dark:border-zinc-800/60">
        {/* Sort select */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <span className="hidden sm:inline text-xs text-slate-400 dark:text-zinc-500 font-light">
            Sắp xếp:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold px-3 py-2 sm:py-2.5 text-slate-600 dark:text-zinc-300 focus:outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Grid/List toggle */}
        <div className="flex items-center gap-1 border border-slate-200/50 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-0.5 bg-slate-50 dark:bg-zinc-900 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-zinc-800 text-rose-500 shadow-xs'
                : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600'
            }`}
            aria-label="Grid View"
          >
            <Icon name="grid" size={12} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-zinc-800 text-rose-500 shadow-xs'
                : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600'
            }`}
            aria-label="List View"
          >
            <Icon name="list" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
