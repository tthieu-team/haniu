'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function CollectionsSection() {
  const collections = useHomeLayoutStore((state) => state.collections);
  const isVisible = useHomeLayoutStore((state) => state.visibility.collections);

  if (!isVisible) return null;

  return (
    <section id="collections" className="py-16 space-y-12 scroll-mt-20">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] font-bold tracking-widest text-rose-500 uppercase block">
          Curated Series
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
          {collections.title}
        </h2>
        <p className="text-sm text-slate-400 dark:text-zinc-400 font-light">
          {collections.subtitle}
        </p>
      </div>

      {/* Magazine layout / grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.items.map((item, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-500 bg-zinc-950 aspect-[4/5] flex flex-col justify-end p-8"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Visual gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/30 to-transparent" />

            {/* Info details */}
            <div className="relative z-10 space-y-3">
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400">
                Bộ Sưu Tập
              </span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-rose-350 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-350 leading-relaxed font-light">
                  {item.subtitle}
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={item.href}
                  className="inline-flex items-center text-xs font-bold text-white hover:text-rose-400 transition-colors group-hover:translate-x-1 transition-all duration-300"
                >
                  Mua Ngay <Icon name="→" size={14} className="ml-1.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
