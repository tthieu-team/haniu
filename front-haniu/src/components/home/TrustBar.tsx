'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function TrustBar() {
  const trust = useHomeLayoutStore((state) => state.trustBar);
  const isVisible = useHomeLayoutStore((state) => state.visibility.trustBar);

  if (!isVisible) return null;

  return (
    <section className="bg-slate-50 dark:bg-zinc-900/40 border-y border-slate-100 dark:border-zinc-800/80 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center text-center">
          {trust.items.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 group cursor-default">
              <span className="text-rose-500 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                <Icon name={item.icon} size={16} />
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-350 tracking-wide">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
