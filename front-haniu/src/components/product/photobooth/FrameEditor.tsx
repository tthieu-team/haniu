'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';
import { CapturedPhoto, PhotoboothConfig, Sticker } from './types';
import { generateComposition } from './composition';
import { playSound } from './sounds';

interface FrameEditorProps {
  photos: CapturedPhoto[];
  config: PhotoboothConfig;
  stickers?: Sticker[];
  onConfirm: (updatedConfig: PhotoboothConfig) => void;
  onCancel: () => void;
}

const TRENDY_COLORS = [
  { name: 'Trắng tinh khôi', value: '#ffffff' },
  { name: 'Kem sữa ngọt', value: '#faf7f2' },
  { name: 'Hồng phấn pastel', value: '#fff0f2' },
  { name: 'Xanh matcha', value: '#f1f8e9' },
  { name: 'Tím oải hương', value: '#f3e5f5' },
  { name: 'Xanh da trời', value: '#e3f2fd' },
  { name: 'Đen Matte cổ điển', value: '#18181b' },
];

export const FrameEditor: React.FC<FrameEditorProps> = ({
  photos,
  config,
  stickers = [],
  onConfirm,
  onCancel,
}) => {
  // Local state to modify config copy
  const [localConfig, setLocalConfig] = useState<PhotoboothConfig>({ ...config });
  const [liveUrl, setLiveUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sliderBorderSize, setSliderBorderSize] = useState(localConfig.borderSize !== undefined ? localConfig.borderSize : 15);

  // Sync slider state when config changes externally
  useEffect(() => {
    setSliderBorderSize(localConfig.borderSize !== undefined ? localConfig.borderSize : 15);
  }, [localConfig.borderSize]);

  const AVAILABLE_FONTS = [
    { id: 'be-vietnam-pro', name: 'Be Vietnam Pro (Không chân)' },
    { id: 'cormorant-garamond', name: 'Cormorant Garamond (Có chân)' },
    { id: 'dancing-script', name: 'Dancing Script (Viết tay mềm)' },
    { id: 'patrick-hand', name: 'Patrick Hand (Viết tay mộc)' },
    { id: 'mali', name: 'Mali (Viết tay ngộ nghĩnh)' },
  ];

  const resolveFont = (fontKey?: string) => {
    switch (fontKey) {
      case 'dancing-script': return '"Dancing Script", cursive';
      case 'patrick-hand': return '"Patrick Hand", cursive';
      case 'mali': return '"Mali", cursive';
      case 'cormorant-garamond': return '"Cormorant Garamond", serif';
      case 'be-vietnam-pro': return '"Be Vietnam Pro", sans-serif';
      default: return '"Be Vietnam Pro", sans-serif';
    }
  };

  // Update Live Preview Composition URL with Debounce - Only when background frame styles change!
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        // We render the canvas preview WITHOUT signature and date for high performance!
        const baseConfigForPreview: PhotoboothConfig = {
          ...localConfig,
          userName: '',
          showDate: false
        };
        const blob = await generateComposition(photos, baseConfigForPreview, stickers);
        const url = URL.createObjectURL(blob);
        if (active) {
          setLiveUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
        }
      } catch (err) {
        console.error(err);
      }
    }, 150); // 150ms debounce

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [photos, localConfig.frameColor, localConfig.backgroundImage, localConfig.borderSize, localConfig.filter, stickers]);

  // Cleanup Live URL
  useEffect(() => {
    return () => {
      if (liveUrl) URL.revokeObjectURL(liveUrl);
    };
  }, [liveUrl]);

  const handleColorSelect = (colorHex: string) => {
    playSound('click');
    setLocalConfig(prev => ({
      ...prev,
      frameColor: colorHex,
      backgroundImage: undefined, // Clear background image when color selected
    }));
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setLocalConfig(prev => ({
            ...prev,
            backgroundImage: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearBgImage = () => {
    setLocalConfig(prev => ({
      ...prev,
      backgroundImage: undefined
    }));
  };

  return (
    <div className="w-full h-full bg-background flex flex-col sm:flex-row relative overflow-hidden transition-colors duration-550 min-h-0 text-xs font-semibold text-slate-800 dark:text-zinc-100">
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between bg-gradient-to-b from-white dark:from-zinc-950 to-transparent pointer-events-none">
        <button
          onClick={onCancel}
          className="h-9 px-4 rounded-full bg-card-bg border border-border-color text-foreground hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 pointer-events-auto cursor-pointer shadow-xs"
        >
          <Icon name="arrow-left" size={12} className="text-primary-color" />
          <span>Hủy bỏ</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            onConfirm(localConfig);
          }}
          className="px-5 py-2 rounded-xl bg-rose-600 dark:bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 shadow-md cursor-pointer pointer-events-auto"
        >
          <Icon name="check" size={12} />
          <span>Áp dụng khung & chữ</span>
        </button>
      </div>

      {/* Live Preview Pane */}
      <div className="flex-1 min-w-0 overflow-y-auto p-6 pt-24 flex flex-col items-center justify-start sm:justify-center custom-scrollbar">
        {liveUrl ? (
          <div className="relative flex items-center justify-center select-none max-w-[75vw] sm:max-w-[340px] w-full bg-slate-100 dark:bg-zinc-900 rounded-xl shadow-2xl p-1.5 overflow-hidden">
            <div 
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: `${localConfig.template.canvasWidth} / ${localConfig.template.canvasHeight}` }}
            >
              <img
                src={liveUrl}
                alt="Live frame designer preview"
                className="w-full h-full object-contain pointer-events-none select-none rounded-lg"
              />

              {/* Real-time CSS Username Signature Overlay */}
              {localConfig.userName !== '' && (
                <div
                  className="absolute pointer-events-none whitespace-nowrap select-none text-center font-bold"
                  style={{
                    left: `${localConfig.userNameX !== undefined ? localConfig.userNameX : 50}%`,
                    top: `${localConfig.userNameY !== undefined ? localConfig.userNameY : ((localConfig.template.canvasHeight - 70) / localConfig.template.canvasHeight) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: resolveFont(localConfig.userNameFont),
                    fontSize: `${Math.max(6, (localConfig.userNameSize || 36) * (340 / localConfig.template.canvasWidth))}px`,
                    color: localConfig.userNameColor || '#e11d48',
                  }}
                >
                  {localConfig.userName || 'HANIU STUDIO'}
                </div>
              )}

              {/* Real-time CSS Date Overlay */}
              {localConfig.showDate && (
                <div
                  className="absolute pointer-events-none whitespace-nowrap select-none text-center font-bold"
                  style={{
                    left: `${localConfig.dateX !== undefined ? localConfig.dateX : 50}%`,
                    top: `${localConfig.dateY !== undefined ? localConfig.dateY : ((localConfig.template.canvasHeight - 30) / localConfig.template.canvasHeight) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: resolveFont(localConfig.dateFont),
                    fontSize: `${Math.max(5, (localConfig.dateSize || 18) * (340 / localConfig.template.canvasWidth))}px`,
                    color: localConfig.dateColor || '#64748b',
                  }}
                >
                  {new Date().toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
            <span className="text-[10px] text-muted-color uppercase tracking-wider font-bold">Đang vẽ bản xem trước...</span>
          </div>
        )}
      </div>

      {/* Right Side Control Sidebar */}
      <div className="w-full sm:w-80 lg:w-96 shrink-0 bg-card-bg border-t sm:border-t-0 sm:border-l border-border-color flex flex-col h-[45vh] sm:h-full z-40 relative shadow-xl overflow-y-auto custom-scrollbar p-5 space-y-5">
        <div className="border-b border-border-color pb-3">
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <Icon name="palette" size={14} className="text-rose-500" />
            Khung & Nền
          </h3>
        </div>

        {/* 1. Border Padding spacing slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-muted-color tracking-wide">
            <span>Độ dày viền</span>
            <span className="text-rose-500 font-mono font-bold">
              {sliderBorderSize}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="45"
            step="1"
            value={sliderBorderSize}
            onChange={(e) => setSliderBorderSize(parseInt(e.target.value))}
            onMouseUp={() => setLocalConfig(prev => ({ ...prev, borderSize: sliderBorderSize }))}
            onTouchEnd={() => setLocalConfig(prev => ({ ...prev, borderSize: sliderBorderSize }))}
            className="w-full h-1.5 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
          />
        </div>

        <hr className="border-border-color" />

        {/* 2. Color Swatches */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-bold uppercase text-muted-color tracking-wide block">Màu viền</label>
          <div className="grid grid-cols-4 gap-2">
            {TRENDY_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={`h-9 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center text-[9px] relative hover:scale-105 active:scale-95 ${localConfig.frameColor === color.value && !localConfig.backgroundImage
                    ? 'border-rose-500 scale-105 shadow-md'
                    : 'border-border-color'
                  }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {color.value === '#ffffff' && <span className="text-slate-400 text-[8px]">Trắng</span>}
                {color.value === '#18181b' && <span className="text-zinc-400 text-[8px]">Đen</span>}
                {localConfig.frameColor === color.value && !localConfig.backgroundImage && (
                  <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center text-rose-500">
                    <Icon name="check" size={14} className="font-bold stroke-[3px]" />
                  </div>
                )}
              </button>
            ))}
            {/* Custom native color picker button */}
            <div className="relative h-9 rounded-xl border-2 border-dashed border-border-color hover:border-rose-400 flex items-center justify-center overflow-hidden transition-all hover:scale-105">
              <input
                type="color"
                value={localConfig.frameColor || '#ffffff'}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Icon name="palette" size={14} className="text-muted-color" />
            </div>
          </div>
        </div>

        <hr className="border-border-color" />

        {/* 3. Predefined Background Templates */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-bold uppercase text-muted-color tracking-wide block">Ảnh nền thiết kế sẵn</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Gấu Haniu 🧸', url: '/image/bear_bg.png' },
              { name: 'Hoa Nhí 🌸', url: '/image/flower_bg.png' },
              { name: 'Tình Nhân 💖', url: '/image/valentine_bg.png' },
              { name: 'Tốt Nghiệp 🎓', url: '/image/graduation_bg.png' },
              { name: 'Quốc Khánh 🇻🇳', url: '/image/national_bg.png' },
              { name: 'Nhà Giáo 🏫', url: '/image/teachers_bg.png' },
              { name: 'Y2K Cyber 👾', url: '/image/y2k_bg.png' },
              { name: 'Vintage 🎞️', url: '/image/vintage_bg.png' },
              { name: 'Holo mesh 🌈', url: '/image/holographic_bg.png' },
            ].map((bg) => (
              <button
                key={bg.url}
                onClick={() => {
                  playSound('click');
                  setLocalConfig(prev => ({
                    ...prev,
                    backgroundImage: bg.url
                  }));
                }}
                className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex flex-col items-center justify-end p-1 hover:scale-105 active:scale-95 ${
                  localConfig.backgroundImage === bg.url
                    ? 'border-rose-500 shadow-md scale-105'
                    : 'border-border-color hover:border-slate-400'
                }`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
                  style={{ backgroundImage: `url(${bg.url})` }}
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition-colors" />
                {localConfig.backgroundImage === bg.url && (
                  <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center text-white">
                    <Icon name="check" size={14} className="font-bold stroke-[3px]" />
                  </div>
                )}
                <span className="relative z-10 text-[7px] font-black text-white bg-black/55 px-1 py-0.5 rounded-sm line-clamp-1 select-none pointer-events-none">
                  {bg.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <hr className="border-border-color" />

        {/* 3. Custom Background Image Upload */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-bold uppercase text-muted-color tracking-wide block">Tải ảnh nền riêng</label>

          {localConfig.backgroundImage && !localConfig.backgroundImage.startsWith('/image/') ? (
            <div className="p-2.5 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <img
                  src={localConfig.backgroundImage}
                  className="w-8 h-8 object-cover rounded-lg border border-border-color"
                  alt="Custom background selected"
                />
                <span className="text-[9px] font-bold text-rose-500">Đã nhận nền riêng</span>
              </div>
              <button
                onClick={clearBgImage}
                className="w-6 h-6 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Xóa nền"
              >
                <Icon name="close" size={10} />
              </button>
            </div>
          ) : (
            <label className="w-full h-16 border-2 border-dashed border-border-color hover:border-rose-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-slate-50/[0.02] hover:bg-rose-500/[0.01] transition-all p-2 text-center">
              <Icon name="image" size={18} className="text-slate-400" />
              <span className="text-[9px] font-bold text-slate-500">Tải ảnh lên (.png, .jpg)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleBgUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <hr className="border-border-color" />

        {/* 4. Custom Branding Text Caption */}
        <div className="space-y-4">
          <div className="border-t border-border-color pt-3">
            <label className="text-[10px] font-black uppercase text-foreground tracking-wider flex items-center gap-1">
              <span>✍️ Thiết Kế Chữ Ký</span>
            </label>
          </div>
          
          <div className="space-y-2.5">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase text-muted-color tracking-wide block">Nội dung chữ ký</label>
              <input
                type="text"
                placeholder="Ví dụ: HANIU STUDIO"
                value={localConfig.userName || ''}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full bg-background border border-border-color rounded-xl px-3 h-9 text-foreground text-xs focus:outline-none focus:border-rose-500 transition-all font-sans font-bold"
              />
            </div>

            {/* Font Family selector for signature */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase text-muted-color tracking-wide block">Font Chữ ký</label>
              <select
                value={localConfig.userNameFont || 'cormorant-garamond'}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, userNameFont: e.target.value }))}
                className="w-full bg-background border border-border-color rounded-xl px-2.5 h-9 text-foreground text-xs focus:outline-none focus:border-rose-500 transition-all font-bold"
              >
                {AVAILABLE_FONTS.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Font Size slider for signature */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold uppercase text-muted-color tracking-wide">
                <span>Cỡ chữ ký</span>
                <span className="text-rose-500 font-mono">{localConfig.userNameSize || 36}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="80"
                step="2"
                value={localConfig.userNameSize || 36}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, userNameSize: parseInt(e.target.value) }))}
                className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Horizontal Position (X) for signature */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold uppercase text-muted-color tracking-wide">
                <span>Vị trí ngang (Trái - Phải)</span>
                <span className="text-rose-500 font-mono">{localConfig.userNameX !== undefined ? Math.round(localConfig.userNameX) : 50}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={localConfig.userNameX !== undefined ? localConfig.userNameX : 50}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, userNameX: parseInt(e.target.value) }))}
                className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Vertical Position (Y) for signature */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold uppercase text-muted-color tracking-wide">
                <span>Vị trí dọc (Trên - Dưới)</span>
                <span className="text-rose-500 font-mono">
                  {localConfig.userNameY !== undefined 
                    ? Math.round(localConfig.userNameY) 
                    : Math.round(((localConfig.template.canvasHeight - 70) / localConfig.template.canvasHeight) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={localConfig.userNameY !== undefined 
                  ? localConfig.userNameY 
                  : ((localConfig.template.canvasHeight - 70) / localConfig.template.canvasHeight) * 100}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, userNameY: parseInt(e.target.value) }))}
                className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Color selector for signature */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase text-muted-color tracking-wide block">Màu chữ ký</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localConfig.userNameColor || '#e11d48'}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, userNameColor: e.target.value }))}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-border-color bg-transparent p-0.5"
                />
                <span className="text-[10px] font-mono text-muted-color">{localConfig.userNameColor || '#e11d48'}</span>
              </div>
            </div>
          </div>

          <hr className="border-border-color" />

          {/* 5. Date Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase text-foreground tracking-wider flex items-center gap-1">
                <span>📅 Ngày Chụp</span>
              </label>
              <button
                onClick={() => setLocalConfig(prev => ({ ...prev, showDate: !prev.showDate }))}
                className={`w-9 h-5 rounded-full transition-all relative p-0.5 cursor-pointer ${localConfig.showDate ? 'bg-rose-500' : 'bg-slate-300 dark:bg-zinc-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-xs ${localConfig.showDate ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {localConfig.showDate && (
              <div className="space-y-2.5 bg-slate-50/50 dark:bg-zinc-900/40 p-2.5 rounded-2xl border border-border-color/60">
                {/* Font Family selector for date */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-muted-color tracking-wide block">Font Ngày</label>
                  <select
                    value={localConfig.dateFont || 'be-vietnam-pro'}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, dateFont: e.target.value }))}
                    className="w-full bg-background border border-border-color rounded-xl px-2.5 h-8 text-foreground text-xs focus:outline-none focus:border-rose-500 transition-all font-bold"
                  >
                    {AVAILABLE_FONTS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size slider for date */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold uppercase text-muted-color tracking-wide">
                    <span>Cỡ chữ ngày</span>
                    <span className="text-rose-500 font-mono">{localConfig.dateSize || 18}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="1"
                    value={localConfig.dateSize || 18}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, dateSize: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* Horizontal Position (X) for Date */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold uppercase text-muted-color tracking-wide">
                    <span>Vị trí ngang</span>
                    <span className="text-rose-500 font-mono">{localConfig.dateX !== undefined ? Math.round(localConfig.dateX) : 50}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={localConfig.dateX !== undefined ? localConfig.dateX : 50}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, dateX: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* Vertical Position (Y) for Date */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold uppercase text-muted-color tracking-wide">
                    <span>Vị trí dọc</span>
                    <span className="text-rose-500 font-mono">
                      {localConfig.dateY !== undefined 
                        ? Math.round(localConfig.dateY) 
                        : Math.round(((localConfig.template.canvasHeight - 30) / localConfig.template.canvasHeight) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={localConfig.dateY !== undefined 
                      ? localConfig.dateY 
                      : ((localConfig.template.canvasHeight - 30) / localConfig.template.canvasHeight) * 100}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, dateY: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* Color selector for date */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-muted-color tracking-wide block">Màu chữ ngày</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localConfig.dateColor || '#64748b'}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, dateColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-border-color bg-transparent p-0.5"
                    />
                    <span className="text-[10px] font-mono text-muted-color">{localConfig.dateColor || '#64748b'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
