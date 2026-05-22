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
    <section id="categories" className="py-16 space-y-12">
      {/* Title block */}
      <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
          <Icon name="✨" size={10} className="animate-pulse" /> PHÂN LOẠI QUÀ TẶNG
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          Bộ Sưu Tập{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
            Theo Dịp Lễ
          </span>
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          {categories.subtitle}
        </p>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.items.map((item, idx) => {
          const isActive = selectedOccasion === item.slug;
          return (
            <div
              key={idx}
              onClick={() => onOccasionSelect?.(item.slug)}
              className={`group relative overflow-hidden rounded-[32px] border transition-all duration-500 cursor-pointer shadow-md hover:shadow-xl aspect-[4/3] flex flex-col justify-end p-6 ${
                isActive
                  ? 'border-rose-500 ring-4 ring-rose-500/15 scale-[1.02]'
                  : 'border-slate-200 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-900/50 hover:scale-[1.01]'
              }`}
            >
              {/* Category Image */}
              <div className="absolute inset-0 bg-zinc-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-65 group-hover:scale-110 transition-all duration-700 ease-out"
                />
              </div>

              {/* Tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

              {/* Info text card */}
              <div className="relative z-10 space-y-2 bg-black/40 dark:bg-zinc-950/40 backdrop-blur-md border border-white/10 p-4.5 rounded-2xl">
                <h3 className="font-extrabold text-sm text-white group-hover:text-rose-300 transition-colors tracking-wide">
                  {item.name}
                </h3>
                <div className="flex justify-between items-center text-[10px] text-zinc-300">
                  <span className="font-light tracking-wider uppercase text-[9px] bg-white/10 px-2 py-0.5 rounded-md">{item.count}</span>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300 font-extrabold text-rose-400 flex items-center gap-1">
                    Khám phá <Icon name="→" size={11} />
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
