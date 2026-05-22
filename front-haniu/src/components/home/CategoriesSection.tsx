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
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
          {categories.title}
        </h2>
        <p className="text-sm text-slate-400 dark:text-zinc-400 font-light leading-relaxed">
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
              className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer shadow-sm hover:shadow-lg aspect-[4/3] flex flex-col justify-end p-6 ${
                isActive
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-slate-100 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-900/50'
              }`}
            >
              {/* Category Image */}
              <div className="absolute inset-0 bg-zinc-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 to-transparent opacity-90" />

              {/* Info text */}
              <div className="relative z-10 space-y-1">
                <h3 className="font-bold text-base text-white group-hover:text-rose-300 transition-colors">
                  {item.name}
                </h3>
                <div className="flex justify-between items-center text-[11px] text-zinc-350">
                  <span className="font-light">{item.count}</span>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 font-bold text-rose-400 flex items-center gap-1">
                    Khám phá <Icon name="→" size={12} />
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
