'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';

interface RightPropertiesProps {
  selectedLayer: any;
  updateSelectedLayer: (updates: any) => void;
  handleDeleteLayer: (id: string) => void;
  builderTemplate?: any;
  setBuilderTemplate?: React.Dispatch<React.SetStateAction<any>>;
}

// Reusable Smart Number Input that allows free typing, backspacing, decimals and zero entry without forced locks
const NumberInput: React.FC<{
  label?: string;
  value: number | undefined;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number | string;
  unit?: string;
  className?: string;
}> = ({ label, value, onChange, min = 0, max = 100, step = 'any', unit = '', className = '' }) => {
  const [tempVal, setTempVal] = useState(value !== undefined ? String(value) : '');
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    if (tempVal === '' || isNaN(Number(tempVal))) {
      const fallback = min ?? 0;
      setTempVal(String(fallback));
      onChange(fallback);
    } else {
      let num = parseFloat(tempVal);
      if (min !== undefined) num = Math.max(min, num);
      if (max !== undefined) num = Math.min(max, num);
      // Round to 2 decimal places to avoid floating point artifacts
      const rounded = Math.round(num * 100) / 100;
      setTempVal(String(rounded));
      onChange(rounded);
    }
  };

  const displayValue = isFocused ? tempVal : (value !== undefined ? String(value) : '');

  return (
    <div className={className}>
      {label && (
        <label className="text-[8px] text-slate-500 dark:text-zinc-400 font-bold block mb-1 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onFocus={() => {
            setIsFocused(true);
            setTempVal(value !== undefined ? String(value) : '');
          }}
          onChange={e => {
            setTempVal(e.target.value);
            const parsed = parseFloat(e.target.value);
            if (!isNaN(parsed)) {
              onChange(parsed);
            }
          }}
          onBlur={handleBlur}
          className="w-full px-2.5 h-8 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-xs font-bold font-mono text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-rose-500 transition-colors"
        />
        {unit && (
          <span className="absolute right-2.5 text-[10px] font-bold text-slate-400 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

// Reusable Compact Color Picker Row (Never breaks layout!)
const ColorPickerRow: React.FC<{
  label?: string;
  color: string;
  onChange: (c: string) => void;
  onPickEyedropper?: () => void;
  presets?: { color: string; name: string; border?: boolean }[];
}> = ({ label, color, onChange, onPickEyedropper, presets }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[8px] text-slate-500 dark:text-zinc-400 font-bold block uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex gap-1.5 items-center">
        <input
          type="color"
          value={color?.startsWith('#') ? color : '#2b2b2b'}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-700 p-0.5 bg-white dark:bg-zinc-800 shrink-0 shadow-2xs"
          title="Chọn màu"
        />
        <input
          type="text"
          value={color || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-2.5 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-rose-500 min-w-0"
        />
        {onPickEyedropper && (
          <button
            type="button"
            onClick={onPickEyedropper}
            title="Bút chấm màu từ màn hình"
            className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 transition-all flex items-center justify-center shrink-0 cursor-pointer active:scale-95 shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m14 7 3 3m-9.5 9.5-3.5 1 1-3.5 11.5-11.5a2.12 2.12 0 0 1 3 3L7.5 19.5z" />
              <path d="M16 5l3 3" />
            </svg>
          </button>
        )}
      </div>
      {presets && presets.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {presets.map(p => (
            <button
              key={p.color}
              type="button"
              onClick={() => onChange(p.color)}
              className={`w-5 h-5 rounded-md transition-all hover:scale-115 active:scale-95 cursor-pointer relative shadow-2xs ${
                p.border ? 'border border-slate-300 dark:border-zinc-600' : ''
              } ${color === p.color ? 'ring-2 ring-rose-500 ring-offset-1' : ''}`}
              style={{ backgroundColor: p.color === 'transparent' ? '#ffffff' : p.color }}
              title={p.name}
            >
              {p.color === 'transparent' && (
                <span className="absolute inset-0 flex items-center justify-center text-red-500 font-black">
                  <Icon name="close" size={10} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const RightProperties: React.FC<RightPropertiesProps> = ({
  selectedLayer,
  updateSelectedLayer,
  handleDeleteLayer,
  builderTemplate,
  setBuilderTemplate
}) => {
  // Tab states
  const [activeLayerTab, setActiveLayerTab] = useState<'content' | 'layout' | 'effects'>('content');
  const [activeTemplateTab, setActiveTemplateTab] = useState<'general' | 'background' | 'overlay'>('general');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAiShape, setIsGeneratingAiShape] = useState(false);

  // EyeDropper color picker from screen
  const handlePickColor = async (targetKey: string, isTemplateProp?: boolean) => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          if (isTemplateProp) {
            setBuilderTemplate?.((p: any) => ({ ...p, [targetKey]: result.sRGBHex, backgroundType: 'solid' }));
          } else {
            updateSelectedLayer({ 
              [targetKey]: result.sRGBHex,
              ...(targetKey === 'backgroundColor' ? { 
                bgRadius: selectedLayer?.bgRadius ?? 999, 
                bgPadding: selectedLayer?.bgPadding ?? 8 
              } : {})
            });
          }
        }
      } catch {
        // User cancelled
      }
    } else {
      alert('Trình duyệt hiện tại chưa hỗ trợ API EyeDropper. Bạn có thể chọn trên bảng màu hoặc nhập mã HEX.');
    }
  };

  const handleGenerateAiShape = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAiShape(true);
    
    const p = aiPrompt.toLowerCase();
    let localShape: { path: string; polygon: string } | null = null;
    
    if (p.includes('trái tim') || p.includes('tim') || p.includes('heart')) {
      localShape = {
        path: "M 50 90 C 20 70, 5 45, 15 25 C 25 5, 45 10, 50 25 C 55 10, 75 5, 85 25 C 95 45, 80 70, 50 90 Z",
        polygon: "50% 90%, 20% 70%, 5% 45%, 15% 25%, 25% 5%, 50% 25%, 75% 5%, 85% 25%, 95% 45%, 80% 70%"
      };
    } else if (p.includes('đám mây') || p.includes('mây') || p.includes('cloud')) {
      localShape = {
        path: "M 20 65 C 5 65, 5 40, 20 40 C 20 20, 45 15, 55 30 C 65 15, 90 20, 90 45 C 100 45, 100 70, 80 70 L 20 70 Z",
        polygon: "20% 70%, 5% 60%, 10% 40%, 25% 30%, 45% 15%, 65% 20%, 85% 30%, 95% 50%, 85% 70%, 20% 70%"
      };
    } else if (p.includes('ngôi sao') || p.includes('sao') || p.includes('star')) {
      localShape = {
        path: "M 50 8 C 55 18, 65 22, 78 25 C 70 35, 68 45, 72 58 C 60 55, 50 60, 40 55 C 28 58, 30 35, 22 25 C 35 22, 45 18, 50 8 Z",
        polygon: "50% 8%, 65% 22%, 78% 25%, 68% 45%, 72% 58%, 50% 60%, 28% 58%, 30% 35%, 22% 25%, 35% 22%"
      };
    } else if (p.includes('hoa cúc') || p.includes('chrysanthemum')) {
      localShape = {
        path: "M 50 10 C 60 5, 70 15, 65 30 C 80 20, 90 35, 80 50 C 95 55, 90 75, 70 75 C 75 90, 60 100, 50 90 C 40 100, 25 90, 30 75 C 10 75, 5 55, 20 50 C 10 35, 20 20, 35 30 C 30 15, 40 5, 50 10 Z",
        polygon: "50% 10%, 65% 30%, 80% 20%, 80% 50%, 95% 55%, 70% 75%, 75% 90%, 50% 90%, 25% 90%, 30% 75%, 5% 55%, 20% 50%, 20% 20%, 35% 30%"
      };
    } else if (p.includes('sakura') || p.includes('hoa anh đào') || p.includes('anh đào')) {
      localShape = {
        path: "M 50 15 C 65 5, 80 20, 70 40 C 90 35, 95 55, 75 60 C 85 80, 65 95, 50 80 C 35 95, 15 80, 25 60 C 5 55, 10 35, 30 40 C 20 20, 35 5, 50 15 Z",
        polygon: "50% 15%, 70% 40%, 90% 35%, 75% 60%, 85% 80%, 50% 80%, 15% 80%, 25% 60%, 10% 35%, 30% 40%"
      };
    }

    if (localShape) {
      updateSelectedLayer({
        frameShape: 'custom-path',
        framePath: localShape.path,
        framePolygon: localShape.polygon
      });
      setIsGeneratingAiShape(false);
      return;
    }

    let polygonStr = '50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%';
    updateSelectedLayer({ framePolygon: polygonStr });
    setIsGeneratingAiShape(false);
  };

  if (!selectedLayer) {
    return (
      <div 
        style={{ width: '360px', minWidth: '360px', maxWidth: '360px', flexShrink: 0 }}
        className="w-[360px] min-w-[360px] max-w-[360px] border-l border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-3.5 space-y-4 shrink-0 flex flex-col font-sans h-full"
      >
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-2.5">
          <span className="text-xs font-black uppercase text-rose-500 tracking-wider flex items-center gap-1.5">
            <Icon name="settings" size={14} className="shrink-0" />
            <span>Cấu hình Template</span>
          </span>
        </div>

        {/* Top Tab Bar for Template Settings */}
        <div className="flex bg-slate-100 dark:bg-zinc-850 p-1 rounded-xl gap-1">
          {[
            { id: 'general', label: 'Cơ bản', icon: 'file-text' },
            { id: 'background', label: 'Hình nền', icon: 'palette' },
            { id: 'overlay', label: 'Lớp phủ', icon: 'image' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTemplateTab(t.id as any)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTemplateTab === t.id
                  ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Icon name={t.icon} size={12} className="shrink-0" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: GENERAL TEMPLATE INFO */}
        {activeTemplateTab === 'general' && (
          <div className="space-y-4 pt-1">
            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
              <div>
                <label className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-400 block mb-1">
                  Tên Template
                </label>
                <input
                  type="text"
                  value={builderTemplate?.name || ''}
                  onChange={e => setBuilderTemplate?.((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
                  placeholder="Nhập tên template..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-zinc-800">
                <NumberInput
                  label="Chiều rộng canvas"
                  value={builderTemplate?.canvasWidth || 1200}
                  onChange={w => setBuilderTemplate?.((p: any) => ({ ...p, canvasWidth: w }))}
                  min={200}
                  max={4000}
                  unit="px"
                />
                <NumberInput
                  label="Chiều cao canvas"
                  value={builderTemplate?.canvasHeight || 1600}
                  onChange={h => setBuilderTemplate?.((p: any) => ({ ...p, canvasHeight: h }))}
                  min={200}
                  max={4000}
                  unit="px"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BACKGROUND SETTINGS */}
        {activeTemplateTab === 'background' && (
          <div className="space-y-4 pt-1">
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl gap-1">
              {['solid', 'gradient', 'image'].map((bType) => (
                <button
                  key={bType}
                  onClick={() => setBuilderTemplate?.((p: any) => ({
                    ...p,
                    backgroundType: bType,
                    backgroundGradient: p.backgroundGradient || { color1: '#fda4af', color2: '#f43f5e', angle: 45 }
                  }))}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                    (builderTemplate?.backgroundType || 'solid') === bType
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                  }`}
                >
                  {bType === 'solid' ? 'Đơn sắc' : bType === 'gradient' ? 'Gradient' : 'Ảnh nền'}
                </button>
              ))}
            </div>

            {builderTemplate?.backgroundType === 'solid' && (
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
                <ColorPickerRow
                  label="Mã màu nền"
                  color={builderTemplate.background?.startsWith('#') ? builderTemplate.background : '#f6f1ec'}
                  onChange={c => setBuilderTemplate?.((p: any) => ({ ...p, background: c, backgroundType: 'solid' }))}
                  onPickEyedropper={() => handlePickColor('background', true)}
                  presets={[
                    { color: '#f6f1ec', name: 'Be kem ấm vintage (như mẫu)' },
                    { color: '#ffffff', name: 'Trắng tinh', border: true },
                    { color: '#fad2d8', name: 'Hồng pastel' },
                    { color: '#fef3c7', name: 'Vàng bơ nhạt' },
                    { color: '#d1fae5', name: 'Xanh bạc hà' },
                    { color: '#e0e7ff', name: 'Xanh pastel' },
                    { color: '#1e293b', name: 'Đen mờ' },
                  ]}
                />
              </div>
            )}

            {builderTemplate?.backgroundType === 'gradient' && (
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <ColorPickerRow
                    label="Màu bắt đầu"
                    color={builderTemplate.backgroundGradient?.color1 || '#fda4af'}
                    onChange={c => setBuilderTemplate?.((p: any) => ({
                      ...p,
                      backgroundGradient: { ...(p.backgroundGradient || {}), color1: c }
                    }))}
                  />
                  <ColorPickerRow
                    label="Màu kết thúc"
                    color={builderTemplate.backgroundGradient?.color2 || '#f43f5e'}
                    onChange={c => setBuilderTemplate?.((p: any) => ({
                      ...p,
                      backgroundGradient: { ...(p.backgroundGradient || {}), color2: c }
                    }))}
                  />
                </div>
              </div>
            )}

            {builderTemplate?.backgroundType === 'image' && (
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2.5">
                <label className="text-[9px] font-black uppercase text-slate-400 block">Link ảnh hoặc tải file</label>
                <input
                  type="text"
                  value={builderTemplate.background?.startsWith('http') || builderTemplate.background?.startsWith('data:') ? builderTemplate.background : ''}
                  onChange={e => setBuilderTemplate?.((p: any) => ({ ...p, background: e.target.value, backgroundType: 'image' }))}
                  placeholder="URL ảnh nền..."
                  className="w-full px-2.5 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] focus:outline-none"
                />
                <label className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center cursor-pointer transition-colors shadow-xs">
                  Chọn File Ảnh Nền
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setBuilderTemplate?.((p: any) => ({
                              ...p,
                              background: event.target!.result as string,
                              backgroundType: 'image'
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            )}

            {/* Template Canvas Border Controls */}
            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wider block">
                    Viền Nền Template (Border)
                  </label>
                  <span className="text-[8px] text-slate-400 block font-medium">
                    Khung viền bao quanh toàn bộ thiết kế
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const isBorderOn = (builderTemplate?.canvasBorderSize ?? 0) > 0;
                    if (isBorderOn) {
                      setBuilderTemplate?.((p: any) => ({ ...p, canvasBorderSize: 0 }));
                    } else {
                      setBuilderTemplate?.((p: any) => ({ 
                        ...p, 
                        canvasBorderSize: 4, 
                        canvasBorderColor: p?.canvasBorderColor || '#ffffff',
                        canvasBorderStyle: p?.canvasBorderStyle || 'solid'
                      }));
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                    (builderTemplate?.canvasBorderSize ?? 0) > 0
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${(builderTemplate?.canvasBorderSize ?? 0) > 0 ? 'bg-white' : 'bg-slate-400'}`} />
                  <span>{(builderTemplate?.canvasBorderSize ?? 0) > 0 ? 'BẬT' : 'TẮT'}</span>
                </button>
              </div>

              {(builderTemplate?.canvasBorderSize ?? 0) > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-200/60 dark:border-zinc-800">
                  <div className="grid grid-cols-2 gap-2">
                    <NumberInput
                      label="Độ dày viền (px)"
                      value={builderTemplate?.canvasBorderSize ?? 4}
                      onChange={s => setBuilderTemplate?.((p: any) => ({ ...p, canvasBorderSize: s }))}
                      min={1}
                      max={100}
                      step={1}
                      unit="px"
                    />
                    <NumberInput
                      label="Bo góc viền (px)"
                      value={builderTemplate?.canvasBorderRadius ?? 8}
                      onChange={r => setBuilderTemplate?.((p: any) => ({ ...p, canvasBorderRadius: r }))}
                      min={0}
                      max={100}
                      step={1}
                      unit="px"
                    />
                  </div>

                  <ColorPickerRow
                    label="Màu viền nền"
                    color={builderTemplate?.canvasBorderColor || '#ffffff'}
                    onChange={c => setBuilderTemplate?.((p: any) => ({ ...p, canvasBorderColor: c }))}
                    onPickEyedropper={() => handlePickColor('canvasBorderColor', true)}
                    presets={[
                      { color: '#ffffff', name: 'Trắng', border: true },
                      { color: '#fad2d8', name: 'Hồng pastel' },
                      { color: '#f43f5e', name: 'Hồng đậm' },
                      { color: '#f6f1ec', name: 'Be vintage' },
                      { color: '#2b2b2b', name: 'Đen chì' },
                    ]}
                  />

                  <div>
                    <label className="text-[8px] text-slate-500 dark:text-zinc-400 font-bold block mb-1 uppercase tracking-wider">
                      Kiểu nét viền nền
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: 'solid', label: 'Liền' },
                        { id: 'dashed', label: 'Đứt' },
                        { id: 'dotted', label: 'Chấm' },
                        { id: 'double', label: 'Đôi' },
                      ].map(styleItem => (
                        <button
                          key={styleItem.id}
                          type="button"
                          onClick={() => setBuilderTemplate?.((p: any) => ({ ...p, canvasBorderStyle: styleItem.id }))}
                          className={`py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                            (builderTemplate?.canvasBorderStyle || 'solid') === styleItem.id
                              ? 'bg-rose-500 border-rose-600 text-white shadow-2xs'
                              : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300'
                          }`}
                        >
                          {styleItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: OVERLAY SETTINGS */}
        {activeTemplateTab === 'overlay' && (
          <div className="space-y-4 pt-1">
            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
              <label className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-400 block">
                Lớp Phủ Thiết Kế (PNG Overlay)
              </label>
              <input
                type="text"
                value={builderTemplate?.overlay || ''}
                onChange={e => setBuilderTemplate?.((p: any) => ({ ...p, overlay: e.target.value }))}
                placeholder="URL ảnh PNG trong suốt..."
                className="w-full px-2.5 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono focus:outline-none"
              />
              <div className="flex gap-2">
                <label className="flex-1 h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center cursor-pointer transition-colors shadow-xs">
                  Tải Lên PNG
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setBuilderTemplate?.((p: any) => ({
                              ...p,
                              overlay: event.target!.result as string
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {builderTemplate?.overlay && (
                  <button
                    onClick={() => setBuilderTemplate?.((p: any) => ({ ...p, overlay: '' }))}
                    className="px-3 bg-red-50 hover:bg-red-100 dark:bg-red-955/20 border border-red-200 dark:border-red-900 rounded-xl text-red-500 text-[9px] font-black uppercase transition-colors cursor-pointer"
                  >
                    Gỡ bỏ
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: LAYER SELECTED (TABBED PROPERTIES ACCORDION)
  // ─────────────────────────────────────────────────────────────────────────────
  const shadowStyleActive = Boolean(selectedLayer.shadowColor && selectedLayer.shadowColor !== 'rgba(0,0,0,0)' && selectedLayer.shadowColor !== 'none');
  const isBgActive = Boolean(selectedLayer.backgroundColor && selectedLayer.backgroundColor !== 'transparent');

  return (
    <div 
      style={{ width: '360px', minWidth: '360px', maxWidth: '360px', flexShrink: 0 }}
      className="w-[360px] min-w-[360px] max-w-[360px] border-l border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-3.5 space-y-4 shrink-0 flex flex-col font-sans h-full"
    >
      
      {/* Top Header with Delete button */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-rose-500 shrink-0">
            {selectedLayer.type === 'text' ? <Icon name="type" size={15} /> : selectedLayer.type === 'frame' ? <Icon name="camera" size={15} /> : selectedLayer.type === 'sticker' ? <Icon name="palette" size={15} /> : selectedLayer.type === 'logo' ? <Icon name="gem" size={15} /> : selectedLayer.type === 'shape' ? <Icon name="square" size={15} /> : <Icon name="image" size={15} />}
          </span>
          <span className="text-xs font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wider truncate">
            {selectedLayer.label || (selectedLayer.type === 'text' ? 'Văn Bản' : selectedLayer.type === 'frame' ? `Khung #${selectedLayer.order || 1}` : 'Thành Phần')}
          </span>
        </div>
        <button 
          onClick={() => handleDeleteLayer(selectedLayer.id)}
          className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-955/20 border border-red-200/60 dark:border-red-900/40 rounded-xl text-red-500 cursor-pointer transition-colors shrink-0"
          title="Xóa lớp này"
        >
          <Icon name="trash" size={13} />
        </button>
      </div>

      {/* Layer Navigation Tabs */}
      <div className="flex bg-slate-100 dark:bg-zinc-850 p-1 rounded-xl gap-1">
        {[
          { id: 'content', label: 'Nội dung', icon: 'palette' },
          { id: 'layout', label: 'Vị trí (%)', icon: 'sliders' },
          { id: 'effects', label: 'Hiệu ứng', icon: 'sparkles' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveLayerTab(t.id as any)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeLayerTab === t.id
                ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <Icon name={t.icon} size={12} className="shrink-0" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: CONTENT & STYLING */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeLayerTab === 'content' && (
        <div className="space-y-4 pt-1">
          
          {/* TEXT LAYER SPECIFIC SETTINGS */}
          {selectedLayer.type === 'text' && (
            <div className="space-y-3.5">
              {/* Text Content */}
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-slate-500 dark:text-zinc-400 font-bold block uppercase tracking-wider">
                    Nội dung văn bản
                  </label>
                  <span className="text-[8px] text-slate-400 font-medium">
                    (Để trống sẽ tự xóa)
                  </span>
                </div>
                <textarea 
                  rows={2}
                  value={selectedLayer.text || ''}
                  onChange={e => updateSelectedLayer({ text: e.target.value })}
                  onFocus={e => {
                    if (selectedLayer.text === 'Nhập chữ...' || selectedLayer.text === 'Văn bản mới') {
                      e.target.select();
                    }
                  }}
                  onBlur={e => {
                    if (!e.target.value.trim()) {
                      handleDeleteLayer(selectedLayer.id);
                    }
                  }}
                  placeholder="Nhập nội dung chữ (để trống sẽ tự xóa)..."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-rose-500 shadow-2xs"
                />
              </div>

              {/* Text Highlight Pastel Background Card */}
              <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-300 tracking-wider block">
                      Màu Nền Cho Chữ
                    </label>
                    <span className="text-[8px] text-rose-500/80 dark:text-rose-400 block font-medium">
                      Vệt màu pastel làm nổi bật chữ
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isBgActive) {
                        updateSelectedLayer({ backgroundColor: 'transparent' });
                      } else {
                        updateSelectedLayer({ 
                          backgroundColor: '#fad2d8', 
                          bgRadius: selectedLayer.bgRadius ?? 999, 
                          bgPadding: selectedLayer.bgPadding ?? 8 
                        });
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                      isBgActive
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isBgActive ? 'bg-white' : 'bg-slate-400'}`} />
                    <span>{isBgActive ? 'BẬT' : 'TẮT'}</span>
                  </button>
                </div>

                {isBgActive && (
                  <div className="space-y-3 pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
                    <ColorPickerRow
                      color={selectedLayer.backgroundColor || '#fad2d8'}
                      onChange={c => updateSelectedLayer({ 
                        backgroundColor: c,
                        bgRadius: selectedLayer.bgRadius ?? 999,
                        bgPadding: selectedLayer.bgPadding ?? 8
                      })}
                      onPickEyedropper={() => handlePickColor('backgroundColor')}
                      presets={[
                        { color: '#fad2d8', name: 'Hồng pastel vệt cọ' },
                        { color: '#fbcfe8', name: 'Hồng kẹo baby' },
                        { color: '#f6f1ec', name: 'Be kem ấm' },
                        { color: '#fef08a', name: 'Vàng bơ nhạt' },
                        { color: '#bbf7d0', name: 'Xanh bạc hà' },
                        { color: '#ddd6fe', name: 'Tím pastel' },
                        { color: '#ffffff', name: 'Trắng sứ', border: true },
                        { color: 'transparent', name: 'Tắt nền', border: true },
                      ]}
                    />

                    {/* Shape / Radius of background highlight */}
                    <div className="space-y-2 pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
                      <div className="flex items-center justify-between">
                        <label className="text-[8px] text-slate-500 dark:text-zinc-400 font-bold block uppercase tracking-wider">
                          Bo góc nền chữ
                        </label>
                        <span className="text-[9px] font-mono font-bold text-rose-500">
                          {`${(selectedLayer.bgRadius ?? 999) >= 999 ? 999 : (selectedLayer.bgRadius ?? 0)}px`}
                        </span>
                      </div>

                      <NumberInput
                        value={(selectedLayer.bgRadius ?? 999) >= 999 ? 999 : (selectedLayer.bgRadius ?? 0)}
                        onChange={r => updateSelectedLayer({ bgRadius: r })}
                        min={0}
                        max={999}
                        step={1}
                        unit="px"
                      />

                      {/* Quick preset chips in 5 balanced columns */}
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          { label: '0px', radius: 0 },
                          { label: '6px', radius: 6 },
                          { label: '12px', radius: 12 },
                          { label: '24px', radius: 24 },
                          { label: '999px', radius: 999 },
                        ].map(item => {
                          const isItemActive = item.radius === 999 
                            ? (selectedLayer.bgRadius ?? 0) >= 999 
                            : (selectedLayer.bgRadius ?? 0) === item.radius;
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => updateSelectedLayer({ bgRadius: item.radius })}
                              className={`py-1 rounded-lg text-[9px] font-mono font-bold border transition-all cursor-pointer text-center px-0.5 ${
                                isItemActive
                                  ? 'bg-rose-500 border-rose-600 text-white shadow-2xs'
                                  : 'bg-white dark:bg-zinc-900 border-rose-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-rose-600'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Background Border Controls */}
                    <div className="space-y-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
                      <NumberInput
                        label="Độ dày viền nền"
                        value={selectedLayer.bgBorderSize ?? 0}
                        onChange={s => updateSelectedLayer({ bgBorderSize: s })}
                        min={0}
                        max={15}
                        step={0.5}
                        unit="px"
                      />

                      {(selectedLayer.bgBorderSize ?? 0) > 0 && (
                        <div className="space-y-2.5">
                          <ColorPickerRow
                            label="Màu viền nền"
                            color={selectedLayer.bgBorderColor || '#ffffff'}
                            onChange={c => updateSelectedLayer({ bgBorderColor: c })}
                            onPickEyedropper={() => handlePickColor('bgBorderColor')}
                            presets={[
                              { color: '#ffffff', name: 'Trắng', border: true },
                              { color: '#2b2b2b', name: 'Đen chì' },
                              { color: '#f43f5e', name: 'Hồng đậm' },
                              { color: '#fbcfe8', name: 'Hồng nhạt' },
                              { color: '#fef08a', name: 'Vàng nhạt' },
                            ]}
                          />

                          <div>
                            <label className="text-[8px] text-slate-500 dark:text-zinc-400 font-bold block mb-1 uppercase tracking-wider">
                              Kiểu nét viền nền
                            </label>
                            <div className="grid grid-cols-3 gap-1">
                              {[
                                { id: 'solid', label: 'Nét liền' },
                                { id: 'dashed', label: 'Nét đứt' },
                                { id: 'dotted', label: 'Chấm bi' },
                              ].map(styleItem => (
                                <button
                                  key={styleItem.id}
                                  type="button"
                                  onClick={() => updateSelectedLayer({ bgBorderStyle: styleItem.id })}
                                  className={`py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                                    (selectedLayer.bgBorderStyle || 'solid') === styleItem.id
                                      ? 'bg-rose-500 border-rose-600 text-white shadow-2xs'
                                      : 'bg-white dark:bg-zinc-900 border-rose-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300'
                                  }`}
                                >
                                  {styleItem.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Font Color, Family & Typography */}
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
                <ColorPickerRow
                  label="Màu sắc chữ"
                  color={selectedLayer.fontColor || '#2b2b2b'}
                  onChange={c => updateSelectedLayer({ fontColor: c })}
                  onPickEyedropper={() => handlePickColor('fontColor')}
                  presets={[
                    { color: '#2b2b2b', name: 'Đen chì' },
                    { color: '#5c4033', name: 'Nâu đất' },
                    { color: '#c28b96', name: 'Hồng đất' },
                    { color: '#e11d48', name: 'Đỏ hồng' },
                    { color: '#ffffff', name: 'Trắng tinh', border: true },
                  ]}
                />

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-zinc-800">
                  <div>
                    <label className="text-[8px] text-slate-500 dark:text-zinc-400 font-bold block mb-1 uppercase tracking-wider">
                      Họ Font
                    </label>
                    <select 
                      value={selectedLayer.fontFamily || 'Patrick Hand'}
                      onChange={e => updateSelectedLayer({ fontFamily: e.target.value })}
                      className="w-full px-2 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-bold text-slate-800 dark:text-zinc-100"
                    >
                      <optgroup label="Chữ Vẽ Tay">
                        <option value="Patrick Hand">Patrick Hand</option>
                        <option value="Caveat">Caveat</option>
                        <option value="Mali">Mali</option>
                        <option value="Itim">Itim</option>
                        <option value="Dancing Script">Dancing Script</option>
                      </optgroup>
                      <optgroup label="Font Hiện Đại">
                        <option value="Be Vietnam Pro">Be Vietnam Pro</option>
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="sans-serif">Sans Serif</option>
                      </optgroup>
                    </select>
                  </div>

                  <NumberInput
                    label="Cỡ chữ (px)"
                    value={selectedLayer.fontSize || 28}
                    onChange={s => updateSelectedLayer({ fontSize: s })}
                    min={8}
                    max={120}
                    unit="px"
                  />
                </div>

                {/* Alignment & Weight */}
                <div className="flex gap-1.5 pt-1">
                  <button 
                    type="button"
                    onClick={() => updateSelectedLayer({ fontWeight: selectedLayer.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                      selectedLayer.fontWeight === 'bold' 
                        ? 'bg-rose-500 border-rose-600 text-white' 
                        : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    B
                  </button>
                  <button 
                    type="button"
                    onClick={() => updateSelectedLayer({ fontStyle: selectedLayer.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    className={`flex-1 py-1.5 rounded-lg text-xs italic font-bold border transition-all cursor-pointer ${
                      selectedLayer.fontStyle === 'italic' 
                        ? 'bg-rose-500 border-rose-600 text-white' 
                        : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    I
                  </button>
                  {['left', 'center', 'right'].map((align) => (
                    <button 
                      key={align}
                      type="button"
                      onClick={() => updateSelectedLayer({ align })}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold border uppercase transition-all cursor-pointer ${
                        selectedLayer.align === align 
                          ? 'bg-rose-500 border-rose-600 text-white' 
                          : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      {align === 'left' ? 'Trái' : align === 'center' ? 'Giữa' : 'Phải'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Stroke / Outline Card with ON/OFF Toggle in Tab 1 */}
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wider block">
                      Viền Nét Chữ (Stroke)
                    </label>
                    <span className="text-[8px] text-slate-400 block font-medium">
                      Tạo đường viền nét bo quanh chữ
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const isStrokeOn = (selectedLayer.strokeSize ?? 0) > 0;
                      if (isStrokeOn) {
                        updateSelectedLayer({ strokeSize: 0 });
                      } else {
                        updateSelectedLayer({ 
                          strokeSize: 2, 
                          strokeColor: selectedLayer.strokeColor || '#ffffff' 
                        });
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                      (selectedLayer.strokeSize ?? 0) > 0
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${(selectedLayer.strokeSize ?? 0) > 0 ? 'bg-white' : 'bg-slate-400'}`} />
                    <span>{(selectedLayer.strokeSize ?? 0) > 0 ? 'BẬT' : 'TẮT'}</span>
                  </button>
                </div>

                {(selectedLayer.strokeSize ?? 0) > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-zinc-800">
                    <NumberInput
                      label="Độ dày viền nét (px)"
                      value={selectedLayer.strokeSize ?? 2}
                      onChange={s => updateSelectedLayer({ strokeSize: s })}
                      min={0.5}
                      max={15}
                      step={0.5}
                      unit="px"
                    />
                    <ColorPickerRow
                      label="Màu viền chữ"
                      color={selectedLayer.strokeColor || '#ffffff'}
                      onChange={c => updateSelectedLayer({ strokeColor: c })}
                      onPickEyedropper={() => handlePickColor('strokeColor')}
                      presets={[
                        { color: '#ffffff', name: 'Trắng', border: true },
                        { color: '#000000', name: 'Đen' },
                        { color: '#f43f5e', name: 'Hồng đậm' },
                        { color: '#fef08a', name: 'Vàng nhạt' },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FRAME LAYER SPECIFIC SETTINGS */}
          {selectedLayer.type === 'frame' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] text-slate-500 dark:text-zinc-400 font-bold block mb-1 uppercase tracking-wider">
                      Thứ tự chụp
                    </label>
                    <select 
                      value={selectedLayer.order || 1}
                      onChange={e => updateSelectedLayer({ order: parseInt(e.target.value) })}
                      className="w-full px-2 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>Ảnh thứ {n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-500 dark:text-zinc-400 font-bold block mb-1 uppercase tracking-wider">
                      Cố định tỷ lệ
                    </label>
                    <select 
                      value={selectedLayer.aspectRatio || 'free'}
                      onChange={e => updateSelectedLayer({ aspectRatio: e.target.value })}
                      className="w-full px-2 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold"
                    >
                      <option value="free">Tự do</option>
                      <option value="1:1">1:1 (Vuông)</option>
                      <option value="4:5">4:5 (Instagram)</option>
                      <option value="9:16">9:16 (Story)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-zinc-800">
                  <NumberInput
                    label="Độ dày viền (px)"
                    value={selectedLayer.borderSize ?? 4}
                    onChange={b => updateSelectedLayer({ borderSize: b })}
                    min={0}
                    max={24}
                    unit="px"
                  />
                  <NumberInput
                    label="Bo góc (px)"
                    value={selectedLayer.cornerRadius ?? 8}
                    onChange={r => updateSelectedLayer({ cornerRadius: r })}
                    min={0}
                    max={100}
                    unit="px"
                  />
                </div>

                <ColorPickerRow
                  label="Màu viền khung"
                  color={selectedLayer.borderColor || '#ffffff'}
                  onChange={c => updateSelectedLayer({ borderColor: c })}
                  onPickEyedropper={() => handlePickColor('borderColor')}
                  presets={[
                    { color: '#ffffff', name: 'Trắng', border: true },
                    { color: '#fad2d8', name: 'Hồng pastel' },
                    { color: '#000000', name: 'Đen' },
                  ]}
                />
              </div>

              {/* Frame Shape Selector */}
              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-400 block">
                  Kiểu hình khung ảnh (Shape)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { shape: 'rect', icon: 'square', label: 'Chữ Nhật' },
                    { shape: 'circle', icon: 'circle', label: 'Hình Tròn' },
                    { shape: 'triangle', icon: 'triangle', label: 'Tam Giác' },
                    { shape: 'heart-custom', icon: 'heart', label: 'Trái Tim', isPreset: true, path: "M 50 90 C 20 70, 5 45, 15 25 C 25 5, 45 10, 50 25 C 55 10, 75 5, 85 25 C 95 45, 80 70, 50 90 Z", polygon: "50% 90%, 20% 70%, 5% 45%, 15% 25%, 25% 5%, 50% 25%, 75% 5%, 85% 25%, 95% 45%, 80% 70%" },
                    { shape: 'cloud-custom', icon: 'cloud', label: 'Đám Mây', isPreset: true, path: "M 20 65 C 5 65, 5 40, 20 40 C 20 20, 45 15, 55 30 C 65 15, 90 20, 90 45 C 100 45, 100 70, 80 70 L 20 70 Z", polygon: "20% 70%, 5% 60%, 10% 40%, 25% 30%, 45% 15%, 65% 20%, 85% 30%, 95% 50%, 85% 70%, 20% 70%" },
                    { shape: 'star-custom', icon: 'star', label: 'Ngôi Sao', isPreset: true, path: "M 50 8 C 55 18, 65 22, 78 25 C 70 35, 68 45, 72 58 C 60 55, 50 60, 40 55 C 28 58, 30 35, 22 25 C 35 22, 45 18, 50 8 Z", polygon: "50% 8%, 65% 22%, 78% 25%, 68% 45%, 72% 58%, 50% 60%, 28% 58%, 30% 35%, 22% 25%, 35% 22%" },
                    { shape: 'flower-sakura-custom', icon: 'sparkles', label: 'Hoa Đào', isPreset: true, path: "M 50 15 C 65 5, 80 20, 70 40 C 90 35, 95 55, 75 60 C 85 80, 65 95, 50 80 C 35 95, 15 80, 25 60 C 5 55, 10 35, 30 40 C 20 20, 35 5, 50 15 Z", polygon: "50% 15%, 70% 40%, 90% 35%, 75% 60%, 85% 80%, 50% 80%, 15% 80%, 25% 60%, 10% 35%, 30% 40%" },
                    { shape: 'teddy-custom', icon: 'gem', label: 'Gấu Bông', isPreset: true, path: "M 25 25 C 15 10, 35 0, 45 15 C 55 5, 75 10, 75 25 C 90 35, 90 70, 50 90 C 10 70, 10 35, 25 25 Z", polygon: "25% 25%, 20% 10%, 40% 15%, 60% 15%, 80% 10%, 75% 25%, 90% 40%, 80% 75%, 50% 90%, 20% 75%, 10% 40%" },
                    { shape: 'custom', icon: 'image', label: 'Khung Đè' },
                    { shape: 'custom-path', icon: 'bot', label: 'AI Shape' }
                  ].map((item) => {
                    const isActive = item.isPreset 
                      ? selectedLayer.frameShape === 'custom-path' && selectedLayer.framePath === item.path
                      : (selectedLayer.frameShape || 'rect') === item.shape && selectedLayer.frameShape !== 'custom-path';
                    return (
                      <button
                        key={item.shape + '-' + item.label}
                        type="button"
                        onClick={() => {
                          if (item.isPreset) {
                            updateSelectedLayer({
                              frameShape: 'custom-path',
                              framePath: item.path,
                              framePolygon: item.polygon
                            });
                          } else {
                            updateSelectedLayer({ frameShape: item.shape });
                          }
                        }}
                        className={`py-2 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-xs font-bold ${
                          isActive 
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 shadow-2xs' 
                            : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100'
                        }`}
                        title={item.label}
                      >
                        <Icon name={item.icon} size={15} className="shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STICKER / LOGO / SHAPE / OVERLAY SPECIFIC SETTINGS */}
          {(selectedLayer.type === 'sticker' || selectedLayer.type === 'logo') && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
              <label className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-400 block">
                Lật ảnh (Flip)
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateSelectedLayer({ flipX: !selectedLayer.flipX })}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedLayer.flipX ? 'bg-rose-500 border-rose-600 text-white' : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  Lật ngang ↔
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedLayer({ flipY: !selectedLayer.flipY })}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedLayer.flipY ? 'bg-rose-500 border-rose-600 text-white' : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  Lật dọc ↕
                </button>
              </div>
            </div>
          )}

          {selectedLayer.type === 'shape' && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
              <div>
                <label className="text-[8px] text-slate-500 dark:text-zinc-400 font-bold block mb-1 uppercase tracking-wider">
                  Kiểu hình dạng
                </label>
                <select 
                  value={selectedLayer.shapeType || 'rect'}
                  onChange={e => updateSelectedLayer({ shapeType: e.target.value })}
                  className="w-full px-2 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold"
                >
                  <option value="rect">Hình Chữ Nhật</option>
                  <option value="circle">Hình Tròn</option>
                  <option value="triangle">Hình Tam Giác</option>
                  <option value="heart">Hình Trái Tim</option>
                  <option value="star">Hình Ngôi Sao</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ColorPickerRow
                  label="Màu tô"
                  color={selectedLayer.fillColor || '#fda4af'}
                  onChange={c => updateSelectedLayer({ fillColor: c })}
                />
                <ColorPickerRow
                  label="Màu viền"
                  color={selectedLayer.borderColor || '#f43f5e'}
                  onChange={c => updateSelectedLayer({ borderColor: c })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-zinc-800">
                <NumberInput
                  label="Độ dày viền"
                  value={selectedLayer.borderSize ?? 0}
                  onChange={b => updateSelectedLayer({ borderSize: b })}
                  min={0}
                  max={20}
                  unit="px"
                />
                {selectedLayer.shapeType !== 'circle' && (
                  <NumberInput
                    label="Bo góc"
                    value={selectedLayer.cornerRadius ?? 8}
                    onChange={r => updateSelectedLayer({ cornerRadius: r })}
                    min={0}
                    max={100}
                    unit="px"
                  />
                )}
              </div>
            </div>
          )}

          {selectedLayer.type === 'overlay' && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2.5">
              <label className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-400 block">
                Link ảnh lớp phủ (.png)
              </label>
              <input
                type="text"
                value={selectedLayer.url || ''}
                onChange={e => updateSelectedLayer({ url: e.target.value })}
                placeholder="URL ảnh PNG..."
                className="w-full px-2.5 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono focus:outline-none"
              />
              <label className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center cursor-pointer transition-colors shadow-xs">
                Chọn File Ảnh Phủ
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          updateSelectedLayer({ url: event.target!.result as string });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: POSITION & DIMENSIONS (%) */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeLayerTab === 'layout' && (
        <div className="space-y-4 pt-1">
          <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <h5 className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-400 tracking-wider">
              Tọa độ & Kích thước (%)
            </h5>

            <div className="grid grid-cols-2 gap-2.5">
              <NumberInput
                label="Trục X (%)"
                value={selectedLayer.x ?? 0}
                onChange={x => updateSelectedLayer({ x })}
                min={0}
                max={100}
                unit="%"
              />
              <NumberInput
                label="Trục Y (%)"
                value={selectedLayer.y ?? 0}
                onChange={y => updateSelectedLayer({ y })}
                min={0}
                max={100}
                unit="%"
              />
              <NumberInput
                label="Chiều Rộng (%)"
                value={selectedLayer.width ?? 20}
                onChange={w => updateSelectedLayer({ width: Math.max(0, w) })}
                min={0}
                max={100}
                unit="%"
              />
              <NumberInput
                label="Chiều Cao (%)"
                value={selectedLayer.height ?? 20}
                onChange={h => updateSelectedLayer({ height: Math.max(0, h) })}
                min={0}
                max={100}
                unit="%"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <h5 className="text-[9px] font-black uppercase text-slate-500 dark:text-zinc-400 tracking-wider">
              Xoay & Độ Mờ
            </h5>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[9px] text-slate-500 dark:text-zinc-400 font-bold mb-1">
                  <span>Góc xoay (Rotate)</span>
                  <span className="font-mono text-rose-500">{selectedLayer.rotation || 0}°</span>
                </div>
                <input 
                  type="range" min="0" max="360"
                  value={selectedLayer.rotation || 0}
                  onChange={e => updateSelectedLayer({ rotation: parseInt(e.target.value) || 0 })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[9px] text-slate-500 dark:text-zinc-400 font-bold mb-1">
                  <span>Độ mờ (Opacity)</span>
                  <span className="font-mono text-rose-500">{selectedLayer.opacity ?? 100}%</span>
                </div>
                <input 
                  type="range" min="10" max="100"
                  value={selectedLayer.opacity ?? 100}
                  onChange={e => updateSelectedLayer({ opacity: parseInt(e.target.value) || 100 })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: EFFECTS & SHADOW */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeLayerTab === 'effects' && (
        <div className="space-y-4 pt-1">
          {/* Shadow Card */}
          <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-800 dark:text-zinc-200 block">
                  Đổ bóng (Shadow)
                </label>
                <span className="text-[8px] text-slate-400 block font-medium">
                  Tạo hiệu ứng nổi khối cho lớp
                </span>
              </div>
              <input 
                type="checkbox"
                checked={shadowStyleActive}
                onChange={e => {
                  if (e.target.checked) {
                    updateSelectedLayer({ 
                      shadowColor: 'rgba(0,0,0,0.15)', 
                      shadowBlur: 10, 
                      shadowOffsetX: 0, 
                      shadowOffsetY: 4 
                    });
                  } else {
                    updateSelectedLayer({ shadowColor: 'rgba(0,0,0,0)' });
                  }
                }}
                className="accent-rose-500 w-4 h-4 cursor-pointer"
              />
            </div>

            {shadowStyleActive && (
              <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-zinc-800">
                <ColorPickerRow
                  label="Màu bóng"
                  color={selectedLayer.shadowColor || 'rgba(0,0,0,0.15)'}
                  onChange={c => updateSelectedLayer({ shadowColor: c })}
                  presets={[
                    { color: 'rgba(0,0,0,0.15)', name: 'Bóng nhẹ' },
                    { color: 'rgba(0,0,0,0.3)', name: 'Bóng đậm' },
                    { color: 'rgba(244,63,94,0.3)', name: 'Bóng hồng' },
                  ]}
                />

                <div className="grid grid-cols-2 gap-2">
                  <NumberInput
                    label="Độ nhòe (Blur)"
                    value={selectedLayer.shadowBlur ?? 10}
                    onChange={b => updateSelectedLayer({ shadowBlur: b })}
                    min={0}
                    max={50}
                    unit="px"
                  />
                  <NumberInput
                    label="Lệch Y (Offset)"
                    value={selectedLayer.shadowOffsetY ?? 4}
                    onChange={y => updateSelectedLayer({ shadowOffsetY: y })}
                    min={-50}
                    max={50}
                    unit="px"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Text Stroke / Outline for Text Layers with ON/OFF Toggle */}
          {selectedLayer.type === 'text' && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wider block">
                    Viền Nét Chữ (Stroke)
                  </label>
                  <span className="text-[8px] text-slate-400 block font-medium">
                    Tạo đường viền nét bo quanh chữ
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const isStrokeOn = (selectedLayer.strokeSize ?? 0) > 0;
                    if (isStrokeOn) {
                      updateSelectedLayer({ strokeSize: 0 });
                    } else {
                      updateSelectedLayer({ 
                        strokeSize: 2, 
                        strokeColor: selectedLayer.strokeColor || '#ffffff' 
                      });
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                    (selectedLayer.strokeSize ?? 0) > 0
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${(selectedLayer.strokeSize ?? 0) > 0 ? 'bg-white' : 'bg-slate-400'}`} />
                  <span>{(selectedLayer.strokeSize ?? 0) > 0 ? 'BẬT' : 'TẮT'}</span>
                </button>
              </div>

              {(selectedLayer.strokeSize ?? 0) > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-zinc-800">
                  <NumberInput
                    label="Độ dày viền nét (px)"
                    value={selectedLayer.strokeSize ?? 2}
                    onChange={s => updateSelectedLayer({ strokeSize: s })}
                    min={0.5}
                    max={15}
                    step={0.5}
                    unit="px"
                  />
                  <ColorPickerRow
                    label="Màu viền chữ"
                    color={selectedLayer.strokeColor || '#ffffff'}
                    onChange={c => updateSelectedLayer({ strokeColor: c })}
                    onPickEyedropper={() => handlePickColor('strokeColor')}
                    presets={[
                      { color: '#ffffff', name: 'Trắng', border: true },
                      { color: '#000000', name: 'Đen' },
                      { color: '#f43f5e', name: 'Hồng đậm' },
                      { color: '#fef08a', name: 'Vàng nhạt' },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
