'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { LOCAL_STICKERS, LocalStickerCategory, LocalStickerItem } from './stickersData';

const gf = new GiphyFetch('h4WnsWOfiI1R0QymIt6qeUM3FCVUMUhD');

interface LeftToolboxProps {
  builderTemplate: any;
  setBuilderTemplate: React.Dispatch<React.SetStateAction<any>>;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  assets: any;
  handleAddFrameLayer: () => void;
  handleAddTextLayer: (withBackground?: boolean) => void;
  handleAddShapeLayer: (shape: 'rect' | 'circle' | 'triangle' | 'heart' | 'star') => void;
  handleAddStickerLayer: (url: string) => void;
  handleAddLogoLayer?: (url: string) => void;
  handleDuplicateLayer: (layer: any) => void;
  handleMoveLayerUp: (idx: number) => void;
  handleMoveLayerDown: (idx: number) => void;
  handleAddOverlayLayer: () => void;
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
  handleDuplicateLayer,
  handleMoveLayerUp,
  handleMoveLayerDown,
  handleAddOverlayLayer
}) => {
  // Left Sidebar Active Tab: 'elements' (Thêm lớp), 'stickers' (Thư viện sticker), 'layers' (Quản lý lớp)
  const [activeTab, setActiveTab] = useState<'elements' | 'stickers' | 'layers'>('elements');

  // Sub-tab for Sticker: 'local' (Haniu Local) vs 'giphy' (Giphy Online)
  const [stickerSubTab, setStickerSubTab] = useState<'local' | 'giphy'>('local');

  // GIPHY stickers states
  const [giphySearch, setGiphySearch] = useState('');
  const [giphyStickers, setGiphyStickers] = useState<any[]>([]);
  const [loadingGiphy, setLoadingGiphy] = useState(false);
  const [localStickers, setLocalStickers] = useState<LocalStickerCategory[]>(LOCAL_STICKERS);
  const [openCategories, setOpenCategories] = useState<string[]>(() => {
    return LOCAL_STICKERS.length > 0 ? [LOCAL_STICKERS[0].category] : [];
  });

  const uploadedCategory: LocalStickerCategory = {
    category: 'ĐÃ TẢI LÊN',
    items: (assets?.stickers || []).map((stk: any) => ({
      name: stk.name,
      url: stk.url,
      type: 'sticker' as const
    }))
  };

  const allCategories = [
    ...(uploadedCategory.items.length > 0 ? [uploadedCategory] : []),
    ...localStickers
  ];

  const toggleCategory = (catName: string) => {
    setOpenCategories(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const handleExpandAll = () => {
    if (openCategories.length === allCategories.length) {
      setOpenCategories([]);
    } else {
      setOpenCategories(allCategories.map(c => c.category));
    }
  };

  const fetchGiphyStickers = async (query: string) => {
    setLoadingGiphy(true);
    try {
      if (query.trim() === '') {
        const { data } = await gf.trending({ type: 'stickers', limit: 24 });
        setGiphyStickers(data);
      } else {
        const { data } = await gf.search(query, { type: 'stickers', limit: 30 });
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
    
    // Fetch dynamic stickers from backend public files
    const loadLocalStickers = async () => {
      try {
        const res = await fetch('/api/stickers');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLocalStickers(data);
            setOpenCategories(prev => prev.length === 0 ? [data[0].category] : prev);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic stickers:', err);
      }
    };
    loadLocalStickers();
  }, []);

  const layersCount = builderTemplate.layers?.length || 0;

  return (
    <div 
      style={{ width: '360px', minWidth: '360px', maxWidth: '360px', flexShrink: 0 }}
      className="w-[360px] min-w-[360px] max-w-[360px] border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shrink-0 flex flex-col font-sans h-full overflow-hidden"
    >
      
      {/* Top Primary Navigation Tabs (Strictly Equal 33.33% Width for all tabs) */}
      <div className="grid grid-cols-3 bg-slate-100 dark:bg-zinc-850 p-1 rounded-2xl gap-1 shrink-0 mb-3 border border-slate-200/50 dark:border-zinc-800 w-full">
        {[
          { id: 'elements', label: 'Thành phần', icon: '➕' },
          { id: 'stickers', label: 'Sticker', icon: '🎨' },
          { id: 'layers', label: `Lớp (${layersCount})`, icon: '📑' },
        ].map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`w-full min-w-0 py-2 px-1 rounded-xl text-[11px] font-bold uppercase flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200/80 dark:border-zinc-700'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <span className="text-xs shrink-0">{t.icon}</span>
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: THÊM THÀNH PHẦN (ELEMENTS) */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'elements' && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
          {/* Primary Layer Cards */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
              Thêm Lớp Mới
            </h4>
            <div className="grid grid-cols-3 gap-2 w-full">
              <button 
                type="button"
                onClick={handleAddFrameLayer}
                className="w-full min-w-0 h-20 border border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-zinc-300 hover:text-rose-600 cursor-pointer transition-all group shadow-2xs hover:shadow-sm p-1"
                title="Thêm khung chứa ảnh photobooth"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
                <span className="text-[11px] font-bold uppercase tracking-tight font-sans truncate w-full text-center">Khung Ảnh</span>
              </button>
              
              <button 
                type="button"
                onClick={() => handleAddTextLayer(true)}
                className="w-full min-w-0 h-20 border border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-zinc-300 hover:text-rose-600 cursor-pointer transition-all group shadow-2xs hover:shadow-sm p-1"
                title="Thêm văn bản chữ nghệ thuật photobooth"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">🖋️</span>
                <span className="text-[11px] font-bold uppercase tracking-tight font-sans truncate w-full text-center">Văn Bản</span>
              </button>

              <button 
                type="button"
                onClick={handleAddOverlayLayer}
                className="w-full min-w-0 h-20 border border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-zinc-300 hover:text-rose-600 cursor-pointer transition-all group shadow-2xs hover:shadow-sm p-1"
                title="Thêm lớp phủ ảnh trong suốt overlay"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">🖼️</span>
                <span className="text-[11px] font-bold uppercase tracking-tight font-sans truncate w-full text-center">Lớp Phủ</span>
              </button>
            </div>
          </div>

          {/* Shapes Toolbox */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <h4 className="text-[11px] font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
              Hình Dạng (Shapes)
            </h4>
            <div className="grid grid-cols-5 gap-1 w-full">
              {[
                { shape: 'rect', icon: '■', label: 'Chữ Nhật' },
                { shape: 'circle', icon: '●', label: 'Tròn' },
                { shape: 'triangle', icon: '▲', label: 'Tam Giác' },
                { shape: 'heart', icon: '♥', label: 'Trái Tim' },
                { shape: 'star', icon: '★', label: 'Ngôi Sao' }
              ].map((item) => (
                <button
                  key={item.shape}
                  type="button"
                  onClick={() => handleAddShapeLayer(item.shape as any)}
                  className="w-full min-w-0 py-2 border border-slate-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-600 dark:text-zinc-300 hover:text-rose-600 px-0.5"
                  title={item.label}
                >
                  <span className="text-sm font-bold">{item.icon}</span>
                  <span className="text-[8px] font-semibold uppercase mt-0.5 truncate w-full text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: THƯ VIỆN STICKER (MODERN SLEEK DESIGN & SUB-TABS) */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'stickers' && (
        <div className="flex-1 flex flex-col min-h-0 space-y-3">
          
          {/* Modern Segmented Sub-tab Switcher (Level 2 Hierarchy) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-zinc-850 rounded-2xl gap-1 shrink-0 border border-slate-200/60 dark:border-zinc-800/80">
            <button
              onClick={() => setStickerSubTab('local')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                stickerSubTab === 'local'
                  ? 'bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200/80 dark:border-zinc-700'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <span className="text-xs">🌸</span>
              <span className="truncate">Thư viện Haniu</span>
            </button>
            <button
              onClick={() => setStickerSubTab('giphy')}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                stickerSubTab === 'giphy'
                  ? 'bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200/80 dark:border-zinc-700'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <span className="text-xs">✨</span>
              <span className="truncate">GIPHY Online</span>
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* SUB-TAB 1: HANIU LOCAL STICKERS (MODERN ACCORDION CARDS) */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {stickerSubTab === 'local' && (
            <div className="flex-1 flex flex-col min-h-0 space-y-2">
              {/* Header with Title and Toggle All */}
              <div className="flex items-center justify-between px-1 shrink-0">
                <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
                  Bộ sưu tập ({allCategories.length})
                </span>
                <button
                  type="button"
                  onClick={handleExpandAll}
                  className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  {openCategories.length === allCategories.length ? 'Thu gọn' : 'Mở tất cả'}
                </button>
              </div>

              {/* Modern Accordion List of Categories */}
              <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1">
                {allCategories.map((cat) => {
                  const isExpanded = openCategories.includes(cat.category);
                  return (
                    <div 
                      key={cat.category} 
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                        isExpanded
                          ? 'border-rose-200 dark:border-rose-900/50 bg-white dark:bg-zinc-900 shadow-sm'
                          : 'border-slate-200/60 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-850/40 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      {/* Accordion Category Header Button */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.category)}
                        className={`w-full flex items-center justify-between p-2.5 cursor-pointer transition-colors text-left group ${
                          isExpanded 
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400' 
                            : 'text-slate-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 transition-colors ${
                            isExpanded
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-white dark:bg-zinc-800 border border-slate-200/70 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 group-hover:border-rose-300'
                          }`}>
                            {cat.category === 'ĐÃ TẢI LÊN' ? '☁️' : isExpanded ? '📂' : '📁'}
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 block truncate">
                              {cat.category}
                            </span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold shrink-0 ${
                            isExpanded 
                              ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300' 
                              : 'bg-slate-200/60 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                          }`}>
                            {cat.items.length}
                          </span>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[8px] shrink-0 transition-transform duration-200 ${
                          isExpanded 
                            ? 'rotate-180 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300' 
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 group-hover:text-slate-600'
                        }`}>
                          ▼
                        </div>
                      </button>

                      {/* Accordion Category Content (Stickers Grid) */}
                      {isExpanded && (
                        <div className="p-2.5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/60 animate-in fade-in duration-150">
                          <div className="grid grid-cols-3 gap-2">
                            {cat.items.map((item: LocalStickerItem) => (
                              <div
                                key={item.url}
                                onClick={() => handleAddStickerLayer(item.url)}
                                className="group relative border border-slate-200/60 dark:border-zinc-800/80 hover:border-rose-400 hover:bg-white dark:hover:bg-zinc-800 rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer aspect-square bg-white dark:bg-zinc-850/80 transition-all shadow-2xs hover:shadow-md hover:scale-[1.03]"
                                title={`Click để thêm ${item.name}`}
                              >
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="w-11 h-11 object-contain pointer-events-none group-hover:scale-110 transition-transform duration-200"
                                />
                                <span className="text-[9px] font-medium text-slate-500 dark:text-zinc-400 text-center truncate w-full mt-1.5">
                                  {item.name}
                                </span>
                                
                                {item.type === 'background' && (
                                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex flex-col gap-1 items-center justify-center p-1.5 z-10">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setBuilderTemplate((prev: any) => ({
                                          ...prev,
                                          background: item.url,
                                          backgroundType: 'image'
                                        }));
                                      }}
                                      className="w-full py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[8px] font-black uppercase text-center cursor-pointer shadow-xs"
                                    >
                                      Làm Nền
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddStickerLayer(item.url);
                                      }}
                                      className="w-full py-1 bg-slate-750 hover:bg-slate-700 text-white rounded-lg text-[8px] font-black uppercase text-center cursor-pointer shadow-xs"
                                    >
                                      Dán Lớp
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* SUB-TAB 2: GIPHY STICKERS (MODERN SEARCH & CLEAN GRID) */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          {stickerSubTab === 'giphy' && (
            <div className="flex-1 flex flex-col min-h-0 space-y-2.5">
              {/* Search Bar with integrated search icon */}
              <div className="relative flex items-center shrink-0">
                <input
                  type="text"
                  value={giphySearch}
                  onChange={e => setGiphySearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') fetchGiphyStickers(giphySearch); }}
                  placeholder="Tìm kiếm sticker GIPHY..."
                  className="w-full pl-8 pr-16 py-2 rounded-2xl border border-slate-200 dark:border-zinc-800 text-xs bg-slate-50/80 dark:bg-zinc-850/80 text-slate-800 dark:text-zinc-100 outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors shadow-2xs"
                />
                <span className="absolute left-2.5 text-slate-400 text-xs pointer-events-none">
                  🔍
                </span>
                {giphySearch && (
                  <button
                    type="button"
                    onClick={() => { setGiphySearch(''); fetchGiphyStickers(''); }}
                    className="absolute right-12 text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-0.5"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => fetchGiphyStickers(giphySearch)}
                  className="absolute right-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  Tìm
                </button>
              </div>

              {/* Quick Trending Keyword Pills */}
              <div className="flex gap-1 overflow-x-auto pb-1 shrink-0 scrollbar-none">
                {['🌸 Cute', '💖 Heart', '🎂 Birthday', '✨ Sparkle', '🐱 Cat', '🎉 Party', '⭐ Star'].map(tag => {
                  const query = tag.replace(/^[^\s]+\s/, '');
                  const isActive = giphySearch.toLowerCase() === query.toLowerCase();
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setGiphySearch(query);
                        fetchGiphyStickers(query);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
                        isActive
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-slate-100/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-zinc-750 hover:text-rose-600 border border-slate-200/50 dark:border-zinc-750'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Giphy Results Grid */}
              {loadingGiphy ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                  <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-bold">Đang tải sticker GIPHY...</span>
                </div>
              ) : giphyStickers.length > 0 ? (
                <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                  <div className="grid grid-cols-3 gap-2">
                    {giphyStickers.map((gif: any) => {
                      const url = gif.images?.fixed_width?.url || gif.images?.original?.url;
                      return (
                        <button 
                          key={gif.id}
                          onClick={() => handleAddStickerLayer(url)}
                          className="group relative p-2 border border-slate-200/60 dark:border-zinc-800/80 hover:border-rose-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer aspect-square bg-slate-50/60 dark:bg-zinc-850/60 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-2xs hover:shadow-md hover:scale-105"
                          title={gif.title || 'Click để dán sticker'}
                        >
                          <img src={url} alt={gif.title} className="w-12 h-12 object-contain pointer-events-none group-hover:scale-110 transition-transform duration-200" />
                          <span className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-rose-500 text-white rounded-md w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-xs transition-opacity">
                            +
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/60 dark:bg-zinc-850/40 border border-dashed border-slate-200 dark:border-zinc-800 text-center text-slate-400 space-y-1">
                  <span className="text-2xl">🔍</span>
                  <span className="text-xs font-bold">Không tìm thấy sticker nào</span>
                  <span className="text-[9px]">Thử tìm kiếm với từ khóa khác hoặc bấm gợi ý phía trên</span>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: QUẢN LÝ LỚP (LAYERS LIST & CONTROLS - FULL HEIGHT) */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'layers' && (
        <div className="flex-1 flex flex-col min-h-0 space-y-2">
          <div className="flex justify-between items-center px-1 shrink-0">
            <h4 className="text-[11px] font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
              Danh Sách Lớp ({layersCount})
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Click để chọn</span>
          </div>

          {layersCount === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50 dark:bg-zinc-850 text-slate-400 space-y-1">
              <span className="text-3xl block">📂</span>
              <span className="text-xs font-bold block">Chưa có lớp nào</span>
              <span className="text-[10px] block">Bấm sang tab "Thành phần" hoặc "Sticker" để thêm</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {builderTemplate.layers?.map((layer: any, idx: number) => {
                const isSelected = layer.id === selectedLayerId;
                return (
                  <div 
                    key={layer.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLayerId(layer.id);
                    }}
                    className={`flex flex-col p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-2xs'
                        : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate max-w-[60%]">
                        <span className="text-slate-400 text-xs">
                          {layer.type === 'frame' ? '📸' : layer.type === 'text' ? '🖋️' : layer.type === 'sticker' ? '🎨' : layer.type === 'overlay' ? '🖼️' : '■'}
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
                          className="bg-transparent border-none text-[11px] font-bold text-slate-800 dark:text-zinc-200 outline-none w-full py-0 cursor-text truncate"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>

                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleDuplicateLayer(layer)}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-750 text-[10px] text-slate-500 cursor-pointer"
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
                          className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-750 cursor-pointer ${layer.locked ? 'text-rose-500' : 'text-slate-400'}`}
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
                          className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-750 cursor-pointer ${layer.visible === false ? 'text-slate-300' : 'text-slate-600 dark:text-zinc-300'}`}
                          title={layer.visible === false ? 'Hiện layer' : 'Ẩn layer'}
                        >
                          {layer.visible === false ? '👁️‍🗨️' : '👁️'}
                        </button>
                        <button 
                          onClick={() => handleMoveLayerUp(idx)}
                          disabled={idx === builderTemplate.layers.length - 1}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-750 disabled:opacity-25 text-slate-500 cursor-pointer text-xs"
                          title="Đưa lên trên"
                        >
                          ▲
                        </button>
                        <button 
                          onClick={() => handleMoveLayerDown(idx)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-750 disabled:opacity-25 text-slate-500 cursor-pointer text-xs"
                          title="Đưa xuống dưới"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
