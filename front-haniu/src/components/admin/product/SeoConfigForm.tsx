'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface SeoConfigFormProps {
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoKeywords: string;
  setSeoKeywords: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
  layoutTemplate: string;
  setLayoutTemplate: (v: string) => void;
}

export default function SeoConfigForm({
  seoTitle,
  setSeoTitle,
  seoKeywords,
  setSeoKeywords,
  seoDescription,
  setSeoDescription,
  layoutTemplate,
  setLayoutTemplate
}: SeoConfigFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2 flex items-center gap-1.5">
        <Icon name="search" size={14} /> Cấu hình SEO & Layout
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-slate-500">Tiêu đề SEO (Seo Title)</label>
          <input
            type="text"
            placeholder="Tiêu đề hiển thị trên thẻ tab trình duyệt"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-slate-500">Từ khóa SEO (Seo Keywords)</label>
          <input
            type="text"
            placeholder="VD: quà tặng quốc khánh, bình giữ nhiệt vỏ tre"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-slate-500">Mô tả SEO (Seo Description)</label>
          <textarea
            rows={3}
            placeholder="Mô tả tóm tắt của sản phẩm khi tìm kiếm trên Google..."
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-slate-500">Giao diện mẫu (Layout Template)</label>
          <select
            value={layoutTemplate}
            onChange={(e) => setLayoutTemplate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
          >
            <option value="DEFAULT">DEFAULT (Mặc định)</option>
            <option value="PREMIUM">PREMIUM (Cao cấp)</option>
            <option value="MINIMAL">MINIMAL (Tối giản)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
