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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {how.steps.map((step, idx) => (
          <div
            key={idx}
            className="relative z-10 flex flex-col space-y-5 group p-7 rounded-[28px] bg-white/60 dark:bg-zinc-900/30 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 hover:border-rose-200 dark:hover:border-rose-900/50 hover:shadow-2xl hover:shadow-rose-500/5 hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-500/0 to-amber-500/0 group-hover:from-rose-500/[0.03] group-hover:to-amber-500/[0.03] transition-all duration-700" />
            <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-rose-500/0 blur-2xl group-hover:bg-rose-500/10 group-hover:scale-150 transition-all duration-700 ease-out" />

            {/* Number Indicator */}
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800/80 flex items-center justify-center font-serif text-sm font-black text-slate-400 dark:text-zinc-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white dark:group-hover:bg-zinc-900 group-hover:text-rose-500 group-hover:border-rose-500/40 group-hover:shadow-lg group-hover:shadow-rose-500/5 transition-all duration-500">
              {step.number}
            </div>

            {/* Step text */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 tracking-wide group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-light group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
