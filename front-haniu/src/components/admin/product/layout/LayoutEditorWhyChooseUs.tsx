'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface WhyChooseUsItem {
  icon: string;
  text: string;
}

interface WhyChooseUsConfig {
  useGlobalConfig: boolean;
  show: boolean;
  list: WhyChooseUsItem[];
}

interface LayoutEditorWhyChooseUsProps {
  whyChooseUsConfig: WhyChooseUsConfig;
  newWhyIcon: string;
  newWhyText: string;
  setNewWhyIcon: (val: string) => void;
  setNewWhyText: (val: string) => void;
  onToggleShow: (val: boolean) => void;
  onUpdateList: (list: WhyChooseUsItem[]) => void;
}

export default function LayoutEditorWhyChooseUs({
  whyChooseUsConfig,
  newWhyIcon,
  newWhyText,
  setNewWhyIcon,
  setNewWhyText,
  onToggleShow,
  onUpdateList
}: LayoutEditorWhyChooseUsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-slate-500 font-semibold">Hiển thị khối Lý do chọn Haniu</label>
          <button
            type="button"
            onClick={() => onToggleShow(!whyChooseUsConfig.show)}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              whyChooseUsConfig.show ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                whyChooseUsConfig.show ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {whyChooseUsConfig.show && (
          <div className="space-y-3">
            <div className="space-y-2">
              {whyChooseUsConfig.list.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => {
                      const list = [...whyChooseUsConfig.list];
                      list[idx] = { ...list[idx], icon: e.target.value };
                      onUpdateList(list);
                    }}
                    className="w-12 text-center bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-800 dark:text-zinc-100"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const list = [...whyChooseUsConfig.list];
                      list[idx] = { ...list[idx], text: e.target.value };
                      onUpdateList(list);
                    }}
                    className="flex-1 bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-zinc-100 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = whyChooseUsConfig.list.filter((_, i) => i !== idx);
                      onUpdateList(list);
                    }}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newWhyIcon}
                onChange={(e) => setNewWhyIcon(e.target.value)}
                placeholder="🌹"
                className="w-12 text-center bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-2 py-1.5 text-xs"
              />
              <input
                type="text"
                value={newWhyText}
                onChange={(e) => setNewWhyText(e.target.value)}
                placeholder="Thêm lý do mới..."
                className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newWhyText.trim()) return;
                  onUpdateList([
                    ...whyChooseUsConfig.list,
                    { icon: newWhyIcon.trim() || '🌹', text: newWhyText.trim() }
                  ]);
                  setNewWhyText('');
                  setNewWhyIcon('🌹');
                }}
                className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Thêm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
