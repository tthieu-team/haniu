'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqConfig {
  title: string;
  content: FaqItem[];
}

interface LayoutEditorFaqProps {
  showFaq: boolean;
  faqConfig: FaqConfig;
  onToggleShow: () => void;
  onTitleChange: (val: string) => void;
  onItemChange: (index: number, field: keyof FaqItem, val: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export default function LayoutEditorFaq({
  showFaq,
  faqConfig,
  onToggleShow,
  onTitleChange,
  onItemChange,
  onAddItem,
  onRemoveItem
}: LayoutEditorFaqProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-slate-500 font-semibold">
          Hiển thị tab "Câu hỏi thường gặp FAQ"
        </label>
        <button
          type="button"
          onClick={onToggleShow}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            showFaq ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              showFaq ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {showFaq && (
        <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
          <div className="space-y-2">
            <label className="block text-slate-500 text-xs">Tiêu đề FAQ</label>
            <input
              type="text"
              value={faqConfig.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-855 dark:bg-zinc-800 shadow-xs font-semibold text-xs text-slate-800 dark:text-zinc-100"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Danh sách câu hỏi & trả lời
            </label>

            {faqConfig.content.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-3 relative"
              >
                <button
                  type="button"
                  onClick={() => onRemoveItem(idx)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Xóa câu hỏi này"
                >
                  <Icon name="trash" size={14} />
                </button>

                <div className="space-y-2">
                  <label className="block text-slate-550 text-[10px]">Câu hỏi (Q)</label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => onItemChange(idx, 'question', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs font-semibold text-xs text-slate-800 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-550 text-[10px]">Câu trả lời (A)</label>
                  <textarea
                    rows={2}
                    value={item.answer}
                    onChange={(e) => onItemChange(idx, 'answer', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-855 dark:bg-zinc-800 shadow-xs leading-relaxed font-normal text-xs text-slate-800 dark:text-zinc-100"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onAddItem}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 dark:hover:border-rose-500 text-slate-500 hover:text-rose-500 rounded-2xl flex items-center justify-center gap-1.5 font-bold transition-all text-[11px] cursor-pointer"
            >
              <Icon name="plus" size={12} /> Thêm câu hỏi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
