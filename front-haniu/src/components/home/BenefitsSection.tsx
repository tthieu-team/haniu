'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function BenefitsSection() {
  const benefits = useHomeLayoutStore((state) => state.benefits);
  const isVisible = useHomeLayoutStore((state) => state.visibility.benefits);

  if (!isVisible) return null;

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-slate-50/50 to-white/20 dark:from-zinc-900/10 dark:to-zinc-950/5 p-4 sm:p-6 md:p-12 rounded-3xl md:rounded-[40px] border border-slate-200 dark:border-zinc-800/60 space-y-10 md:space-y-16 relative overflow-hidden">
      {/* Title */}
      <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto px-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
          <Icon name="✨" size={10} className="animate-pulse" /> DỊCH VỤ TRỌN GÓI
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          Trải Nghiệm{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-500">
            Dịch Vụ Khác Biệt
          </span>{' '}
          Tại Haniu
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          Những giá trị vượt trội tạo nên trải nghiệm mua sắm quà tặng trọn vẹn, chỉn chu và an tâm nhất dành cho bạn.
        </p>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
        {benefits.items.map((item, idx) => {
          const styles = [
            { 
              bg: 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border-rose-100 dark:border-rose-900/30', 
              hoverCardBorder: 'hover:border-rose-200 dark:hover:border-rose-900/50',
              hoverTitle: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
              glowFrom: 'group-hover:from-rose-500/[0.03]',
              glowTo: 'group-hover:to-rose-500/[0.01]',
              bubbleBg: 'group-hover:bg-rose-500/10',
              shadowGlow: 'hover:shadow-rose-500/5'
            },
            { 
              bg: 'bg-violet-50 dark:bg-violet-950/20 text-violet-500 border-violet-100 dark:border-violet-900/30', 
              hoverCardBorder: 'hover:border-violet-200 dark:hover:border-violet-900/50',
              hoverTitle: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
              glowFrom: 'group-hover:from-violet-500/[0.03]',
              glowTo: 'group-hover:to-violet-500/[0.01]',
              bubbleBg: 'group-hover:bg-violet-500/10',
              shadowGlow: 'hover:shadow-violet-500/5'
            },
            { 
              bg: 'bg-amber-500/10 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-900/30', 
              hoverCardBorder: 'hover:border-amber-200 dark:hover:border-amber-900/50',
              hoverTitle: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
              glowFrom: 'group-hover:from-amber-500/[0.03]',
              glowTo: 'group-hover:to-amber-500/[0.01]',
              bubbleBg: 'group-hover:bg-amber-500/10',
              shadowGlow: 'hover:shadow-amber-500/5'
            },
            { 
              bg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border-emerald-100 dark:border-emerald-900/30', 
              hoverCardBorder: 'hover:border-emerald-200 dark:hover:border-emerald-900/50',
              hoverTitle: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
              glowFrom: 'group-hover:from-emerald-500/[0.03]',
              glowTo: 'group-hover:to-emerald-500/[0.01]',
              bubbleBg: 'group-hover:bg-emerald-500/10',
              shadowGlow: 'hover:shadow-emerald-500/5'
            },
          ];
          const currentStyle = styles[idx % styles.length];

          return (
            <div
              key={idx}
              className={`group relative z-10 overflow-hidden bg-white/60 dark:bg-zinc-900/30 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 p-3.5 sm:p-5 md:p-8 rounded-2xl md:rounded-[28px] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer flex flex-col space-y-3 sm:space-y-4 md:space-y-5 ${currentStyle.hoverCardBorder} ${currentStyle.shadowGlow}`}
            >
              {/* Ambient Background Glow on Hover */}
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br from-transparent to-transparent ${currentStyle.glowFrom} ${currentStyle.glowTo} transition-all duration-700`} />
              <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-transparent blur-2xl ${currentStyle.bubbleBg} group-hover:scale-150 transition-all duration-700 ease-out`} />

              <span className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${currentStyle.bg}`}>
                <Icon name={item.icon} size={18} className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] md:w-[26px] md:h-[26px]" />
              </span>
              <div className="space-y-1.5 sm:space-y-2 text-left">
                <h3 className={`font-extrabold text-xs sm:text-sm md:text-base text-slate-800 dark:text-zinc-100 tracking-wide transition-colors duration-300 ${currentStyle.hoverTitle}`}>
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed font-light group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
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
