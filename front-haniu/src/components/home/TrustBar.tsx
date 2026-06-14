'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

export default function TrustBar() {
  const trust = useHomeLayoutStore((state) => state.trustBar);
  const isVisible = useHomeLayoutStore((state) => state.visibility.trustBar);
  const translate = useTranslate();

  if (!isVisible) return null;

  return (
    <section className="bg-gradient-to-r from-slate-50/50 via-white/80 to-slate-50/50 dark:from-zinc-900/20 dark:via-zinc-950/40 dark:to-zinc-900/20 backdrop-blur-md border-y border-slate-200 dark:border-zinc-800/80 py-4 sm:py-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 justify-items-stretch">
          {trust.items.map((item, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden flex items-center gap-2.5 sm:gap-4 group cursor-default p-3 sm:p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/30 border border-slate-200/80 dark:border-zinc-800/85 hover:border-rose-200 dark:hover:border-rose-900/50 hover:shadow-2xl hover:shadow-rose-500/5 hover:-translate-y-1 transition-all duration-500 ease-out shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:shadow-none"
            >
              {/* Ambient Background Glow on Hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-500/0 to-amber-500/0 group-hover:from-rose-500/[0.02] group-hover:to-amber-500/[0.02] transition-all duration-700" />
              <div className="absolute -right-8 -bottom-8 w-20 h-20 rounded-full bg-rose-500/0 blur-2xl group-hover:bg-rose-500/5 group-hover:scale-150 transition-all duration-700 ease-out" />

              <span className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800/80 text-slate-400 dark:text-zinc-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white dark:group-hover:bg-zinc-900 group-hover:text-rose-500 group-hover:border-rose-500/40 group-hover:shadow-lg group-hover:shadow-rose-500/5 transition-all duration-500 shrink-0">
                <Icon name={item.icon} size={18} className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
              </span>
              <div className="text-left space-y-0.5 sm:space-y-1">
                <h4 className="text-[10px] sm:text-xs font-black text-slate-800 dark:text-zinc-100 uppercase tracking-wider sm:tracking-widest group-hover:text-rose-500 transition-colors duration-300">
                  {translate(item.title || item.text)}
                </h4>
                {item.desc && (
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 font-light tracking-wide leading-tight sm:leading-relaxed group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
                    {translate(item.desc)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
