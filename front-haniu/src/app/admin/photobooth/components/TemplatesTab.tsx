'use client';

import React, { useState } from 'react';
import Icon from '@/components/common/Icons';

interface TemplatesTabProps {
  templates: any[];
  events: any[];
  onToggleStatus: (id: string) => void;
  onOpenAdd: () => void;
  onOpenEdit: (tpl: any) => void;
  onClone: (tpl: any) => void;
  onDelete: (id: string) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  templates,
  events,
  onToggleStatus,
  onOpenAdd,
  onOpenEdit,
  onClone,
  onDelete
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

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
                    <div 
                      className="shadow-md border border-slate-300 rounded relative"
                      style={{
                        width: tpl.canvasWidth > tpl.canvasHeight ? '140px' : '90px',
                        height: tpl.canvasWidth > tpl.canvasHeight ? '90px' : '140px',
                        backgroundColor: tpl.background || '#ffffff',
                        backgroundImage: (tpl.background?.startsWith('http') || tpl.background?.startsWith('data:')) ? `url(${tpl.background})` : 'none',
                        backgroundSize: 'cover',
                        padding: '3px'
                      }}
                    >
                      {/* Nested layers visualization inside card */}
                      {tpl.layers?.map((layer: any, idx: number) => {
                        if (layer.visible === false) return null;
                        return (
                          <div 
                            key={layer.id}
                            className={`absolute flex items-center justify-center border-[0.5px] ${
                              layer.type === 'frame' ? 'bg-slate-350 dark:bg-zinc-700 border-white text-[6px]' : 'bg-transparent border-transparent'
                            }`}
                            style={{
                              left: `${layer.x}%`,
                              top: `${layer.y}%`,
                              width: `${layer.width}%`,
                              height: `${layer.height}%`,
                              borderRadius: layer.type === 'frame' ? `${(layer.cornerRadius || 2) / 3}px` : '0px'
                            }}
                          >
                            {layer.type === 'frame' && `📸 ${layer.order || idx + 1}`}
                          </div>
                        );
                      })}
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
                        <span key={ev.id} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-650 dark:text-zinc-350 text-[9px] font-semibold">
                          🎉 {ev.name}
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
                  position: 'relative'
                }}
              >
                {previewTemplate.layers?.map((layer: any, idx: number) => {
                  if (layer.visible === false) return null;
                  
                  const isFrame = layer.type === 'frame';
                  const isText = layer.type === 'text';
                  const isSticker = layer.type === 'sticker';
                  const isLogo = layer.type === 'logo';
                  const isShape = layer.type === 'shape';

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
                      {isText && (
                        <span 
                          className="block text-center truncate w-full font-bold px-1"
                          style={{
                            fontSize: `${(layer.fontSize || 24) * 0.08}px`,
                            color: layer.fontColor || '#1e293b',
                            fontFamily: layer.fontFamily || 'sans-serif',
                            fontWeight: layer.fontWeight || 'bold',
                            fontStyle: layer.fontStyle || 'italic',
                            textAlign: (layer.align || 'center') as any
                          }}
                        >
                          {layer.text}
                        </span>
                      )}

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
                                fontSize: `${(layer.size || 20) * 0.08}px`,
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
                            <div className="w-full h-full flex items-center justify-center text-red-500 text-xs">❤️</div>
                          )}
                          {layer.shapeType === 'star' && (
                            <div className="w-full h-full flex items-center justify-center text-yellow-500 text-xs">⭐</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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
