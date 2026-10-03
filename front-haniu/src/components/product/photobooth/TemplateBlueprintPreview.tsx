'use client';

import React from 'react';
import { PhotoboothTemplate } from './types';

interface TemplateBlueprintPreviewProps {
  template: PhotoboothTemplate;
}

const SAMPLE_PREVIEW_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&auto=format&fit=crop&q=80',
];

export const TemplateBlueprintPreview: React.FC<TemplateBlueprintPreviewProps> = ({ template }) => {
  const t = template as any;
  let bgStyle: React.CSSProperties = {};

  if (t.backgroundType === 'gradient') {
    const grad = t.backgroundGradient || { color1: '#fda4af', color2: '#f43f5e', angle: 45 };
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

  const getResolvedFont = (font?: string) => {
    switch (font) {
      case 'Patrick Hand':
      case 'patrick-hand':
        return '"Patrick Hand", "Mali", cursive';
      case 'Caveat':
      case 'caveat':
        return '"Caveat", cursive';
      case 'Mali':
      case 'mali':
        return '"Mali", cursive';
      case 'Itim':
      case 'itim':
        return '"Itim", cursive';
      case 'Dancing Script':
      case 'dancing-script':
        return '"Dancing Script", cursive';
      case 'Be Vietnam Pro':
      case 'be-vietnam-pro':
        return '"Be Vietnam Pro", sans-serif';
      case 'Cormorant Garamond':
      case 'cormorant-garamond':
        return '"Cormorant Garamond", serif';
      default:
        return font || '"Patrick Hand", "Mali", cursive';
    }
  };

  // Safely parse layers and slots whether they come as array or JSON string
  const rawLayers: any[] = Array.isArray(t.layers)
    ? t.layers
    : typeof t.layers === 'string'
      ? (() => {
          try {
            return JSON.parse(t.layers);
          } catch {
            return [];
          }
        })()
      : [];

  const rawSlots: any[] = Array.isArray(t.slots)
    ? t.slots
    : typeof t.slots === 'string'
      ? (() => {
          try {
            return JSON.parse(t.slots);
          } catch {
            return [];
          }
        })()
      : [];

  // Sort layers by z-index layer priority: frame -> shape -> overlay -> sticker/logo -> text
  const sortedLayers = [...rawLayers].sort((a: any, b: any) => {
    const order: Record<string, number> = {
      frame: 1,
      shape: 2,
      overlay: 3,
      sticker: 4,
      logo: 4,
      text: 5,
    };
    return (order[a.type] || 3) - (order[b.type] || 3);
  });

  return (
    <div
      className="relative border border-slate-250/80 dark:border-zinc-800 rounded-xl overflow-hidden mb-3 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0 w-full"
      style={{
        aspectRatio: `${t.canvasWidth || 1000} / ${t.canvasHeight || 1500}`,
        borderWidth: (t.canvasBorderSize ?? 0) > 0 ? `${(t.canvasBorderSize ?? 0) * 0.15}px` : '1px',
        borderColor: (t.canvasBorderSize ?? 0) > 0 ? t.canvasBorderColor || '#ffffff' : undefined,
        borderStyle: t.canvasBorderStyle || 'solid',
        borderRadius: `${(t.canvasBorderRadius ?? 8) * 0.15}px`,
        containerType: 'inline-size',
        ...bgStyle,
      }}
    >
      {sortedLayers.length > 0 ? (
        sortedLayers.map((layer: any, idx: number) => {
          if (layer.visible === false) return null;

          const isFrame = layer.type === 'frame';
          const isText = layer.type === 'text';
          const isSticker = layer.type === 'sticker';
          const isLogo = layer.type === 'logo';
          const isShape = layer.type === 'shape';
          const isOverlay = layer.type === 'overlay';
          const baseRatio = 300 / (t.canvasWidth || 1000);

          const frameShape = layer.frameShape || 'rect';
          const borderRadius = isText
            ? (layer.bgRadius ?? 0) >= 999
              ? '9999px'
              : `calc(${(layer.bgRadius ?? 0) * baseRatio}cqw)`
            : isFrame && frameShape === 'circle'
              ? '9999px'
              : isFrame && frameShape !== 'rect' && frameShape !== 'custom' && frameShape !== 'custom-path'
                ? '0px'
                : `calc(${((layer.cornerRadius ?? 8) * baseRatio)}cqw)`;

          const clipPath =
            isFrame && frameShape === 'custom-path' && (layer.framePath || layer.framePolygon)
              ? layer.framePath
                ? `url(#clip-preview-layer-${layer.id || idx})`
                : `polygon(${layer.framePolygon})`
              : isFrame && frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom'
                ? frameShape === 'triangle'
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  : frameShape === 'heart'
                    ? 'polygon(50% 24%, 62% 10%, 78% 10%, 90% 20%, 94% 40%, 82% 65%, 50% 95%, 18% 65%, 6% 40%, 10% 20%, 26% 10%, 38% 24%)'
                    : frameShape === 'star'
                      ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                      : 'none'
                : isShape && (layer.shapeType === 'heart' || layer.shapeType === 'star' || layer.shapeType === 'triangle')
                  ? layer.shapeType === 'triangle'
                    ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    : layer.shapeType === 'heart'
                      ? 'polygon(50% 24%, 62% 10%, 78% 10%, 90% 20%, 94% 40%, 82% 65%, 50% 95%, 18% 65%, 6% 40%, 10% 20%, 26% 10%, 38% 24%)'
                      : 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  : 'none';

          // Flip transforms
          let transformStr = layer.rotation ? `rotate(${layer.rotation}deg)` : '';
          if (layer.flipX) transformStr += ' scaleX(-1)';
          if (layer.flipY) transformStr += ' scaleY(-1)';

          const frameShadow = isFrame && layer.shadowColor && layer.shadowColor !== 'rgba(0,0,0,0.0)' && layer.shadowColor !== 'none'
            ? `calc(${((layer.shadowOffsetX ?? 0) * baseRatio)}cqw) calc(${((layer.shadowOffsetY ?? 4) * baseRatio)}cqw) calc(${((layer.shadowBlur ?? 10) * baseRatio)}cqw) ${layer.shadowColor}`
            : 'none';

          return (
            <div
              key={layer.id || idx}
              className={`absolute flex items-center justify-center ${
                isText
                  ? 'overflow-visible bg-transparent'
                  : isFrame
                    ? 'overflow-hidden bg-slate-200 dark:bg-zinc-800'
                    : 'overflow-hidden bg-transparent'
              }`}
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                width: `${layer.width}%`,
                height: `${layer.height}%`,
                borderRadius,
                clipPath,
                borderWidth:
                  isFrame && (frameShape === 'rect' || frameShape === 'circle') && (layer.borderSize ?? 0) > 0
                    ? `calc(${((layer.borderSize ?? 4) * baseRatio)}cqw)`
                    : '0px',
                borderColor: isFrame ? layer.borderColor || '#ffffff' : 'transparent',
                borderStyle: isFrame && (layer.borderSize ?? 0) > 0 ? 'solid' : 'none',
                boxShadow: frameShadow,
                transform: transformStr || 'none',
                opacity: (layer.opacity ?? 100) / 100,
                zIndex: isText ? 25 : isSticker || isLogo ? 20 : isOverlay ? 15 : isShape ? 10 : 5,
              }}
            >
              {/* FRAME WITH REALISTIC DEMO PHOTO */}
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

                  {/* Sample Photo for Frame Mockup */}
                  {(() => {
                    const frameLayers = sortedLayers.filter((l: any) => l.type === 'frame');
                    const frameIdx = frameLayers.indexOf(layer);
                    const photoIdx = ((frameIdx >= 0 ? frameIdx : idx) + (t.name ? t.name.length : 0)) % SAMPLE_PREVIEW_PHOTOS.length;
                    return (
                      <img
                        src={SAMPLE_PREVIEW_PHOTOS[photoIdx]}
                        alt="sample photobooth preview"
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    );
                  })()}

                  {/* Custom Shape Border SVG overlay */}
                  {frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom' && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none z-15"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
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
                            frameShape === 'triangle'
                              ? '50 0, 0 100, 100 100'
                              : frameShape === 'heart'
                                ? '50 24, 62 10, 78 10, 90 20, 94 40, 82 65, 50 95, 18 65, 6 40, 10 20, 26 10, 38 24'
                                : frameShape === 'custom-path' && layer.framePolygon
                                  ? layer.framePolygon.replace(/%/g, '')
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

                  {/* Custom Mask URL */}
                  {frameShape === 'custom' && layer.frameMaskUrl && (
                    <img
                      src={layer.frameMaskUrl}
                      alt="mask"
                      className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10"
                    />
                  )}
                </>
              )}

              {/* TEXT LAYER */}
              {isText &&
                (() => {
                  const bgCol = layer.backgroundColor || layer.bg;
                  const hasBg = bgCol && bgCol !== 'transparent';
                  const baseRatio = 300 / (t.canvasWidth || 1000);
                  const radiusVal =
                    (layer.bgRadius ?? 0) >= 999
                      ? '9999px'
                      : `calc(${(layer.bgRadius ?? 0) * baseRatio}cqw)`;
                  const strokeWidth = (layer.strokeSize ?? 0) * baseRatio;
                  const strokeStyle =
                    (layer.strokeSize ?? 0) > 0
                      ? `calc(${strokeWidth}cqw) ${layer.strokeColor || '#ffffff'}`
                      : 'none';
                  const shadowX = (layer.shadowOffsetX || 0) * baseRatio;
                  const shadowY = (layer.shadowOffsetY || 1) * baseRatio;
                  const shadowBlur = (layer.shadowBlur || 2) * baseRatio;

                  return (
                    <div
                      className="w-full h-full flex items-center justify-center select-none overflow-visible"
                      style={{
                        backgroundColor: hasBg ? bgCol : 'transparent',
                        borderRadius: radiusVal,
                        borderWidth:
                          hasBg && (layer.bgBorderSize ?? 0) > 0
                            ? `calc(${Math.max(0.5, (layer.bgBorderSize ?? 0) * baseRatio)}cqw)`
                            : '0px',
                        borderColor: layer.bgBorderColor || '#ffffff',
                        borderStyle: (layer.bgBorderStyle as any) || 'solid',
                        boxShadow:
                          hasBg && layer.shadowColor
                            ? `calc(${shadowX}cqw) calc(${shadowY}cqw) calc(${shadowBlur}cqw) ${layer.shadowColor}`
                            : 'none',
                      }}
                    >
                      <span
                        className="w-full h-full flex items-center justify-center select-none whitespace-nowrap leading-none px-0.5"
                        style={{
                          fontSize: `calc(${((layer.fontSize || 24) * baseRatio)}cqw)`,
                          color: layer.fontColor || '#2b2b2b',
                          fontFamily: getResolvedFont(layer.fontFamily),
                          fontWeight: layer.fontWeight || 'normal',
                          fontStyle: layer.fontStyle || 'normal',
                          textAlign: (layer.align || 'center') as any,
                          letterSpacing: `${(layer.letterSpacing || 0) * baseRatio}cqw`,
                          WebkitTextStroke: strokeStyle,
                          paintOrder: 'stroke fill',
                        }}
                      >
                        {layer.text}
                      </span>
                    </div>
                  );
                })()}

              {/* STICKER LAYER */}
              {isSticker && layer.url && (
                <img
                  src={layer.url}
                  alt="sticker"
                  className="w-full h-full object-contain pointer-events-none"
                />
              )}

              {/* LOGO LAYER */}
              {isLogo && (
                <div className="flex items-center justify-center w-full h-full">
                  {layer.url ? (
                    <img
                      src={layer.url}
                      alt="logo"
                      className="max-h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <span
                      className="font-bold text-center block w-full truncate"
                      style={{
                        fontSize: `calc(${((layer.size || 20) * (300 / (t.canvasWidth || 1000)))}cqw)`,
                        color: layer.color || '#475569',
                      }}
                    >
                      {layer.logoText || '🎀'}
                    </span>
                  )}
                </div>
              )}

              {/* SHAPE LAYER */}
              {isShape && (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: layer.fillColor || '#fda4af',
                    borderWidth: `${layer.borderSize ?? 0}px`,
                    borderColor: layer.borderColor || '#f43f5e',
                    borderStyle: (layer.borderSize ?? 0) > 0 ? 'solid' : 'none',
                    borderRadius:
                      layer.shapeType === 'circle' ? '999px' : `${layer.cornerRadius ?? 8}px`,
                  }}
                />
              )}

              {/* OVERLAY LAYER */}
              {isOverlay && layer.url && (
                <img
                  src={layer.url}
                  alt="overlay"
                  className="w-full h-full object-fill pointer-events-none"
                />
              )}
            </div>
          );
        })
      ) : (
        rawSlots.map((slot: any, sIdx: number) => {
          const leftPct = (slot.x / (t.canvasWidth || 1000)) * 100;
          const topPct = (slot.y / (t.canvasHeight || 1500)) * 100;
          const widthPct = (slot.width / (t.canvasWidth || 1000)) * 100;
          const heightPct = (slot.height / (t.canvasHeight || 1500)) * 100;

          const frameShape = slot.frameShape || 'rect';
          const borderRadius =
            frameShape === 'circle'
              ? '999px'
              : frameShape !== 'rect' && frameShape !== 'custom' && frameShape !== 'custom-path'
                ? '0px'
                : `${slot.cornerRadius ?? 8}px`;

          const clipPath =
            frameShape === 'custom-path' && (slot.framePath || slot.framePolygon)
              ? slot.framePath
                ? `url(#clip-preview-${slot.id || sIdx})`
                : `polygon(${slot.framePolygon})`
              : frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom'
                ? frameShape === 'triangle'
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  : frameShape === 'heart'
                    ? 'polygon(50% 24%, 62% 10%, 78% 10%, 90% 20%, 94% 40%, 82% 65%, 50% 95%, 18% 65%, 6% 40%, 10% 20%, 26% 10%, 38% 24%)'
                    : frameShape === 'star'
                      ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                      : 'none'
                : 'none';

          return (
            <div
              key={sIdx}
              className="absolute overflow-hidden bg-slate-200 dark:bg-zinc-800 shadow-2xs"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                height: `${heightPct}%`,
                borderRadius,
                clipPath,
                borderWidth:
                  frameShape === 'rect' || frameShape === 'circle'
                    ? `${slot.borderSize ?? 1.5}px`
                    : '0px',
                borderColor: slot.borderColor || '#cbd5e1',
                borderStyle: (slot.borderSize ?? 1.5) > 0 ? 'solid' : 'none',
                transform: slot.rotation ? `rotate(${slot.rotation}deg)` : 'none',
                opacity: (slot.opacity ?? 100) / 100,
              }}
            >
              {/* Sample Photo for legacy slots */}
              <img
                src={SAMPLE_PREVIEW_PHOTOS[sIdx % SAMPLE_PREVIEW_PHOTOS.length]}
                alt="sample photo"
                className="w-full h-full object-cover pointer-events-none select-none"
              />

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
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-15"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
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
                        frameShape === 'triangle'
                          ? '50 0, 0 100, 100 100'
                          : frameShape === 'heart'
                            ? '50 24, 62 10, 78 10, 90 20, 94 40, 82 65, 50 95, 18 65, 6 40, 10 20, 26 10, 38 24'
                            : frameShape === 'custom-path' && slot.framePolygon
                              ? slot.framePolygon.replace(/%/g, '')
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

      {/* Template Level Overlay PNG if present */}
      {t.overlay && (
        <img
          src={t.overlay}
          alt="template overlay"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20"
        />
      )}
    </div>
  );
};
