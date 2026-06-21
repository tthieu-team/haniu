'use client';

import React, { useState } from 'react';
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
  const [showQuickInput, setShowQuickInput] = useState(false);
  const [quickInputText, setQuickInputText] = useState('');
  const [quickInputError, setQuickInputError] = useState('');

  const addItem = () => setItems([...items, { key: '', value: '' }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const handleApplyQuickInput = () => {
    setQuickInputError('');
    const text = quickInputText.trim();
    if (!text) {
      setShowQuickInput(false);
      return;
    }

    let parsedItems: IncludedItemInput[] = [];

    // Try parsing as JSON first
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        parsedItems = parsed
          .map((item: any) => ({
            key: String(item.key || item.name || '').trim(),
            value: String(item.value || '').trim()
          }))
          .filter(item => item.key);
      } else if (typeof parsed === 'object' && parsed !== null) {
        parsedItems = Object.entries(parsed).map(([key, value]) => ({
          key: key.trim(),
          value: String(value).trim()
        }));
      }
    } catch (e) {
      // Fallback: Parse line-by-line (Key: Value)
      const lines = text.split('\n');
      for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine) continue;

        const colonIdx = cleanLine.indexOf(':');
        const dashIdx = cleanLine.indexOf('-');
        const separatorIdx = colonIdx !== -1 ? colonIdx : dashIdx;

        if (separatorIdx !== -1) {
          const key = cleanLine.substring(0, separatorIdx).trim();
          const value = cleanLine.substring(separatorIdx + 1).trim();
          if (key) {
            parsedItems.push({ key, value });
          }
        } else {
          parsedItems.push({ key: cleanLine, value: '' });
        }
      }
    }

    if (parsedItems.length === 0) {
      setQuickInputError('Không thể tìm thấy vật phẩm hợp lệ. Hãy kiểm tra lại định dạng JSON hoặc từng dòng dạng Tên vật phẩm: Số lượng.');
      return;
    }

    setItems([...items, ...parsedItems]);
    setQuickInputText('');
    setShowQuickInput(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-2">
        <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
          🎁 Chi tiết bộ quà tặng gồm (JSONB)
        </h3>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowQuickInput(!showQuickInput)}
            className="text-xs text-indigo-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            ⚡ Nhập nhanh JSON/Text
          </button>
          <button
            type="button"
            onClick={addItem}
            className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Icon name="plus" size={12} /> Thêm vật phẩm
          </button>
        </div>
      </div>

      {showQuickInput && (
        <div className="p-4 bg-slate-50 dark:bg-zinc-950/40 border border-slate-250/60 dark:border-zinc-800 rounded-2xl space-y-3 animate-fade-in">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 block">
              Dán chuỗi JSON hoặc nhập từng dòng dạng: <code>Tên vật phẩm: Số lượng/Mô tả</code>
            </label>
            <textarea
              rows={3}
              value={quickInputText}
              onChange={(e) => setQuickInputText(e.target.value)}
              placeholder='VD: {"Bình giữ nhiệt vỏ tre": "1 chiếc", "Sổ bìa gỗ": "1 cuốn"}&#10;Hoặc:&#10;Bình giữ nhiệt vỏ tre: 1 chiếc&#10;Sổ bìa gỗ: 1 cuốn'
              className="w-full bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed"
            />
          </div>

          {quickInputError && (
            <p className="text-[10px] text-red-500 font-bold">⚠️ {quickInputError}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowQuickInput(false);
                setQuickInputError('');
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500 font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleApplyQuickInput}
              className="px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-bold cursor-pointer"
            >
              Xác nhận nhập
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && !showQuickInput && (
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
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 font-medium"
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
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 font-medium"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-rose-500 hover:text-rose-700 font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
