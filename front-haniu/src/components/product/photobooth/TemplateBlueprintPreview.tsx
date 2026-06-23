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
      {t.layers && t.layers.length > 0 ? (
        t.layers.map((layer: any, idx: number) => {
          if (layer.visible === false) return null;
          
          const isFrame = layer.type === 'frame';
          const isText = layer.type === 'text';
          const isSticker = layer.type === 'sticker';
          const isLogo = layer.type === 'logo';
          const isShape = layer.type === 'shape';
          const isOverlay = layer.type === 'overlay';

          const frameShape = layer.frameShape || 'rect';
          const borderRadius = (isFrame && frameShape === 'circle') ? '999px' : (isFrame && frameShape !== 'rect' && frameShape !== 'custom' && frameShape !== 'custom-path' ? '0px' : `${layer.cornerRadius ?? 8}px`);
          const clipPath = isFrame && frameShape === 'custom-path' && (layer.framePath || layer.framePolygon)
            ? (layer.framePath ? `url(#clip-preview-layer-${layer.id || idx})` : `polygon(${layer.framePolygon})`)
            : (isFrame && frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom'
               ? (frameShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                  : frameShape === 'heart' ? 'polygon(50% 24%, 62% 10%, 78% 10%, 90% 20%, 94% 40%, 82% 65%, 50% 95%, 18% 65%, 6% 40%, 10% 20%, 26% 10%, 38% 24%)'
                  : frameShape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  : 'none')
               : 'none');
          
          return (
            <div
              key={layer.id || idx}
              className={`absolute flex items-center justify-center overflow-hidden ${
                isFrame ? (t.showSlotBackground ? 'bg-white/95' : 'bg-slate-300 dark:bg-zinc-700') : 'bg-transparent'
              }`}
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                width: `${layer.width}%`,
                height: `${layer.height}%`,
                borderRadius,
                clipPath,
                borderWidth: isFrame && (frameShape === 'rect' || frameShape === 'circle') ? `${layer.borderSize ?? 1.5}px` : '0px',
                borderColor: isFrame ? layer.borderColor || '#cbd5e1' : 'transparent',
                borderStyle: isFrame && (layer.borderSize ?? 1.5) > 0 ? 'solid' : 'none',
                transform: layer.rotation ? `rotate(${layer.rotation}deg)` : 'none',
                opacity: (layer.opacity ?? 100) / 100
              }}
            >
              {isFrame && (
                <>
                  {frameShape === 'custom-path' && layer.framePath && (
                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <clipPath id={`clip-preview-layer-${layer.id || idx}`} clipPathUnits="objectBoundingBox">
                          <path d={layer.framePath} transform="scale(0.01)" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                  {frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom' && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-15" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {frameShape === 'custom-path' && layer.framePath ? (
                        <path 
                          d={layer.framePath}
                          fill="none"
                          stroke={layer.borderColor || '#cbd5e1'}
                          strokeWidth={(layer.borderSize ?? 1.5) * 2}
                          vectorEffect="non-scaling-stroke"
                        />
                      ) : (
                        <polygon 
                          points={
                            frameShape === 'triangle' ? '50 0, 0 100, 100 100'
                            : frameShape === 'heart' ? '50 24, 62 10, 78 10, 90 20, 94 40, 82 65, 50 95, 18 65, 6 40, 10 20, 26 10, 38 24'
                            : frameShape === 'custom-path' && layer.framePolygon ? layer.framePolygon.replace(/%/g, '')
                            : '50 0, 61 35, 98 35, 68 57, 79 91, 50 70, 21 91, 32 57, 2 35, 39 35'
                          }
                          fill="none"
                          stroke={layer.borderColor || '#cbd5e1'}
                          strokeWidth={(layer.borderSize ?? 1.5) * 2}
                          vectorEffect="non-scaling-stroke"
                        />
                      )}
                    </svg>
                  )}
                  <span className="text-[8px] scale-75 text-slate-500 font-black">📸 {layer.order || idx + 1}</span>
                </>
              )}
              {isText && (
                <span 
                  className="block text-center truncate w-full px-1"
                  style={{
                    fontSize: `${(layer.fontSize || 24) * 0.08}px`,
                    color: layer.fontColor || '#1e293b',
                    fontFamily: layer.fontFamily || 'sans-serif',
                    fontWeight: layer.fontWeight || 'bold',
                    fontStyle: layer.fontStyle || 'normal',
                    textAlign: (layer.align || 'center') as any
                  }}
                >
                  {layer.text}
                </span>
              )}
              {isSticker && layer.url && (
                <img src={layer.url} alt="sticker" className="w-full h-full object-contain pointer-events-none" />
              )}
              {isLogo && (
                <div className="flex items-center justify-center w-full h-full">
                  {layer.url ? (
                    <img src={layer.url} alt="logo" className="max-h-full object-contain pointer-events-none" />
                  ) : (
                    <span 
                      className="font-bold text-center block w-full truncate"
                      style={{
                        fontSize: `${(layer.size || 20) * 0.08}px`,
                        color: layer.color || '#475569'
                      }}
                    >
                      {layer.logoText || '🎀'}
                    </span>
                  )}
                </div>
              )}
              {isShape && (
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundColor: layer.fillColor || '#fda4af',
                    borderWidth: `${layer.borderSize ?? 0}px`,
                    borderColor: layer.borderColor || '#f43f5e',
                    borderStyle: (layer.borderSize ?? 0) > 0 ? 'solid' : 'none',
                    borderRadius: layer.shapeType === 'circle' ? '999px' : `${layer.cornerRadius ?? 8}px`,
                    clipPath: layer.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                  }}
                >
                  {layer.shapeType === 'heart' && (
                    <div className="w-full h-full flex items-center justify-center text-red-500 text-[10px] sm:text-xs">❤️</div>
                  )}
                  {layer.shapeType === 'star' && (
                    <div className="w-full h-full flex items-center justify-center text-yellow-500 text-[10px] sm:text-xs">⭐</div>
                  )}
                </div>
              )}
              {isOverlay && layer.url && (
                <img src={layer.url} alt="overlay" className="w-full h-full object-fill pointer-events-none" />
              )}
            </div>
          );
        })
      ) : (
        t.slots?.map((slot: any, sIdx: number) => {
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
                borderStyle: (slot.borderSize ?? 1.5) > 0 ? 'solid' : 'none',
                transform: slot.rotation ? `rotate(${slot.rotation}deg)` : 'none',
                opacity: (slot.opacity ?? 100) / 100
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
        })
      )}
    </div>
  );
};
