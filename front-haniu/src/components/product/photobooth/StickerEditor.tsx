'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { Sticker } from './types';
import { playSound } from './sounds';

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

export const StickerEditor: React.FC<StickerEditorProps> = ({ imageUrl, initialStickers, onConfirm, onCancel }) => {
  const [stickers, setStickers] = useState<Sticker[]>(initialStickers || []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customIcon, setCustomIcon] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'icons' | 'emoji' | 'custom'>('icons');
  const [lastClickPos, setLastClickPos] = useState({ x: 50, y: 50 });

  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastClickRef = useRef<number>(0);

  const addSticker = (url: string) => {
    playSound('click');
    const newSticker: Sticker = {
      id: 'stk-' + Date.now(),
      url,
      x: lastClickPos.x,
      y: lastClickPos.y,
      scale: 1,
      rotation: 0
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
      addSticker(customIcon.trim());
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
          className="h-9 px-4 rounded-full bg-card-bg border border-border-color text-foreground hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 pointer-events-auto cursor-pointer"
        >
          <Icon name="arrow-left" size={12} />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => { setStickers([]); setSelectedId(null); }}
            className="px-3 py-2 rounded-xl bg-card-bg border border-border-color text-foreground hover:bg-rose-500/10 dark:hover:bg-rose-500/20 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            <Icon name="refresh" size={11} />
            <span>Xóa hết</span>
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
            Lưu ảnh
          </button>
        </div>
      </div>

      {/* Drawing Canvas Board */}
      <div
        className="flex-1 w-full overflow-y-auto overflow-x-hidden p-6 flex items-center justify-center custom-scrollbar"
        onClick={() => setSelectedId(null)}
      >
        <div
          ref={containerRef}
          className="relative block w-fit h-fit touch-none mx-auto shadow-xl"
          onClick={(e) => {
            e.stopPropagation();
            handleCanvasClick(e);
          }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Work photo preview"
            className="max-w-[85vw] max-h-[55vh] h-auto w-auto block rounded-2xl border border-border-color pointer-events-none select-none bg-card-bg"
          />

          <AnimatePresence>
            {stickers.map((s, index) => {
              const iconKey = s.url.startsWith('icon:') ? s.url.replace('icon:', '') : '';
              const defaultColor = DEFAULT_ICON_COLORS[iconKey] || '#e11d48';
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
                    width: s.url.startsWith('icon:') ? '15%' : isEmoji(s.url) ? '12%' : '18%',
                    touchAction: 'none',
                    containerType: 'inline-size'
                  }}
                >
                  <div className={`relative group transition-all duration-300 ${selectedId === s.id ? 'opacity-100' : 'opacity-90'}`}>
                    {s.url.startsWith('icon:') ? (
                      <div 
                        className="w-full aspect-square flex items-center justify-center"
                        style={{ color: s.color || defaultColor }}
                      >
                        <Icon name={iconKey} size="100%" />
                      </div>
                    ) : isEmoji(s.url) ? (
                      <span 
                        className="drop-shadow-md block select-none pointer-events-none text-center leading-none"
                        style={{ fontSize: '100cqw' }}
                      >
                        {s.url}
                      </span>
                    ) : (
                      <img
                        src={s.url}
                        alt="Sticker item decoration"
                        className="w-full aspect-square object-contain drop-shadow-md block pointer-events-none"
                      />
                    )}

                    {selectedId === s.id && (
                      <div className="absolute -inset-1.5 border-2 border-primary-color rounded-xl pointer-events-none shadow-[0_0_10px_var(--primary)]" />
                    )}
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedSticker && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 left-4 right-4 z-[100] max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card-bg border border-border-color rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary-color flex items-center gap-1">
                  <Icon name="settings" size={12} /> Căn chỉnh Sticker
                </span>
                <button onClick={() => setSelectedId(null)} className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-emerald-500 cursor-pointer">
                  <Icon name="check" size={14} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-[9px] font-bold uppercase text-muted-color">
                    <span>Kích thước</span>
                    <span className="text-primary-color font-mono">{Math.round(selectedSticker.scale * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0.3" max="2.5" step="0.1"
                    value={selectedSticker.scale}
                    onChange={(e) => updateSticker(selectedId!, { scale: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-background rounded-full appearance-none accent-primary-color cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1 text-[9px] font-bold uppercase text-muted-color">
                    <span>Xoay ảnh</span>
                    <span className="text-primary-color font-mono">{Math.round((selectedSticker.rotation * 180) / Math.PI)}°</span>
                  </div>
                  <input
                    type="range" min={-Math.PI} max={Math.PI} step="0.1"
                    value={selectedSticker.rotation}
                    onChange={(e) => updateSticker(selectedId!, { rotation: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-background rounded-full appearance-none accent-primary-color cursor-pointer"
                  />
                </div>
                {selectedSticker.url.startsWith('icon:') && (() => {
                  const iconKey = selectedSticker.url.replace('icon:', '');
                  const defaultColor = DEFAULT_ICON_COLORS[iconKey] || '#e11d48';
                  const currentColor = selectedSticker.color || defaultColor;
                  return (
                    <div>
                      <div className="flex justify-between items-center mb-1 text-[9px] font-bold uppercase text-muted-color">
                        <span>Màu sắc Icon</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => updateSticker(selectedId!, { color: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-border-color bg-transparent p-0.5"
                        />
                        <span className="text-[10px] font-mono text-muted-color">{currentColor}</span>
                      </div>
                    </div>
                  );
                })()}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveLayer(selectedId!, 'down'); }}
                    className="flex-1 py-2 bg-background hover:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl flex items-center justify-center text-foreground font-bold text-[9px] cursor-pointer"
                  >
                    Hạ 1 lớp
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveLayer(selectedId!, 'up'); }}
                    className="flex-1 py-2 bg-background hover:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl flex items-center justify-center text-foreground font-bold text-[9px] cursor-pointer"
                  >
                    Lên 1 lớp
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setStickers(prev => prev.filter(s => s.id !== selectedId)); setSelectedId(null); }}
                    className="px-4 bg-rose-500/10 text-rose-600 dark:text-rose-450 rounded-xl hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
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
                className="bg-card-bg border-t sm:border border-border-color w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 relative z-10 shadow-2xl max-h-[70vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-foreground uppercase tracking-tight font-sans">Thêm Sticker</span>
                  <button
                    onClick={() => setIsLibraryOpen(false)}
                    className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-color hover:text-primary-color cursor-pointer"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>

                {/* Tab selector */}
                <div className="flex border-b border-border-color mb-4 overflow-x-auto scrollbar-none gap-2 pb-2">
                  {[
                    { id: 'icons', label: 'Haniu Icons', icon: 'star' },
                    { id: 'emoji', label: 'Emojis', icon: 'heart' },
                    { id: 'custom', label: 'Tự nhập', icon: 'edit' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                          ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-sm'
                          : 'bg-background hover:bg-rose-500/10 text-muted-color hover:text-rose-600 dark:hover:text-rose-500'
                        }`}
                    >
                      <Icon name={tab.icon} size={11} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Contents */}
                <div className="min-h-[220px]">

                  {activeTab === 'icons' && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-muted-color tracking-wider block mb-1">Icon thiết kế Haniu</label>
                      <div className="flex flex-wrap gap-2 justify-start sm:justify-center overflow-y-auto max-h-[30vh] p-1 custom-scrollbar">
                        {DECORATIVE_ICONS.map((iconName) => (
                          <button
                            key={iconName}
                            onClick={() => addSticker(`icon:${iconName}`)}
                            className="w-14 h-14 rounded-2xl p-2 bg-background border border-border-color hover:border-primary-color hover:bg-rose-500/10 transition-all cursor-pointer flex items-center justify-center shadow-xs text-primary-color shrink-0"
                          >
                            <Icon name={iconName} size={24} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'emoji' && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-muted-color tracking-wider block mb-1">Chọn Emoji</label>
                      <div className="flex flex-wrap gap-2 justify-start sm:justify-center overflow-y-auto max-h-[30vh] p-1 custom-scrollbar">
                        {EMOJI_LIST.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addSticker(emoji)}
                            className="w-12 h-12 rounded-2xl bg-background border border-border-color hover:border-primary-color hover:bg-rose-500/10 transition-all cursor-pointer flex items-center justify-center text-2xl select-none shrink-0"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'custom' && (
                    <div className="space-y-4 py-2">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase text-muted-color tracking-wider">Emoji hoặc chữ tự nhập</label>
                        <div className="flex gap-2">
                          <input
                            placeholder="Gõ emoji hoặc chữ..."
                            value={customIcon}
                            onChange={e => setCustomIcon(e.target.value)}
                            className="flex-1 bg-background border border-border-color rounded-2xl px-4 h-12 text-foreground text-xs focus:outline-none focus:border-primary-color transition-all"
                            onKeyDown={e => e.key === 'Enter' && handleCustomIconSubmit()}
                          />
                          <button
                            onClick={handleCustomIconSubmit}
                            className="bg-rose-600 dark:bg-rose-500 text-white px-6 rounded-2xl font-bold uppercase tracking-wider text-[10px] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                          >
                            Thêm
                          </button>
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-2 rounded-full border border-border-color pointer-events-none shadow-md">
          <span className="text-[9px] text-foreground font-bold uppercase tracking-wider">Chạm hai lần để dán Sticker</span>
        </div>
      )}
    </div>
  );
};
