'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import { useTranslate } from '@/lib/translator';

export default function CTASection() {
  const cta = useHomeLayoutStore((state) => state.cta);
  const isVisible = useHomeLayoutStore((state) => state.visibility.cta);
  const translate = useTranslate();

  if (!isVisible) return null;

  return (
    <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white py-20 px-8 sm:px-12 md:px-20 text-center shadow-xl border border-rose-400/20">
      {/* Visual decorative glowing blur circles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#ffffff,transparent_30%)] opacity-10 animate-pulse" />
      <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-white/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
          {translate(cta.title)}
        </h2>
        <p className="text-xs md:text-sm text-rose-50/90 font-light max-w-lg mx-auto leading-relaxed tracking-wide">
          {translate(cta.subtitle)}
        </p>
        <div className="pt-4">
          <a
            href={cta.buttonHref}
            className="inline-flex items-center justify-center rounded-2xl bg-white text-rose-600 hover:bg-rose-50/95 px-8.5 py-4 text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {translate(cta.buttonText)}
          </a>
        </div>
      </div>
    </section>
  );
}
