'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';

export default function HowItWorksSection() {
  const how = useHomeLayoutStore((state) => state.howItWorks);
  const isVisible = useHomeLayoutStore((state) => state.visibility.howItWorks);

  if (!isVisible) return null;

  return (
    <section className="py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
          {how.title}
        </h2>
        <p className="text-sm text-slate-400 dark:text-zinc-400 font-light">
          {how.subtitle}
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connection line between steps (desktop only) */}
        <div className="hidden lg:block absolute top-12 left-12 right-12 h-[1px] bg-slate-100 dark:bg-zinc-800 z-0" />

        {how.steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col space-y-4 group">
            {/* Number Indicator */}
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-855 flex items-center justify-center font-bold text-rose-500 shadow-sm group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all duration-300">
              {step.number}
            </div>

            {/* Step text */}
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-slate-850 dark:text-zinc-150">
                {step.title}
              </h3>
              <p className="text-[12px] text-slate-400 dark:text-zinc-400 leading-relaxed font-light">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
