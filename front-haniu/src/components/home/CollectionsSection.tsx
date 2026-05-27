'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { catalogService, Collection } from '@/services/catalog.service';
import Icon from '@/components/common/Icons';
import { getFullImageUrl } from '@/lib/api';

export default function CollectionsSection() {
  const layoutCollections = useHomeLayoutStore((state) => state.collections);
  const isVisible = useHomeLayoutStore((state) => state.visibility.collections);
  const [dbCollections, setDbCollections] = useState<Collection[]>([]);

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

  if (!isVisible) return null;

  const hasDbCollections = dbCollections.length > 0;
  const displayItems = hasDbCollections
    ? dbCollections.map(c => ({
        title: c.name,
        subtitle: c.description || 'Dòng sản phẩm được thiết kế độc quyền và chế tác tinh xảo bởi Haniu.',
        image: getFullImageUrl(c.imageUrl) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
        href: `/collections/${c.slug}`
      }))
    : layoutCollections.items;

  return (
    <section id="collections" className="py-16 space-y-12 scroll-mt-20">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
          <Icon name="✨" size={10} className="animate-pulse" /> CURATED SERIES
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          Bộ Sưu Tập{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
            Độc Quyền
          </span>
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          {layoutCollections.subtitle}
        </p>
      </div>

      {/* Magazine layout / grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="group relative overflow-hidden rounded-[32px] border border-slate-200 dark:border-zinc-800/80 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 bg-card-bg aspect-[4/5] flex flex-col justify-end p-8"
          >
            {/* Limited Edition tag */}
            <span className="absolute top-5 right-5 z-20 bg-amber-500/90 backdrop-blur-xs text-white text-[8px] font-black tracking-widest px-3 py-1.5 rounded-lg shadow-lg uppercase border border-amber-400/20 animate-pulse">
              Limited
            </span>

            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-80 dark:opacity-75 group-hover:opacity-60 dark:group-hover:opacity-55 group-hover:scale-110 transition-all duration-700 ease-out"
              />
            </div>

            {/* Visual gradient overlays for high readability in both light & dark themes */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Info details */}
            <div className="relative z-10 space-y-4 text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary-color bg-primary-color/5 dark:bg-primary-color/10 px-2 py-0.5 rounded-md border border-primary-color/20 inline-block">
                Haniu Select
              </span>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-foreground group-hover:text-primary-color transition-colors tracking-wide leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-color leading-relaxed font-light line-clamp-2">
                  {item.subtitle}
                </p>
              </div>
              <div className="pt-2">
                <div
                  className="inline-flex items-center text-xs font-bold text-foreground group-hover:text-primary-color transition-all duration-300 group-hover:gap-2 gap-1"
                >
                  Mua Ngay <Icon name="→" size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
