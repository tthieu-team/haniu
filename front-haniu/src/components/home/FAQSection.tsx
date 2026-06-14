'use client';

import { useState } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslate } from '@/lib/translator';

export default function FAQSection() {
  const faq = useHomeLayoutStore((state) => state.faq);
  const isVisible = useHomeLayoutStore((state) => state.visibility.faq);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { t } = useLanguage();
  const trans = useTranslate();

  if (!isVisible) return null;

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-8 sm:py-12 space-y-12 scroll-mt-20">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100">
          {trans(faq.title)}
        </h2>
        <p className="text-sm text-slate-400 dark:text-zinc-400 font-light">
          {trans("Những thắc mắc thường gặp của khách hàng khi đặt mua set quà tại Haniu")}
        </p>
      </div>

      {/* Accordions */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faq.items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
            >
              {/* Question Trigger */}
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-6 text-left font-semibold text-sm text-slate-800 dark:text-zinc-100 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <span>{trans(item.question)}</span>
                <span className={`text-rose-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  <Icon name="chevron-down" size={16} />
                </span>
              </button>

              {/* Answer Content */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-96 border-t border-slate-200/50 dark:border-zinc-800' : 'max-h-0'
                }`}
              >
                <p className="p-6 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-light whitespace-pre-line bg-slate-50/30 dark:bg-zinc-950/20">
                  {trans(item.answer)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
