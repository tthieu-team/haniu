'use client';

import React, { useState } from 'react';
import { useHomeLayoutStore, HomeSectionKey, DEFAULT_SECTION_ORDER } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

interface VisibilityTabProps {
  onSave?: () => Promise<void>;
  isSaving?: boolean;
}

interface SectionMeta {
  key: HomeSectionKey;
  icon: string;
  name: string;
  desc: string;
  categoryTag: string;
}

const SECTION_METADATA: Record<HomeSectionKey, Omit<SectionMeta, 'key'>> = {
  hero: {
    icon: 'sparkles',
    name: 'Màn hình Hero (Banners)',
    desc: 'Banner lớn slideshow, khuyến mãi đầu trang',
    categoryTag: 'Đầu trang',
  },
  trustBar: {
    icon: 'shield',
    name: 'Thanh Tin cậy (Trust Bar)',
    desc: 'Cam kết vận chuyển, quà chính hãng, đổi trả',
    categoryTag: 'Cam kết',
  },
  brandIntro: {
    icon: 'gem',
    name: 'Giới thiệu Haniu (Brand Intro)',
    desc: 'Câu chuyện thương hiệu, chỉ số nổi bật',
    categoryTag: 'Thương hiệu',
  },
  categories: {
    icon: 'gift',
    name: 'Danh mục Dịp lễ (Categories)',
    desc: 'Bộ sưu tập quà tặng theo từng dịp đặc biệt',
    categoryTag: 'Danh mục',
  },
  featuredProducts: {
    icon: 'box',
    name: 'Sản phẩm Nổi bật (Featured Products)',
    desc: 'Lưới danh sách sản phẩm quà tặng chọn lọc',
    categoryTag: 'Sản phẩm',
  },
  collections: {
    icon: 'package',
    name: 'Bộ sưu tập Quà tặng (Collections)',
    desc: 'Các set quà tặng nổi bật theo chủ đề',
    categoryTag: 'Bộ sưu tập',
  },
  benefits: {
    icon: 'heart',
    name: 'Lợi ích & Dịch vụ (Benefits)',
    desc: 'Khắc tên cá nhân hóa, gói quà nghệ thuật',
    categoryTag: 'Dịch vụ',
  },
  howItWorks: {
    icon: 'clock',
    name: 'Quy trình Mua hàng (How It Works)',
    desc: '4 bước chọn quà, thanh toán và nhận hàng',
    categoryTag: 'Hướng dẫn',
  },
  videoBanner: {
    icon: 'video',
    name: 'Video Banner Cinematic',
    desc: 'Video clip trải nghiệm quà tặng tự động chạy',
    categoryTag: 'Media',
  },
  story: {
    icon: 'bookOpen',
    name: 'Câu chuyện Chế tác (Story)',
    desc: 'Chi tiết nghệ thuật thủ công làm tay',
    categoryTag: 'Nghệ thuật',
  },
  socialProof: {
    icon: 'star',
    name: 'Đánh giá Khách hàng (Reviews)',
    desc: 'Cảm nhận và lời chứng thực từ khách hàng',
    categoryTag: 'Đánh giá',
  },
  ugcFeed: {
    icon: 'camera',
    name: 'Mạng xã hội (UGC Feed)',
    desc: 'Ảnh check-in thực tế từ Instagram, Tiktok',
    categoryTag: 'Mạng xã hội',
  },
  blog: {
    icon: 'fileText',
    name: 'Góc Chia sẻ & Cẩm nang (Blog)',
    desc: 'Bài viết kinh nghiệm chọn và tặng quà',
    categoryTag: 'Tin tức',
  },
  cta: {
    icon: 'zap',
    name: 'Khối Kêu gọi Hành động (CTA Banner)',
    desc: 'Nút hành động kích thích thiết kế quà ngay',
    categoryTag: 'Chuyển đổi',
  },
  faq: {
    icon: 'helpCircle',
    name: 'Hỏi đáp Thường gặp (FAQs)',
    desc: 'Giải đáp thắc mắc về đơn hàng, đổi trả',
    categoryTag: 'Hỗ trợ',
  },
};

