'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { catalogService, Collection } from '@/services/catalog.service';
import Icon from '@/components/common/Icons';
import { getFullImageUrl } from '@/lib/api';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslate } from '@/lib/translator';

import PremiumCardOverlay from '@/components/common/PremiumCardOverlay';

export default function CollectionsSection() {
  const layoutCollections = useHomeLayoutStore((state) => state.collections);
  const isVisible = useHomeLayoutStore((state) => state.visibility.collections);
  const [dbCollections, setDbCollections] = useState<Collection[]>([]);
  const { t } = useLanguage();
  const trans = useTranslate();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await catalogService.getAllCollections();
        const active = (data || []).filter(c => c.isActive || (c as any).active);
        setDbCollections(active);
      } catch (err) {
        console.error('Failed to load collections for home page:', err);
      }
    };
    loadCollections();
  }, []);

  if (!isVisible || dbCollections.length === 0) return null;

  const displayItems = dbCollections.map(c => ({
    title: c.name,
    subtitle: c.description || t('home.collections.fallback_desc'),
    image: getFullImageUrl(c.imageUrl) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
    href: `/collections/${c.slug}`
  }));

  return (
    <section id="collections" className="py-6 md:py-12 space-y-10 sm:space-y-16 scroll-mt-20">
      {/* Title */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto px-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
          <Icon name="✨" size={10} className="animate-pulse" /> {trans(layoutCollections.badge || 'Bộ sưu tập độc quyền')}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          {trans(layoutCollections.title || 'Bộ Sưu Tập Độc Quyền')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          {trans(layoutCollections.subtitle)}
        </p>
      </div>

      {/* Magazine layout / grid cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        {displayItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="group relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-slate-200 dark:border-zinc-800/80 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 bg-card-bg aspect-[16/10] sm:aspect-[4/5] flex flex-col justify-end p-4 sm:p-6 md:p-8"
          >
            {/* Limited Edition tag */}
            <span className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 bg-amber-500/90 backdrop-blur-xs text-white text-[8px] font-black tracking-widest px-3 py-1.5 rounded-lg shadow-lg uppercase border border-amber-400/20 animate-pulse">
              {trans(layoutCollections.limitedTag || 'Limited Edition')}
            </span>

            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
              />
            </div>

            {/* Shared Gradient Overlay component */}
            <PremiumCardOverlay />

            {/* Info details */}
            <div className="relative z-10 space-y-2 sm:space-y-4 text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-500/20 inline-block">
                Haniu Select
              </span>
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-base sm:text-lg md:text-xl font-black text-white group-hover:text-rose-400 transition-colors tracking-wide leading-snug">
                  {trans(item.title)}
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-300 leading-relaxed font-light line-clamp-2">
                  {trans(item.subtitle)}
                </p>
              </div>
              <div className="pt-1 sm:pt-2">
                <div
                  className="inline-flex items-center text-[10px] sm:text-xs font-bold text-zinc-200 group-hover:text-rose-400 transition-all duration-300 group-hover:gap-2 gap-1"
                >
                  {trans(layoutCollections.buyNowText || 'Mua ngay')} <Icon name="→" size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
