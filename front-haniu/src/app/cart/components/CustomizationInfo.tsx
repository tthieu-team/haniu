'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface CustomizationInfoProps {
  info: string;
}

export default function CustomizationInfo({ info }: CustomizationInfoProps) {
  if (!info) return null;

  let parsed: Record<string, string> | null = null;
  try {
    const trimmed = info.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      parsed = JSON.parse(trimmed);
    }
  } catch (e) {
    // Parsing failed, will fallback to raw string
  }

  if (parsed) {
    const hasData = Object.entries(parsed).some(([key, val]) => val && val.trim() !== '');
    if (!hasData) return null;

    return (
      <div className="bg-rose-50/40 dark:bg-rose-950/10 p-3 rounded-xl border border-rose-100/30 dark:border-rose-900/20 text-xs text-slate-700 dark:text-zinc-300 space-y-1.5 mt-2 transition-all">
        <div className="font-bold flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-rose-500">
          <Icon name="palette" size={10} /> Cá nhân hóa thiết kế
        </div>
        <div className="grid grid-cols-1 gap-1 pl-3.5">
          {parsed.giftWrap && parsed.giftWrap.trim() !== "" && (
            <div className="text-[11px]">
              <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-semibold uppercase">Gói quà:</span>{' '}
              <span className="font-bold text-rose-500">{parsed.giftWrap}</span>
            </div>
          )}
          {parsed.cardMessage && parsed.cardMessage.trim() !== "" && (
            <div className="text-[11px]">
              <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-semibold uppercase">Lời chúc:</span>{' '}
              <span className="font-medium italic">“{parsed.cardMessage}”</span>
            </div>
          )}
          {parsed.engravingText && parsed.engravingText.trim() !== "" && (
            <div className="text-[11px]">
              <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-semibold uppercase">Khắc chữ:</span>{' '}
              <span className="font-bold text-slate-800 dark:text-zinc-200">“{parsed.engravingText}”</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback if customizationInfo is not JSON or has parsing issues
  return (
    <div className="bg-rose-50/40 dark:bg-rose-950/10 p-3 rounded-xl border border-rose-100/30 dark:border-rose-900/20 text-xs text-rose-500 space-y-1 mt-2">
      <div className="font-semibold flex items-center gap-1.5 text-[9px] uppercase tracking-wider">
        <Icon name="palette" size={10} /> Cá nhân hóa thiết kế
      </div>
      <p className="italic text-slate-600 dark:text-zinc-300 font-medium text-[11px] pl-3.5">“{info}”</p>
    </div>
  );
}
