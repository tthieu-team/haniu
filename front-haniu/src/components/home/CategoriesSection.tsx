'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

interface CategoriesSectionProps {
  onOccasionSelect?: (slug: string) => void;
  selectedOccasion?: string;
}

export default function CategoriesSection({ onOccasionSelect, selectedOccasion }: CategoriesSectionProps) {
  const categories = useHomeLayoutStore((state) => state.categories);
  const isVisible = useHomeLayoutStore((state) => state.visibility.categories);

  if (!isVisible) return null;

  return (
    <section id="categories" className="py-10 sm:py-16 space-y-8 sm:space-y-12">
      {/* Title block */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto px-3 sm:px-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
          <Icon name="✨" size={10} className="animate-pulse" /> PHÂN LOẠI QUÀ TẶNG
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          Bộ Sưu Tập{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
            Theo Dịp Lễ
          </span>
        </h2>
        <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          {categories.subtitle}
        </p>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {categories.items.map((item, idx) => {
          const isActive = selectedOccasion === item.slug;
          return (
            <div
              key={idx}
              onClick={() => onOccasionSelect?.(item.slug)}
              className={`group overflow-hidden rounded-2xl md:rounded-[28px] border bg-white/80 dark:bg-zinc-900/30 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col ${
                isActive
                  ? 'border-rose-500 ring-4 ring-rose-500/10 shadow-lg scale-[1.02]'
                  : 'border-slate-200/80 dark:border-zinc-800/60 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-rose-300 dark:hover:border-rose-900/50'
              }`}
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-zinc-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {isActive && (
                  <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    Đang Chọn
                  </span>
                )}
              </div>

              {/* Info details */}
              <div className="p-3 sm:p-5 flex flex-col justify-between flex-grow space-y-2 md:space-y-3">
                <div className="space-y-0.5 md:space-y-1">
                  <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-slate-800 dark:text-zinc-100 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors tracking-wide leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[9px] sm:text-xs text-slate-400 dark:text-zinc-500 font-light">
                    Dành cho dịp đặc biệt
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/60">
                  <span className="font-bold text-[8px] sm:text-[10px] text-rose-500 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 px-1.5 sm:px-2.5 py-0.5 rounded-md border border-rose-500/10">
                    {item.count}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-extrabold text-slate-600 dark:text-zinc-300 group-hover:text-rose-500 dark:group-hover:text-rose-400 flex items-center gap-1 transition-colors">
                    Khám phá <Icon name="→" size={10} className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
