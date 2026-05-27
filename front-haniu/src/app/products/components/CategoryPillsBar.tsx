'use client';

import { Category } from '@/services/catalog.service';

export interface CategoryPillsBarProps {
  categories: Category[];
  selectedCat: string;
  onSelectCategory: (cat: string) => void;
}

export default function CategoryPillsBar({
  categories,
  selectedCat,
  onSelectCategory,
}: CategoryPillsBarProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 mb-6 scrollbar-none">
      <div className="flex gap-2.5 min-w-max px-1">
        <button
          onClick={() => onSelectCategory('')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            selectedCat === ''
              ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10'
              : 'bg-white dark:bg-zinc-900 border-slate-200/60 dark:border-zinc-850 text-slate-650 dark:text-zinc-350 hover:border-rose-400'
          }`}
        >
          Tất cả sản phẩm
        </button>
        {categories.map((cat) => {
          const isActive = selectedCat === cat.id || selectedCat === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id || cat.slug)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10'
                  : 'bg-white dark:bg-zinc-900 border-slate-200/60 dark:border-zinc-850 text-slate-650 dark:text-zinc-350 hover:border-rose-400'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
