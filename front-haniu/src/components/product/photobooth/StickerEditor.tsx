'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { Sticker } from './types';
import { playSound } from './sounds';
import { useTranslate } from '@/lib/translator';

interface StickerEditorProps {
  imageUrl: string;
  initialStickers?: Sticker[];
  onConfirm: (stickers: Sticker[]) => void;
  onCancel: () => void;
}

const STICKER_OPTIONS = [
  { id: 's1', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Heart_with_ribbon/3D/heart_with_ribbon_3d.png' },
  { id: 's2', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Sparkles/3D/sparkles_3d.png' },
  { id: 's3', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Party_popper/3D/party_popper_3d.png' },
  { id: 's4', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Crown/3D/crown_3d.png' },
  { id: 's5', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Fire/3D/fire_3d.png' },
  { id: 's6', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Birthday_cake/3D/birthday_cake_3d.png' },
  { id: 's7', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Teddy_bear/3D/teddy_bear_3d.png' },
  { id: 's8', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Rose/3D/rose_3d.png' },
  { id: 's9', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Smiling_face_with_heart-eyes/3D/smiling_face_with_heart-eyes_3d.png' },
  { id: 's10', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Glowing_star/3D/glowing_star_3d.png' },
  { id: 's11', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Rainbow/3D/rainbow_3d.png' },
  { id: 's12', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Cherry_blossom/3D/cherry_blossom_3d.png' },
  { id: 's13', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Sun_with_face/3D/sun_with_face_3d.png' },
  { id: 's14', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Ghost/3D/ghost_3d.png' },
  { id: 's15', url: 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Unicorn/3D/unicorn_3d.png' },
];

const EMOJI_LIST = [
  '😊', '🥰', '😂', '😘', '🤪', '😎', '🥳', '🥺', '😴', '😇',
  '❤️', '💖', '💕', '💗', '💘', '💌', '🌹', '🎈', '🎉', '🧸',
  '✨', '🌟', '🌈', '🍀', '🎀', '👑', '🦄', '🍿', '🧁', '🍕',
  '🐱', '🐶', '🐰', '🐼', '🦊', '🐨', '🐯', '🦁', '🦉', '🦋'
];

const DECORATIVE_ICONS = ['heart', 'star', 'sparkles', 'gem', 'gift', 'party', 'cake', 'camera', 'sun', 'moon', 'leaf'];

const DEFAULT_ICON_COLORS: Record<string, string> = {
  heart: '#e11d48',
  star: '#eab308',
  sparkles: '#f59e0b',
  gem: '#06b6d4',
  gift: '#3b82f6',
  party: '#ec4899',
  cake: '#a855f7',
  camera: '#10b981',
  sun: '#eab308',
  moon: '#6366f1',
  leaf: '#22c55e'
};

export const AVAILABLE_STICKER_FONTS = [
  { id: 'Patrick Hand', name: 'Patrick Hand (Viết tay)', font: '"Patrick Hand", cursive' },
  { id: 'Caveat', name: 'Caveat (Bút dạ)', font: '"Caveat", cursive' },
  { id: 'Mali', name: 'Mali (Tròn ngộ nghĩnh)', font: '"Mali", cursive' },
  { id: 'Itim', name: 'Itim (Bút lông học sinh)', font: '"Itim", cursive' },
  { id: 'Dancing Script', name: 'Dancing Script (Uốn lượn)', font: '"Dancing Script", cursive' },
  { id: 'Be Vietnam Pro', name: 'Be Vietnam Pro (Hiện đại)', font: '"Be Vietnam Pro", sans-serif' },
  { id: 'Cormorant Garamond', name: 'Cormorant (Cổ điển)', font: '"Cormorant Garamond", serif' },
];

export const resolveFontFamily = (font?: string) => {
  switch (font) {
    case 'Patrick Hand': return '"Patrick Hand", "Mali", cursive';
    case 'Caveat': return '"Caveat", cursive';
    case 'Mali': return '"Mali", cursive';
    case 'Itim': return '"Itim", cursive';
    case 'Dancing Script': return '"Dancing Script", cursive';
    case 'Be Vietnam Pro': return '"Be Vietnam Pro", sans-serif';
    case 'Cormorant Garamond': return '"Cormorant Garamond", serif';
    default: return font || 'inherit';
  }
};

const splitGraphemes = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    const seg = new (Intl as any).Segmenter('en', { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s: any) => s.segment).filter((c: string) => c.trim() !== '');
  }
  return Array.from(text).filter((c: string) => c.trim() !== '');
};

export const StickerEditor: React.FC<StickerEditorProps> = ({ imageUrl, initialStickers, onConfirm, onCancel }) => {
  const trans = useTranslate();
  const [stickers, setStickers] = useState<Sticker[]>(initialStickers || []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customIcon, setCustomIcon] = useState('');
  const [customLayout, setCustomLayout] = useState<'horizontal' | 'vertical' | 'grid'>('horizontal');
  const [customSpacing, setCustomSpacing] = useState<number>(4);
  const [customOpacity, setCustomOpacity] = useState<number>(1.0);
  const [customStrokeWidth, setCustomStrokeWidth] = useState<number>(2);
  const [customFontWeight, setCustomFontWeight] = useState<'thin' | 'normal' | 'bold'>('normal');
  const [customFontFamily, setCustomFontFamily] = useState<string>('Patrick Hand');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'icons' | 'emoji' | 'custom'>('icons');
  const [adjustTab, setAdjustTab] = useState<'transform' | 'style' | 'align' | 'layout'>('transform');
  const [lastClickPos, setLastClickPos] = useState({ x: 50, y: 50 });

  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastClickRef = useRef<number>(0);

  const addSticker = (url: string, extra?: Partial<Sticker>) => {
    playSound('click');
    const newSticker: Sticker = {
      id: 'stk-' + Date.now(),
      url,
      x: lastClickPos.x,
      y: lastClickPos.y,
      scale: 1,
      rotation: 0,
      opacity: extra?.opacity ?? 1,
      strokeWidth: extra?.strokeWidth ?? (url.startsWith('icon:') ? customStrokeWidth : 2),
      fontWeight: extra?.fontWeight ?? customFontWeight,
      fontFamily: extra?.fontFamily ?? customFontFamily,
      layout: extra?.layout ?? 'horizontal',
      spacing: extra?.spacing ?? 4,
      textAlign: extra?.textAlign ?? 'center',
      textBaseline: extra?.textBaseline ?? 'middle',
      shadowColor: extra?.shadowColor ?? 'rgba(0,0,0,0.25)',
      shadowBlur: extra?.shadowBlur ?? 10,
      ...extra
    };
    setStickers(prev => [...prev, newSticker]);
    setSelectedId(newSticker.id);
    setIsLibraryOpen(false);
  };

  const handleCanvasClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || !imageRef.current) return;

    const target = e.target as HTMLElement;
    if (target.closest('.sticker-item')) return;

    const now = Date.now();
    const isDoubleClick = now - lastClickRef.current < 300;
    lastClickRef.current = now;

    if (!isDoubleClick) {
      setSelectedId(null);
      return;
    }

    const rect = imageRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      setLastClickPos({ x, y });
      setIsLibraryOpen(true);
      setSelectedId(null);
    }
  };

  const handleCustomIconSubmit = () => {
    if (customIcon.trim()) {
      addSticker(customIcon.trim(), {
        layout: customLayout,
        spacing: customSpacing,
        opacity: customOpacity,
        strokeWidth: customStrokeWidth,
        fontWeight: customFontWeight,
        fontFamily: customFontFamily
      });
      setCustomIcon('');
    }
  };

  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    setStickers(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      const nextIdx = direction === 'up' ? idx + 1 : idx - 1;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const n = [...prev];
      [n[idx], n[nextIdx]] = [n[nextIdx], n[idx]];
      return n;
    });
  };

  const handleStickerDragStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation();
    const isTouch = 'touches' in e;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const startX = clientX;
    const startY = clientY;

    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;

    const currentX = sticker.x;
    const currentY = sticker.y;

    const handleStickerDragMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveIsTouch = 'touches' in moveEvent;
      const moveClientX = moveIsTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveClientY = moveIsTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const deltaX = ((moveClientX - startX) / rect.width) * 100;
      const deltaY = ((moveClientY - startY) / rect.height) * 100;

      const newX = Math.max(0, Math.min(100, currentX + deltaX));
      const newY = Math.max(0, Math.min(100, currentY + deltaY));

      updateSticker(id, { x: newX, y: newY });
    };

    const handleStickerDragEnd = () => {
      window.removeEventListener('mousemove', handleStickerDragMove);
      window.removeEventListener('mouseup', handleStickerDragEnd);
      window.removeEventListener('touchmove', handleStickerDragMove);
      window.removeEventListener('touchend', handleStickerDragEnd);
    };

    window.addEventListener('mousemove', handleStickerDragMove);
    window.addEventListener('mouseup', handleStickerDragEnd);
    window.addEventListener('touchmove', handleStickerDragMove);
    window.addEventListener('touchend', handleStickerDragEnd);
  };

  const selectedSticker = stickers.find(s => s.id === selectedId);
  const isEmoji = (url: string) => !url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/') && !url.startsWith('blob:') && !url.startsWith('icon:');

  return (
    <div className="w-full h-full bg-background flex flex-col relative overflow-hidden transition-colors duration-550 min-h-0">
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between bg-gradient-to-b from-white dark:from-zinc-950 to-transparent pointer-events-none">
        <button
          onClick={onCancel}
          className="h-9 px-4 rounded-full bg-card-bg border border-border-color text-foreground hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 pointer-events-auto cursor-pointer shadow-xs"
        >
          <Icon name="arrow-left" size={12} />
          <span>{trans('Quay lại')}</span>
        </button>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => { setStickers([]); setSelectedId(null); }}
            className="px-3 py-2 rounded-xl bg-card-bg border border-border-color text-foreground hover:bg-rose-500/10 dark:hover:bg-rose-500/20 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Icon name="refresh" size={11} />
            <span>{trans('Xóa hết')}</span>
          </button>
          <button
            disabled={isProcessing}
            onClick={async () => {
              setIsProcessing(true);
              try { await onConfirm(stickers); }
              finally { setIsProcessing(false); }
            }}
            className="px-5 py-2 rounded-xl bg-rose-600 dark:bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
            ) : (
              <Icon name="check" size={12} />
            )}
            <span>{trans('Lưu ảnh')}</span>
          </button>
        </div>
      </div>

      {/* Drawing Canvas Board */}
      <div
        className="flex-1 w-full overflow-y-auto overflow-x-auto p-4 sm:p-6 flex flex-col items-center custom-scrollbar overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onClick={() => setSelectedId(null)}
      >
        <div
          className={`my-auto py-8 sm:py-6 flex flex-col items-center justify-center transition-all duration-300 w-full min-h-min ${
            selectedSticker ? 'pb-64 sm:pb-48' : 'pb-24 sm:pb-12'
          }`}
        >
          <div
            ref={containerRef}
            className="relative block w-fit h-fit mx-auto shadow-xl select-none"
            style={{ touchAction: 'pan-y pan-x' }}
            onClick={(e) => {
              e.stopPropagation();
              handleCanvasClick(e);
            }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Work photo preview"
              className="max-w-[92vw] sm:max-w-[85vw] max-h-[62vh] sm:max-h-[68vh] h-auto w-auto block rounded-2xl border border-border-color pointer-events-none select-none bg-card-bg shadow-sm"
            />

            <AnimatePresence>
              {stickers.map((s) => {
                const iconKey = s.url.startsWith('icon:') ? s.url.replace('icon:', '') : '';
              const defaultColor = DEFAULT_ICON_COLORS[iconKey] || '#e11d48';
              const glyphs = isEmoji(s.url) ? splitGraphemes(s.url) : [];
              const isMultiGlyph = glyphs.length > 1;
              const layout = s.layout || 'horizontal';
              const spacing = s.spacing !== undefined ? s.spacing : 4;
              const weight = s.fontWeight === 'thin' ? '300' : s.fontWeight === 'bold' ? '900' : 'normal';
              const textStroke = s.fontWeight === 'bold' ? '0.6px currentColor' : 'none';

              const sShadowColor = s.shadowColor !== undefined ? s.shadowColor : 'rgba(0,0,0,0.25)';
              const sShadowBlur = s.shadowBlur !== undefined ? s.shadowBlur : 10;
              const dropShadowStyle = (sShadowBlur > 0 && sShadowColor !== 'transparent')
                ? `drop-shadow(0px 2px ${sShadowBlur}px ${sShadowColor})`
                : 'none';
              const align = s.textAlign || 'center';
              const baseline = s.textBaseline || 'middle';

              return (
                <div
                  key={s.id}
                  onMouseDown={(e) => handleStickerDragStart(e, s.id)}
                  onTouchStart={(e) => handleStickerDragStart(e, s.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(s.id);
                    playSound('click');
                  }}
                  className="absolute sticker-item cursor-move select-none p-0 z-30"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    transform: `translate(-50%, -50%) rotate(${(s.rotation * 180) / Math.PI}deg) scale(${s.scale})`,
                    opacity: s.opacity !== undefined ? s.opacity : 1,
                    touchAction: 'none',
                  }}
                >
                  <div className={`relative group transition-all duration-200 ${selectedId === s.id ? 'scale-105' : ''}`}>
                    {s.url.startsWith('icon:') ? (
                      <div 
                        className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center"
                        style={{ 
                          color: s.color || defaultColor,
                          filter: dropShadowStyle
                        }}
                      >
                        <Icon name={iconKey} size="100%" strokeWidth={s.strokeWidth ?? 2} />
                      </div>
                    ) : isEmoji(s.url) ? (
                      !isMultiGlyph ? (
                        <span 
                          className={`block select-none pointer-events-none leading-none text-4xl sm:text-5xl ${
                            align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center'
                          }`}
                          style={{ 
                            fontWeight: weight, 
                            WebkitTextStroke: textStroke,
                            fontFamily: resolveFontFamily(s.fontFamily),
                            filter: dropShadowStyle
                          }}
                        >
                          {s.url}
                        </span>
                      ) : (
                        <div
                          className={`select-none pointer-events-none ${
                            layout === 'vertical'
                              ? 'flex flex-col'
                              : layout === 'grid'
                              ? 'grid grid-cols-2'
                              : 'flex flex-row'
                          }`}
                          style={{ 
                            gap: `${spacing}px`, 
                            fontWeight: weight, 
                            WebkitTextStroke: textStroke,
                            fontFamily: resolveFontFamily(s.fontFamily),
                            filter: dropShadowStyle,
                            justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
                            alignItems: baseline === 'top' ? 'flex-start' : baseline === 'bottom' ? 'flex-end' : 'center'
                          }}
                        >
                          {glyphs.map((g, idx) => (
                            <span key={idx} className="block select-none leading-none text-3xl sm:text-4xl">
                              {g}
                            </span>
                          ))}
                        </div>
                      )
                    ) : (
                      <img
                        src={s.url}
                        alt="Sticker item decoration"
                        className="w-14 h-14 sm:w-18 sm:h-18 object-contain block pointer-events-none"
                        style={{ filter: dropShadowStyle }}
                      />
                    )}

                    {selectedId === s.id && (
                      <div className="absolute -inset-2 border-2 border-rose-500 rounded-xl pointer-events-none shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                    )}
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>

      {/* Selected Sticker Adjustment Modal (Compact & Screen-saving) */}
      <AnimatePresence>
        {selectedSticker && (() => {
          const isIcon = selectedSticker.url.startsWith('icon:');
          const isTextOrEmoji = isEmoji(selectedSticker.url);
          const glyphs = isTextOrEmoji ? splitGraphemes(selectedSticker.url) : [];
          const isMulti = glyphs.length > 1;

          return (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-4 sm:right-4 z-[100] max-w-sm sm:max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card-bg/95 backdrop-blur-md border border-border-color rounded-2xl p-3 shadow-2xl space-y-2.5">
                {/* Header with Tabs */}
                {(() => {
                  const adjustTabs: { id: 'transform' | 'style' | 'align' | 'layout'; label: string; icon: string }[] = [
                    { id: 'transform', label: trans('Kích thước'), icon: 'settings' },
                    { id: 'style', label: trans('Nét & Màu'), icon: 'palette' },
                    { id: 'align', label: trans('Căn lề & Bóng'), icon: 'sparkles' },
                    ...(isMulti ? [{ id: 'layout' as const, label: trans('Bố cục'), icon: 'grid' }] : [])
                  ];
                  const currentTab = adjustTabs.some(t => t.id === adjustTab) ? adjustTab : 'transform';

                  return (
                    <>
                      <div className="flex items-center justify-between pb-2 border-b border-border-color/60 gap-1.5 w-full">
                        {/* Tab Switcher: scroll ngang mượt mà trên mobile khi có 3-4 tabs */}
                        <div
                          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1 min-w-0 py-0.5 touch-pan-x overscroll-contain"
                          style={{
                            WebkitOverflowScrolling: 'touch',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                          }}
                        >
                          {adjustTabs.map((t) => {
                            const isActive = currentTab === t.id;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => setAdjustTab(t.id)}
                                className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border select-none ${
                                  isActive
                                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/80 shadow-xs'
                                    : 'bg-background hover:bg-card-bg text-muted-color border-border-color/80 hover:text-foreground'
                                }`}
                              >
                                <Icon name={t.icon} size={12} className={isActive ? 'text-rose-500 shrink-0' : 'text-muted-color shrink-0'} />
                                <span className="whitespace-nowrap inline-block">{t.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Done / Close Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedId(null)}
                          className="w-7 h-7 rounded-xl bg-background border border-border-color flex items-center justify-center text-emerald-500 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs ml-1 shrink-0"
                          title={trans('Hoàn tất')}
                        >
                          <Icon name="check" size={14} />
                        </button>
                      </div>

                      {/* Tab 1: Kích thước & Xoay */}
                      {currentTab === 'transform' && (
                        <div className="grid grid-cols-2 gap-3 py-1">
                          <div>
                            <div className="flex justify-between items-center mb-0.5 text-[9px] font-bold uppercase text-muted-color">
                              <span>{trans('Kích thước')}</span>
                              <span className="text-rose-500 font-mono">{Math.round(selectedSticker.scale * 100)}%</span>
                            </div>
                            <input
                              type="range" min="0.3" max="2.5" step="0.1"
                              value={selectedSticker.scale}
                              onChange={(e) => updateSticker(selectedId!, { scale: parseFloat(e.target.value) })}
                              className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-0.5 text-[9px] font-bold uppercase text-muted-color">
                              <span>{trans('Xoay ảnh')}</span>
                              <span className="text-rose-500 font-mono">{Math.round((selectedSticker.rotation * 180) / Math.PI)}°</span>
                            </div>
                            <input
                              type="range" min={-Math.PI} max={Math.PI} step="0.1"
                              value={selectedSticker.rotation}
                              onChange={(e) => updateSticker(selectedId!, { rotation: parseFloat(e.target.value) })}
                              className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {/* Tab 2: Nét vẽ, Màu sắc & Độ mờ */}
                      {currentTab === 'style' && (
                        <div className="space-y-2 py-1">
                          {/* Font chữ cho Text / Emoji Sticker */}
                          {isTextOrEmoji && (
                            <div className="flex items-center justify-between pb-1 border-b border-border-color/40">
                              <span className="text-[9px] font-bold uppercase text-muted-color">{trans('Font chữ')}</span>
                              <select
                                value={selectedSticker.fontFamily || 'Patrick Hand'}
                                onChange={(e) => updateSticker(selectedId!, { fontFamily: e.target.value })}
                                className="bg-background border border-border-color rounded-lg px-2 py-0.5 text-[9px] font-bold text-foreground focus:outline-none cursor-pointer"
                                style={{ fontFamily: resolveFontFamily(selectedSticker.fontFamily || 'Patrick Hand') }}
                              >
                                {AVAILABLE_STICKER_FONTS.map((f) => (
                                  <option key={f.id} value={f.id} style={{ fontFamily: f.font }}>
                                    {f.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Nét vẽ Bold / Thin */}
                          {(isIcon || isTextOrEmoji) && (
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold uppercase text-muted-color">{trans('Nét vẽ (Bold / Thin)')}</span>
                              <div className="flex gap-1 bg-background p-0.5 rounded-lg border border-border-color">
                                {[
                                  { id: 'thin', label: trans('Mảnh (Thin)'), stroke: 1.25 },
                                  { id: 'normal', label: trans('Vừa (Normal)'), stroke: 2 },
                                  { id: 'bold', label: trans('Đậm (Bold)'), stroke: 3.5 },
                                ].map((w) => (
                                  <button
                                    key={w.id}
                                    onClick={() => updateSticker(selectedId!, { 
                                      fontWeight: w.id as any, 
                                      strokeWidth: w.stroke 
                                    })}
                                    className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                                      (selectedSticker.fontWeight || (selectedSticker.strokeWidth === 1.25 ? 'thin' : selectedSticker.strokeWidth === 3.5 ? 'bold' : 'normal')) === w.id
                                        ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-xs'
                                        : 'text-muted-color hover:text-foreground'
                                    }`}
                                  >
                                    {w.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Màu sắc & Độ mờ */}
                          <div className="grid grid-cols-2 gap-3 items-center pt-1 border-t border-border-color/40">
                            {isIcon ? (() => {
                              const iconKey = selectedSticker.url.replace('icon:', '');
                              const defaultColor = DEFAULT_ICON_COLORS[iconKey] || '#e11d48';
                              const currentColor = selectedSticker.color || defaultColor;
                              return (
                                <div>
                                  <div className="flex justify-between items-center mb-0.5 text-[9px] font-bold uppercase text-muted-color">
                                    <span>{trans('Màu sắc Icon')}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 h-6">
                                    <input
                                      type="color"
                                      value={currentColor}
                                      onChange={(e) => updateSticker(selectedId!, { color: e.target.value })}
                                      className="w-6 h-6 rounded cursor-pointer border border-border-color bg-transparent p-0 shrink-0"
                                    />
                                    <span className="text-[9px] font-mono text-muted-color truncate">{currentColor}</span>
                                  </div>
                                </div>
                              );
                            })() : (
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateSticker(selectedId!, { scale: 1, rotation: 0, opacity: 1, strokeWidth: 2, fontWeight: 'normal' })}
                                  className="text-[9px] text-muted-color hover:text-rose-500 font-bold underline cursor-pointer"
                                >
                                  {trans('Đặt lại mặc định')}
                                </button>
                              </div>
                            )}

                            <div>
                              <div className="flex justify-between items-center mb-0.5 text-[9px] font-bold uppercase text-muted-color">
                                <span>{trans('Độ mờ đục')}</span>
                                <span className="text-rose-500 font-mono">{Math.round((selectedSticker.opacity ?? 1.0) * 100)}%</span>
                              </div>
                              <input
                                type="range" min="0.1" max="1.0" step="0.05"
                                value={selectedSticker.opacity ?? 1.0}
                                onChange={(e) => updateSticker(selectedId!, { opacity: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Căn lề & Hiệu ứng bóng */}
                      {currentTab === 'align' && (
                        <div className="space-y-2 py-1">
                          {/* Căn lề ngang */}
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase text-muted-color">{trans('Căn ngang (Align)')}</span>
                            <div className="flex gap-1 bg-background p-0.5 rounded-lg border border-border-color">
                              {[
                                { id: 'left', label: trans('Trái ⬅') },
                                { id: 'center', label: trans('Giữa ⏺') },
                                { id: 'right', label: trans('Phải ➡') },
                              ].map((al) => (
                                <button
                                  key={al.id}
                                  type="button"
                                  onClick={() => updateSticker(selectedId!, { textAlign: al.id as any })}
                                  className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                                    (selectedSticker.textAlign || 'center') === al.id
                                      ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-xs'
                                      : 'text-muted-color hover:text-foreground'
                                  }`}
                                >
                                  {al.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Căn lề dọc */}
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase text-muted-color">{trans('Căn dọc (Baseline)')}</span>
                            <div className="flex gap-1 bg-background p-0.5 rounded-lg border border-border-color">
                              {[
                                { id: 'top', label: trans('Trên ⬆') },
                                { id: 'middle', label: trans('Giữa ⏺') },
                                { id: 'bottom', label: trans('Dưới ⬇') },
                              ].map((bl) => (
                                <button
                                  key={bl.id}
                                  type="button"
                                  onClick={() => updateSticker(selectedId!, { textBaseline: bl.id as any })}
                                  className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                                    (selectedSticker.textBaseline || 'middle') === bl.id
                                      ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-xs'
                                      : 'text-muted-color hover:text-foreground'
                                  }`}
                                >
                                  {bl.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Độ mờ bóng (Shadow Blur) */}
                          <div className="pt-1 border-t border-border-color/40">
                            <div className="flex justify-between items-center mb-0.5 text-[9px] font-bold uppercase text-muted-color">
                              <span>{trans('Độ mờ bóng (Shadow Blur)')}</span>
                              <span className="text-rose-500 font-mono">
                                {(selectedSticker.shadowBlur ?? 10) === 0 ? trans('Tắt') : `${selectedSticker.shadowBlur ?? 10}px`}
                              </span>
                            </div>
                            <input
                              type="range" min="0" max="30" step="1"
                              value={selectedSticker.shadowBlur ?? 10}
                              onChange={(e) => updateSticker(selectedId!, { shadowBlur: parseInt(e.target.value) })}
                              className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                            />
                          </div>

                          {/* Màu bóng đổ (Shadow Color) */}
                          <div className="flex items-center justify-between pt-1 border-t border-border-color/40">
                            <span className="text-[9px] font-bold uppercase text-muted-color">{trans('Màu bóng')}</span>
                            <div className="flex items-center gap-1">
                              {[
                                { label: trans('Tắt'), val: 'transparent' },
                                { label: trans('Mờ'), val: 'rgba(0,0,0,0.25)' },
                                { label: trans('Đen'), val: 'rgba(0,0,0,0.65)' },
                                { label: trans('Sáng'), val: 'rgba(255,255,255,0.75)' },
                                { label: trans('Hồng'), val: 'rgba(244,63,94,0.6)' },
                              ].map((preset) => (
                                <button
                                  key={preset.val}
                                  type="button"
                                  onClick={() => updateSticker(selectedId!, { shadowColor: preset.val })}
                                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded border transition-all cursor-pointer ${
                                    (selectedSticker.shadowColor || 'rgba(0,0,0,0.25)') === preset.val
                                      ? 'bg-rose-500 text-white border-rose-500'
                                      : 'bg-background text-muted-color border-border-color hover:text-foreground'
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                              <input
                                type="color"
                                value={
                                  selectedSticker.shadowColor && selectedSticker.shadowColor.startsWith('#')
                                    ? selectedSticker.shadowColor
                                    : '#000000'
                                }
                                onChange={(e) => updateSticker(selectedId!, { shadowColor: e.target.value })}
                                className="w-5 h-5 rounded cursor-pointer border border-border-color bg-transparent p-0 shrink-0 ml-0.5"
                                title={trans('Màu tùy chỉnh')}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Bố cục & Khoảng cách */}
                      {currentTab === 'layout' && isMulti && (
                        <div className="space-y-2 py-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase text-muted-color">{trans('Bố cục icon')}</span>
                            <div className="flex gap-1 bg-background p-0.5 rounded-lg border border-border-color">
                              {[
                                { id: 'horizontal', label: trans('Ngang ↔') },
                                { id: 'vertical', label: trans('Dọc ↕') },
                                { id: 'grid', label: trans('Lưới ⊞') },
                              ].map((l) => (
                                <button
                                  key={l.id}
                                  onClick={() => updateSticker(selectedId!, { layout: l.id as any })}
                                  className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                                    (selectedSticker.layout || 'horizontal') === l.id
                                      ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-xs'
                                      : 'text-muted-color hover:text-foreground'
                                  }`}
                                >
                                  {l.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-1 border-t border-border-color/40">
                            <div className="flex justify-between items-center mb-0.5 text-[9px] font-bold uppercase text-muted-color">
                              <span>{trans('Khoảng cách icon')}</span>
                              <span className="text-rose-500 font-mono">{selectedSticker.spacing ?? 4}px</span>
                            </div>
                            <input
                              type="range" min="0" max="30" step="1"
                              value={selectedSticker.spacing ?? 4}
                              onChange={(e) => updateSticker(selectedId!, { spacing: parseInt(e.target.value) })}
                              className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Actions: Lớp & Xóa */}
                <div className="flex gap-2 pt-1 border-t border-border-color/60">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveLayer(selectedId!, 'down'); }}
                    className="flex-1 py-1.5 bg-background hover:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg flex items-center justify-center text-foreground font-bold text-[9px] cursor-pointer transition-all border border-border-color/60"
                  >
                    {trans('Hạ 1 lớp')}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveLayer(selectedId!, 'up'); }}
                    className="flex-1 py-1.5 bg-background hover:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg flex items-center justify-center text-foreground font-bold text-[9px] cursor-pointer transition-all border border-border-color/60"
                  >
                    {trans('Lên 1 lớp')}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStickers(prev => prev.filter(s => s.id !== selectedId)); setSelectedId(null); }}
                    className="px-3 bg-rose-500/10 text-rose-600 dark:text-rose-450 rounded-lg hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Library popup */}
      {mounted && createPortal(
        <AnimatePresence>
          {isLibraryOpen && (
            <div
              style={{ zIndex: 999999 }}
              className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4 text-xs font-semibold text-slate-800 dark:text-zinc-100"
            >
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                onClick={() => setIsLibraryOpen(false)}
              />
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                className="bg-card-bg border-t sm:border border-border-color w-full max-w-md rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 relative z-10 shadow-2xl max-h-[75vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-black text-foreground uppercase tracking-tight font-sans">{trans('Thêm Sticker')}</span>
                  <button
                    onClick={() => setIsLibraryOpen(false)}
                    className="w-8 h-8 rounded-full bg-background border border-border-color flex items-center justify-center text-muted-color hover:text-rose-500 cursor-pointer shadow-xs"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>

                {/* Tab selector */}
                <div className="flex border-b border-border-color mb-3 overflow-x-auto scrollbar-none gap-2 pb-2">
                  {[
                    { id: 'icons', label: trans('Haniu Icons'), icon: 'star' },
                    { id: 'emoji', label: trans('Emojis'), icon: 'heart' },
                    { id: 'custom', label: trans('Tự nhập'), icon: 'edit' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                          ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-xs'
                          : 'bg-background hover:bg-rose-500/10 text-muted-color hover:text-rose-600 dark:hover:text-rose-500'
                        }`}
                    >
                      <Icon name={tab.icon} size={11} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Contents */}
                <div className="min-h-[200px]">
                  {activeTab === 'icons' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase text-muted-color tracking-wider block">{trans('Icon thiết kế Haniu')}</label>
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] font-bold text-muted-color uppercase">{trans('Nét:')}</span>
                          <div className="flex gap-0.5 bg-background p-0.5 rounded-lg border border-border-color">
                            {[
                              { id: 'thin', label: trans('Mảnh'), stroke: 1.25 },
                              { id: 'normal', label: trans('Vừa'), stroke: 2 },
                              { id: 'bold', label: trans('Đậm'), stroke: 3.5 },
                            ].map((w) => (
                              <button
                                key={w.id}
                                type="button"
                                onClick={() => setCustomStrokeWidth(w.stroke)}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                  customStrokeWidth === w.stroke
                                    ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-xs'
                                    : 'text-muted-color hover:text-foreground'
                                }`}
                              >
                                {w.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-start sm:justify-center overflow-y-auto max-h-[30vh] p-1 custom-scrollbar">
                        {DECORATIVE_ICONS.map((iconName) => (
                          <button
                            key={iconName}
                            onClick={() => addSticker(`icon:${iconName}`, { strokeWidth: customStrokeWidth, opacity: customOpacity })}
                            className="w-13 h-13 rounded-2xl p-2 bg-background border border-border-color hover:border-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer flex items-center justify-center shadow-xs text-rose-500 shrink-0"
                          >
                            <Icon name={iconName} size={24} strokeWidth={customStrokeWidth} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'emoji' && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-muted-color tracking-wider block mb-1">{trans('Chọn Emoji')}</label>
                      <div className="flex flex-wrap gap-2 justify-start sm:justify-center overflow-y-auto max-h-[30vh] p-1 custom-scrollbar">
                        {EMOJI_LIST.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addSticker(emoji, { opacity: customOpacity })}
                            className="w-11 h-11 rounded-2xl bg-background border border-border-color hover:border-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer flex items-center justify-center text-2xl select-none shrink-0"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'custom' && (
                    <div className="space-y-3 py-1">
                      {/* Input + Submit button */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-muted-color tracking-wider">
                          {trans('Nhập emoji hoặc chữ biểu tượng')}
                        </label>
                        <div className="flex gap-2">
                          <input
                            placeholder={trans('Ví dụ: ❤️✨🔥 hoặc chữ...')}
                            value={customIcon}
                            onChange={e => setCustomIcon(e.target.value)}
                            className="flex-1 bg-background border border-border-color rounded-xl px-3 h-10 text-foreground text-xs focus:outline-none focus:border-rose-500 transition-all font-sans"
                            onKeyDown={e => e.key === 'Enter' && handleCustomIconSubmit()}
                          />
                          <button
                            onClick={handleCustomIconSubmit}
                            disabled={!customIcon.trim()}
                            className="bg-rose-600 dark:bg-rose-500 disabled:opacity-50 text-white px-5 rounded-xl font-bold uppercase tracking-wider text-[10px] hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0 shadow-sm"
                          >
                            {trans('Thêm')}
                          </button>
                        </div>
                      </div>

                      {/* Quick Emoji Shortcuts */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold uppercase text-muted-color">{trans('Chạm nhanh icon')}</span>
                        <div className="flex flex-wrap gap-1">
                          {['❤️', '✨', '🔥', '🥰', '👑', '🎉', '🌸', '⭐', '🎀', '🍀', '🍰', '🧸', '🍕', '🐱'].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => setCustomIcon(prev => prev + em)}
                              className="w-7 h-7 rounded-lg bg-background border border-border-color hover:border-rose-400 hover:bg-rose-500/10 flex items-center justify-center text-sm cursor-pointer transition-all active:scale-90"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Layout & Stroke Options */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-border-color/80 space-y-2">
                        {/* Bố cục Ngang / Dọc / Lưới */}
                        <div className="flex items-center justify-between text-[9px] font-bold">
                          <span className="text-muted-color uppercase">{trans('Bố cục hiển thị')}</span>
                          <div className="flex gap-1 bg-background p-0.5 rounded-lg border border-border-color">
                            {[
                              { id: 'horizontal', label: trans('Ngang ↔') },
                              { id: 'vertical', label: trans('Dọc ↕') },
                              { id: 'grid', label: trans('Lưới ⊞') },
                            ].map((l) => (
                              <button
                                key={l.id}
                                type="button"
                                onClick={() => setCustomLayout(l.id as any)}
                                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                  customLayout === l.id
                                    ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-xs'
                                    : 'text-muted-color hover:text-foreground'
                                }`}
                              >
                                {l.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Font chữ */}
                        <div className="flex items-center justify-between text-[9px] font-bold pt-1 border-t border-border-color/40">
                          <span className="text-muted-color uppercase">{trans('Font chữ')}</span>
                          <select
                            value={customFontFamily}
                            onChange={(e) => setCustomFontFamily(e.target.value)}
                            className="bg-background border border-border-color rounded-lg px-2 py-0.5 text-[9px] font-bold text-foreground focus:outline-none cursor-pointer"
                            style={{ fontFamily: resolveFontFamily(customFontFamily) }}
                          >
                            {AVAILABLE_STICKER_FONTS.map((f) => (
                              <option key={f.id} value={f.id} style={{ fontFamily: f.font }}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Nét vẽ Bold / Thin */}
                        <div className="flex items-center justify-between text-[9px] font-bold pt-1 border-t border-border-color/40">
                          <span className="text-muted-color uppercase">{trans('Độ đậm (Bold / Thin)')}</span>
                          <div className="flex gap-1 bg-background p-0.5 rounded-lg border border-border-color">
                            {[
                              { id: 'thin', label: trans('Mảnh (Thin)'), stroke: 1.25 },
                              { id: 'normal', label: trans('Vừa (Normal)'), stroke: 2 },
                              { id: 'bold', label: trans('Đậm (Bold)'), stroke: 3.5 },
                            ].map((w) => (
                              <button
                                key={w.id}
                                type="button"
                                onClick={() => {
                                  setCustomFontWeight(w.id as any);
                                  setCustomStrokeWidth(w.stroke);
                                }}
                                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                  customFontWeight === w.id
                                    ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-xs'
                                    : 'text-muted-color hover:text-foreground'
                                }`}
                              >
                                {w.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sliders: Khoảng cách */}
                        <div className="pt-1 border-t border-border-color/40">
                          <div className="flex justify-between items-center mb-0.5 text-[10px] font-bold uppercase text-muted-color">
                            <span>{trans('Khoảng cách giữa các icon')}</span>
                            <span className="text-rose-500 font-mono">{customSpacing}px</span>
                          </div>
                          <input
                            type="range" min="0" max="25" step="1"
                            value={customSpacing}
                            onChange={(e) => setCustomSpacing(parseInt(e.target.value))}
                            className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {!selectedId && !isLibraryOpen && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLastClickPos({ x: 50, y: 50 });
              setIsLibraryOpen(true);
            }}
            className="bg-rose-600 dark:bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 rounded-full shadow-lg border border-rose-400/40 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Icon name="heart" size={13} />
            <span className="text-[11px] font-bold uppercase tracking-wider">{trans('Thêm Sticker')}</span>
          </button>
          <div className="hidden sm:flex bg-white/90 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-2 rounded-full border border-border-color shadow-sm pointer-events-none">
            <span className="text-[9px] text-muted-color font-bold uppercase tracking-wider">{trans('Chạm 2 lần vào ảnh để dán')}</span>
          </div>
        </div>
      )}
    </div>
  );
};
