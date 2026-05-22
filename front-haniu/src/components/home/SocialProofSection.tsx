'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function SocialProofSection() {
  const proof = useHomeLayoutStore((state) => state.socialProof);
  const isVisible = useHomeLayoutStore((state) => state.visibility.socialProof);

  if (!isVisible) return null;

  return (
    <section className="py-16 space-y-12">
      {/* Metrics Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-100 dark:border-zinc-800">
        <div className="space-y-2 text-center md:text-left max-w-md">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
            {proof.title}
          </h2>
          <p className="text-sm text-slate-400 dark:text-zinc-400 font-light">
            Sự hài lòng của khách hàng là động lực lớn nhất để Haniu không ngừng sáng tạo.
          </p>
        </div>

        <div className="flex items-center gap-8 divide-x divide-slate-200 dark:divide-zinc-800 bg-slate-50 dark:bg-zinc-900/50 px-8 py-5 rounded-3xl border border-slate-100 dark:border-zinc-800/80">
          <div className="text-center px-4">
            <span className="text-3xl font-black text-rose-500 flex items-center justify-center gap-1">
              {proof.ratingScore} <Icon name="★" size={24} className="fill-current text-rose-500" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-zinc-500">
              Đánh Giá Trung Bình
            </span>
          </div>
          <div className="text-center px-4 pl-8">
            <span className="text-3xl font-black text-slate-800 dark:text-zinc-100 block">
              {proof.reviewsCount}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-zinc-500">
              Khách Hàng Đã Tin Dùng
            </span>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {proof.reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Star Rating */}
              <div className="flex text-amber-400 gap-0.5">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Icon key={i} name="★" size={14} className="fill-current text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-light">
                &ldquo;{rev.content}&rdquo;
              </p>
            </div>

            {/* Profile User */}
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-50 dark:border-zinc-850">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-zinc-800"
              />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  {rev.name}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-light">
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
