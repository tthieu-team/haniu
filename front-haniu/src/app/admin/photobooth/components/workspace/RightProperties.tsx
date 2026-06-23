'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface RightPropertiesProps {
  selectedLayer: any;
  updateSelectedLayer: (updates: any) => void;
  handleDeleteLayer: (id: string) => void;
  builderTemplate?: any;
  setBuilderTemplate?: React.Dispatch<React.SetStateAction<any>>;
}

export const RightProperties: React.FC<RightPropertiesProps> = ({
  selectedLayer,
  updateSelectedLayer,
  handleDeleteLayer,
  builderTemplate,
  setBuilderTemplate
}) => {
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [isGeneratingAiShape, setIsGeneratingAiShape] = React.useState(false);

  const handleGenerateAiShape = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAiShape(true);
    
    // Check local presets first for instant correctness
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
    } else if (p.includes('hoa cúc') || p.includes('chrysanthemum') || p.includes('bông hoa cúc')) {
      localShape = {
        path: "M 50 10 C 60 5, 70 15, 65 30 C 80 20, 90 35, 80 50 C 95 55, 90 75, 70 75 C 75 90, 60 100, 50 90 C 40 100, 25 90, 30 75 C 10 75, 5 55, 20 50 C 10 35, 20 20, 35 30 C 30 15, 40 5, 50 10 Z",
        polygon: "50% 10%, 65% 30%, 80% 20%, 80% 50%, 95% 55%, 70% 75%, 75% 90%, 50% 90%, 25% 90%, 30% 75%, 5% 55%, 20% 50%, 20% 20%, 35% 30%"
      };
    } else if (p.includes('sakura') || p.includes('hoa anh đào') || p.includes('anh đào') || p.includes('đào')) {
      localShape = {
        path: "M 50 15 C 65 5, 80 20, 70 40 C 90 35, 95 55, 75 60 C 85 80, 65 95, 50 80 C 35 95, 15 80, 25 60 C 5 55, 10 35, 30 40 C 20 20, 35 5, 50 15 Z",
        polygon: "50% 15%, 70% 40%, 90% 35%, 75% 60%, 85% 80%, 50% 80%, 15% 80%, 25% 60%, 10% 35%, 30% 40%"
      };
    } else if (p.includes('gấu bông') || p.includes('teddy')) {
      localShape = {
        path: "M 25 25 C 15 10, 35 0, 45 15 C 55 5, 75 10, 75 25 C 90 35, 90 70, 50 90 C 10 70, 10 35, 25 25 Z",
        polygon: "25% 25%, 20% 10%, 40% 15%, 60% 15%, 80% 10%, 75% 25%, 90% 40%, 80% 75%, 50% 90%, 20% 75%, 10% 40%"
      };
    } else if (p.includes('thỏ') || p.includes('bunny') || p.includes('rabbit')) {
      localShape = {
        path: "M 35 25 C 30 5, 45 0, 45 20 C 50 5, 55 5, 55 20 C 55 0, 70 5, 65 25 C 85 35, 85 75, 50 90 C 15 75, 15 35, 35 25 Z",
        polygon: "35% 25%, 35% 5%, 45% 20%, 55% 20%, 65% 5%, 65% 25%, 85% 40%, 80% 75%, 50% 90%, 20% 75%, 15% 40%"
      };
    } else if (p.includes('gấu') || p.includes('bear')) {
      localShape = {
        path: "M 25 25 C 15 10, 35 0, 45 15 C 55 0, 75 10, 75 25 C 90 35, 90 70, 50 90 C 10 70, 10 35, 25 25 Z",
        polygon: "25% 25%, 20% 10%, 40% 15%, 60% 15%, 80% 10%, 75% 25%, 90% 40%, 80% 75%, 50% 90%, 20% 75%, 10% 40%"
      };
    } else if (p.includes('mèo') || p.includes('cat') || p.includes('kitten')) {
      localShape = {
        path: "M 20 30 L 35 5 C 40 15, 45 20, 50 20 C 55 20, 60 15, 65 5 L 80 30 C 90 40, 90 70, 50 90 C 10 70, 10 40, 20 30 Z",
        polygon: "20% 30%, 35% 5%, 50% 20%, 65% 5%, 80% 30%, 90% 45%, 80% 75%, 50% 90%, 20% 75%, 10% 45%"
      };
    } else if (p.includes('mặt trời') || p.includes('sun')) {
      localShape = {
        path: "M 50 10 C 60 15, 70 15, 80 10 C 80 25, 90 30, 95 40 C 85 45, 85 55, 95 60 C 90 70, 80 75, 80 90 C 70 85, 60 85, 50 90 C 40 85, 30 85, 20 90 C 20 75, 10 70, 5 60 C 15 55, 15 45, 5 40 C 10 30, 20 25, 20 10 C 30 15, 40 15, 50 10 Z",
        polygon: "50% 10%, 80% 10%, 95% 40%, 95% 60%, 80% 90%, 50% 90%, 20% 90%, 5% 60%, 5% 40%, 20% 10%"
      };
    }

    if (localShape) {
      updateSelectedLayer({
        frameShape: 'custom-path',
        framePolygon: localShape.polygon,
        framePath: localShape.path
      });
      setIsGeneratingAiShape(false);
      return;
    }

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_shape', prompt: aiPrompt })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.polygon) {
          updateSelectedLayer({ 
            framePolygon: data.polygon,
            framePath: data.path || '',
            frameShape: 'custom-path'
          });
          setIsGeneratingAiShape(false);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to generate shape via AI, falling back to presets:', err);
    }

    // Local Presets Fallback
    let polygonStr = '50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%'; // fallback hexagon
    
    if (p.includes('mây') || p.includes('cloud')) {
      polygonStr = '25% 65%, 15% 55%, 15% 40%, 25% 30%, 40% 30%, 50% 17%, 68% 17%, 78% 30%, 88% 40%, 88% 55%, 78% 65%';
    } else if (p.includes('vương miện') || p.includes('crown')) {
      polygonStr = '0% 100%, 0% 35%, 20% 65%, 50% 25%, 80% 65%, 100% 35%, 100% 100%';
    } else if (p.includes('lá') || p.includes('leaf') || p.includes('diệp')) {
      polygonStr = '50% 0%, 80% 25%, 90% 50%, 80% 75%, 50% 100%, 20% 75%, 10% 50%, 20% 25%';
    } else if (p.includes('8 cánh') || p.includes('8-point') || p.includes('bát giác sao')) {
      polygonStr = '50% 0%, 62% 38%, 85% 15%, 68% 50%, 85% 85%, 62% 62%, 50% 100%, 38% 62%, 15% 85%, 32% 50%, 15% 15%, 38% 38%';
    } else if (p.includes('lục giác') || p.includes('hexa')) {
      polygonStr = '50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%';
    } else if (p.includes('bát giác') || p.includes('octa')) {
      polygonStr = '30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%';
    } else if (p.includes('thoi') || p.includes('kim cương') || p.includes('diamond')) {
      polygonStr = '50% 0%, 100% 50%, 50% 100%, 0% 50%';
    } else if (p.includes('khiên') || p.includes('khiêng') || p.includes('shield') || p.includes('badge')) {
      polygonStr = '0% 0%, 100% 0%, 100% 55%, 50% 100%, 0% 55%';
    } else if (p.includes('thập') || p.includes('cross') || p.includes('cộng')) {
      polygonStr = '35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%';
    } else if (p.includes('mác') || p.includes('ribbon') || p.includes('tag')) {
      polygonStr = '0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%';
    } else if (p.includes('ngũ giác') || p.includes('penta')) {
      polygonStr = '50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%';
    } else {
      const seed = p.length || 7;
      const numPoints = 12;
      const pts: string[] = [];
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const wave = Math.sin(angle * 3 + seed) * 0.12 + Math.cos(angle * 2 + seed * 0.5) * 0.08;
        const r = 0.38 + wave;
        const px = Math.round(50 + Math.cos(angle) * r * 100);
        const py = Math.round(50 + Math.sin(angle) * r * 100);
        pts.push(`${px}% ${py}%`);
      }
      polygonStr = pts.join(', ');
    }
    
    updateSelectedLayer({ framePolygon: polygonStr });
    setIsGeneratingAiShape(false);
  };

  if (!selectedLayer) {
    return (
      <div className="w-80 border-l border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-5 space-y-6 shrink-0 flex flex-col font-sans">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
          <span className="text-xs font-black uppercase text-rose-500 tracking-wider flex items-center gap-1">
            ⚙️ Cấu hình Template
          </span>
        </div>

        {/* Template General Info */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Tên Template</label>
          <input
            type="text"
            value={builderTemplate?.name || ''}
            onChange={e => setBuilderTemplate?.((prev: any) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 h-9 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-800 dark:text-zinc-200 focus:outline-none"
            placeholder="Tên template..."
          />
        </div>

        {/* Background Config */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hình nền (Background)</h5>
          
          <div className="flex gap-2">
            {['solid', 'gradient', 'image'].map((bType) => (
              <button
                key={bType}
                onClick={() => setBuilderTemplate?.((p: any) => ({
                  ...p,
                  backgroundType: bType,
                  backgroundGradient: p.backgroundGradient || { color1: '#fda4af', color2: '#f43f5e', angle: 45 }
                }))}
                className={`flex-1 py-1 rounded-lg text-[9px] font-black uppercase border transition-colors ${
                  (builderTemplate?.backgroundType || 'solid') === bType
                    ? 'bg-rose-500 border-rose-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-rose-600'
                }`}
              >
                {bType === 'solid' ? 'Đơn sắc' : bType === 'gradient' ? 'Gradient' : 'Ảnh nền'}
              </button>
            ))}
          </div>

          {builderTemplate?.backgroundType === 'gradient' && (
            <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-200 dark:border-zinc-800">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] text-slate-400 font-bold block mb-1">Màu bắt đầu</label>
                  <input
                    type="color"
                    value={builderTemplate.backgroundGradient?.color1 || '#fda4af'}
                    onChange={e => setBuilderTemplate?.((p: any) => ({
                      ...p,
                      backgroundGradient: { ...(p.backgroundGradient || {}), color1: e.target.value }
                    }))}
                    className="w-full h-8 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[8px] text-slate-400 font-bold block mb-1">Màu kết thúc</label>
                  <input
                    type="color"
                    value={builderTemplate.backgroundGradient?.color2 || '#f43f5e'}
                    onChange={e => setBuilderTemplate?.((p: any) => ({
                      ...p,
                      backgroundGradient: { ...(p.backgroundGradient || {}), color2: e.target.value }
                    }))}
                    className="w-full h-8 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {builderTemplate?.backgroundType === 'solid' && (
            <div className="flex gap-2 items-center p-2.5 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-200 dark:border-zinc-800">
              <input
                type="color"
                value={builderTemplate.background?.startsWith('#') ? builderTemplate.background : '#ffffff'}
                onChange={e => setBuilderTemplate?.((p: any) => ({ ...p, background: e.target.value, backgroundType: 'solid' }))}
                className="w-8 h-8 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-zinc-350">{builderTemplate.background || '#ffffff'}</span>
            </div>
          )}

          {builderTemplate?.backgroundType === 'image' && (
            <div className="space-y-1.5 p-2.5 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-200 dark:border-zinc-800">
              <input
                type="text"
                value={builderTemplate.background?.startsWith('http') || builderTemplate.background?.startsWith('data:') ? builderTemplate.background : ''}
                onChange={e => setBuilderTemplate?.((p: any) => ({ ...p, background: e.target.value, backgroundType: 'image' }))}
                placeholder="Link URL ảnh nền..."
                className="w-full px-2 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] focus:outline-none"
              />
              <label className="w-full h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center cursor-pointer transition-colors shadow-sm">
                Chọn file ảnh nền
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
        </div>

        {/* OVERLAY CONFIG */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lớp Phủ Thiết Kế (Overlay)</h5>
          <p className="text-[8px] text-slate-400 leading-relaxed font-medium">
            💡 Tải lên một ảnh PNG trong suốt có hoa văn, khung viền đè hoặc logo để phủ lên trên tất cả các lớp.
          </p>

          <div className="space-y-2">
            <input
              type="text"
              value={builderTemplate?.overlay || ''}
              onChange={e => setBuilderTemplate?.((p: any) => ({ ...p, overlay: e.target.value }))}
              placeholder="URL ảnh overlay (.png)..."
              className="w-full px-2 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono focus:outline-none"
            />
            <div className="flex gap-2">
              <label className="flex-1 h-8 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black uppercase flex items-center justify-center cursor-pointer transition-colors shadow-sm">
                Tải ảnh phủ lên
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
                  className="px-3 bg-red-50 hover:bg-red-100 dark:bg-red-955/20 border border-red-200 dark:border-red-900 rounded-lg text-red-500 text-[9px] font-black uppercase transition-colors cursor-pointer"
                >
                  Xóa
                </button>
              )}
            </div>
            {builderTemplate?.overlay && (
              <div className="relative mt-2 p-1 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-850 max-h-28 overflow-hidden flex items-center justify-center">
                <img
                  src={builderTemplate.overlay}
                  alt="overlay preview"
                  className="max-h-24 object-contain rounded"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 text-center">
          <p className="text-[9px] font-semibold px-2 text-slate-400 leading-normal">
            Bấm vào bất kỳ thành phần nào trên Canvas để chỉnh sửa thuộc tính lớp chi tiết.
          </p>
        </div>
      </div>
    );
  }

  const shadowStyleActive = !!selectedLayer.shadowColor && selectedLayer.shadowColor !== 'rgba(0,0,0,0)';

  return (
    <div className="w-80 border-l border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-5 space-y-6 shrink-0">
      
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
        <span className="text-xs font-black uppercase text-rose-500 tracking-wider flex items-center gap-1">
          ⚙️ Thuộc tính lớp
        </span>
        <button 
          onClick={() => handleDeleteLayer(selectedLayer.id)}
          className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-955/20 rounded-lg text-red-500 cursor-pointer"
          title="Xóa lớp"
        >
          <Icon name="trash" size={12} />
        </button>
      </div>

      {/* Positions coordinate controls */}
      <div className="space-y-2">
        <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Căn chỉnh tỷ lệ vị trí (%)</h5>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Trục X (%)</label>
            <input 
              type="number" min="0" max="100"
              value={selectedLayer.x}
              onChange={e => updateSelectedLayer({ x: parseInt(e.target.value) || 0 })}
              className="w-full px-2 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[11px]"
            />
          </div>
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Trục Y (%)</label>
            <input 
              type="number" min="0" max="100"
              value={selectedLayer.y}
              onChange={e => updateSelectedLayer({ y: parseInt(e.target.value) || 0 })}
              className="w-full px-2 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[11px]"
            />
          </div>
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Chiều rộng (%)</label>
            <input 
              type="number" min="5" max="100"
              value={selectedLayer.width}
              onChange={e => updateSelectedLayer({ width: Math.max(5, parseInt(e.target.value) || 5) })}
              className="w-full px-2 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[11px]"
            />
          </div>
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Chiều cao (%)</label>
            <input 
              type="number" min="5" max="100"
              value={selectedLayer.height}
              onChange={e => updateSelectedLayer({ height: Math.max(5, parseInt(e.target.value) || 5) })}
              className="w-full px-2 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* FLIP STICKER / LOGO TOOL */}
      {(selectedLayer.type === 'sticker' || selectedLayer.type === 'logo') && (
        <div className="space-y-2 pt-1 border-t border-slate-105">
          <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Lật ảnh (Flip)</h5>
          <div className="flex gap-2">
            <button
              onClick={() => updateSelectedLayer({ flipX: !selectedLayer.flipX })}
              className={`flex-1 py-1 rounded text-[10px] font-bold border ${selectedLayer.flipX ? 'bg-rose-500/10 border-rose-500 text-rose-550' : 'bg-white'}`}
            >
              Lật ngang ↔
            </button>
            <button
              onClick={() => updateSelectedLayer({ flipY: !selectedLayer.flipY })}
              className={`flex-1 py-1 rounded text-[10px] font-bold border ${selectedLayer.flipY ? 'bg-rose-500/10 border-rose-500 text-rose-550' : 'bg-white'}`}
            >
              Lật dọc ↕
            </button>
          </div>
        </div>
      )}

      {/* Shared Advanced attributes: Opacity & Rotation */}
      <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-zinc-850">
        <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Hiệu ứng nâng cao</h5>
        <div>
          <div className="flex justify-between text-[9px] text-slate-400 font-bold mb-1">
            <span>Góc xoay (Rotate)</span>
            <span className="font-mono">{selectedLayer.rotation || 0}°</span>
          </div>
          <input 
            type="range" min="0" max="360"
            value={selectedLayer.rotation || 0}
            onChange={e => updateSelectedLayer({ rotation: parseInt(e.target.value) })}
            className="w-full accent-rose-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-[9px] text-slate-400 font-bold mb-1">
            <span>Độ mờ (Opacity)</span>
            <span className="font-mono">{selectedLayer.opacity ?? 100}%</span>
          </div>
          <input 
            type="range" min="10" max="100"
            value={selectedLayer.opacity ?? 100}
            onChange={e => updateSelectedLayer({ opacity: parseInt(e.target.value) })}
            className="w-full accent-rose-500"
          />
        </div>
      </div>

      {/* Shadow control settings */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-850">
        <div className="flex justify-between items-center">
          <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Đổ bóng (Shadow)</h5>
          <input 
            type="checkbox"
            checked={shadowStyleActive}
            onChange={e => {
              if (e.target.checked) {
                updateSelectedLayer({ shadowColor: 'rgba(0,0,0,0.15)', shadowBlur: 10, shadowOffsetX: 0, shadowOffsetY: 4 });
              } else {
                updateSelectedLayer({ shadowColor: 'rgba(0,0,0,0)' });
              }
            }}
            className="accent-rose-500"
          />
        </div>
        {shadowStyleActive && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[8px] text-slate-400 font-bold block mb-1">Độ nhòe (Blur)</label>
                <input 
                  type="number" min="0" max="50"
                  value={selectedLayer.shadowBlur ?? 10}
                  onChange={e => updateSelectedLayer({ shadowBlur: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-[11px]"
                />
              </div>
              <div>
                <label className="text-[8px] text-slate-400 font-bold block mb-1">Màu bóng</label>
                <input 
                  type="text" 
                  value={selectedLayer.shadowColor || 'rgba(0,0,0,0.15)'}
                  onChange={e => updateSelectedLayer({ shadowColor: e.target.value })}
                  className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-[11px]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PHOTO FRAME PROPERTIES */}
      {selectedLayer.type === 'frame' && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-850">
          <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Thông số Khung Ảnh</h5>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Thứ tự chụp (Order)</label>
              <select 
                value={selectedLayer.order || 1}
                onChange={e => updateSelectedLayer({ order: parseInt(e.target.value) })}
                className="w-full px-2 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[11px] font-bold"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>Ảnh thứ {n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Cố định tỷ lệ (Ratio)</label>
              <select 
                value={selectedLayer.aspectRatio || 'free'}
                onChange={e => updateSelectedLayer({ aspectRatio: e.target.value })}
                className="w-full px-2 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[11px] font-bold"
              >
                <option value="free">Tự do</option>
                <option value="1:1">1:1 (Vuông)</option>
                <option value="4:5">4:5 (Instagram)</option>
                <option value="9:16">9:16 (Story)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1.5">Kiểu hình khung ảnh (Shape)</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { shape: 'rect', icon: '■', label: 'Chu nhat' },
                { shape: 'circle', icon: '●', label: 'Hinh Tron' },
                { shape: 'triangle', icon: '▲', label: 'Tam Giac' },
                { shape: 'heart-custom', icon: '❤️', label: 'Trai Tim', isPreset: true, path: "M 50 90 C 20 70, 5 45, 15 25 C 25 5, 45 10, 50 25 C 55 10, 75 5, 85 25 C 95 45, 80 70, 50 90 Z", polygon: "50% 90%, 20% 70%, 5% 45%, 15% 25%, 25% 5%, 50% 25%, 75% 5%, 85% 25%, 95% 45%, 80% 70%" },
                { shape: 'cloud-custom', icon: '☁️', label: 'Dam May', isPreset: true, path: "M 20 65 C 5 65, 5 40, 20 40 C 20 20, 45 15, 55 30 C 65 15, 90 20, 90 45 C 100 45, 100 70, 80 70 L 20 70 Z", polygon: "20% 70%, 5% 60%, 10% 40%, 25% 30%, 45% 15%, 65% 20%, 85% 30%, 95% 50%, 85% 70%, 20% 70%" },
                { shape: 'star-custom', icon: '⭐', label: 'Sao Tron', isPreset: true, path: "M 50 8 C 55 18, 65 22, 78 25 C 70 35, 68 45, 72 58 C 60 55, 50 60, 40 55 C 28 58, 30 35, 22 25 C 35 22, 45 18, 50 8 Z", polygon: "50% 8%, 65% 22%, 78% 25%, 68% 45%, 72% 58%, 50% 60%, 28% 58%, 30% 35%, 22% 25%, 35% 22%" },
                { shape: 'bunny-custom', icon: '🐰', label: 'Tho', isPreset: true, path: "M 35 25 C 30 5, 45 0, 45 20 C 50 5, 55 5, 55 20 C 55 0, 70 5, 65 25 C 85 35, 85 75, 50 90 C 15 75, 15 35, 35 25 Z", polygon: "35% 25%, 35% 5%, 45% 20%, 55% 20%, 65% 5%, 65% 25%, 85% 40%, 80% 75%, 50% 90%, 20% 75%, 15% 40%" },
                { shape: 'teddy-custom', icon: '🧸', label: 'Gau Bong', isPreset: true, path: "M 25 25 C 15 10, 35 0, 45 15 C 55 5, 75 10, 75 25 C 90 35, 90 70, 50 90 C 10 70, 10 35, 25 25 Z", polygon: "25% 25%, 20% 10%, 40% 15%, 60% 15%, 80% 10%, 75% 25%, 90% 40%, 80% 75%, 50% 90%, 20% 75%, 10% 40%" },
                { shape: 'bear-custom', icon: '🐻', label: 'Mat Gau', isPreset: true, path: "M 25 25 C 15 10, 35 0, 45 15 C 55 0, 75 10, 75 25 C 90 35, 90 70, 50 90 C 10 70, 10 35, 25 25 Z", polygon: "25% 25%, 20% 10%, 40% 15%, 60% 15%, 80% 10%, 75% 25%, 90% 40%, 80% 75%, 50% 90%, 20% 75%, 10% 40%" },
                { shape: 'cat-custom', icon: '🐱', label: 'Mat Meo', isPreset: true, path: "M 20 30 L 35 5 C 40 15, 45 20, 50 20 C 55 20, 60 15, 65 5 L 80 30 C 90 40, 90 70, 50 90 C 10 70, 10 40, 20 30 Z", polygon: "20% 30%, 35% 5%, 50% 20%, 65% 5%, 80% 30%, 90% 45%, 80% 75%, 50% 90%, 20% 75%, 10% 45%" },
                { shape: 'flower-chrys-custom', icon: '🌼', label: 'Hoa Cuc', isPreset: true, path: "M 50 10 C 60 5, 70 15, 65 30 C 80 20, 90 35, 80 50 C 95 55, 90 75, 70 75 C 75 90, 60 100, 50 90 C 40 100, 25 90, 30 75 C 10 75, 5 55, 20 50 C 10 35, 20 20, 35 30 C 30 15, 40 5, 50 10 Z", polygon: "50% 10%, 65% 30%, 80% 20%, 80% 50%, 95% 55%, 70% 75%, 75% 90%, 50% 90%, 25% 90%, 30% 75%, 5% 55%, 20% 50%, 20% 20%, 35% 30%" },
                { shape: 'flower-sakura-custom', icon: '🌸', label: 'Sakura', isPreset: true, path: "M 50 15 C 65 5, 80 20, 70 40 C 90 35, 95 55, 75 60 C 85 80, 65 95, 50 80 C 35 95, 15 80, 25 60 C 5 55, 10 35, 30 40 C 20 20, 35 5, 50 15 Z", polygon: "50% 15%, 70% 40%, 90% 35%, 75% 60%, 85% 80%, 50% 80%, 15% 80%, 25% 60%, 10% 35%, 30% 40%" },
                { shape: 'sun-custom', icon: '☀️', label: 'Mat Troi', isPreset: true, path: "M 50 10 C 60 15, 70 15, 80 10 C 80 25, 90 30, 95 40 C 85 45, 85 55, 95 60 C 90 70, 80 75, 80 90 C 70 85, 60 85, 50 90 C 40 85, 30 85, 20 90 C 20 75, 10 70, 5 60 C 15 55, 15 45, 5 40 C 10 30, 20 25, 20 10 C 30 15, 40 15, 50 10 Z", polygon: "50% 10%, 80% 10%, 95% 40%, 95% 60%, 80% 90%, 50% 90%, 20% 90%, 5% 60%, 5% 40%, 20% 10%" },
                { shape: 'custom', icon: '🖼️', label: 'Khung De' },
                { shape: 'custom-path', icon: '🤖', label: 'AI Shape' }
              ].map((item) => {
                const isActive = item.isPreset 
                  ? selectedLayer.frameShape === 'custom-path' && selectedLayer.framePath === item.path
                  : (selectedLayer.frameShape || 'rect') === item.shape && selectedLayer.frameShape !== 'custom-path';
                return (
                  <button
                    key={item.shape + '-' + (item.label || '')}
                    type="button"
                    onClick={() => {
                      if (item.isPreset) {
                        updateSelectedLayer({
                          frameShape: 'custom-path',
                          framePath: item.path,
                          framePolygon: item.polygon
                        });
                      } else {
                        const updates: any = { frameShape: item.shape };
                        if (item.shape === 'custom-path' && !selectedLayer.framePolygon) {
                          updates.framePolygon = '50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%'; // default hexagon
                        }
                        updateSelectedLayer(updates);
                      }
                    }}
                    className={`py-2 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-xs font-bold ${
                      isActive 
                        ? 'bg-rose-500 border-rose-600 text-white shadow-sm shadow-rose-500/10' 
                        : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-rose-600'
                    }`}
                    title={item.label}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-[7px] mt-0.5 font-bold uppercase truncate max-w-full px-0.5 text-center">{item.label.split(' ')[0] || item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedLayer.frameShape === 'custom' && (
            <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-2xl">
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Ảnh khung đè / PNG Mask URL</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={selectedLayer.frameMaskUrl || ''}
                  onChange={e => updateSelectedLayer({ frameMaskUrl: e.target.value })}
                  placeholder="URL ảnh viền đè (.png)..."
                  className="w-full px-2 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-semibold focus:outline-none focus:border-rose-500"
                />
                <label className="px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[9px] font-black uppercase flex items-center justify-center cursor-pointer transition-colors shrink-0">
                  Tải lên
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
                            updateSelectedLayer({ frameMaskUrl: event.target!.result as string });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[8px] text-slate-400 mt-1 leading-relaxed">
                💡 Sử dụng một ảnh định dạng <b>PNG trong suốt</b> có sẵn phần viền/mask để phủ đè trực tiếp lên ô ảnh này.
              </p>
            </div>
          )}

          {selectedLayer.frameShape === 'custom-path' && (
            <div className="space-y-3 p-3 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-2xl">
              {/* AI generator form */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1">
                  🤖 Trình Tạo Hình Dạng AI
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Mô tả hình (VD: đám mây, chiếc lá...)"
                    className="w-full px-2 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-semibold focus:outline-none"
                    onKeyDown={e => { if (e.key === 'Enter') handleGenerateAiShape(); }}
                  />
                  <button
                    onClick={handleGenerateAiShape}
                    disabled={isGeneratingAiShape}
                    className="px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider disabled:opacity-50 shrink-0 cursor-pointer"
                  >
                    {isGeneratingAiShape ? '...' : 'Tạo'}
                  </button>
                </div>
              </div>

              {/* Raw Polygon coordinates editor */}
              <div className="space-y-1">
                <label className="text-[8px] text-slate-400 font-bold block">Tọa Độ Đa Giác (CSS clip-path)</label>
                <textarea
                  rows={2}
                  value={selectedLayer.framePolygon || ''}
                  onChange={e => updateSelectedLayer({ framePolygon: e.target.value })}
                  placeholder="50% 0%, 100% 25%, 100% 75%..."
                  className="w-full p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-[9px] font-mono leading-normal focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="text-[8px] text-slate-400 leading-relaxed space-y-1">
                <p>💡 <b>Từ khóa AI hỗ trợ:</b> <i>đám mây, vương miện, chiếc lá, lục giác, bát giác, khiên, ngôi sao 8 cánh, chữ thập, kim cương...</i></p>
                <p>💡 Bạn cũng có thể dán trực tiếp tọa độ <code>polygon(...)</code> tìm thấy từ các trang tạo CSS clip-path online để áp dụng ngay.</p>
              </div>
            </div>
          )}

          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Màu viền khung</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                value={selectedLayer.borderColor || '#ffffff'}
                onChange={e => updateSelectedLayer({ borderColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-500">{selectedLayer.borderColor}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Độ dày viền (px)</label>
              <input 
                type="number" min="0" max="24"
                value={selectedLayer.borderSize ?? 4}
                onChange={e => updateSelectedLayer({ borderSize: parseInt(e.target.value) || 0 })}
                className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-xs"
              />
            </div>
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Bo góc (Radius)</label>
              <input 
                type="number" min="0" max="100"
                value={selectedLayer.cornerRadius ?? 8}
                onChange={e => updateSelectedLayer({ cornerRadius: parseInt(e.target.value) || 0 })}
                className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TEXT PROPERTIES */}
      {selectedLayer.type === 'text' && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-850">
          <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Thông số Văn Bản</h5>
          
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Nội dung chữ</label>
            <textarea 
              rows={2}
              value={selectedLayer.text || ''}
              onChange={e => updateSelectedLayer({ text: e.target.value })}
              className="w-full p-2 rounded-lg bg-slate-50 border text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Kích cỡ font</label>
              <input 
                type="number" 
                value={selectedLayer.fontSize || 24}
                onChange={e => updateSelectedLayer({ fontSize: parseInt(e.target.value) || 12 })}
                className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-xs"
              />
            </div>
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Họ Font (Font Family)</label>
              <select 
                value={selectedLayer.fontFamily || 'sans-serif'}
                onChange={e => updateSelectedLayer({ fontFamily: e.target.value })}
                className="w-full px-2 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[10px]"
              >
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Classic Serif</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Cursive Hand</option>
                <option value="system-ui">System Default</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Cách chữ (spacing)</label>
              <input 
                type="number" 
                value={selectedLayer.letterSpacing || 0}
                onChange={e => updateSelectedLayer({ letterSpacing: parseInt(e.target.value) || 0 })}
                className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-xs"
              />
            </div>
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Viền chữ (stroke px)</label>
              <input 
                type="number" 
                value={selectedLayer.strokeSize || 0}
                onChange={e => updateSelectedLayer({ strokeSize: parseInt(e.target.value) || 0 })}
                className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-xs"
              />
            </div>
          </div>

          {selectedLayer.strokeSize > 0 && (
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Màu viền chữ</label>
              <input 
                type="color" 
                value={selectedLayer.strokeColor || '#ffffff'}
                onChange={e => updateSelectedLayer({ strokeColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer"
              />
            </div>
          )}

          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Định dạng chữ</label>
            <div className="flex gap-1.5">
              <button 
                onClick={() => updateSelectedLayer({ fontWeight: selectedLayer.fontWeight === 'bold' ? 'normal' : 'bold' })}
                className={`flex-1 py-1 rounded text-xs font-black border ${selectedLayer.fontWeight === 'bold' ? 'bg-slate-200 border-slate-350' : 'bg-white'}`}
              >
                B
              </button>
              <button 
                onClick={() => updateSelectedLayer({ fontStyle: selectedLayer.fontStyle === 'italic' ? 'normal' : 'italic' })}
                className={`flex-1 py-1 rounded text-xs italic border ${selectedLayer.fontStyle === 'italic' ? 'bg-slate-200 border-slate-350' : 'bg-white'}`}
              >
                I
              </button>
              {['left', 'center', 'right'].map((align) => (
                <button 
                  key={align}
                  onClick={() => updateSelectedLayer({ align })}
                  className={`flex-1 py-1 rounded text-[9px] font-bold border uppercase ${selectedLayer.align === align ? 'bg-slate-200 border-slate-350' : 'bg-white'}`}
                >
                  {align.charAt(0)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Màu sắc chữ</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                value={selectedLayer.fontColor || '#1e293b'}
                onChange={e => updateSelectedLayer({ fontColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-500">{selectedLayer.fontColor}</span>
            </div>
          </div>

        </div>
      )}

      {/* LOGO PROPERTIES */}
      {selectedLayer.type === 'logo' && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-850">
          <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Thông số Logo</h5>
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Chữ ký logo</label>
            <input 
              type="text" 
              value={selectedLayer.logoText || ''}
              onChange={e => updateSelectedLayer({ logoText: e.target.value })}
              className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-xs"
            />
          </div>
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Kích thước logo (Size)</label>
            <input 
              type="number" 
              value={selectedLayer.size || 20}
              onChange={e => updateSelectedLayer({ size: parseInt(e.target.value) || 12 })}
              className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-xs"
            />
          </div>
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Màu sắc logo</label>
            <input 
              type="color" 
              value={selectedLayer.color || '#475569'}
              onChange={e => updateSelectedLayer({ color: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* SHAPE PROPERTIES */}
      {selectedLayer.type === 'shape' && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-850">
          <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Thông số Hình dạng (Shape)</h5>
          
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Kiểu hình</label>
            <select 
              value={selectedLayer.shapeType}
              onChange={e => updateSelectedLayer({ shapeType: e.target.value })}
              className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-[11px] font-bold"
            >
              <option value="rect">Hình Chữ Nhật / Vuông</option>
              <option value="circle">Hình Tròn</option>
              <option value="triangle">Hình Tam Giác</option>
              <option value="heart">Hình Trái Tim</option>
              <option value="star">Hình Ngôi Sao</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Màu sắc tô</label>
              <input 
                type="color" 
                value={selectedLayer.fillColor || '#fda4af'}
                onChange={e => updateSelectedLayer({ fillColor: e.target.value })}
                className="w-full h-8 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Màu viền</label>
              <input 
                type="color" 
                value={selectedLayer.borderColor || '#f43f5e'}
                onChange={e => updateSelectedLayer({ borderColor: e.target.value })}
                className="w-full h-8 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-slate-400 font-bold block mb-1">Độ dày viền</label>
              <input 
                type="number" min="0" max="15"
                value={selectedLayer.borderSize ?? 0}
                onChange={e => updateSelectedLayer({ borderSize: parseInt(e.target.value) || 0 })}
                className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-xs"
              />
            </div>
            {selectedLayer.shapeType !== 'circle' && (
              <div>
                <label className="text-[8px] text-slate-400 font-bold block mb-1">Bo góc (Radius)</label>
                <input 
                  type="number" min="0" max="100"
                  value={selectedLayer.cornerRadius ?? 8}
                  onChange={e => updateSelectedLayer({ cornerRadius: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 h-8 rounded-lg bg-slate-50 border text-xs"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* OVERLAY LAYER PROPERTIES */}
      {selectedLayer.type === 'overlay' && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-850">
          <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Thông số Lớp Phủ (Overlay)</h5>
          
          <div>
            <label className="text-[8px] text-slate-400 font-bold block mb-1">Ảnh lớp phủ / PNG URL</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={selectedLayer.url || ''}
                onChange={e => updateSelectedLayer({ url: e.target.value })}
                placeholder="URL ảnh lớp phủ (.png)..."
                className="w-full px-2 h-8 rounded-lg bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-[10px] focus:outline-none focus:border-rose-500"
              />
              <label className="px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[9px] font-black uppercase flex items-center justify-center cursor-pointer transition-colors shrink-0">
                Tải lên
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
            <p className="text-[8px] text-slate-400 mt-1 leading-relaxed">
              💡 Khuyên dùng ảnh PNG trong suốt có viền/logo trang trí để làm lớp phủ kéo thả.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
