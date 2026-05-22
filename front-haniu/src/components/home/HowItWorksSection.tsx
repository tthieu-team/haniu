'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';

export default function HowItWorksSection() {
  const how = useHomeLayoutStore((state) => state.howItWorks);
  const isVisible = useHomeLayoutStore((state) => state.visibility.howItWorks);

  if (!isVisible) return null;

  return (
    <section className="py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
          QUY TRÌNH DỊCH VỤ
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          Quy Trình Tạo Nên{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
            Món Quà Độc Bản
          </span>
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          {how.subtitle}
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connection line between steps (desktop only) */}
        <div className="hidden lg:block absolute top-[44px] left-12 right-12 h-[2px] bg-gradient-to-r from-rose-200 via-amber-200 to-rose-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 z-0" />

        {how.steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col space-y-5 group p-6 rounded-[28px] bg-slate-50/40 dark:bg-zinc-900/15 border border-transparent hover:border-slate-200/80 dark:hover:border-zinc-800/80 hover:bg-white dark:hover:bg-zinc-900/40 transition-all duration-500 shadow-xs hover:shadow-lg">
            {/* Number Indicator */}
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-center font-serif text-lg font-extrabold text-rose-500 shadow-sm group-hover:bg-gradient-to-br group-hover:from-rose-500 group-hover:to-pink-500 group-hover:text-white group-hover:border-rose-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-rose-500/20 transition-all duration-500">
              {step.number}
            </div>

            {/* Step text */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 tracking-wide">
                {step.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-light">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
