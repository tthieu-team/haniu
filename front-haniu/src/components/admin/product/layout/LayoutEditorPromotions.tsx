'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface PromotionsConfig {
  useGlobalConfig: boolean;
  show: boolean;
  list: string[];
}

interface LayoutEditorPromotionsProps {
  promotionsConfig: PromotionsConfig;
  newPromo: string;
  setNewPromo: (val: string) => void;
  onToggleShow: (val: boolean) => void;
  onUpdateList: (list: string[]) => void;
}

export default function LayoutEditorPromotions({
  promotionsConfig,
  newPromo,
  setNewPromo,
  onToggleShow,
  onUpdateList
}: LayoutEditorPromotionsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-slate-500 font-semibold">Hiển thị khối Ưu đãi sản phẩm</label>
          <button
            type="button"
            onClick={() => onToggleShow(!promotionsConfig.show)}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              promotionsConfig.show ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                promotionsConfig.show ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {promotionsConfig.show && (
          <div className="space-y-3">
            <div className="space-y-2">
              {promotionsConfig.list.map((promo, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => {
                      const list = [...promotionsConfig.list];
                      list[idx] = e.target.value;
                      onUpdateList(list);
                    }}
                    className="flex-1 bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-xs text-slate-800 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = promotionsConfig.list.filter((_, i) => i !== idx);
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
                value={newPromo}
                onChange={(e) => setNewPromo(e.target.value)}
                placeholder="Thêm ưu đãi mới cho riêng sản phẩm..."
                className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newPromo.trim()) return;
                  onUpdateList([...promotionsConfig.list, newPromo.trim()]);
                  setNewPromo('');
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
