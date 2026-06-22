'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { fetchApi } from './api';
import { useLanguage } from '@/providers/LanguageProvider';

interface TranslationStore {
  translations: Record<string, string>;
  fetchTranslations: (texts: string[], lang: string) => Promise<void>;
}

const pending = new Set<string>();

// SSR-safe storage: returns no-op on server, localStorage on client
const safeStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      length: 0,
      clear: () => {},
      key: () => null,
    } as Storage;
  }
  return localStorage;
});

export const useTranslationStore = create<TranslationStore>()(
  persist(
    (set, get) => ({
      translations: {},
      fetchTranslations: async (texts, lang) => {
        const missing = texts.filter(t => {
          const key = `${t}_${lang}`;
          const currentVal = get().translations[key];
          return !currentVal && !pending.has(key);
        });
        if (missing.length === 0) return;
        
        missing.forEach(t => pending.add(`${t}_${lang}`));
        
        const CHUNK_SIZE = 10;
        const chunks: string[][] = [];
        for (let i = 0; i < missing.length; i += CHUNK_SIZE) {
          chunks.push(missing.slice(i, i + CHUNK_SIZE));
        }

        try {
          await Promise.all(
            chunks.map(async (chunk) => {
              try {
                const res = await fetchApi('/api/v1/translate', {
                  method: 'POST',
                  body: JSON.stringify({ texts: chunk }),
                });
                if (res) {
                  set(state => {
                    const newTrans = { ...state.translations };
                    Object.entries(res).forEach(([k, v]) => {
                      newTrans[`${k}_${lang}`] = v as string;
                    });
                    return { translations: newTrans };
                  });
                }
              } catch (err) {
                console.error('Failed to fetch translation chunk:', err);
              } finally {
                chunk.forEach(t => pending.delete(`${t}_${lang}`));
              }
            })
          );
        } catch (err) {
          console.error('Failed to fetch translations:', err);
        }
      }
    }),
    {
      name: 'haniu-translation-cache-v2',
      storage: safeStorage,
    }
  )
);

const needsTranslationToVi = (text: string): boolean => {
  if (/^[0-9\s,.\-!@#$%^&*()_+={}\[\]|\\:;"'< >?/~`]*$/.test(text)) {
    return false;
  }
  const hasAccents = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/.test(text);
  return !hasAccents;
};

// Global translation batching queue
let batchQueue: Record<string, Set<string>> = {};
let batchTimeout: NodeJS.Timeout | null = null;

const triggerBatchTranslate = () => {
  const currentQueue = { ...batchQueue };
  batchQueue = {};
  batchTimeout = null;

  Object.entries(currentQueue).forEach(([lang, textSet]) => {
    const texts = Array.from(textSet);
    if (texts.length > 0) {
      useTranslationStore.getState().fetchTranslations(texts, lang);
    }
  });
};

export function queueTranslation(text: string, lang: string) {
  if (!batchQueue[lang]) {
    batchQueue[lang] = new Set();
  }
  batchQueue[lang].add(text);

  if (!batchTimeout) {
    batchTimeout = setTimeout(triggerBatchTranslate, 100); // Wait 100ms for other renders to register
  }
}

export function useTranslate() {
  const { language } = useLanguage();
  const { translations } = useTranslationStore();

  return (text: string | null | undefined): string => {
    if (!text) return '';
    if (language === 'vi' && !needsTranslationToVi(text)) return text;

    const key = `${text}_${language}`;
    const cached = translations[key];
    if (cached) {
      return cached;
    }

    // Trigger batch translation fetch in the background
    queueTranslation(text, language);

    return text; // Fallback to original text while translating
  };
}
