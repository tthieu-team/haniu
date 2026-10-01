'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';
import { CapturedPhoto, PhotoboothConfig, Sticker } from './types';
import { generateComposition } from './composition';
import { playSound } from './sounds';
import { useTranslate } from '@/lib/translator';

interface FrameEditorProps {
  photos: CapturedPhoto[];
  config: PhotoboothConfig;
  stickers?: Sticker[];
  onConfirm: (updatedConfig: PhotoboothConfig) => void;
  onCancel: () => void;
}

const AVAILABLE_FONTS = [
  { id: 'Caveat', name: 'Caveat (Bút dạ nét tay)', font: '"Caveat", cursive' },
  { id: 'Dancing Script', name: 'Dancing Script (Viết tay mềm)', font: '"Dancing Script", cursive' },
  { id: 'Patrick Hand', name: 'Patrick Hand (Viết tay mộc)', font: '"Patrick Hand", cursive' },
  { id: 'Mali', name: 'Mali (Viết tay ngộ nghĩnh)', font: '"Mali", cursive' },
  { id: 'Itim', name: 'Itim (Bút lông nhẹ nhàng)', font: '"Itim", cursive' },
  { id: 'Be Vietnam Pro', name: 'Be Vietnam Pro (Hiện đại)', font: '"Be Vietnam Pro", sans-serif' },
  { id: 'Cormorant Garamond', name: 'Cormorant (Cổ điển)', font: '"Cormorant Garamond", serif' },
];

