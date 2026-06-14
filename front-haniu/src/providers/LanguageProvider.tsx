'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import vi from '../locales/vi.json';
import en from '../locales/en.json';
import ja from '../locales/ja.json';

import { useTranslationStore, queueTranslation } from '@/lib/translator';

type Language = 'vi' | 'en' | 'ja' | 'zh';

const dictionaries = {
  vi,
  en,
  ja,
  zh: {},
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect language from URL query parameter (critical for SEO / search engine bots)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as Language;
    const validLangs: Language[] = ['vi', 'en', 'ja', 'zh'];

    const storedLang = localStorage.getItem('haniu_lang') as Language;
    let activeLang: Language = 'vi';

    if (urlLang && validLangs.includes(urlLang)) {
      activeLang = urlLang;
      // Sync to localStorage and cookies
      localStorage.setItem('haniu_lang', urlLang);
      document.cookie = `haniu_lang=${urlLang}; path=/; max-age=31536000; SameSite=Lax`;
    } else if (storedLang && validLangs.includes(storedLang)) {
      activeLang = storedLang;
    }

    setLanguageState(activeLang);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('haniu_lang', lang);
    // Reload to apply language change in dynamic components and reset active state
    if (typeof window !== 'undefined') {
      document.cookie = `haniu_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      window.location.reload();
    }
  };

  const needsTranslationToVi = (text: string): boolean => {
    if (/^[0-9\s,.\-!@#$%^&*()_+={}\[\]|\\:;"'< >?/~`]*$/.test(text)) {
      return false;
    }
    const hasAccents = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/.test(text);
    return !hasAccents;
  };

  const t = (key: string): string => {
    // Always resolve from Vietnamese dictionary first to get the source Vietnamese text
    const keys = key.split('.');
    let result: any = dictionaries['vi'];

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        result = key;
        break;
      }
    }

    const resolvedText = typeof result === 'string' ? result : key;
    if (language === 'vi' && !needsTranslationToVi(resolvedText)) return resolvedText;

    const cacheKey = `${resolvedText}_${language}`;
    const cached = useTranslationStore.getState().translations[cacheKey];
    if (cached) {
      return cached;
    }

    // Trigger async translation fetch from backend in the background using batch queue
    if (mounted) {
      queueTranslation(resolvedText, language);
    }

    return resolvedText; // Return original text while translation loads
  };

  // Suppress hydration issues by displaying Vietnamese until mounted on client
  const activeLanguage = mounted ? language : 'vi';

  return (
    <LanguageContext.Provider value={{ language: activeLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  // Subscribe to translation store to trigger re-renders when translations are updated
  useTranslationStore((state) => state.translations);
  return context;
};
