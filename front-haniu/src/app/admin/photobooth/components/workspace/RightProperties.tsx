'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface RightPropertiesProps {
  selectedLayer: any;
  updateSelectedLayer: (updates: any) => void;
  handleDeleteLayer: (id: string) => void;
}

export const RightProperties: React.FC<RightPropertiesProps> = ({
  selectedLayer,
  updateSelectedLayer,
  handleDeleteLayer
}) => {
  if (!selectedLayer) {
    return (
      <div className="w-80 border-l border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-5 space-y-6 shrink-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl block mb-2">⚙️</span>
        <p className="text-xs font-semibold px-2 text-slate-400">
          Bấm vào bất kỳ thành phần nào trên Canvas hoặc trong danh sách Lớp để cấu hình chi tiết.
        </p>
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
                <option value="3:4">3:4 (Dọc)</option>
                <option value="9:16">9:16 (Story)</option>
              </select>
            </div>
          </div>

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

    </div>
  );
};