export const FrameEditor: React.FC<FrameEditorProps> = ({
  photos,
  config,
  stickers = [],
  onConfirm,
  onCancel,
}) => {
  const trans = useTranslate();
  const [localConfig, setLocalConfig] = useState<PhotoboothConfig>({ ...config });
  const [liveUrl, setLiveUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Extract all text layers from the current template
  const textLayers = (localConfig.template?.layers || []).filter((l: any) => l.type === 'text');

  // Update Live Preview Composition URL with Debounce whenever template text layers change
  useEffect(() => {
    let active = true;
    setIsGenerating(true);
    const timer = setTimeout(async () => {
      try {
        const blob = await generateComposition(photos, localConfig, stickers);
        const url = URL.createObjectURL(blob);
        if (active) {
          setLiveUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
          setIsGenerating(false);
        }
      } catch (err) {
        console.error(err);
        if (active) setIsGenerating(false);
      }
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [photos, localConfig, stickers]);

  // Cleanup Live URL
  useEffect(() => {
    return () => {
      if (liveUrl) URL.revokeObjectURL(liveUrl);
    };
  }, [liveUrl]);

  const handleUpdateText = (layerId: string, newText: string) => {
    setLocalConfig(prev => {
      const updatedLayers = (prev.template.layers || []).map((l: any) =>
        l.id === layerId ? { ...l, text: newText } : l
      );
      return {
        ...prev,
        template: {
          ...prev.template,
          layers: updatedLayers,
        },
      };
    });
  };

  const handleUpdateProperty = (layerId: string, property: string, value: any) => {
    setLocalConfig(prev => {
      const updatedLayers = (prev.template.layers || []).map((l: any) =>
        l.id === layerId ? { ...l, [property]: value } : l
      );
      return {
        ...prev,
        template: {
          ...prev.template,
          layers: updatedLayers,
        },
      };
    });
  };

  return (
    <div className="w-full h-full bg-background flex flex-col sm:flex-row relative overflow-hidden transition-colors duration-550 min-h-0 text-xs font-semibold text-slate-800 dark:text-zinc-100">
      {/* Top Left Back Button over Preview */}
      <div className="absolute top-4 left-4 z-50 pointer-events-auto">
        <button
          onClick={onCancel}
          className="h-9 px-4 rounded-full bg-card-bg/95 backdrop-blur-md border border-border-color text-foreground hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Icon name="arrow-left" size={12} className="text-primary-color" />
          <span>{trans('Hủy bỏ')}</span>
        </button>
      </div>

      {/* Live Preview Pane */}
      <div className="flex-1 min-w-0 overflow-y-auto p-6 pt-16 pb-12 flex flex-col items-center justify-start custom-scrollbar">
        {liveUrl ? (
          <div className="relative flex flex-col items-center justify-start select-none max-w-[92vw] sm:max-w-[340px] w-full bg-slate-100 dark:bg-zinc-900 rounded-xl shadow-2xl p-2 border border-border-color">
            <div 
              className="relative w-full overflow-hidden rounded-lg"
              style={{ aspectRatio: `${localConfig.template.canvasWidth} / ${localConfig.template.canvasHeight}` }}
            >
              <img
                src={liveUrl}
                alt="Live frame designer preview"
                className="w-full h-auto pointer-events-none select-none"
              />
              {isGenerating && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold backdrop-blur-sm animate-pulse">
                  {trans('Đang cập nhật...')}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 m-auto">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
            <span className="text-[10px] text-muted-color uppercase tracking-wider font-bold">{trans('Đang chuẩn bị bản xem trước...')}</span>
          </div>
        )}
      </div>

      {/* Right Side Control Sidebar */}
      <div className="w-full sm:w-80 lg:w-96 shrink-0 bg-card-bg border-t sm:border-t-0 sm:border-l border-border-color flex flex-col h-[50vh] sm:h-full z-40 relative shadow-xl overflow-y-auto custom-scrollbar p-5 space-y-4">
        <div className="border-b border-border-color pb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Icon name="palette" size={14} className="text-rose-500" />
              {trans('Chỉnh sửa nội dung chữ')}
            </h3>
            <p className="text-[10px] text-muted-color mt-1 font-normal leading-relaxed">
              {trans('Bạn có thể tùy ý sửa ngày tháng hoặc các thông điệp văn bản trên khung ảnh này.')}
            </p>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onConfirm(localConfig);
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
          >
            <Icon name="check" size={12} />
            <span>{trans('Áp dụng')}</span>
          </button>
        </div>

        {/* Text Layers List */}
        <div className="space-y-4">
          {textLayers.length > 0 ? (
            textLayers.map((layer: any, idx: number) => {
              const currentFont = layer.fontFamily || 'Caveat';
              const currentColor = layer.fontColor || '#2b2b2b';

              return (
                <div
                  key={layer.id || idx}
                  className="p-3.5 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl border border-border-color/80 space-y-3 shadow-xs hover:border-rose-400/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-foreground tracking-wider flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      {trans('Văn bản')} {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-rose-500/80 font-mono px-2 py-0.5 rounded-md bg-rose-500/10 truncate max-w-[130px]">
                      {layer.text || '...'}
                    </span>
                  </div>

                  {/* Text Input */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-muted-color tracking-wide block">
                      {trans('Nội dung hiển thị')}
                    </label>
                    <input
                      type="text"
                      value={layer.text || ''}
                      onChange={(e) => handleUpdateText(layer.id, e.target.value)}
                      placeholder={trans('Ví dụ: 05-10-2024')}
                      className="w-full bg-background border border-border-color rounded-xl px-3 h-10 text-foreground text-sm font-bold focus:outline-none focus:border-rose-500 transition-all shadow-xs"
                    />
                  </div>

                  {/* Font, Size and Color Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* Font Chữ */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-color tracking-wide block">
                        {trans('Font chữ')}
                      </label>
                      <select
                        value={currentFont}
                        onChange={(e) => handleUpdateProperty(layer.id, 'fontFamily', e.target.value)}
                        className="w-full bg-background border border-border-color rounded-xl px-2 h-9 text-foreground text-xs font-semibold focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
                        style={{ fontFamily: AVAILABLE_FONTS.find(f => f.id === currentFont)?.font || 'inherit' }}
                      >
                        {AVAILABLE_FONTS.map((f) => (
                          <option key={f.id} value={f.id} style={{ fontFamily: f.font }}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cỡ Chữ (Font Size) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase text-muted-color tracking-wide block">
                          {trans('Cỡ chữ')}
                        </label>
                        <span className="text-xs font-mono font-bold text-rose-500">
                          {layer.fontSize || 24}px
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 h-9 w-full">
                        <input
                          type="range"
                          min="8"
                          max="64"
                          step="1"
                          value={layer.fontSize || 24}
                          onChange={(e) => handleUpdateProperty(layer.id, 'fontSize', parseInt(e.target.value) || 24)}
                          className="flex-1 min-w-0 h-1.5 bg-background rounded-full appearance-none accent-rose-500 cursor-pointer"
                        />
                        <input
                          type="number"
                          min="8"
                          max="64"
                          value={layer.fontSize || 24}
                          onChange={(e) => handleUpdateProperty(layer.id, 'fontSize', parseInt(e.target.value) || 24)}
                          className="w-10 h-7 rounded-lg bg-background border border-border-color text-center font-mono font-bold text-[11px] shrink-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Màu chữ và định dạng (Bold, Italic, Align) */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-border-color/50 items-center">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-color tracking-wide block">
                        {trans('Màu chữ')}
                      </label>
                      <div className="flex items-center gap-1.5 h-8">
                        <input
                          type="color"
                          value={currentColor}
                          onChange={(e) => handleUpdateProperty(layer.id, 'fontColor', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-border-color bg-transparent p-0.5 shrink-0"
                        />
                        <span className="text-xs font-mono text-muted-color truncate">{currentColor}</span>
                      </div>
                    </div>

                    {/* Định dạng B / I / Align */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-color tracking-wide block">
                        {trans('Định dạng')}
                      </label>
                      <div className="flex gap-1 h-8 items-center">
                        <button
                          type="button"
                          onClick={() => handleUpdateProperty(layer.id, 'fontWeight', layer.fontWeight === 'bold' ? 'normal' : 'bold')}
                          className={`w-7 h-7 rounded-lg text-xs font-black border transition-all cursor-pointer flex items-center justify-center ${
                            layer.fontWeight === 'bold'
                              ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                              : 'bg-background text-muted-color border-border-color hover:text-foreground'
                          }`}
                          title={trans('In đậm (Bold)')}
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateProperty(layer.id, 'fontStyle', layer.fontStyle === 'italic' ? 'normal' : 'italic')}
                          className={`w-7 h-7 rounded-lg text-xs italic font-bold border transition-all cursor-pointer flex items-center justify-center ${
                            layer.fontStyle === 'italic'
                              ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                              : 'bg-background text-muted-color border-border-color hover:text-foreground'
                          }`}
                          title={trans('In nghiêng (Italic)')}
                        >
                          I
                        </button>
                        {(['left', 'center', 'right'] as const).map((al) => (
                          <button
                            key={al}
                            type="button"
                            onClick={() => handleUpdateProperty(layer.id, 'align', al)}
                            className={`flex-1 h-7 rounded-lg text-[9px] font-bold uppercase border transition-all cursor-pointer flex items-center justify-center ${
                              (layer.align || 'center') === al
                                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                                : 'bg-background text-muted-color border-border-color hover:text-foreground'
                            }`}
                            title={`Căn ${al}`}
                          >
                            {al === 'left' ? '⬅' : al === 'right' ? '➡' : '⏺'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-border-color text-center space-y-1 text-muted-color">
              <p className="text-xs font-bold text-foreground">{trans('Không có dòng chữ nào')}</p>
              <p className="text-[10px] leading-relaxed">{trans('Khung ảnh này không chứa văn bản nào cần chỉnh sửa.')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
