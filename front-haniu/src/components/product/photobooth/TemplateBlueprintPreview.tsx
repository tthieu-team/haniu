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

        const frameShape = slot.frameShape || 'rect';
        const borderRadius = frameShape === 'circle' ? '999px' : (frameShape !== 'rect' && frameShape !== 'custom' && frameShape !== 'custom-path' ? '0px' : `${slot.cornerRadius ?? 8}px`);

        const clipPath = frameShape === 'custom-path' && (slot.framePath || slot.framePolygon)
          ? (slot.framePath ? `url(#clip-preview-${slot.id || sIdx})` : `polygon(${slot.framePolygon})`)
          : (frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom'
             ? (frameShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                : frameShape === 'heart' ? 'polygon(50% 24%, 62% 10%, 78% 10%, 90% 20%, 94% 40%, 82% 65%, 50% 95%, 18% 65%, 6% 40%, 10% 20%, 26% 10%, 38% 24%)'
                : frameShape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                : 'none')
             : 'none');

        return (
          <div
            key={sIdx}
            className={`absolute shadow-2xs ${
              t.showSlotBackground ? 'bg-white/95' : 'bg-transparent'
            }`}
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              width: `${widthPct}%`,
              height: `${heightPct}%`,
              borderRadius,
              clipPath,
              borderWidth: (frameShape === 'rect' || frameShape === 'circle') ? `${slot.borderSize ?? 1.5}px` : '0px',
              borderColor: slot.borderColor || '#cbd5e1',
              borderStyle: (slot.borderSize ?? 1.5) > 0 ? 'solid' : 'none'
            }}
          >
            {frameShape === 'custom-path' && slot.framePath && (
              <svg width="0" height="0" className="absolute">
                <defs>
                  <clipPath id={`clip-preview-${slot.id || sIdx}`} clipPathUnits="objectBoundingBox">
                    <path d={slot.framePath} transform="scale(0.01)" />
                  </clipPath>
                </defs>
              </svg>
            )}
            {frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom' && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-15" viewBox="0 0 100 100" preserveAspectRatio="none">
                {frameShape === 'custom-path' && slot.framePath ? (
                  <path 
                    d={slot.framePath}
                    fill="none"
                    stroke={slot.borderColor || '#cbd5e1'}
                    strokeWidth={(slot.borderSize ?? 1.5) * 2}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : (
                  <polygon 
                    points={
                      frameShape === 'triangle' ? '50 0, 0 100, 100 100'
                      : frameShape === 'heart' ? '50 24, 62 10, 78 10, 90 20, 94 40, 82 65, 50 95, 18 65, 6 40, 10 20, 26 10, 38 24'
                      : frameShape === 'custom-path' && slot.framePolygon ? slot.framePolygon.replace(/%/g, '')
                      : '50 0, 61 35, 98 35, 68 57, 79 91, 50 70, 21 91, 32 57, 2 35, 39 35'
                    }
                    fill="none"
                    stroke={slot.borderColor || '#cbd5e1'}
                    strokeWidth={(slot.borderSize ?? 1.5) * 2}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};
