'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import Icon from '@/components/common/Icons';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ] as const;

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer text-slate-800 dark:text-zinc-100 text-xs font-bold"
        title="Chọn ngôn ngữ / Select Language"
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="uppercase tracking-wider text-[10px]">{currentLang.code}</span>
        <span className={`opacity-60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <Icon name="chevron-down" size={8} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-1.5 animate-scale-up">
          <div className="flex flex-col gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border border-transparent ${
                  language === lang.code
                    ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 border-rose-200/40 dark:border-rose-900/30'
                    : 'text-slate-700 dark:text-zinc-350 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span className="flex-1">{lang.name}</span>
                {language === lang.code && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
