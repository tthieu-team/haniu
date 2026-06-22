'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { LOCAL_STICKERS } from './stickersData';

const gf = new GiphyFetch('h4WnsWOfiI1R0QymIt6qeUM3FCVUMUhD');

interface LeftToolboxProps {
  builderTemplate: any;
  setBuilderTemplate: React.Dispatch<React.SetStateAction<any>>;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  assets: any;
  handleAddFrameLayer: () => void;
  handleAddTextLayer: () => void;
  handleAddShapeLayer: (shape: 'rect' | 'circle' | 'triangle' | 'heart' | 'star') => void;
  handleAddStickerLayer: (url: string) => void;
  handleAddLogoLayer: (url: string) => void;
  handleDuplicateLayer: (layer: any) => void;
  handleMoveLayerUp: (idx: number) => void;
  handleMoveLayerDown: (idx: number) => void;
}

export const LeftToolbox: React.FC<LeftToolboxProps> = ({
  builderTemplate,
  setBuilderTemplate,
  selectedLayerId,
  setSelectedLayerId,
  assets,
  handleAddFrameLayer,
  handleAddTextLayer,
  handleAddShapeLayer,
  handleAddStickerLayer,
  handleAddLogoLayer,
  handleDuplicateLayer,
  handleMoveLayerUp,
  handleMoveLayerDown
}) => {
  // GIPHY stickers states
  const [giphySearch, setGiphySearch] = useState('');
  const [giphyStickers, setGiphyStickers] = useState<any[]>([]);
  const [loadingGiphy, setLoadingGiphy] = useState(false);
  const [activeLocalCategory, setActiveLocalCategory] = useState(LOCAL_STICKERS[0].category);

  const fetchGiphyStickers = async (query: string) => {
    setLoadingGiphy(true);
    try {
      if (query.trim() === '') {
        const { data } = await gf.trending({ type: 'stickers', limit: 12 });
        setGiphyStickers(data);
      } else {
        const { data } = await gf.search(query, { type: 'stickers', limit: 16 });
        setGiphyStickers(data);
      }
    } catch (e) {
      console.error('Lỗi khi tải Giphy stickers:', e);
    } finally {
      setLoadingGiphy(false);
    }
  };

  useEffect(() => {
    fetchGiphyStickers('');
  }, []);

  return (
    <div className="w-80 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto p-5 space-y-6 shrink-0">
      
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Thêm lớp thành phần</h4>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleAddFrameLayer}
            className="h-16 border border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-rose-600 cursor-pointer transition-all"
          >
            <span className="text-lg">📸</span>
            <span className="text-[9px] font-black uppercase tracking-wider font-sans">Khung Ảnh</span>
          </button>
          <button 
            onClick={handleAddTextLayer}
            className="h-16 border border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-rose-600 cursor-pointer transition-all"
          >
            <span className="text-lg">🖋️</span>
            <span className="text-[9px] font-black uppercase tracking-wider font-sans">Văn Bản</span>
          </button>
        </div>
      </div>

      {/* ADD SHAPES TOOLBOX */}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Thêm Hình dạng (Shapes)</h4>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { shape: 'rect', icon: '■', label: 'H.Chữ Nhật' },
            { shape: 'circle', icon: '●', label: 'H.Tròn' },
            { shape: 'triangle', icon: '▲', label: 'Tam Giác' },
            { shape: 'heart', icon: '♥', label: 'Trái Tim' },
            { shape: 'star', icon: '★', label: 'Ngôi Sao' }
          ].map((item) => (
            <button
              key={item.shape}
              onClick={() => handleAddShapeLayer(item.shape as any)}
              className="py-2.5 border border-slate-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-rose-600"
              title={item.label}
            >
              <span className="text-sm font-bold">{item.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* HANIU LOCAL STICKERS LIBRARY */}
      <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-zinc-800 pt-3">
        <h4 className="text-xs font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wider flex items-center justify-between">
          <span>🎨 Thư viện Sticker Haniu</span>
          <span className="text-[8px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded font-black">LOCAL</span>
        </h4>

        {/* Categories Tab Selector */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
          {LOCAL_STICKERS.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveLocalCategory(cat.category)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase whitespace-nowrap cursor-pointer transition-all ${
                activeLocalCategory === cat.category
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-750'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Sticker Grid */}
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
          {LOCAL_STICKERS.find(c => c.category === activeLocalCategory)?.items.map((item) => (
            <div
              key={item.url}
              onClick={() => {
                if (item.type === 'background') {
                  if (confirm('Bạn muốn dùng hình này làm hình nền hay nhãn dán?\n- OK: Làm hình nền\n- Cancel: Làm nhãn dán')) {
                    setBuilderTemplate((prev: any) => ({
                      ...prev,
                      background: item.url,
                      backgroundType: 'image'
                    }));
                    return;
                  }
                }
                handleAddStickerLayer(item.url);
              }}
              className="group relative border border-slate-150 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-xl p-1.5 flex flex-col items-center justify-center cursor-pointer aspect-square bg-slate-50 dark:bg-zinc-900 transition-all"
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-12 h-12 object-contain pointer-events-none group-hover:scale-110 transition-transform duration-200"
                title={`Click để thêm ${item.name}`}
              />
              <span className="text-[8px] font-bold text-slate-450 dark:text-zinc-400 text-center truncate w-full mt-1.5">
                {item.name}
              </span>
              
              {/* Quick actions for backgrounds */}
              {item.type === 'background' && (
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex flex-col gap-1 items-center justify-center p-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBuilderTemplate((prev: any) => ({
                        ...prev,
                        background: item.url,
                        backgroundType: 'image'
                      }));
                    }}
                    className="w-full py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[7px] font-black uppercase text-center cursor-pointer"
                  >
                    Làm Nền
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddStickerLayer(item.url);
                    }}
                    className="w-full py-0.5 bg-slate-700 hover:bg-slate-650 text-white rounded text-[7px] font-black uppercase text-center cursor-pointer"
                  >
                    Dán Lớp
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GIPHY ONLINE STICKERS SEARCH */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
          <span>Sticker trực tuyến (GIPHY)</span>
          <span className="text-[8px] bg-rose-500/10 text-rose-500 px-1 py-0.5 rounded font-black">SDK</span>
        </h4>
        
        <div className="flex gap-1.5">
          <input
            type="text"
            value={giphySearch}
            onChange={e => setGiphySearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') fetchGiphyStickers(giphySearch); }}
            placeholder="Tìm sticker GIPHY..."
            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-[11px] bg-slate-50 dark:bg-zinc-850 text-slate-700 dark:text-zinc-200 outline-none"
          />
          <button
            onClick={() => fetchGiphyStickers(giphySearch)}
            className="px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
          >
            Tìm
          </button>
        </div>

        {loadingGiphy ? (
          <div className="text-center py-5 text-[10px] text-slate-400">Đang tìm kiếm sticker...</div>
        ) : giphyStickers.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
            {giphyStickers.map((gif: any) => {
              const url = gif.images?.fixed_width?.url || gif.images?.original?.url;
              return (
                <button 
                  key={gif.id}
                  onClick={() => handleAddStickerLayer(url)}
                  className="p-1 border border-slate-150 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-xl flex items-center justify-center cursor-pointer aspect-square bg-slate-50 dark:bg-zinc-900"
                  title={gif.title}
                >
                  <img src={url} alt={gif.title} className="w-8 h-8 object-contain pointer-events-none" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border text-center text-[10px] text-slate-400">
            Không tìm thấy sticker nào.
          </div>
        )}
      </div>

      {/* LOGO WATERMARKS QUICK-ADD */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Thêm Logo Watermark</h4>
        <div className="space-y-1.5">
          {assets.logos && assets.logos.length > 0 ? (
            assets.logos.map((lg: any) => (
              <button 
                key={lg.id}
                onClick={() => handleAddLogoLayer(lg.url)}
                className="w-full py-2 px-3 border border-slate-250 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 text-left rounded-xl text-[10px] font-bold text-slate-700 dark:text-zinc-300 flex items-center justify-between cursor-pointer"
              >
                <span className="truncate pr-2">{lg.name}</span>
                <span className="text-amber-500">✨</span>
              </button>
            ))
          ) : (
            <button 
              onClick={() => handleAddLogoLayer('')}
              className="w-full py-2 px-3 border border-dashed border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-rose-500 hover:border-rose-500 text-left rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-between cursor-pointer"
            >
              <span>Mẫu Logo Mặc Định</span>
              <span>➕</span>
            </button>
          )}
        </div>
      </div>

      {/* LAYER MANAGER LIST */}
      <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wider">Quản lý Lớp (Layers)</h4>
          <span className="text-[10px] text-slate-400 font-bold">{builderTemplate.layers?.length || 0} Layers</span>
        </div>

        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {builderTemplate.layers?.map((layer: any, idx: number) => {
            const isSelected = layer.id === selectedLayerId;
            return (
              <div 
                key={layer.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLayerId(layer.id);
                }}
                className={`flex flex-col p-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600'
                    : 'bg-slate-50 dark:bg-zinc-850 border-slate-150 dark:border-zinc-800 text-slate-655 dark:text-zinc-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                    <span className="text-slate-400">
                      {layer.type === 'frame' ? '📸' : layer.type === 'text' ? '🖋️' : layer.type === 'sticker' ? '🎨' : layer.type === 'logo' ? '🏷️' : '■'}
                    </span>
                    <input
                      type="text"
                      value={layer.type === 'frame' ? layer.label : layer.type === 'text' ? layer.text : layer.label || layer.type.toUpperCase()}
                      onChange={e => {
                        const updatedVal = e.target.value;
                        setBuilderTemplate((prev: any) => ({
                          ...prev,
                          layers: prev.layers.map((l: any) => {
                            if (l.id !== layer.id) return l;
                            if (layer.type === 'frame') return { ...l, label: updatedVal };
                            if (layer.type === 'text') return { ...l, text: updatedVal };
                            return { ...l, label: updatedVal };
                          })
                        }));
                      }}
                      className="bg-transparent border-none text-[11px] font-bold text-slate-700 dark:text-zinc-200 outline-none w-full py-0 cursor-text"
                      onClick={e => e.stopPropagation()}
                    />
                  </div>

                  <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleDuplicateLayer(layer)}
                      className="p-1 rounded hover:bg-slate-205 text-[10px] text-slate-450"
                      title="Nhân bản lớp"
                    >
                      👯
                    </button>
                    <button 
                      onClick={() => {
                        const locked = !layer.locked;
                        setBuilderTemplate((prev: any) => ({
                          ...prev,
                          layers: prev.layers.map((l: any) => l.id === layer.id ? { ...l, locked } : l)
                        }));
                      }}
                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 ${layer.locked ? 'text-rose-500' : 'text-slate-400'}`}
                      title={layer.locked ? 'Mở khóa layer' : 'Khóa layer'}
                    >
                      {layer.locked ? '🔒' : '🔓'}
                    </button>
                    <button 
                      onClick={() => {
                        const visible = layer.visible === false ? true : false;
                        setBuilderTemplate((prev: any) => ({
                          ...prev,
                          layers: prev.layers.map((l: any) => l.id === layer.id ? { ...l, visible } : l)
                        }));
                      }}
                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 ${layer.visible === false ? 'text-slate-350' : 'text-slate-655'}`}
                      title={layer.visible === false ? 'Hiện layer' : 'Ẩn layer'}
                    >
                      {layer.visible === false ? '👁️‍gi' : '👁️'}
                    </button>
                    <button 
                      onClick={() => handleMoveLayerUp(idx)}
                      disabled={idx === builderTemplate.layers.length - 1}
                      className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-400"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => handleMoveLayerDown(idx)}
                      disabled={idx === 0}
                      className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-400"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
