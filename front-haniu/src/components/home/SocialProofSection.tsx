'use client';

import { useEffect } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { useTestimonialStore } from '@/store/testimonial';
import Icon from '@/components/common/Icons';
import { useLanguage } from '@/providers/LanguageProvider';

import { useTranslate } from '@/lib/translator';

export default function SocialProofSection() {
  const proof = useHomeLayoutStore((state) => state.socialProof);
  const isVisible = useHomeLayoutStore((state) => state.visibility.socialProof);
  const { activeTestimonials, fetchActiveTestimonials } = useTestimonialStore();
  const { t } = useLanguage();
  const trans = useTranslate();

  useEffect(() => {
    if (isVisible) {
      fetchActiveTestimonials();
    }
  }, [isVisible, fetchActiveTestimonials]);

  if (!isVisible) return null;

  // Fallback to layout configs if database testimonials table is empty
  const displayReviews = activeTestimonials.length > 0 ? activeTestimonials : proof.reviews;

  return (
    <section className="py-8 sm:py-12 space-y-12">
      {/* Metrics Row */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-zinc-800">
        <div className="space-y-4 text-center lg:text-left max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
            <Icon name="★" size={10} className="animate-pulse" /> {trans(proof.badge || 'Khách hàng nói gì về Haniu')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
            {trans(proof.title)}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
            {trans("Đọc những chia sẻ chân thực của khách hàng đã mua và trải nghiệm các set quà từ Haniu.")}
          </p>
        </div>

        <div className="flex items-center gap-8 divide-x divide-slate-200 dark:divide-zinc-800 bg-white/80 dark:bg-zinc-950/60 backdrop-blur-md px-8 py-5.5 rounded-[32px] border border-slate-200 dark:border-zinc-800/80 shadow-lg">
          <div className="text-center px-4">
            <span className="text-3xl font-black text-rose-500 flex items-center justify-center gap-1">
              {proof.ratingScore} <Icon name="★" size={20} className="fill-current text-rose-500" />
            </span>
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500 dark:text-zinc-400 block mt-1">
              {t('home.reviews.rating')}
            </span>
          </div>
          <div className="text-center px-4 pl-8">
            <span className="text-3xl font-black text-slate-800 dark:text-zinc-100 block">
              {proof.reviewsCount}
            </span>
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500 dark:text-zinc-400 block mt-1">
              {t('home.reviews.trust')}
            </span>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayReviews.map((rev) => (
          <div
            key={rev.id}
            className="group bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200 dark:border-zinc-800/60 p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Giant quote mark overlay */}
            <span className="absolute top-1 right-5 text-[90px] text-slate-200/50 dark:text-zinc-800/50 font-serif pointer-events-none select-none">
              &ldquo;
            </span>

            <div className="space-y-4 relative z-10">
              {/* Star Rating */}
              <div className="flex text-amber-500 gap-0.5">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Icon key={i} name="★" size={14} className="fill-current text-amber-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-light italic">
                &ldquo;{rev.content}&rdquo;
              </p>
            </div>

            {/* Profile User */}
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200/60 dark:border-zinc-800/80 relative z-10">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200/80 dark:border-zinc-800"
              />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                  {rev.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-light">
                  {rev.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
