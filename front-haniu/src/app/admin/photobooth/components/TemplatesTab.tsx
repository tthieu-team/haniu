'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/common/Icons';
import { TemplateBlueprintPreview } from '@/components/product/photobooth/TemplateBlueprintPreview';

interface TemplatesTabProps {
  templates: any[];
  events: any[];
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  onToggleStatus: (id: string) => void;
  onOpenAdd: () => void;
  onOpenEdit: (tpl: any) => void;
  onClone: (tpl: any) => void;
  onDelete: (id: string) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  templates,
  events,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
  onToggleStatus,
  onOpenAdd,
  onOpenEdit,
  onClone,
  onDelete
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Intersection observer for smooth infinite scrolling
  useEffect(() => {
    if (!hasMore || loadingMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    const currentEl = observerRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [hasMore, loadingMore, onLoadMore]);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Vừa xong';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  // Helper to get events using a template
  const getUsingEvents = (tplId: string) => {
    return events.filter((ev: any) => {
      if (ev.templateIds && Array.isArray(ev.templateIds)) {
        return ev.templateIds.includes(tplId);
      }
      return ev.templateId === tplId;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200">Mẫu Bố Cục Photobooth (Templates)</h3>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">Bố cục ảnh, sticker dán kèm, logos watermark và số lượng ảnh cần chụp tương ứng.</p>
        </div>
        <button 
          onClick={onOpenAdd}
          className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <Icon name="palette" size={12} />
          Tự Thiết Kế Layout
        </button>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const frameCount = (tpl.layers || []).filter((l: any) => l.type === 'frame').length;
          const usingEvents = getUsingEvents(tpl.id);
          const isActive = tpl.status === 'ACTIVE';

          return (
            <div key={tpl.id} className="bg-slate-50 dark:bg-zinc-850/50 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col justify-between group hover:shadow-lg transition-all">
              <div>
                
                {/* Visual Thumbnail or Mini CSS Canvas */}
                <div className="w-full h-44 bg-slate-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center p-3 mb-4 overflow-hidden border border-slate-300 dark:border-zinc-700 relative">
                  {tpl.thumbnail ? (
                    <img 
                      src={tpl.thumbnail} 
                      alt={tpl.name} 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-200" 
                    />
                  ) : (
                    <div className="w-full h-full max-w-[130px] flex items-center justify-center pointer-events-none select-none">
                      <TemplateBlueprintPreview template={tpl} />
                    </div>
                  )}

                  {/* Absolute active/inactive badge overlay */}
                  <button 
                    onClick={() => onToggleStatus(tpl.id)}
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer shadow-sm transition-all active:scale-95 ${
                      isActive 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
                  >
                    {isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </button>
                </div>

                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-black text-slate-800 dark:text-zinc-200 uppercase tracking-tight truncate max-w-[70%]">
                    {tpl.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 dark:text-rose-450 text-[8px] font-black uppercase tracking-wider shrink-0">
                    {frameCount} Khung Hình
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 line-clamp-1 mb-2 font-medium">
                  {tpl.description || 'Chưa có mô tả cho template này.'}
                </p>

                {/* Event usage section */}
                <div className="space-y-1 mb-4">
                  <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    Sự kiện đang sử dụng:
                  </div>
                  {usingEvents.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {usingEvents.map((ev: any) => (
                        <span key={ev.id} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-650 dark:text-zinc-350 text-[9px] font-semibold flex items-center gap-1">
                          <Icon name="party" size={10} className="text-rose-500" />
                          <span>{ev.name}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[9px] italic text-slate-400">Không có sự kiện nào áp dụng</span>
                  )}
                </div>

              </div>

              {/* Bottom Actions card bar */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-slate-400">Kích thước: {tpl.canvasWidth}x{tpl.canvasHeight}</span>
                  <span className="text-[8px] text-slate-400 font-medium">Cập nhật: {formatDate(tpl.updatedAt || tpl.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setPreviewTemplate(tpl)}
                    className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-black uppercase tracking-wider cursor-pointer"
                    title="Xem trước kết quả in"
                  >
                    Xem trước
                  </button>
                  <button 
                    onClick={() => onOpenEdit(tpl)}
                    className="px-2 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-rose-500/10 border border-slate-250 dark:border-zinc-750 text-slate-700 hover:text-rose-600 dark:text-zinc-300 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => onClone(tpl)}
                    className="px-2 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-amber-500/10 border border-slate-250 dark:border-zinc-750 text-slate-700 hover:text-amber-500 dark:text-zinc-300 text-[9px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Nhân bản
                  </button>
                  <button 
                    onClick={() => onDelete(tpl.id)}
                    className="p-1.5 rounded-lg border border-red-200 bg-red-500/5 hover:bg-red-500/10 text-red-500 cursor-pointer"
                    title="Xóa layout"
                  >
                    <Icon name="trash" size={11} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite Scroll Loader & Sentinel */}
      {loadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-100 dark:bg-zinc-800/40 rounded-3xl p-5 border border-slate-200/50 dark:border-zinc-800 flex flex-col justify-between h-[300px]">
              <div className="w-full h-44 bg-slate-200 dark:bg-zinc-700/50 rounded-2xl mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-zinc-700/50 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-zinc-700/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Sentinel for triggering loadMore */}
      <div ref={observerRef} className="h-4 w-full" />

      {/* End of list badge */}
      {!hasMore && templates.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase bg-slate-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 flex items-center gap-1.5">
            <Icon name="check" size={12} className="text-emerald-500" />
            <span>Đã hiển thị tất cả ({templates.length}) mẫu layout</span>
          </span>
        </div>
      )}

      {/* VISUAL RENDER PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-850 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100">Xem Trước Thành Phẩm</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{previewTemplate.name}</p>
              </div>
              <button 
                onClick={() => setPreviewTemplate(null)} 
                className="p-2 text-slate-400 hover:text-slate-650 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            {/* Simulated rendered canvas with mock photoshoot images */}
            <div className="p-6 bg-slate-100 dark:bg-zinc-950 flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
              <div 
                className="relative shadow-xl rounded-lg overflow-hidden transition-all"
                style={{
                  width: previewTemplate.canvasWidth > previewTemplate.canvasHeight ? '300px' : '200px',
                  height: previewTemplate.canvasWidth > previewTemplate.canvasHeight ? '200px' : '300px',
                  backgroundColor: previewTemplate.background?.startsWith('#') ? previewTemplate.background : '#ffffff',
                  backgroundImage: (previewTemplate.background?.startsWith('http') || previewTemplate.background?.startsWith('data:')) ? `url(${previewTemplate.background})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  containerType: 'inline-size',
                }}
              >
                {previewTemplate.layers?.map((layer: any, idx: number) => {
                  if (layer.visible === false) return null;
                  
                  const isFrame = layer.type === 'frame';
                  const isText = layer.type === 'text';
                  const isSticker = layer.type === 'sticker';
                  const isLogo = layer.type === 'logo';
                  const isShape = layer.type === 'shape';
                  const isOverlay = layer.type === 'overlay';

                  const shadowStyle = layer.shadowColor 
                    ? `${layer.shadowOffsetX || 0}px ${layer.shadowOffsetY || 4}px ${layer.shadowBlur || 10}px ${layer.shadowColor}` 
                    : 'none';

                  return (
                    <div
                      key={layer.id}
                      className="absolute flex items-center justify-center overflow-hidden"
                      style={{
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        width: `${layer.width}%`,
                        height: `${layer.height}%`,
                        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : 'none',
                        opacity: (layer.opacity ?? 100) / 100,
                        boxShadow: layer.type !== 'frame' ? shadowStyle : 'none'
                      }}
                    >
                      {/* Frame: Simulate cute placeholder image */}
                      {isFrame && (
                        <>
                          {layer.frameShape === 'custom-path' && layer.framePath && (
                            <svg width="0" height="0" className="absolute">
                              <defs>
                                <clipPath id={`clip-tab-${layer.id}`} clipPathUnits="objectBoundingBox">
                                  <path d={layer.framePath} transform="scale(0.01)" />
                                </clipPath>
                              </defs>
                            </svg>
                          )}
                          <div 
                            className="w-full h-full flex flex-col items-center justify-center text-slate-455 border relative"
                            style={{
                              borderWidth: (layer.frameShape === 'rect' || layer.frameShape === 'circle') ? `${layer.borderSize ?? 4}px` : '0px',
                              borderColor: layer.borderColor || '#ffffff',
                              borderRadius: layer.frameShape === 'circle' ? '999px' : (layer.frameShape && layer.frameShape !== 'rect' && layer.frameShape !== 'custom' && layer.frameShape !== 'custom-path' ? '0px' : `${layer.cornerRadius ?? 8}px`),
                              clipPath: layer.frameShape === 'custom-path'
                                ? (layer.framePath ? `url(#clip-tab-${layer.id})` : (layer.framePolygon ? `polygon(${layer.framePolygon})` : 'none'))
                                : (layer.frameShape && layer.frameShape !== 'rect' && layer.frameShape !== 'circle' && layer.frameShape !== 'custom'
                                   ? (layer.frameShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                                      : layer.frameShape === 'heart' ? 'polygon(50% 24%, 62% 10%, 78% 10%, 90% 20%, 94% 40%, 82% 65%, 50% 95%, 18% 65%, 6% 40%, 10% 20%, 26% 10%, 38% 24%)'
                                      : 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)')
                                   : 'none'),
                              boxShadow: shadowStyle,
                              // Premium mock background for portrait photography
                              background: 'linear-gradient(to bottom, #dbeafe, #eff6ff)',
                              backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          >
                            {layer.frameShape === 'custom' && layer.frameMaskUrl && (
                              <img 
                                src={layer.frameMaskUrl} 
                                alt="custom mask" 
                                className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10 animate-fade-in" 
                              />
                            )}
                            {layer.frameShape && layer.frameShape !== 'rect' && layer.frameShape !== 'circle' && layer.frameShape !== 'custom' && (
                               <svg className="absolute inset-0 w-full h-full pointer-events-none z-15" viewBox="0 0 100 100" preserveAspectRatio="none">
                                 {layer.frameShape === 'custom-path' && layer.framePath ? (
                                   <path 
                                     d={layer.framePath}
                                     fill="none"
                                     stroke={layer.borderColor || '#ffffff'}
                                     strokeWidth={(layer.borderSize ?? 4) * 2}
                                     vectorEffect="non-scaling-stroke"
                                   />
                                 ) : (
                                   <polygon 
                                     points={
                                       layer.frameShape === 'triangle' ? '50 0, 0 100, 100 100'
                                       : layer.frameShape === 'heart' ? '50 24, 62 10, 78 10, 90 20, 94 40, 82 65, 50 95, 18 65, 6 40, 10 20, 26 10, 38 24'
                                       : layer.frameShape === 'custom-path' && layer.framePolygon ? layer.framePolygon.replace(/%/g, '')
                                       : '50 0, 61 35, 98 35, 68 57, 79 91, 50 70, 21 91, 32 57, 2 35, 39 35'
                                     }
                                     fill="none"
                                     stroke={layer.borderColor || '#ffffff'}
                                     strokeWidth={(layer.borderSize ?? 4) * 2}
                                     vectorEffect="non-scaling-stroke"
                                   />
                                 )}
                               </svg>
                             )}
                            {/* Order Indicator */}
                            <span className="absolute top-1 left-1 bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-black z-20">
                              {layer.order || 1}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Text */}
                      {isText && (() => {
                        const bgCol = layer.backgroundColor || layer.bg;
                        const hasBg = bgCol && bgCol !== 'transparent';
                        const baseRatio = 300 / (previewTemplate.canvasWidth || 1000);
                        const radiusVal = (layer.bgRadius ?? 0) >= 999 ? '9999px' : `calc(${(layer.bgRadius ?? 0) * baseRatio}cqw)`;
                        return (
                          <div 
                            className="w-full h-full flex items-center justify-center select-none overflow-hidden"
                            style={{
                              backgroundColor: hasBg ? bgCol : 'transparent',
                              borderRadius: radiusVal,
                            }}
                          >
                            <span 
                              className="w-full h-full flex items-center justify-center select-none whitespace-nowrap leading-none px-0.5"
                              style={{
                                fontSize: `calc(${((layer.fontSize || 24) * baseRatio)}cqw)`,
                                color: layer.fontColor || '#2b2b2b',
                                fontFamily: layer.fontFamily ? `"${layer.fontFamily}", cursive` : '"Patrick Hand", cursive',
                                fontWeight: layer.fontWeight || 'normal',
                                fontStyle: layer.fontStyle || 'normal',
                                textAlign: (layer.align || 'center') as any
                              }}
                            >
                              {layer.text}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Sticker */}
                      {isSticker && (
                        <img 
                          src={layer.url} 
                          alt="sticker" 
                          className="w-full h-full object-contain"
                        />
                      )}

                      {/* Logo */}
                      {isLogo && (
                        <div className="flex items-center justify-center w-full h-full">
                          {layer.url ? (
                            <img src={layer.url} alt="logo" className="max-h-full object-contain" />
                          ) : (
                            <span 
                              className="font-bold text-center block w-full truncate"
                              style={{
                                fontSize: `calc(${((layer.size || 20) * (300 / (previewTemplate.canvasWidth || 1000)))}cqw)`,
                                color: layer.color || '#475569'
                              }}
                            >
                              {layer.logoText}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Shape */}
                      {isShape && (
                        <div 
                          className="w-full h-full"
                          style={{
                            backgroundColor: layer.fillColor || '#fda4af',
                            borderWidth: `${layer.borderSize ?? 0}px`,
                            borderColor: layer.borderColor || '#f43f5e',
                            borderStyle: layer.borderSize > 0 ? 'solid' : 'none',
                            borderRadius: layer.shapeType === 'circle' ? '999px' : `${layer.cornerRadius ?? 8}px`,
                            clipPath: layer.shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                          }}
                        >
                          {layer.shapeType === 'heart' && (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon name="heart" size={12} className="text-red-500 fill-red-500" />
                            </div>
                          )}
                          {layer.shapeType === 'star' && (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon name="star" size={12} className="text-amber-400 fill-amber-400" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Overlay */}
                      {isOverlay && layer.url && (
                        <img 
                          src={layer.url} 
                          alt="overlay" 
                          className="w-full h-full object-fill pointer-events-none"
                        />
                      )}
                    </div>
                  );
                })}
                {/* Overlay visualization inside preview modal */}
                {previewTemplate.overlay && (
                  <img 
                    src={previewTemplate.overlay} 
                    alt="preview overlay" 
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20"
                  />
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-850 flex justify-end">
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
              >
                Đóng xem trước
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
