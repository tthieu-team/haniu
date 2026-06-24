'use client';

import React, { useState, useEffect } from 'react';
import { useHomeLayoutStore, DEFAULT_STATE } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function FaqPage() {
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const { faq } = useHomeLayoutStore();
  const activeFaq = mounted ? faq : DEFAULT_STATE.faq;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-32 bg-slate-50/50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
      </div>
    );
  }

  // Generate FAQ JSON-LD Schema (GEO/AEO optimization)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': (activeFaq.items || []).map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

  const toggleFaq = (index: number) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-slate-50/50 dark:bg-zinc-950 min-h-screen pt-4 pb-12 space-y-16 animate-fade-in font-sans">
        
        {/* Banner Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] overflow-hidden bg-slate-100/60 dark:bg-zinc-950 text-slate-800 dark:text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-200 dark:border-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent opacity-60 dark:opacity-40 pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 border border-rose-500/25">
                <Icon name="sparkles" size={10} className="animate-pulse" /> HELP CENTER
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight py-1 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500">
                {activeFaq.title || 'Hỏi Đáp Thường Gặp'}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-light tracking-wide max-w-xl">
                Tìm câu trả lời nhanh cho những thắc mắc của bạn về việc chọn quà, khắc tên cá nhân hóa, thanh toán và vận chuyển tại Haniu.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs Navigation */}
          <nav className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1.5 font-medium">
            <a href="/" className="hover:text-rose-500 transition-colors">Trang chủ</a>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-zinc-300">Những câu hỏi thường gặp</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Accordion List (Left Column) */}
            <div className="lg:col-span-8 space-y-4">
            {(activeFaq.items || []).map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-zinc-900 rounded-[28px] border border-slate-200 dark:border-zinc-800/60 shadow-xs hover:border-rose-500/20 dark:hover:border-rose-500/25 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 pr-4">
                      {item.question}
                    </span>
                    <span className={`w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 flex items-center justify-center transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-rose-500/10 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400' : ''
                    }`}>
                      <Icon name="chevron-down" size={12} />
                    </span>
                  </button>
                  
                  {/* Expandable answer panel */}
                  <div className={`transition-all duration-350 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100 border-t border-slate-200 dark:border-zinc-800/60' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}>
                    <div className="p-5 sm:p-6 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-light leading-relaxed whitespace-pre-line tracking-wide bg-slate-50/[0.1] dark:bg-zinc-800/[0.05]">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>

            {/* Right Column: Contact Support card */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="text-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[36px] p-8 space-y-4 shadow-xs">
                <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                  Vẫn chưa tìm thấy câu trả lời?
                </h3>
                <p className="text-xs text-slate-450 dark:text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
                  Đừng ngần ngại liên hệ trực tiếp với bộ phận chăm sóc khách hàng của Haniu. Chúng tôi luôn sẵn sàng hỗ trợ 24/7.
                </p>
                <div className="pt-2 flex flex-col gap-3">
                  <a 
                    href="/contact" 
                    className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/10 text-center"
                  >
                    Gửi liên hệ ngay
                  </a>
                  <a 
                    href="https://web.facebook.com/profile.php?id=61590521378095" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all text-center"
                  >
                    Trò chuyện qua Facebook
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
