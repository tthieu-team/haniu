'use client';

import React from 'react';

interface LayoutEditorPoliciesProps {
  activeTab: 'returns' | 'warranty' | 'care';
  show: boolean;
  title: string;
  content: string;
  onToggleShow: () => void;
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
}

export default function LayoutEditorPolicies({
  activeTab,
  show,
  title,
  content,
  onToggleShow,
  onTitleChange,
  onContentChange
}: LayoutEditorPoliciesProps) {
  const labelName =
    activeTab === 'returns' ? 'Đổi trả & Hoàn tiền' :
    activeTab === 'warranty' ? 'Chính sách Bảo hành' : 'Hướng dẫn bảo quản';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-slate-550 dark:text-zinc-300 font-semibold">
          Hiển thị tab "{labelName}"
        </label>
        <button
          type="button"
          onClick={onToggleShow}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            show ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              show ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {show && (
        <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
          <div className="space-y-2">
            <label className="block text-slate-500 text-xs">Tiêu đề hiển thị</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs font-semibold text-xs text-slate-800 dark:text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-slate-500 text-xs">Nội dung chi tiết (Có hỗ trợ xuống dòng)</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-855 dark:bg-zinc-800 shadow-xs leading-relaxed font-normal text-xs text-slate-800 dark:text-zinc-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}
