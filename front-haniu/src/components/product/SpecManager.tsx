'use client';

import React, { useState } from 'react';
import Icon from '@/components/common/Icons';

interface SpecInput {
  key: string;
  value: string;
}

interface SpecManagerProps {
  specs: SpecInput[];
  setSpecs: (specs: SpecInput[]) => void;
}

export default function SpecManager({ specs, setSpecs }: SpecManagerProps) {
  const [showQuickInput, setShowQuickInput] = useState(false);
  const [quickInputText, setQuickInputText] = useState('');
  const [quickInputError, setQuickInputError] = useState('');

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (idx: number) => setSpecs(specs.filter((_, i) => i !== idx));

  const handleApplyQuickInput = () => {
    setQuickInputError('');
    const text = quickInputText.trim();
    if (!text) {
      setShowQuickInput(false);
      return;
    }

    let parsedSpecs: SpecInput[] = [];

    // Try parsing as JSON first
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        parsedSpecs = parsed
          .map((item: any) => ({
            key: String(item.key || item.name || '').trim(),
            value: String(item.value || '').trim()
          }))
          .filter(item => item.key);
      } else if (typeof parsed === 'object' && parsed !== null) {
        parsedSpecs = Object.entries(parsed).map(([key, value]) => ({
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
            parsedSpecs.push({ key, value });
          }
        } else {
          parsedSpecs.push({ key: cleanLine, value: '' });
        }
      }
    }

    if (parsedSpecs.length === 0) {
      setQuickInputError('Không thể tìm thấy thuộc tính hợp lệ. Hãy kiểm tra lại định dạng JSON hoặc từng dòng dạng Key: Value.');
      return;
    }

    setSpecs([...specs, ...parsedSpecs]);
    setQuickInputText('');
    setShowQuickInput(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-2">
        <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400">Thông số kỹ thuật động (JSONB)</h3>
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
            onClick={addSpec}
            className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Icon name="plus" size={12} /> Thêm thông số mới
          </button>
        </div>
      </div>

      {showQuickInput && (
        <div className="p-4 bg-slate-50 dark:bg-zinc-950/40 border border-slate-250/60 dark:border-zinc-800 rounded-2xl space-y-3 animate-fade-in">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 block">
              Dán chuỗi JSON hoặc nhập từng dòng dạng: <code>Thuộc tính: Giá trị</code>
            </label>
            <textarea
              rows={3}
              value={quickInputText}
              onChange={(e) => setQuickInputText(e.target.value)}
              placeholder='VD: {"Chất liệu": "Gỗ tự nhiên", "Kích thước": "20 x 15 x 5 cm"}&#10;Hoặc:&#10;Xuất xứ: Việt Nam&#10;Màu sắc: Đỏ'
              className="w-full bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed"
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
        {specs.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Tên cột thuộc tính (VD: Chất liệu, Xuất xứ)"
              value={item.key}
              onChange={(e) => {
                const newSpecs = [...specs];
                newSpecs[idx].key = e.target.value;
                setSpecs(newSpecs);
              }}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 font-medium"
            />
            <input
              type="text"
              placeholder="Giá trị tương ứng (VD: Thủy tinh, Pháp)"
              value={item.value}
              onChange={(e) => {
                const newSpecs = [...specs];
                newSpecs[idx].value = e.target.value;
                setSpecs(newSpecs);
              }}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 font-medium"
            />
            <button
              type="button"
              onClick={() => removeSpec(idx)}
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
