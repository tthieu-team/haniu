import { useEffect } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { useUgcStore } from '@/store/ugc';
import Icon from '@/components/common/Icons';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslate } from '@/lib/translator';

export default function UgcFeedSection() {
  const ugc = useHomeLayoutStore((state) => state.ugcFeed);
  const isVisible = useHomeLayoutStore((state) => state.visibility.ugcFeed);
  const { activeUgcItems, fetchActiveUgcItems } = useUgcStore();
  const { t } = useLanguage();
  const trans = useTranslate();

  useEffect(() => {
    if (isVisible) {
      fetchActiveUgcItems();
    }
  }, [isVisible, fetchActiveUgcItems]);

  if (!isVisible) return null;

  const displayItems = activeUgcItems.length > 0 ? activeUgcItems : ugc.items;

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
            <Icon name="✨" size={10} className="animate-pulse" /> {trans(ugc?.badge || 'Khoảnh khắc của Haniu')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
            {trans(ugc?.title || 'Khoảnh Khắc Của Haniu')}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
            {trans(ugc?.hashtag || '#mygiftmoment')}
          </p>
        </div>

        {/* UGC Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayItems.map((item, idx) => {
            // Mock social stats for high fidelity
            const likes = [142, 389, 215, 512, 188, 304];
            const comments = [12, 45, 18, 62, 14, 29];
            
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-[28px] bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm block"
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt="Customer moment"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-40 transition-all duration-750 ease-out"
                />

                {/* Instagram Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/60 to-rose-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white space-y-3 p-4">
                  {/* Instagram Logo SVG */}
                  <svg
                    className="w-6 h-6 text-rose-500 animate-scale-up"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  
                  {/* Interactive mock stats */}
                  <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-100">
                    <span className="flex items-center gap-1">
                      ❤️ {likes[idx % likes.length]}
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {comments[idx % comments.length]}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
