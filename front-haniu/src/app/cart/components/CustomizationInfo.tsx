'use client';

import React from 'react';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';

interface CustomizationInfoProps {
  info: string;
}

export default function CustomizationInfo({ info }: CustomizationInfoProps) {
  if (!info) return null;

  let parsed: Record<string, any> | null = null;
  try {
    const trimmed = info.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      parsed = JSON.parse(trimmed);
    }
  } catch (e) {
    // Parsing failed, will fallback to raw string
  }

  const resolvePhotoUrl = (url: string) => {
    if (url && url.startsWith('local_pb_') && typeof window !== 'undefined') {
      return localStorage.getItem(`haniu_pb_${url}`) || '';
    }
    return getFullImageUrl(url) || '';
  };

  if (parsed) {
    const hasData = Object.entries(parsed).some(([key, val]) => val && (typeof val === 'string' ? val.trim() !== '' : Array.isArray(val) ? val.length > 0 : !!val));
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
          {/* Photobooth attached images */}
          {((parsed as any).photoboothPhotoUrls || (parsed as any).photoboothPhotoUrl) && (
            <div className="text-[11px] pt-1 space-y-1">
              <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-semibold uppercase block">Ảnh Photobooth đính kèm:</span>
              <div className="flex gap-2.5 overflow-x-auto py-1 custom-scrollbar">
                {(() => {
                  const urls = (parsed as any).photoboothPhotoUrls || 
                               (((parsed as any).photoboothPhotoUrl || '') as string).split(',').filter(Boolean);
                  return (Array.isArray(urls) ? urls : []).map((url: string, idx: number) => {
                    const resolved = resolvePhotoUrl(url);
                    if (!resolved) return null;
                    return (
                      <div key={idx} className="relative w-10 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 shrink-0 shadow-xs">
                        <img src={resolved} className="w-full h-full object-cover" alt="Custom photobooth print" />
                      </div>
                    );
                  });
                })()}
              </div>
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