export function VisibilityTab({ onSave, isSaving = false }: VisibilityTabProps) {
  const {
    visibility,
    welcomeScreen,
    sectionOrder,
    toggleVisibility,
    updateWelcomeScreen,
    updateSectionOrder,
    moveSection,
    resetSectionOrder,
  } = useHomeLayoutStore();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'visible' | 'hidden'>('all');

  // Normalize current order: ensure all 15 sections exist
  const currentOrder: HomeSectionKey[] = React.useMemo(() => {
    if (sectionOrder && Array.isArray(sectionOrder) && sectionOrder.length > 0) {
      const valid = sectionOrder.filter((key) => key in SECTION_METADATA);
      const missing = DEFAULT_SECTION_ORDER.filter((key) => !valid.includes(key));
      return [...valid, ...missing];
    }
    return DEFAULT_SECTION_ORDER;
  }, [sectionOrder]);

  const visibleCount = currentOrder.filter((k) => visibility[k] !== false).length;
  const hiddenCount = currentOrder.length - visibleCount;

  // Filter sections if active tab filter is applied
  const displayedOrder = React.useMemo(() => {
    if (filterMode === 'visible') {
      return currentOrder.filter((k) => visibility[k] !== false);
    }
    if (filterMode === 'hidden') {
      return currentOrder.filter((k) => visibility[k] === false);
    }
    return currentOrder;
  }, [currentOrder, filterMode, visibility]);

  // Handle Drag and Drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    // Keep clean
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, movedItem);

    updateSectionOrder(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-black text-slate-800 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
            <Icon name="order" size={16} className="text-rose-500" />
            <span>Trạng thái Hiển thị & Sắp xếp Vị trí các Khối Trang Chủ</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium mt-1">
            Kéo thả biểu tượng <span className="font-bold text-rose-500">☰</span> hoặc bấm <span className="font-bold">▲ / ▼</span> để thay đổi thứ tự xuất hiện các session tại trang chủ theo ý muốn.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-end">
          <button
            onClick={() => {
              if (confirm('Khôi phục thứ tự các khối về vị trí mặc định ban đầu?')) {
                resetSectionOrder();
              }
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700/80 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            title="Khôi phục thứ tự 15 khối về mặc định"
          >
            <Icon name="rotate" size={12} />
            <span>Đặt lại thứ tự</span>
          </button>

          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSaving ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Icon name="save" size={13} />
              )}
              <span>Lưu trạng thái hiển thị</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Welcome Screen Standalone Highlight Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 dark:bg-rose-500/25 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Icon name="sparkles" size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                Splash Welcome Screen (Màn hình mở đầu)
              </span>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-rose-500/20 text-rose-600 dark:text-rose-300">
                Hiệu ứng Overlay
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
              Màn hình chào mừng với hoạt họa nghệ thuật xuất hiện ngay khi người dùng mở trang chủ.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0 self-end sm:self-center">
          <input
            type="checkbox"
            checked={welcomeScreen?.isEnabled || false}
            onChange={(e) => updateWelcomeScreen({ isEnabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-slate-300 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500 shadow-inner" />
        </label>
      </div>

      {/* 3. Section Filter & Order Status Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/70 dark:bg-zinc-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Bộ lọc:</span>
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-0.5 rounded-xl border border-slate-200/80 dark:border-zinc-700">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Tất cả ({currentOrder.length})
            </button>
            <button
              onClick={() => setFilterMode('visible')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                filterMode === 'visible'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Đang hiện ({visibleCount})
            </button>
            <button
              onClick={() => setFilterMode('hidden')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                filterMode === 'hidden'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Đã ẩn ({hiddenCount})
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
          <Icon name="info" size={13} className="text-rose-500" />
          <span>Vị trí trên cùng (01) sẽ hiển thị đầu tiên trên màn hình trang chủ</span>
        </p>
      </div>

      {/* 4. Draggable & Sortable Sections List */}
      <div className="space-y-2.5">
        {displayedOrder.map((sectionKey) => {
          const originalIndex = currentOrder.indexOf(sectionKey);
          const isVisible = visibility[sectionKey] !== false;
          const meta = SECTION_METADATA[sectionKey] || {
            icon: 'box',
            name: sectionKey,
            desc: 'Khối thông tin trang chủ',
            categoryTag: 'Khối',
          };

          const isBeingDragged = draggedIndex === originalIndex;
          const isDragTarget = dragOverIndex === originalIndex;

          return (
            <div
              key={sectionKey}
              draggable={filterMode === 'all'}
              onDragStart={(e) => handleDragStart(e, originalIndex)}
              onDragOver={(e) => handleDragOver(e, originalIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, originalIndex)}
              onDragEnd={handleDragEnd}
              className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all select-none ${
                isBeingDragged
                  ? 'opacity-40 border-rose-500 scale-[0.99] bg-rose-50 dark:bg-rose-950/20'
                  : isDragTarget
                  ? 'border-rose-500 border-2 bg-rose-50/70 dark:bg-rose-950/30 scale-[1.01] shadow-lg shadow-rose-500/10'
                  : isVisible
                  ? 'border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs'
                  : 'border-slate-200/50 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/40 opacity-60'
              }`}
            >
              {/* Left Column: Drag Handle + Order Index Badge + Icon + Name & Tag */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {/* Drag Handle */}
                <div
                  className={`flex items-center justify-center p-1.5 rounded-lg text-slate-400 dark:text-zinc-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors ${
                    filterMode === 'all' ? 'cursor-grab active:cursor-grabbing' : 'opacity-30 cursor-not-allowed'
                  }`}
                  title={filterMode === 'all' ? 'Giữ và kéo thả để thay đổi vị trí' : 'Chuyển về tab "Tất cả" để kéo thả'}
                >
                  <Icon name="grip-vertical" size={16} />
                </div>

                {/* Numeric Position Badge */}
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-mono text-xs font-black flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-zinc-700/60">
                  {String(originalIndex + 1).padStart(2, '0')}
                </div>

                {/* Section Icon Box */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                    isVisible
                      ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  <Icon name={meta.icon} size={17} />
                </div>

                {/* Text Labels */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 truncate">
                      {meta.name}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                      {meta.categoryTag}
                    </span>
                    {!isVisible && (
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        Đã ẩn
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-zinc-500 font-medium truncate mt-0.5">
                    {meta.desc}
                  </p>
                </div>
              </div>

              {/* Right Column: Move Up / Down Buttons + Visibility Toggle Switch */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-2">
                {/* Up / Down Move Buttons */}
                <div className="flex items-center gap-1 border-r border-slate-200 dark:border-zinc-800 pr-3">
                  <button
                    type="button"
                    disabled={originalIndex === 0}
                    onClick={() => moveSection(originalIndex, 'up')}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-20 disabled:hover:bg-slate-100 dark:disabled:hover:bg-zinc-800 disabled:hover:text-slate-600 active:scale-90 transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                    title="Di chuyển lên trên"
                  >
                    <span className="text-[10px] font-black leading-none">▲</span>
                  </button>
                  <button
                    type="button"
                    disabled={originalIndex === currentOrder.length - 1}
                    onClick={() => moveSection(originalIndex, 'down')}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-20 disabled:hover:bg-slate-100 dark:disabled:hover:bg-zinc-800 disabled:hover:text-slate-600 active:scale-90 transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                    title="Di chuyển xuống dưới"
                  >
                    <span className="text-[10px] font-black leading-none">▼</span>
                  </button>
                </div>

                {/* Toggle Visibility Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => toggleVisibility(sectionKey)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500 shadow-inner" />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
