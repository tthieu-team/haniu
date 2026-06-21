'use client';

import React, { useState } from 'react';
import Icon from '@/components/common/Icons';

const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Image load error'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
};

interface TemplateWizardProps {
  builderTemplate: any;
  setBuilderTemplate: React.Dispatch<React.SetStateAction<any>>;
  assets: any;
  onClose: () => void;
  onFinishWizard: () => void;
}

export const TemplateWizard: React.FC<TemplateWizardProps> = ({
  builderTemplate,
  setBuilderTemplate,
  assets,
  onClose,
  onFinishWizard
}) => {
  const [wizardStep, setWizardStep] = useState(1);

  // Default ratios mapping
  const ratioPresets = [
    { label: '9:16 (Story)', w: 1080, h: 1920 },
    { label: '3:4 (Portrait)', w: 1200, h: 1600 },
    { label: '4:5 (Instagram)', w: 1200, h: 1500 },
    { label: '1:1 (Square)', w: 1200, h: 1200 },
    { label: 'Custom', w: 1200, h: 1800 }
  ];

  const [selectedRatio, setSelectedRatio] = useState('3:4 (Portrait)');

  // Form states for wizard step 1
  const [basicInfo, setBasicInfo] = useState({
    name: builderTemplate.name || '',
    description: builderTemplate.description || '',
    thumbnail: builderTemplate.thumbnail || '',
    status: builderTemplate.status || 'ACTIVE'
  });

  const handleNextStep = () => {
    if (wizardStep === 1) {
      if (!basicInfo.name.trim()) {
        alert('Vui lòng nhập tên Template!');
        return;
      }
      setBuilderTemplate((prev: any) => ({
        ...prev,
        ...basicInfo
      }));
      setWizardStep(2);
    } else if (wizardStep === 2) {
      setWizardStep(3);
    } else if (wizardStep === 3) {
      onFinishWizard();
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Wizard Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border-b border-slate-100 dark:border-zinc-850 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black uppercase text-slate-800 dark:text-zinc-100 tracking-tight">Tạo Template Mới</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bước {wizardStep} trên 3</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-655 dark:hover:text-zinc-200 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800">
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="h-1 bg-slate-100 dark:bg-zinc-800 w-full relative">
          <div 
            className="h-full bg-rose-600 transition-all duration-300"
            style={{ width: `${(wizardStep / 3) * 100}%` }}
          />
        </div>

        {/* Wizard Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* STEP 1: BASIC INFORMATION */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 mb-4">
                <p className="text-xs text-rose-600 dark:text-rose-455 font-semibold leading-relaxed font-sans">
                  💡 Nhập các thông tin nhận diện cơ bản của khung ảnh. Tên template và thumbnail sẽ hiển thị trực tiếp cho khách hàng lựa chọn khi chụp.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Tên Template *</label>
                <input 
                  type="text" 
                  value={basicInfo.name}
                  onChange={e => setBasicInfo(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ví dụ: Korean 4 Cut, Valentine Sweet..."
                  className="w-full px-4 h-10 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-150 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Mô tả ngắn</label>
                <textarea 
                  rows={2}
                  value={basicInfo.description}
                  onChange={e => setBasicInfo(p => ({ ...p, description: e.target.value }))}
                  placeholder="Mô tả sơ lược về layout..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-150 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Thumbnail URL / Tải ảnh lên</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={basicInfo.thumbnail}
                    onChange={e => setBasicInfo(p => ({ ...p, thumbnail: e.target.value }))}
                    placeholder="Nhập đường dẫn ảnh đại diện hoặc tải lên..."
                    className="w-full px-4 h-10 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-700 dark:text-zinc-150 focus:outline-none"
                  />
                  <label className="px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition-colors shrink-0">
                    Tải ảnh
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressImage(file, 400, 400, 0.7).then(compressedBase64 => {
                            setBasicInfo(p => ({ ...p, thumbnail: compressedBase64 }));
                          }).catch(() => {
                            // Fallback
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setBasicInfo(p => ({ ...p, thumbnail: event.target!.result as string }));
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }
                      }}
                    />
                  </label>
                  <button 
                    onClick={() => {
                      const url = prompt('Nhập URL ảnh mô phỏng có sẵn:');
                      if (url) setBasicInfo(p => ({ ...p, thumbnail: url }));
                    }}
                    className="px-3 bg-slate-100 dark:bg-zinc-800 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-200 shrink-0"
                  >
                    URL
                  </button>
                </div>
                {basicInfo.thumbnail && (
                  <div className="mt-2 relative w-16 h-16 rounded-xl overflow-hidden border border-slate-250 dark:border-zinc-800 bg-slate-100 flex items-center justify-center">
                    <img src={basicInfo.thumbnail} alt="thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Trạng thái mặc định</label>
                <div className="flex gap-4">
                  {['ACTIVE', 'INACTIVE'].map(status => (
                    <label key={status} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300 cursor-pointer">
                      <input 
                        type="radio" 
                        name="wizard_status" 
                        checked={basicInfo.status === status}
                        onChange={() => setBasicInfo(p => ({ ...p, status }))}
                        className="accent-rose-600"
                      />
                      {status === 'ACTIVE' ? 'Hoạt động (Active)' : 'Tạm dừng (Inactive)'}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CANVAS RATIOS */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 mb-2">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold leading-relaxed">
                  📐 Chọn tỷ lệ khung hình chuẩn cho ảnh in. Tỷ lệ in phổ biến nhất của các quầy Photobooth là 3:4 hoặc 9:16.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">Chọn tỷ lệ in ảnh</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {ratioPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setSelectedRatio(preset.label);
                        setBuilderTemplate((prev: any) => ({
                          ...prev,
                          canvasWidth: preset.w,
                          canvasHeight: preset.h
                        }));
                      }}
                      className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                        selectedRatio === preset.label
                          ? 'border-rose-500 bg-rose-500/5 text-rose-600'
                          : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 hover:bg-slate-100 text-slate-700 dark:text-zinc-350'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{preset.label}</span>
                        <span className="text-[9px] opacity-60 font-mono">{preset.w}x{preset.h}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Hoặc lấy tỷ lệ từ ảnh tải lên</label>
                <div className="flex gap-2">
                  <label className="w-full py-3 bg-rose-500/5 hover:bg-rose-500/10 dark:bg-zinc-850 dark:hover:bg-zinc-800 border border-dashed border-rose-500/20 dark:border-zinc-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-rose-600 dark:text-rose-455">
                    <Icon name="image" size={14} />
                    Chọn ảnh để lấy kích thước tự động
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                              setSelectedRatio(`Từ ảnh (${img.naturalWidth}x${img.naturalHeight})`);
                              setBuilderTemplate((prev: any) => ({
                                ...prev,
                                canvasWidth: img.naturalWidth,
                                canvasHeight: img.naturalHeight,
                                background: event.target!.result as string,
                                backgroundType: 'image'
                              }));
                            };
                            img.src = event.target!.result as string;
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Chiều rộng tùy chỉnh (px)</label>
                  <input 
                    type="number" 
                    value={builderTemplate.canvasWidth}
                    onChange={e => {
                      setSelectedRatio('Custom');
                      setBuilderTemplate((p: any) => ({ ...p, canvasWidth: parseInt(e.target.value) || 1000 }));
                    }}
                    className="w-full px-4 h-10 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Chiều cao tùy chỉnh (px)</label>
                  <input 
                    type="number" 
                    value={builderTemplate.canvasHeight}
                    onChange={e => {
                      setSelectedRatio('Custom');
                      setBuilderTemplate((p: any) => ({ ...p, canvasHeight: parseInt(e.target.value) || 1000 }));
                    }}
                    className="w-full px-4 h-10 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BACKGROUND SELECTION */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 mb-2">
                <p className="text-xs text-rose-600 dark:text-rose-455 font-semibold leading-relaxed">
                  🎨 Lựa chọn màu sắc chủ đạo hoặc tải ảnh nền đặc thù cho template của bạn.
                </p>
              </div>

              {/* SOLID VS GRADIENT OPTION */}
              <div className="flex gap-2">
                {['solid', 'gradient'].map((bType) => (
                  <button
                    key={bType}
                    onClick={() => setBuilderTemplate((p: any) => ({
                      ...p,
                      backgroundType: bType,
                      backgroundGradient: p.backgroundGradient || { color1: '#fda4af', color2: '#f43f5e', angle: 45 }
                    }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border uppercase ${
                      (builderTemplate.backgroundType || 'solid') === bType
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-slate-100 text-slate-655'
                    }`}
                  >
                    {bType === 'solid' ? 'Màu đơn sắc' : 'Màu dải Gradient'}
                  </button>
                ))}
              </div>

              {builderTemplate.backgroundType === 'gradient' ? (
                <div className="space-y-3 p-3 bg-slate-50 dark:bg-zinc-850 rounded-2xl border">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold block mb-1">Màu bắt đầu</label>
                      <input 
                        type="color"
                        value={builderTemplate.backgroundGradient?.color1 || '#fda4af'}
                        onChange={e => setBuilderTemplate((p: any) => ({
                          ...p,
                          backgroundGradient: { ...(p.backgroundGradient || {}), color1: e.target.value }
                        }))}
                        className="w-full h-9 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold block mb-1">Màu kết thúc</label>
                      <input 
                        type="color"
                        value={builderTemplate.backgroundGradient?.color2 || '#f43f5e'}
                        onChange={e => setBuilderTemplate((p: any) => ({
                          ...p,
                          backgroundGradient: { ...(p.backgroundGradient || {}), color2: e.target.value }
                        }))}
                        className="w-full h-9 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold block mb-1">Góc xoay (°)</label>
                    <input 
                      type="number"
                      value={builderTemplate.backgroundGradient?.angle || 45}
                      onChange={e => setBuilderTemplate((p: any) => ({
                        ...p,
                        backgroundGradient: { ...(p.backgroundGradient || {}), angle: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 h-8 bg-white border text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Màu nền chủ đạo</label>
                  <div className="flex gap-3 items-center p-2 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <input 
                      type="color" 
                      value={builderTemplate.background?.startsWith('#') ? builderTemplate.background : '#ffffff'}
                      onChange={e => setBuilderTemplate((p: any) => ({ ...p, background: e.target.value, backgroundType: 'solid' }))}
                      className="w-10 h-10 rounded-xl cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-200">
                        {builderTemplate.background?.startsWith('#') ? builderTemplate.background : 'Màu tự chọn'}
                      </span>
                      <p className="text-[9px] text-slate-400">Chọn mã màu HEX làm viền nền của bức ảnh</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Ảnh nền từ thư viện / Tải lên file hoặc URL</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={builderTemplate.background?.startsWith('http') || builderTemplate.background?.startsWith('data:') ? builderTemplate.background : ''}
                    onChange={e => setBuilderTemplate((p: any) => ({ ...p, background: e.target.value, backgroundType: 'image' }))}
                    placeholder="Dán link ảnh nền hoặc tải lên file..."
                    className="w-full px-4 h-10 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                  />
                  <label className="px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition-colors shrink-0">
                    Tải ảnh
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressImage(file, 1200, 1200, 0.75).then(compressedBase64 => {
                            setBuilderTemplate((p: any) => ({
                              ...p,
                              background: compressedBase64,
                              backgroundType: 'image'
                            }));
                          }).catch(() => {
                            // Fallback
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setBuilderTemplate((p: any) => ({
                                  ...p,
                                  background: event.target!.result as string,
                                  backgroundType: 'image'
                                }));
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }
                      }}
                    />
                  </label>
                  <button 
                    onClick={() => {
                      const url = prompt('Nhập URL ảnh nền:');
                      if (url) setBuilderTemplate((p: any) => ({ ...p, background: url, backgroundType: 'image' }));
                    }}
                    className="px-3 bg-slate-100 dark:bg-zinc-800 text-xs font-bold rounded-xl shrink-0 text-slate-600 dark:text-zinc-300 hover:bg-slate-200"
                  >
                    URL
                  </button>
                </div>

                {assets.backgrounds && assets.backgrounds.length > 0 ? (
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-450 mb-2">Ảnh nền có sẵn trong thư viện:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {assets.backgrounds.map((bg: any) => (
                        <button
                          key={bg.id}
                          onClick={() => setBuilderTemplate((p: any) => ({ ...p, background: bg.url, backgroundType: 'image' }))}
                          className={`p-1 border rounded-xl overflow-hidden aspect-video bg-slate-200 ${
                            builderTemplate.background === bg.url && builderTemplate.backgroundType === 'image' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-zinc-800'
                          }`}
                        >
                          <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic">Thư viện ảnh nền đang trống. Bạn có thể tự do tô màu đơn sắc ở trên hoặc thiết lập ảnh nền sau.</p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900 border-t border-slate-150 dark:border-zinc-850 flex justify-between items-center">
          <button 
            onClick={handlePrevStep}
            disabled={wizardStep === 1}
            className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-zinc-450 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl disabled:opacity-40"
          >
            Quay lại
          </button>
          <button 
            onClick={handleNextStep}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
          >
            {wizardStep === 3 ? 'Bắt Đầu Thiết Kế' : 'Tiếp Tục'}
          </button>
        </div>

      </div>
    </div>
  );
};
