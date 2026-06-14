'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslate } from '@/lib/translator';

const STEP_DECORATIONS = [
  {
    icon: 'gift',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    colorStyle: {
      text: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border-rose-100 dark:border-rose-900/30',
      hoverTitle: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
      border: 'border-rose-500',
      shadow: 'hover:shadow-rose-500/5 hover:border-rose-200 dark:hover:border-rose-900/40'
    }
  },
  {
    icon: 'edit',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&auto=format&fit=crop&q=80',
    colorStyle: {
      text: 'text-violet-500 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/20 text-violet-500 border-violet-100 dark:border-violet-900/30',
      hoverTitle: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
      border: 'border-violet-500',
      shadow: 'hover:shadow-violet-500/5 hover:border-violet-200 dark:hover:border-violet-900/40'
    }
  },
  {
    icon: 'eye',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80',
    colorStyle: {
      text: 'text-amber-600 dark:text-amber-500',
      bg: 'bg-amber-500/10 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-900/30',
      hoverTitle: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
      border: 'border-amber-500',
      shadow: 'hover:shadow-amber-500/5 hover:border-amber-200 dark:hover:border-amber-900/40'
    }
  },
  {
    icon: 'truck',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    colorStyle: {
      text: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border-emerald-100 dark:border-emerald-900/30',
      hoverTitle: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
      border: 'border-emerald-500',
      shadow: 'hover:shadow-emerald-500/5 hover:border-emerald-200 dark:hover:border-emerald-900/40'
    }
  }
];

export default function HowItWorksSection() {
  const isVisible = useHomeLayoutStore((state) => state.visibility.howItWorks);
  const howItWorks = useHomeLayoutStore((state) => state.howItWorks);
  const { t } = useLanguage();
  const trans = useTranslate();

  if (!isVisible) return null;

  const steps = howItWorks?.steps || [];

  return (
    <section className="py-12 md:py-20 lg:pb-28 bg-gradient-to-b from-slate-50/50 to-white/20 dark:from-zinc-900/10 dark:to-zinc-950/5 p-4 sm:p-6 md:p-12 rounded-3xl md:rounded-[40px] border border-slate-200 dark:border-zinc-800/60 space-y-10 md:space-y-16 overflow-hidden relative">
      
      {/* Title */}
      <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto px-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
          <Icon name="✨" size={10} className="animate-pulse" /> {trans(howItWorks.badge || 'Quy trình dịch vụ')}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          {trans(howItWorks.title)}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          {trans(howItWorks.subtitle)}
        </p>
      </div>

      {/* Luxury Artisan Collage Layout */}
      <div className="relative max-w-6xl mx-auto px-2 sm:px-4">

        {/* Curved connecting line running in the background for desktop */}
        <div className="absolute inset-x-0 top-[35%] -z-10 hidden lg:block text-rose-500/30 dark:text-rose-500/20">
          <svg className="w-full h-32 overflow-visible" fill="none" viewBox="0 0 1000 120">
            <path
              d="M -50,60 C 200,-20 400,140 600,60 C 800,-20 1000,80 1100,60"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="8 8"
            />
          </svg>
        </div>

        {/* Vertical dashed connecting line for mobile (hidden on tablet and desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-[2px] -z-10 sm:hidden text-rose-500/40 dark:text-rose-500/30">
          <div className="h-full border-l-2 border-dashed border-current" />
        </div>

        {/* Staggered, tilted cards container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-y-12 sm:gap-x-6 lg:gap-8 justify-items-center items-stretch">
          {steps.map((step, idx) => {
            const dec = STEP_DECORATIONS[idx] || STEP_DECORATIONS[0];
            const cardStyles = [
              'lg:-rotate-1 lg:translate-y-0 sm:-translate-y-4 -translate-x-3 sm:translate-x-0 -rotate-1 hover:rotate-0 hover:translate-x-0 hover:translate-y-0',
              'lg:rotate-2 lg:translate-y-8 sm:translate-y-4 translate-x-3 sm:translate-x-0 rotate-1 hover:rotate-0 hover:translate-x-0 hover:translate-y-0',
              'lg:-rotate-2 lg:translate-y-0 sm:-translate-y-4 -translate-x-3 sm:translate-x-0 -rotate-1 hover:rotate-0 hover:translate-x-0 hover:translate-y-0',
              'lg:rotate-1 lg:translate-y-8 sm:translate-y-4 translate-x-3 sm:translate-x-0 rotate-1 hover:rotate-0 hover:translate-x-0 hover:translate-y-0'
            ];

            return (
              <div
                key={idx}
                className={`w-full max-w-[320px] sm:max-w-none flex flex-col items-center group relative transition-all duration-500 ${cardStyles[idx % cardStyles.length]}`}
              >
                {/* Physical connection thread knot on top of card */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border-2 ${dec.colorStyle.border} flex items-center justify-center z-20 shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <span className={`w-2 h-2 rounded-full ${dec.colorStyle.text.split(' ')[0]} bg-current`} />
                </div>

                {/* The Card */}
                <div className={`w-full p-6 rounded-[28px] bg-white/60 dark:bg-zinc-900/30 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full ${dec.colorStyle.shadow}`}>

                  {/* Step Image with elegant rounded border */}
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 shadow-inner mb-5 relative">
                    <img
                      src={getFullImageUrl(step.image || dec.image)}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Step Number Tag inside Image */}
                    <span className={`absolute top-3 right-3 z-20 text-[9px] font-black tracking-widest px-2.5 py-1 rounded-xl shadow-md border uppercase ${dec.colorStyle.bg}`}>
                      Step {step.number}
                    </span>
                  </div>

                  {/* Header / Icon Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${dec.colorStyle.bg}`}>
                      <Icon name={dec.icon} size={18} />
                    </span>
                    <h3 className={`font-extrabold text-sm md:text-base text-slate-800 dark:text-zinc-100 tracking-wide transition-colors duration-300 ${dec.colorStyle.hoverTitle}`}>
                      {trans(step.title)}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs md:text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed font-light font-sans text-left flex-grow">
                    {trans(step.desc)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
