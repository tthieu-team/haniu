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
          <div key={idx} className="relative z-10 flex flex-col space-y-5 group p-7 rounded-[32px] bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200 dark:border-zinc-800/80 hover:border-rose-400 dark:hover:border-rose-800 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer">
            {/* Number Indicator */}
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-serif text-sm font-black text-rose-500 shadow-xs group-hover:bg-gradient-to-br group-hover:from-rose-500 group-hover:to-pink-500 group-hover:text-white group-hover:border-rose-500 transition-all duration-500">
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
