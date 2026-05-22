'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function BenefitsSection() {
  const benefits = useHomeLayoutStore((state) => state.benefits);
  const isVisible = useHomeLayoutStore((state) => state.visibility.benefits);

  if (!isVisible) return null;

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-zinc-900/30 rounded-3xl p-8 border border-slate-100 dark:border-zinc-900/60 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100 sm:text-3xl">
          {benefits.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col space-y-4"
          >
            <span className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500">
              <Icon name={item.icon} size={24} />
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="text-[12px] text-slate-400 dark:text-zinc-400 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
