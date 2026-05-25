'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface IncludedItemInput {
  key: string;
  value: string;
}

interface IncludedItemsManagerProps {
  items: IncludedItemInput[];
  setItems: (items: IncludedItemInput[]) => void;
}

export default function IncludedItemsManager({ items, setItems }: IncludedItemsManagerProps) {
  const addItem = () => setItems([...items, { key: '', value: '' }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-2">
        <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
          🎁 Chi tiết bộ quà tặng gồm (JSONB)
        </h3>
        <button
          type="button"
          onClick={addItem}
          className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"
        >
          <Icon name="plus" size={12} /> Thêm vật phẩm
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-[11px] text-slate-400 italic">Chưa cấu hình các vật phẩm có trong bộ quà này.</p>
        )}
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Tên vật phẩm (VD: Bình giữ nhiệt vỏ tre, Sổ bìa gỗ)"
              value={item.key}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx].key = e.target.value;
                setItems(newItems);
              }}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800"
            />
            <input
              type="text"
              placeholder="Số lượng (VD: 1 chiếc, 1 cuốn)"
              value={item.value}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx].value = e.target.value;
                setItems(newItems);
              }}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-rose-500 hover:text-rose-700 font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
