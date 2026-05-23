'use client';

import Icon from '@/components/common/Icons';

export interface ProductToolbarProps {
  onOpenFilters: () => void;
  sortOption: string;
  setSortOption: (opt: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortOptions: Array<{ name: string; value: string }>;
}

export default function ProductToolbar({
  onOpenFilters,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  sortOptions,
}: ProductToolbarProps) {
  return (
    <div className="sticky top-16 z-30 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-4 border-b border-slate-100 dark:border-zinc-800/80">
      {/* Filter Toggle Mobile Button */}
      <button
        onClick={onOpenFilters}
        className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 transition-all cursor-pointer"
      >
        <Icon name="filter" size={13} />
        <span>Bộ lọc</span>
      </button>

      {/* Sort selector */}
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-xs text-slate-400 dark:text-zinc-500 font-light">Sắp xếp:</span>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-xl text-xs font-bold px-3 py-2 text-slate-600 dark:text-zinc-300 focus:outline-none cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      {/* View Mode Switcher */}
      <div className="hidden sm:flex items-center gap-1.5 border border-slate-200/60 dark:border-zinc-850 rounded-xl p-0.5 bg-slate-50 dark:bg-zinc-900">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
            viewMode === 'grid' 
              ? 'bg-white dark:bg-zinc-800 text-rose-500 shadow-xs' 
              : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600'
          }`}
          aria-label="Grid View"
        >
          <Icon name="grid" size={14} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
            viewMode === 'list' 
              ? 'bg-white dark:bg-zinc-800 text-rose-500 shadow-xs' 
              : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600'
          }`}
          aria-label="List View"
        >
          <Icon name="list" size={14} />
        </button>
      </div>
    </div>
  );
}
