'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';

export default function CTASection() {
  const cta = useHomeLayoutStore((state) => state.cta);
  const isVisible = useHomeLayoutStore((state) => state.visibility.cta);

  if (!isVisible) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white py-16 px-8 sm:px-12 md:px-20 text-center shadow-xl border border-rose-400/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ffffff,transparent_30%)] opacity-10 animate-pulse" />
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight text-white drop-shadow-sm">
          {cta.title}
        </h2>
        <p className="text-sm text-rose-50/90 font-light max-w-lg mx-auto leading-relaxed">
          {cta.subtitle}
        </p>
        <div className="pt-4">
          <a
            href={cta.buttonHref}
            className="inline-flex items-center justify-center rounded-2xl bg-white text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-8 py-4 text-sm font-bold shadow-lg shadow-rose-900/10 hover:shadow-rose-900/25 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {cta.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
