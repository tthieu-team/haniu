'use client';

import React, { useState, useRef } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

export default function BrandIntroSection() {
  const brandIntro = useHomeLayoutStore((state) => state.brandIntro);
  const isVisible = useHomeLayoutStore((state) => state.visibility.brandIntro);
  const translate = useTranslate();

  if (!isVisible) return null;

  return (
    <section className="py-6 sm:py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-rose-500/5 blur-3xl -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-1.5 text-[9px] sm:text-[10px] font-black tracking-[0.25em] uppercase text-rose-500 border border-rose-500/25">
              <Icon name="✨" size={10} className="animate-pulse" /> {translate(brandIntro.subtitle)}
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
              {translate(brandIntro.title).split(' ').slice(0, 3).join(' ')}{' '}
              <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 bg-clip-text text-transparent block sm:inline">
                {translate(brandIntro.title).split(' ').slice(3).join(' ')}
              </span>
            </h2>

            <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 leading-relaxed font-light max-w-xl">
              {translate(brandIntro.description)}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="/#products"
                className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white dark:hover:text-white px-6 py-3.5 text-xs font-extrabold shadow-md hover:shadow-lg hover:shadow-rose-500/25 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 border border-transparent w-full sm:w-44"
              >
                {translate("Khám phá câu chuyện")}
              </a>
              <a
                href="/collections"
                className="inline-flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50/20 dark:hover:bg-rose-950/10 px-6 py-3.5 text-xs font-extrabold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-300 w-full sm:w-44"
              >
                {translate("Các bộ sưu tập")}
              </a>
            </div>
          </div>

          {/* Right Stats Column */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {brandIntro.stats.map((stat, idx) => {
                const parts = stat.value.trim().split(' ');
                const hasEmoji = parts.length > 1 && (parts[0].length <= 4 || /[\p{Emoji}]/u.test(parts[0]));
                const numberVal = hasEmoji ? parts.slice(1).join(' ') : stat.value;

                // Map stats to matching clean Lucide icons for maximum consistency
                const iconNames = ['users', 'camera', 'gift', 'heart'];
                const iconName = iconNames[idx % iconNames.length];

                // Premium matching brand themes with high-conversion micro-badges
                const themes = [
                  {
                    bg: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400',
                    border: 'group-hover:border-rose-200 dark:group-hover:border-rose-900/30',
                    gradient: 'from-rose-500 via-rose-400 to-pink-500',
                    bar: 'from-rose-500 to-pink-500',
                    badge: '★ 99% Hài lòng'
                  },
                  {
                    bg: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400',
                    border: 'group-hover:border-indigo-200 dark:group-hover:border-indigo-900/30',
                    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
                    bar: 'from-indigo-500 to-purple-500',
                    badge: 'Ảnh feedback thật'
                  },
                  {
                    bg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
                    border: 'group-hover:border-amber-200 dark:group-hover:border-amber-900/30',
                    gradient: 'from-amber-500 via-orange-500 to-rose-500',
                    bar: 'from-amber-500 to-rose-500',
                    badge: 'Độc bản & Thủ công'
                  },
                  {
                    bg: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
                    border: 'group-hover:border-rose-200 dark:group-hover:border-rose-900/30',
                    gradient: 'from-rose-600 via-pink-500 to-amber-500',
                    bar: 'from-rose-600 to-amber-500',
                    badge: 'Gửi trọn yêu thương'
                  },
                ];
                const theme = themes[idx % themes.length];

                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={idx}
                    className={`relative overflow-hidden p-5 pl-6 rounded-[24px] border border-slate-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/20 backdrop-blur-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/[0.04] transition-all duration-500 group ${theme.border} ${!isEven ? 'sm:translate-y-3' : ''}`}
                  >
                    {/* Inline Style Injection for safe, direct keyframes rendering */}
                    <style>{`
                      @keyframes float-slow-coords-${idx} {
                        0% { right: -24px; bottom: -24px; }
                        50% { right: -12px; bottom: -12px; }
                        100% { right: -24px; bottom: -24px; }
                      }
                    `}</style>
                    {/* Ambient glow bubbles inside card */}
                    <div
                      className={`absolute w-16 h-16 rounded-full bg-gradient-to-br ${theme.gradient} opacity-5 group-hover:opacity-20 blur-xl transition-all duration-700 group-hover:scale-150`}
                      style={{
                        right: '-24px',
                        bottom: '-24px',
                        animation: `float-slow-coords-${idx} ${6 + (idx * 1.5)}s ease-in-out infinite`
                      }}
                    />

                    {/* Vertical gradient indicator strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${theme.bar} opacity-60 group-hover:opacity-100 transition-opacity`} />

                    <div className="flex flex-col gap-3 w-full">
                      {/* Row 1: Standalone Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ring-2 ring-transparent group-hover:ring-offset-2 dark:group-hover:ring-offset-zinc-900 group-hover:ring-rose-500/20 transition-all duration-300 ${theme.bg}`}>
                        <Icon name={iconName} size={16} className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      </div>
 
                      {/* Row 2, 3, 4: Value, Label, and Badge stacked below */}
                      <div className="flex flex-col gap-1.5 pl-0.5 w-full">
                        <span className={`text-xl sm:text-2xl font-extrabold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent tracking-tight leading-tight whitespace-nowrap`}>
                          {numberVal}
                        </span>
                        <span className="block text-[11px] sm:text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-wide leading-tight">
                          {translate(stat.label)}
                        </span>
                        <div className="pt-0.5">
                          <span className={`inline-block text-[9px] font-medium px-1.5 py-0.5 rounded-sm ${theme.bg} scale-95 origin-left whitespace-nowrap`}>
                            {theme.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
