'use client';

import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

export interface ActiveFilterTagsProps {
  activeFilters: Array<{ key: string; label: string }>;
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilterTags({
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterTagsProps) {
  const trans = useTranslate();
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-550 select-none mr-1">
        {trans('Đang lọc theo:')}
      </span>
      {activeFilters.map((tag) => (
        <div
          key={tag.key}
          className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold px-3 py-1.5 rounded-full border border-rose-100/40 dark:border-rose-900/20"
        >
          <span>{tag.label}</span>
          <button
            onClick={() => onRemoveFilter(tag.key)}
            className="hover:text-rose-800 dark:hover:text-rose-300 transition-colors p-0.5 cursor-pointer"
            title={trans('Xóa tiêu chí lọc này')}
          >
            <Icon name="close" size={10} />
          </button>
        </div>
      ))}
      <button
        onClick={onClearAll}
        className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors py-1.5 px-3 cursor-pointer"
      >
        {trans('Hủy tất cả bộ lọc')}
      </button>
    </div>
  );
}
