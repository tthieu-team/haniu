'use client';

import React from 'react';
import { PhotoboothTemplate } from './types';

interface TemplateBlueprintPreviewProps {
  template: PhotoboothTemplate;
}

export const TemplateBlueprintPreview: React.FC<TemplateBlueprintPreviewProps> = ({ template }) => {
  const t = template as any;
  let bgStyle: React.CSSProperties = {};

  if (t.backgroundType === 'gradient') {
    const grad = (t as any).backgroundGradient || { color1: '#fda4af', color2: '#f43f5e', angle: 45 };
    bgStyle = {
      background: `linear-gradient(${grad.angle || 45}deg, ${grad.color1 || '#fda4af'}, ${grad.color2 || '#f43f5e'})`
    };
  } else if (
    t.backgroundType === 'image' ||
    t.background?.startsWith('http') ||
    t.background?.startsWith('/') ||
    t.background?.startsWith('data:')
  ) {
    bgStyle = {
      backgroundImage: `url(${t.background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  } else {
    bgStyle = {
      backgroundColor: t.background || '#ffffff'
    };
  }

  return (
    <div 
      className="relative border border-slate-250/80 dark:border-zinc-800 rounded-xl overflow-hidden mb-3 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0 w-full"
      style={{
        aspectRatio: `${t.canvasWidth} / ${t.canvasHeight}`,
        ...bgStyle
      }}
    >
      {t.slots?.map((slot: any, sIdx: number) => {
        const leftPct = (slot.x / t.canvasWidth) * 100;
        const topPct = (slot.y / t.canvasHeight) * 100;
        const widthPct = (slot.width / t.canvasWidth) * 100;
        const heightPct = (slot.height / t.canvasHeight) * 100;
        return (
          <div
            key={sIdx}
            className={`absolute border border-slate-350 dark:border-zinc-700 rounded-sm shadow-2xs ${
              t.showSlotBackground ? 'bg-white/95' : 'bg-transparent'
            }`}
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              width: `${widthPct}%`,
              height: `${heightPct}%`,
            }}
          />
        );
      })}
    </div>
  );
};
