'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface ProductsTabsHeaderProps {
  filterStatus: string;
  onSelectStatus: (status: string) => void;
  filterFeature: string;
  onSelectFeature: (feature: string) => void;
  statusCounts: {
    ALL: number;
    PUBLISHED: number;
    DRAFT: number;
    ARCHIVED: number;
  };
}

export const ProductsTabsHeader: React.FC<ProductsTabsHeaderProps> = ({
  filterStatus,
  onSelectStatus,
  filterFeature,
  onSelectFeature,
  statusCounts
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-zinc-800 pb-1">
      {/* Left: Status tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => onSelectStatus('ALL')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            filterStatus === 'ALL'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>Tất cả sản phẩm</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
            filterStatus === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
          }`}>
            {statusCounts.ALL}
          </span>
        </button>

        <button
          onClick={() => onSelectStatus('PUBLISHED')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            filterStatus === 'PUBLISHED'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>Đang mở bán</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
            filterStatus === 'PUBLISHED' ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
          }`}>
            {statusCounts.PUBLISHED}
          </span>
        </button>

        <button
          onClick={() => onSelectStatus('DRAFT')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            filterStatus === 'DRAFT'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <span>Bản nháp / Tạm ẩn</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
            filterStatus === 'DRAFT' ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
          }`}>
            {statusCounts.DRAFT}
          </span>
        </button>
      </div>

      {/* Right: Feature Filter pills */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider hidden md:inline">
          Phân loại:
        </span>

        <button
          onClick={() => onSelectFeature(filterFeature === 'FEATURED' ? 'ALL' : 'FEATURED')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            filterFeature === 'FEATURED'
              ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900/50'
              : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
          }`}
        >
          <Icon name="star" size={11} className={filterFeature === 'FEATURED' ? 'text-rose-500' : ''} />
          <span>Nổi bật</span>
        </button>

        <button
          onClick={() => onSelectFeature(filterFeature === 'CUSTOMIZABLE' ? 'ALL' : 'CUSTOMIZABLE')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            filterFeature === 'CUSTOMIZABLE'
              ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-900/50'
              : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
          }`}
        >
          <Icon name="palette" size={11} className={filterFeature === 'CUSTOMIZABLE' ? 'text-purple-500' : ''} />
          <span>Khắc chữ</span>
        </button>

        <button
          onClick={() => onSelectFeature(filterFeature === 'COMBO' ? 'ALL' : 'COMBO')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            filterFeature === 'COMBO'
              ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-900/50'
              : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
          }`}
        >
          <Icon name="gift" size={11} className={filterFeature === 'COMBO' ? 'text-blue-500' : ''} />
          <span>Set Combo</span>
        </button>
      </div>
    </div>
  );
};
