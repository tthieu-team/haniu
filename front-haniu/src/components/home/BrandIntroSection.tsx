'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function BrandIntroSection() {
  const brandIntro = useHomeLayoutStore((state) => state.brandIntro);
  const isVisible = useHomeLayoutStore((state) => state.visibility.brandIntro);

  if (!isVisible) return null;

  return (
    <section className="py-10 sm:py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-rose-500/5 blur-3xl -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-2 text-xs font-bold tracking-widest uppercase text-rose-500 border border-rose-500/25">
              <Icon name="✨" size={12} /> {brandIntro.subtitle}
            </span>
            
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100 sm:text-5xl leading-tight">
              {brandIntro.title.split(' ').slice(0, 3).join(' ')}{' '}
              <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 bg-clip-text text-transparent block sm:inline">
                {brandIntro.title.split(' ').slice(3).join(' ')}
              </span>
            </h2>
            
            <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 leading-relaxed font-light max-w-xl">
              {brandIntro.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="/#products"
                className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-6 py-3.5 text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-transparent dark:border-zinc-200 w-full sm:w-44"
              >
                Khám phá câu chuyện
              </a>
              <a
                href="/#collections"
                className="inline-flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-350 px-6 py-3.5 text-xs font-bold shadow-xs hover:bg-slate-50 dark:hover:bg-zinc-850 hover:scale-[1.02] active:scale-95 transition-all duration-300 w-full sm:w-44"
              >
                Các bộ sưu tập
              </a>
            </div>
          </div>

          {/* Right Stats Column */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {brandIntro.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 backdrop-blur-md shadow-lg shadow-slate-100/50 dark:shadow-none hover:border-rose-500/30 dark:hover:border-rose-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-500 group"
                >
                  <span className="block text-2xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-br from-rose-500 to-amber-500 bg-clip-text group-hover:scale-105 transition-transform duration-500 origin-left">
                    {stat.value}
                  </span>
                  <span className="block mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
