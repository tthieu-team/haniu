'use client';

import React, { useState } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { FileUploadInput } from './FileUploadInput';
import Icon from '@/components/common/Icons';
import { HeroPreviewModal } from './HeroPreviewModal';

export function HeroTab() {
  const {
    hero,
    updateHero,
    updateHeroSlide,
    addHeroSlide,
    deleteHeroSlide,
    updateGridFeatureCard,
  } = useHomeLayoutStore();

  const [editingSlideId, setEditingSlideId] = useState<string>('');
  const [editingCardId, setEditingCardId] = useState<string>('feat-1');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  return (
    <div className="space-y-8">
      {/* Configuration Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Layout Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Bố cục Hero Banner</label>
          <select
            value={hero.layoutType || 'slider'}
            onChange={(e) => updateHero({ layoutType: e.target.value as any })}
            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 dark:text-white"
          >
            <option value="slider">Slider lớn chạy tự động (Slider Layout)</option>
            <option value="split-grid">Bố cục chia lưới 3 phần (Split-Grid Layout)</option>
          </select>
          <p className="text-[10px] text-slate-400">
            Chọn giữa một slideshow chạy chiếm toàn màn hình chính hoặc một lưới chia làm slide chính bên trái và 2 banner phụ bên phải.
          </p>
        </div>

        {/* Autoplay config */}
        <div className="space-y-4 bg-slate-50/50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-105 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">Tự động chuyển Slide</span>
              <span className="text-[10px] text-slate-400">Tự chuyển ảnh sau một khoảng thời gian (áp dụng cho Slider lớn)</span>
            </div>
            <input
              type="checkbox"
              checked={hero.autoplay}
              onChange={(e) => updateHero({ autoplay: e.target.checked })}
              className="rounded border-slate-350 dark:border-zinc-700 bg-slate-50 text-rose-500 focus:ring-rose-500 h-4 w-4 cursor-pointer"
            />
          </div>
          {hero.autoplay && (
            <div className="grid grid-cols-2 items-center gap-4 border-t border-slate-150 dark:border-zinc-800 pt-3">
              <label className="text-xs font-semibold text-slate-500">Tốc độ chuyển (milliseconds):</label>
              <input
                type="number"
                step={500}
                min={1000}
                value={hero.autoplaySpeed || 5000}
                onChange={(e) => updateHero({ autoplaySpeed: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-center"
              />
            </div>
          )}
        </div>
      </div>

      {/* Split grid positional assignment */}
      {hero.layoutType === 'split-grid' && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-4">
          <div>
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Cấu hình Chia Lưới (Split-Grid)</h4>
            <p className="text-[10px] text-slate-400">Chỉ định slide nào được hiển thị ở các vị trí chia lưới.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Slide chính bên trái</label>
              <select
                value={hero.gridMainSlideId || ''}
                onChange={(e) => updateHero({ gridMainSlideId: e.target.value })}
                className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              >
                {(hero.slides || []).map((slide, idx) => (
                  <option key={slide.id} value={slide.id}>
                    Slide {idx + 1}: {slide.boldTitle || 'Chưa đặt tên'}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Slide phụ bên phải</label>
              <select
                value={hero.gridSubSlideId || ''}
                onChange={(e) => updateHero({ gridSubSlideId: e.target.value })}
                className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              >
                {(hero.slides || []).map((slide, idx) => (
                  <option key={slide.id} value={slide.id}>
                    Slide {idx + 1}: {slide.boldTitle || 'Chưa đặt tên'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Slide list manager */}
      <div className="border-t border-slate-200 dark:border-zinc-800 pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Danh sách Banner Slides</h3>
            <p className="text-[10px] text-slate-400">Chỉnh sửa nội dung, tiêu đề và hình nền của từng slide banner.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="eye" size={12} /> Xem trước giao diện
            </button>
            <button
              onClick={() => {
                const newId = `slide-${Date.now()}`;
                const newSlide = {
                  id: newId,
                  backgroundImage: '',
                  scriptTitle: 'Món quà mới',
                  boldTitle: 'ĐỘC BẢN',
                  badgeText: 'Mẫu combo quà cao cấp',
                  subtitle: 'Chi tiết quà tặng cá nhân hóa cao cấp Haniu.',
                  ctaText: 'XEM NGAY',
                  ctaHref: '/#products',
                  textLayout: 'left' as const,
                  circleBadgeText: 'HANDMADE • WITH LOVE •',
                  cardTitle: 'PREMIUM',
                  cardSubtitle: 'For You ♡',
                };
                addHeroSlide(newSlide);
                setEditingSlideId(newId);
              }}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-rose-500 text-rose-500 hover:bg-rose-500/5 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="plus" size={12} /> Thêm Slide Mới
            </button>
          </div>
        </div>

        {/* Dropdown select slide */}
        <div className="w-full xl:w-96">
          <select
            value={editingSlideId || (hero.slides?.[0]?.id || '')}
            onChange={(e) => setEditingSlideId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-white"
          >
            {(hero.slides || []).map((slide, sIdx) => (
              <option key={slide.id} value={slide.id}>
                Slide {sIdx + 1}: {slide.boldTitle || 'Chưa đặt tên'}
              </option>
            ))}
          </select>
        </div>

        {/* Selected slide editor form */}
        {(() => {
          const currentEditingSlide = (hero.slides || []).find(
            (s) => s.id === (editingSlideId || hero.slides?.[0]?.id)
          );
          if (!currentEditingSlide) return <p className="text-xs text-slate-400">Không có slide nào.</p>;

          return (
            <div className="bg-slate-50/50 dark:bg-zinc-850 p-6 rounded-2xl border border-slate-105 dark:border-zinc-800 space-y-6">
              <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest border-b border-slate-200 dark:border-zinc-800 pb-2 mb-4">
                Chỉnh sửa: Slide {hero.slides.findIndex((s) => s.id === currentEditingSlide.id) + 1}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Background image file uploader */}
                <div className="md:col-span-2">
                  <FileUploadInput
                    label="Ảnh nền Banner (Background Image)"
                    value={currentEditingSlide.backgroundImage}
                    onChange={(url) => updateHeroSlide(currentEditingSlide.id, { backgroundImage: url })}
                    placeholder="Tải lên tệp ảnh hoặc điền đường dẫn ảnh..."
                  />
                </div>

                {/* Pill tag line */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Dòng chữ nhỏ Tag Pill (Badge Text)</label>
                  <input
                    type="text"
                    value={currentEditingSlide.badgeText}
                    onChange={(e) => updateHeroSlide(currentEditingSlide.id, { badgeText: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Text Layout Alignment */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Căn lề chữ (Text Alignment)</label>
                  <select
                    value={currentEditingSlide.textLayout}
                    onChange={(e) => updateHeroSlide(currentEditingSlide.id, { textLayout: e.target.value as any })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
                  >
                    <option value="left">Căn Trái</option>
                    <option value="right">Căn Phải</option>
                    <option value="center">Căn Giữa</option>
                  </select>
                </div>

                {/* Cursive Subtitle */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Chữ viết tay phụ (Cursive Script)</label>
                  <input
                    type="text"
                    value={currentEditingSlide.scriptTitle}
                    onChange={(e) => updateHeroSlide(currentEditingSlide.id, { scriptTitle: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Bold main header */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề đậm chính (Bold Title)</label>
                  <input
                    type="text"
                    value={currentEditingSlide.boldTitle}
                    onChange={(e) => updateHeroSlide(currentEditingSlide.id, { boldTitle: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Slide description */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Đoạn văn mô tả phụ (Description)</label>
                  <textarea
                    rows={3}
                    value={currentEditingSlide.subtitle}
                    onChange={(e) => updateHeroSlide(currentEditingSlide.id, { subtitle: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* CTA Action Text */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Dòng chữ nút (CTA Text)</label>
                  <input
                    type="text"
                    value={currentEditingSlide.ctaText}
                    onChange={(e) => updateHeroSlide(currentEditingSlide.id, { ctaText: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* CTA URL Link */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Link chuyển hướng nút (CTA URL)</label>
                  <input
                    type="text"
                    value={currentEditingSlide.ctaHref}
                    onChange={(e) => updateHeroSlide(currentEditingSlide.id, { ctaHref: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Stamp text */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Chữ Stamp tròn xoay (Circle Stamp)</label>
                  <input
                    type="text"
                    value={currentEditingSlide.circleBadgeText}
                    onChange={(e) => updateHeroSlide(currentEditingSlide.id, { circleBadgeText: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Organic badge Card details */}
                <div className="grid grid-cols-2 gap-2 md:col-span-2 border-t border-slate-250 dark:border-zinc-800 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề Card góc nhỏ</label>
                    <input
                      type="text"
                      value={currentEditingSlide.cardTitle || ''}
                      onChange={(e) => updateHeroSlide(currentEditingSlide.id, { cardTitle: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Phụ đề Card góc nhỏ (Cursive)</label>
                    <input
                      type="text"
                      value={currentEditingSlide.cardSubtitle || ''}
                      onChange={(e) => updateHeroSlide(currentEditingSlide.id, { cardSubtitle: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Remove button */}
              {hero.slides.length > 1 && (
                <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (confirm('Bạn chắc chắn muốn xóa slide này?')) {
                        deleteHeroSlide(currentEditingSlide.id);
                        const remaining = hero.slides.filter((s) => s.id !== currentEditingSlide.id);
                        if (remaining.length > 0) {
                          setEditingSlideId(remaining[0].id);
                        }
                      }
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-red-55 hover:bg-red-100 dark:bg-red-950/20 text-red-655 dark:text-red-400 border border-red-250 dark:border-red-950/40 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Icon name="trash" size={14} /> Xóa Slide Này
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Grid feature cards */}
      <div className="border-t border-slate-200 dark:border-zinc-800 pt-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Cấu hình 3 Card tiện ích (Home Grid Features)
          </h3>
          <p className="text-[10px] text-slate-400">Chỉnh sửa nội dung các card giới thiệu nhanh bên dưới Slideshow.</p>
        </div>

        {/* Dropdown select card */}
        <div className="w-full xl:w-96">
          <select
            value={editingCardId}
            onChange={(e) => setEditingCardId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-white"
          >
            {(hero.gridFeatures || []).map((card, idx) => (
              <option key={card.id} value={card.id}>
                Card {idx + 1}: {card.title || 'Chưa đặt tên'}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Card edit form */}
        {(() => {
          const currentCard = (hero.gridFeatures || []).find((c) => c.id === editingCardId);
          if (!currentCard) return null;

          return (
            <div className="bg-slate-50/50 dark:bg-zinc-850 p-6 rounded-2xl border border-slate-105 dark:border-zinc-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề Card</label>
                  <input
                    type="text"
                    value={currentCard.title}
                    onChange={(e) => updateGridFeatureCard(currentCard.id, { title: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Tên Icon (Emoji hoặc Lucide icon)</label>
                  <input
                    type="text"
                    value={currentCard.icon}
                    onChange={(e) => updateGridFeatureCard(currentCard.id, { icon: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Đoạn mô tả ngắn (Description)</label>
                  <textarea
                    rows={2}
                    value={currentCard.desc}
                    onChange={(e) => updateGridFeatureCard(currentCard.id, { desc: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Tag viết tay góc nhỏ (Tag Text)</label>
                  <input
                    type="text"
                    value={currentCard.tagText || ''}
                    onChange={(e) => updateGridFeatureCard(currentCard.id, { tagText: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                {/* Uploader input for card background image */}
                <div>
                  <FileUploadInput
                    label="Ảnh đại diện Card (Image)"
                    value={currentCard.image}
                    onChange={(url) => updateGridFeatureCard(currentCard.id, { image: url })}
                    placeholder="Tải lên hoặc điền đường dẫn ảnh..."
                  />
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      <HeroPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
}
