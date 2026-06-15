'use client';

import { useState, useEffect } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { catalogService, Occasion } from '@/services/catalog.service';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslate } from '@/lib/translator';

interface CategoriesSectionProps {
  onOccasionSelect?: (slug: string) => void;
  selectedOccasion?: string;
  occasions?: Occasion[];
}

export default function CategoriesSection({ onOccasionSelect, selectedOccasion, occasions }: CategoriesSectionProps) {
  const layoutCategories = useHomeLayoutStore((state) => state.categories);
  const isVisible = useHomeLayoutStore((state) => state.visibility.categories);
  const [dbOccasions, setDbOccasions] = useState<Occasion[]>([]);
  const { t, language } = useLanguage();
  const trans = useTranslate();

  useEffect(() => {
    if (occasions && occasions.length > 0) {
      setDbOccasions(occasions);
    } else {
      const loadOccasions = async () => {
        try {
          const data = await catalogService.getAllOccasions();
          const active = (data || []).filter(o => {
            const val = o.isActive !== undefined ? o.isActive : (o as any).active;
            return val !== false;
          });
          setDbOccasions(active);
        } catch (err) {
          console.error('Failed to load occasions for home page:', err);
        }
      };
      loadOccasions();
    }
  }, [occasions]);

  if (!isVisible) return null;

  const hasDbOccasions = dbOccasions.length > 0;
  const displayItems = hasDbOccasions
    ? dbOccasions.map(o => ({
      name: o.name,
      slug: o.slug,
      image: getFullImageUrl(o.imageUrl) || 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop&q=80',
      count: (o as any).productCount !== undefined && (o as any).productCount > 0
        ? `${(o as any).productCount}+ ${t('home.categories.gift_sets')}`
        : `24+ ${t('home.categories.gift_sets')}`
    }))
    : layoutCategories.items;

  return (
    <section id="categories" className="py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* Title block */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto px-3 sm:px-4">
        {(layoutCategories.badge || 'Chọn theo dịp lễ') && (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
            <Icon name="✨" size={10} className="animate-pulse" /> {trans(layoutCategories.badge || 'Chọn theo dịp lễ')}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          {trans(layoutCategories.title || 'Bộ Sưu Tập Quà Tặng Theo Dịp')}
        </h2>
        <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          {trans(layoutCategories.subtitle || 'Lựa chọn món quà hoàn hảo nhất cho những cột mốc ý nghĩa trong cuộc sống')}
        </p>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {displayItems.map((item, idx) => {
          const isActive = selectedOccasion === item.slug;
          const formattedName = language === 'ja'
            ? `${trans(item.name)}ギフト`
            : language === 'en'
              ? `${trans(item.name)} Gifts`
              : item.name.toLowerCase().startsWith('quà')
                ? item.name
                : `Quà ${item.name}`;

          // Premium symbol based on slug
          const getSymbol = (slug: string) => {
            if (slug.includes('sinh-nhat')) return '🎂';
            if (slug.includes('tinh-nhan') || slug.includes('valentine')) return '❤️';
            if (slug.includes('nha-giao') || slug.includes('20-11')) return '👨‍🏫';
            if (slug.includes('quoc-khanh') || slug.includes('2-9')) return '🇻🇳';
            return '✨';
          };

          return (
            <div
              key={idx}
              onClick={() => onOccasionSelect?.(item.slug)}
              className={`group relative overflow-hidden rounded-[28px] cursor-pointer aspect-[3/4] flex flex-col justify-end p-4 sm:p-6 transition-all duration-500 bg-slate-100/50 dark:bg-zinc-900/30 border ${isActive
                ? 'border-rose-500 ring-4 ring-rose-500/20 shadow-xl shadow-rose-500/10 scale-[1.03] -translate-y-1.5'
                : 'border-slate-200/80 dark:border-zinc-800/40 shadow-md hover:shadow-2xl hover:shadow-rose-500/5 hover:-translate-y-2 hover:border-rose-300 dark:hover:border-rose-900/30'
                }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                />
              </div>

              {/* Gradient Overlay for high readability in both light & dark themes */}
              <div className={`absolute inset-0 z-10 transition-all duration-300 ${isActive
                ? 'bg-gradient-to-t from-rose-500/10 via-background/80 to-transparent dark:from-rose-950/40 dark:via-background/85'
                : 'bg-gradient-to-t from-background/95 via-background/50 to-transparent dark:from-background/95 dark:via-background/45'
                }`} />

              {/* Status Badge */}
              {isActive && (
                <span className="absolute top-4 left-4 z-20 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-lg border border-rose-400/20 animate-pulse">
                  {t('home.categories.selected')}
                </span>
              )}

              {/* Category Occasion Badge */}
              <span className="absolute top-4 right-4 z-20 bg-slate-50/10 dark:bg-white/10 text-slate-800 dark:text-white backdrop-blur-md text-[9px] font-black tracking-widest px-2 py-1.5 rounded-lg border border-slate-500/20 dark:border-white/10 uppercase">
                {getSymbol(item.slug)} Series
              </span>

              {/* Info details */}
              <div className="relative z-20 space-y-2 text-left">
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  {t('home.categories.special_occasion')}
                </span>

                <h3 className="text-sm sm:text-base md:text-lg font-black text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors tracking-wide leading-tight line-clamp-1">
                  {formattedName}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-zinc-800/80">
                  <span className="font-bold text-[8px] sm:text-[9px] text-rose-600 dark:text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/10 dark:border-rose-400/10">
                    {item.count}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-foreground/90 group-hover:text-rose-600 dark:group-hover:text-rose-400 flex items-center gap-1 transition-colors">
                    {t('home.categories.explore')} <Icon name="→" size={10} className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
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
