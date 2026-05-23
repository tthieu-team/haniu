'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function BenefitsSection() {
  const benefits = useHomeLayoutStore((state) => state.benefits);
  const isVisible = useHomeLayoutStore((state) => state.visibility.benefits);

  if (!isVisible) return null;

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-slate-50/50 to-white/20 dark:from-zinc-900/10 dark:to-zinc-950/5 p-5 md:p-12 rounded-3xl md:rounded-[40px] border border-slate-200 dark:border-zinc-800/60 space-y-8 md:space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto px-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
          <Icon name="✨" size={10} className="animate-pulse" /> DỊCH VỤ TRỌN GÓI
        </span>
        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          Trải Nghiệm{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-500">
            Dịch Vụ Khác Biệt
          </span>{' '}
          Tại Haniu
        </h2>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {benefits.items.map((item, idx) => {
          const styles = [
            { bg: 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border-rose-100 dark:border-rose-900/30', hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-800' },
            { bg: 'bg-violet-50 dark:bg-violet-950/20 text-violet-500 border-violet-100 dark:border-violet-900/30', hoverBorder: 'hover:border-violet-400 dark:hover:border-violet-800' },
            { bg: 'bg-amber-500/10 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-900/30', hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-800' },
            { bg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border-emerald-100 dark:border-emerald-900/30', hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-800' },
          ];
          const currentStyle = styles[idx % styles.length];

          return (
            <div
              key={idx}
              className={`group bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 p-5 md:p-7 rounded-2xl md:rounded-[28px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4 md:space-y-5 cursor-pointer ${currentStyle.hoverBorder}`}
            >
              <span className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${currentStyle.bg}`}>
                <Icon name={item.icon} size={22} className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />
              </span>
              <div className="space-y-1.5 md:space-y-2">
                <h3 className="font-extrabold text-xs md:text-sm text-slate-800 dark:text-zinc-100 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
