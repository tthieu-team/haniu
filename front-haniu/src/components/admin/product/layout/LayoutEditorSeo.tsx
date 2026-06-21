'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface SeoSection {
  icon: string;
  title: string;
  content: string;
}

interface LayoutEditorSeoProps {
  showSeoDescription: boolean;
  title: string;
  sections: SeoSection[];
  onToggleShow: () => void;
  onTitleChange: (val: string) => void;
  onSectionChange: (index: number, field: keyof SeoSection, val: string) => void;
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
}

export default function LayoutEditorSeo({
  showSeoDescription,
  title,
  sections,
  onToggleShow,
  onTitleChange,
  onSectionChange,
  onAddSection,
  onRemoveSection
}: LayoutEditorSeoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-slate-505 dark:text-zinc-300 font-semibold flex items-center gap-2">
          Hiển thị phần "Mô tả & Câu chuyện"
        </label>
        <button
          type="button"
          onClick={onToggleShow}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            showSeoDescription ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              showSeoDescription ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {showSeoDescription && (
        <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
          <div className="space-y-2">
            <label className="block text-slate-500 text-[11px] font-bold uppercase">Tiêu đề chính</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs font-semibold"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Các mục câu chuyện
            </label>

            {sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-slate-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-3 relative"
              >
                <button
                  type="button"
                  onClick={() => onRemoveSection(idx)}
                  className="absolute top-3 right-3 text-slate-450 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Xóa mục này"
                >
                  <Icon name="trash" size={14} />
                </button>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <label className="block text-slate-500 text-[10px]">Icon</label>
                    <input
                      type="text"
                      value={section.icon}
                      onChange={(e) => onSectionChange(idx, 'icon', e.target.value)}
                      className="w-full text-center px-2 py-2 rounded-xl border border-slate-200 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs"
                    />
                  </div>
                  <div className="col-span-10 md:col-span-11 space-y-2">
                    <label className="block text-slate-500 text-[10px]">Tiêu đề mục</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => onSectionChange(idx, 'title', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-500 text-[10px]">Nội dung chi tiết</label>
                  <textarea
                    rows={3}
                    value={section.content}
                    onChange={(e) => onSectionChange(idx, 'content', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs leading-relaxed font-normal text-xs"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onAddSection}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 dark:hover:border-rose-500 text-slate-500 hover:text-rose-500 rounded-2xl flex items-center justify-center gap-1.5 font-bold transition-all text-[11px] cursor-pointer"
            >
              <Icon name="plus" size={12} /> Thêm mục mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
