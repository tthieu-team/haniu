'use client';

import { useState } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function LiveConfigPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'visibility' | 'text'>('visibility');
  const [editingSlideId, setEditingSlideId] = useState<string>('');
  const [editingCardId, setEditingCardId] = useState<string>('feat-1');

  const {
    visibility,
    header,
    announcementBar,
    hero,
    trustBar,
    brandIntro,
    categories,
    benefits,
    videoBanner,
    collections,
    socialProof,
    howItWorks,
    ugcFeed,
    blog,
    story,
    cta,
    faq,
    footer,
    welcomeScreen,
    toggleVisibility,
    updateHeader,
    updateAnnouncementBar,
    updateHero,
    updateHeroSlide,
    addHeroSlide,
    deleteHeroSlide,
    updateGridFeatureCard,
    updateTrustBar,
    updateBrandIntro,
    updateCategories,
    updateBenefits,
    updateVideoBanner,
    updateCollections,
    updateSocialProof,
    updateHowItWorks,
    updateUgcFeed,
    updateBlog,
    updateStory,
    updateCta,
    updateFaq,
    updateFooter,
    updateWelcomeScreen,
    resetAll,
  } = useHomeLayoutStore();

  return (
    <>
      {/* Floating Gear Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 sm:w-auto items-center justify-center sm:justify-start gap-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-slate-700/30 cursor-pointer text-xs font-bold font-sans sm:px-5"
      >
        <Icon name="⚙️" size={18} />
        <span className="hidden sm:inline">Cấu hình giao diện</span>
      </button>

      {/* Slide-over Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans">
          {/* Backdrop Close Click */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-zinc-900 text-zinc-100 h-full shadow-2xl flex flex-col border-l border-zinc-800 animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Icon name="🎨" size={20} className="text-rose-500" /> Customizer Store
                </h3>
                <p className="text-[10px] text-zinc-400 font-light mt-0.5">
                  Tùy chỉnh giao diện & nội dung trang chủ live
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer text-xs font-semibold p-1"
              >
                <span className="flex items-center gap-1"><Icon name="close" size={12} /> Đóng</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 text-center text-xs font-bold border-b border-zinc-800 bg-zinc-950/40">
              <button
                onClick={() => setActiveTab('visibility')}
                className={`py-3.5 border-b-2 cursor-pointer ${
                  activeTab === 'visibility'
                    ? 'border-rose-500 text-rose-450 bg-zinc-900/10'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Bật/Tắt Các Phần
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`py-3.5 border-b-2 cursor-pointer ${
                  activeTab === 'text'
                    ? 'border-rose-500 text-rose-450 bg-zinc-900/10'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sửa Nội Dung (Live)
              </button>
            </div>

            {/* Body Configuration Scroll area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'visibility' ? (
                <div className="space-y-4">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">
                    Hiển thị các khối
                  </span>

                  <div className="space-y-3">
                    {/* Welcome Screen Toggle */}
                    <label
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/40 hover:bg-zinc-950 border border-zinc-800/80 cursor-pointer transition-colors"
                    >
                      <span className="text-xs font-semibold text-rose-450 flex items-center gap-1.5">
                        <Icon name="✨" size={14} className="animate-pulse text-rose-500" />
                        <span>Màn chào mừng (Welcome Splash)</span>
                      </span>

                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={welcomeScreen?.isEnabled || false}
                          onChange={(e) => updateWelcomeScreen({ isEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
                      </div>
                    </label>

                    {Object.entries(visibility).map(([section, value]) => (
                      <label
                        key={section}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/40 hover:bg-zinc-950 border border-zinc-800/80 cursor-pointer transition-colors"
                      >
                        <span className="text-xs font-medium capitalize text-zinc-300">
                          {section === 'hero' && 'Màn hình chính (Hero)'}
                          {section === 'trustBar' && 'Thanh tin cậy (Trust Bar)'}
                          {section === 'brandIntro' && 'Giới thiệu thương hiệu (Brand Intro)'}
                          {section === 'categories' && 'Danh mục dịp lễ'}
                          {section === 'featuredProducts' && 'Danh sách sản phẩm'}
                          {section === 'collections' && 'Bộ sưu tập (Collections)'}
                          {section === 'benefits' && 'Lợi ích dịch vụ (Benefits)'}
                          {section === 'videoBanner' && 'Banner Video Cinematic'}
                          {section === 'socialProof' && 'Đánh giá (Social Proof)'}
                          {section === 'howItWorks' && 'Quy trình mua hàng'}
                          {section === 'ugcFeed' && 'Feed mạng xã hội (UGC)'}
                          {section === 'blog' && 'Góc chia sẻ (Blog)'}
                          {section === 'story' && 'Câu chuyện chế tác'}
                          {section === 'cta' && 'Khối kêu gọi (CTA)'}
                          {section === 'faq' && 'Hỏi đáp thường gặp (FAQ)'}
                        </span>

                        <div className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => toggleVisibility(section as any)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Welcome Splash settings */}
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-rose-450 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2 flex items-center gap-1">
                      <Icon name="✨" size={10} /> MÀN HÌNH CHÀO MỪNG (Splash)
                    </span>
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Dòng chữ chào mừng</label>
                        <input
                          type="text"
                          value={welcomeScreen?.welcomeText || ''}
                          onChange={(e) => updateWelcomeScreen({ welcomeText: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Phụ đề chào mừng</label>
                        <input
                          type="text"
                          value={welcomeScreen?.welcomeSubtitle || ''}
                          onChange={(e) => updateWelcomeScreen({ welcomeSubtitle: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Thời gian hiển thị (ms)</label>
                        <input
                          type="number"
                          step={500}
                          min={1000}
                          max={10000}
                          value={welcomeScreen?.durationMs || 2500}
                          onChange={(e) => updateWelcomeScreen({ durationMs: Number(e.target.value) })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Announcement bar */}
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-rose-450 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2">
                      Announcement Bar
                    </span>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Bật thanh thông báo</label>
                        <input
                          type="checkbox"
                          checked={announcementBar.isEnabled}
                          onChange={(e) => updateAnnouncementBar({ isEnabled: e.target.checked })}
                          className="rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-rose-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Nội dung thông báo</label>
                        <input
                          type="text"
                          value={announcementBar.text}
                          onChange={(e) => updateAnnouncementBar({ text: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero section slide list and configurations */}
                  <div className="space-y-4 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2">
                      Màn hình HERO (Slideshow)
                    </span>

                    {/* Bố cục Hero selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-semibold">Bố cục Hero</label>
                      <select
                        value={hero.layoutType || 'slider'}
                        onChange={(e) => updateHero({ layoutType: e.target.value as any })}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="slider">Slider lớn tự động chạy</option>
                        <option value="split-grid">Chia lưới 3 phần (Split-Grid)</option>
                      </select>
                    </div>

                    {hero.layoutType === 'split-grid' && (
                      <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/40 my-2">
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block border-b border-zinc-800/50 pb-1.5">Cấu hình Chia Lưới</span>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase font-semibold">Slide chính bên trái</label>
                          <select
                            value={hero.gridMainSlideId || ''}
                            onChange={(e) => updateHero({ gridMainSlideId: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                          >
                            {(hero.slides || []).map((slide, idx) => (
                              <option key={slide.id} value={slide.id}>
                                Slide {idx + 1}: {slide.boldTitle || 'Chưa đặt tên'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase font-semibold">Slide phụ phía trên bên phải</label>
                          <select
                            value={hero.gridSubSlideId || ''}
                            onChange={(e) => updateHero({ gridSubSlideId: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                          >
                            {(hero.slides || []).map((slide, idx) => (
                              <option key={slide.id} value={slide.id}>
                                Slide {idx + 1}: {slide.boldTitle || 'Chưa đặt tên'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Autoplay setting */}
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-zinc-400">Tự động chuyển slide (chỉ cho slider)</span>
                      <input
                        type="checkbox"
                        checked={hero.autoplay}
                        onChange={(e) => updateHero({ autoplay: e.target.checked })}
                        className="rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-rose-500"
                      />
                    </div>
                    {hero.autoplay && (
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tốc độ chuyển (ms)</label>
                        <input
                          type="number"
                          value={hero.autoplaySpeed}
                          onChange={(e) => updateHero({ autoplaySpeed: Number(e.target.value) })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    )}

                    <div className="border-t border-zinc-800/60 my-2 pt-3 space-y-3">
                      {/* Slide selector and Add Slide button */}
                      <div className="flex gap-2">
                        <select
                          value={editingSlideId || (hero.slides?.[0]?.id || '')}
                          onChange={(e) => setEditingSlideId(e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        >
                          {(hero.slides || []).map((slide, sIdx) => (
                            <option key={slide.id} value={slide.id}>
                              Slide {sIdx + 1}: {slide.boldTitle || 'Chưa đặt tên'}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            const newId = `slide-${Date.now()}`;
                            const newSlide = {
                              id: newId,
                              backgroundImage: "/7329c11d-7fcf-45e3-a4d3-08c9f6764741.jfif",
                              scriptTitle: "Món quà",
                              boldTitle: "MỚI",
                              badgeText: "Set quà tặng cao cấp",
                              subtitle: "Mô tả ngắn gọn về slide này để thu hút khách hàng.",
                              ctaText: "MUA NGAY",
                              ctaHref: "/#products",
                              textLayout: "left" as const,
                              circleBadgeText: "HANDMADE • WITH LOVE •",
                              cardTitle: "QUÀ TẶNG",
                              cardSubtitle: "Gửi gắm yêu thương ♡",
                            };
                            addHeroSlide(newSlide);
                            setEditingSlideId(newId);
                          }}
                          className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors border border-rose-500/20"
                        >
                          <Icon name="plus" size={12} />
                          <span>Thêm</span>
                        </button>
                      </div>

                      {hero.slides?.find(s => s.id === (editingSlideId || hero.slides?.[0]?.id)) && (() => {
                        const currentEditingSlide = hero.slides.find(s => s.id === (editingSlideId || hero.slides?.[0]?.id))!;
                        
                        return (
                          <div className="space-y-3 border-t border-zinc-800/40 pt-3">
                            {/* Background Image */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-500 uppercase font-semibold">Đường dẫn ảnh nền</label>
                              <input
                                type="text"
                                value={currentEditingSlide.backgroundImage}
                                onChange={(e) => updateHeroSlide(currentEditingSlide.id, { backgroundImage: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>

                            {/* Layout alignment */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-500 uppercase font-semibold">Căn lề chữ (Text Layout)</label>
                              <select
                                value={currentEditingSlide.textLayout}
                                onChange={(e) => updateHeroSlide(currentEditingSlide.id, { textLayout: e.target.value as any })}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                              >
                                <option value="left">Trái (Left)</option>
                                <option value="right">Phải (Right)</option>
                                <option value="center">Giữa (Center)</option>
                              </select>
                            </div>

                            {/* Heart Badge Text */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-500 uppercase font-semibold">Pill Badge Text</label>
                              <input
                                type="text"
                                value={currentEditingSlide.badgeText}
                                onChange={(e) => updateHeroSlide(currentEditingSlide.id, { badgeText: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>

                            {/* Titles */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Cursive Script (ví dụ: Quà theo)</label>
                                <input
                                  type="text"
                                  value={currentEditingSlide.scriptTitle}
                                  onChange={(e) => updateHeroSlide(currentEditingSlide.id, { scriptTitle: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Serif Bold Title (ví dụ: Ý MUỐN)</label>
                                <input
                                  type="text"
                                  value={currentEditingSlide.boldTitle}
                                  onChange={(e) => updateHeroSlide(currentEditingSlide.id, { boldTitle: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-500 uppercase font-semibold">Mô tả phụ</label>
                              <textarea
                                rows={3}
                                value={currentEditingSlide.subtitle}
                                onChange={(e) => updateHeroSlide(currentEditingSlide.id, { subtitle: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>

                            {/* CTA Text and Href */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Nút hành động</label>
                                <input
                                  type="text"
                                  value={currentEditingSlide.ctaText}
                                  onChange={(e) => updateHeroSlide(currentEditingSlide.id, { ctaText: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Đường dẫn nút</label>
                                <input
                                  type="text"
                                  value={currentEditingSlide.ctaHref}
                                  onChange={(e) => updateHeroSlide(currentEditingSlide.id, { ctaHref: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                            </div>

                            {/* Stamp Text */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-500 uppercase font-semibold">Chữ stamp xoay (circle badge)</label>
                              <input
                                type="text"
                                value={currentEditingSlide.circleBadgeText}
                                onChange={(e) => updateHeroSlide(currentEditingSlide.id, { circleBadgeText: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>

                            {/* Organic Card Details */}
                            <div className="grid grid-cols-2 gap-2 border-t border-zinc-800/40 pt-2.5">
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tiêu đề tag góc</label>
                                <input
                                  type="text"
                                  value={currentEditingSlide.cardTitle}
                                  onChange={(e) => updateHeroSlide(currentEditingSlide.id, { cardTitle: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Phụ đề tag góc (cursive)</label>
                                <input
                                  type="text"
                                  value={currentEditingSlide.cardSubtitle}
                                  onChange={(e) => updateHeroSlide(currentEditingSlide.id, { cardSubtitle: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                            </div>

                            {/* Delete Button */}
                            {hero.slides.length > 1 && (
                              <button
                                onClick={() => {
                                  if (confirm('Bạn chắc chắn muốn xóa slide này?')) {
                                    deleteHeroSlide(currentEditingSlide.id);
                                    const remaining = hero.slides.filter(s => s.id !== currentEditingSlide.id);
                                    if (remaining.length > 0) {
                                      setEditingSlideId(remaining[0].id);
                                    }
                                  }
                                }}
                                className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-rose-500/25 mt-2"
                              >
                                <Icon name="trash" size={12} />
                                <span>Xóa Slide Này</span>
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Feature Cards Editor */}
                    <div className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/40 my-2 pt-3">
                      <span className="text-[9px] font-bold text-rose-450 uppercase tracking-wider block border-b border-zinc-800/60 pb-1.5 mb-1">
                        Tùy chỉnh 3 Card tiện ích (Grid)
                      </span>
                      
                      <div className="flex gap-2">
                        <select
                          value={editingCardId}
                          onChange={(e) => setEditingCardId(e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        >
                          {(hero.gridFeatures || []).map((card, idx) => (
                            <option key={card.id} value={card.id}>
                              Card {idx + 1}: {card.title || 'Chưa đặt tên'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {(() => {
                        const currentCard = (hero.gridFeatures || []).find(c => c.id === editingCardId);
                        if (!currentCard) return null;

                        return (
                          <div className="space-y-3 border-t border-zinc-850/60 pt-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tiêu đề Card</label>
                                <input
                                  type="text"
                                  value={currentCard.title}
                                  onChange={(e) => updateGridFeatureCard(currentCard.id, { title: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Icon (emoji/Lucide)</label>
                                <input
                                  type="text"
                                  value={currentCard.icon}
                                  onChange={(e) => updateGridFeatureCard(currentCard.id, { icon: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-zinc-500 uppercase font-semibold">Mô tả ngắn</label>
                              <textarea
                                rows={2}
                                value={currentCard.desc}
                                onChange={(e) => updateGridFeatureCard(currentCard.id, { desc: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tag chữ viết tay (Tag Text)</label>
                                <input
                                  type="text"
                                  value={currentCard.tagText || ''}
                                  onChange={(e) => updateGridFeatureCard(currentCard.id, { tagText: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Đường dẫn ảnh thu nhỏ</label>
                                <input
                                  type="text"
                                  value={currentCard.image}
                                  onChange={(e) => updateGridFeatureCard(currentCard.id, { image: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Brand Intro section */}
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-rose-450 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2">
                      Giới thiệu thương hiệu (Brand Intro)
                    </span>
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Phụ đề (Subtitle)</label>
                        <input
                          type="text"
                          value={brandIntro.subtitle}
                          onChange={(e) => updateBrandIntro({ subtitle: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tiêu đề chính (Title)</label>
                        <input
                          type="text"
                          value={brandIntro.title}
                          onChange={(e) => updateBrandIntro({ title: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Mô tả chi tiết</label>
                        <textarea
                          rows={4}
                          value={brandIntro.description}
                          onChange={(e) => updateBrandIntro({ description: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Video Banner section */}
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2">
                      Cinematic Video Banner
                    </span>
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tiêu đề</label>
                        <input
                          type="text"
                          value={videoBanner.title}
                          onChange={(e) => updateVideoBanner({ title: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Phụ đề</label>
                        <input
                          type="text"
                          value={videoBanner.subtitle}
                          onChange={(e) => updateVideoBanner({ subtitle: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Đường dẫn Video (.mp4)</label>
                        <input
                          type="text"
                          value={videoBanner.videoUrl}
                          onChange={(e) => updateVideoBanner({ videoUrl: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Collections Section */}
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2">
                      Bộ sưu tập
                    </span>
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tiêu đề chính</label>
                        <input
                          type="text"
                          value={collections.title}
                          onChange={(e) => updateCollections({ title: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Mô tả phụ</label>
                        <input
                          type="text"
                          value={collections.subtitle}
                          onChange={(e) => updateCollections({ subtitle: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* UGC Feed section */}
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2">
                      Social UGC Feed
                    </span>
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tiêu đề</label>
                        <input
                          type="text"
                          value={ugcFeed.title}
                          onChange={(e) => updateUgcFeed({ title: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Hashtag liên kết</label>
                        <input
                          type="text"
                          value={ugcFeed.hashtag}
                          onChange={(e) => updateUgcFeed({ hashtag: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Blog Section */}
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2">
                      Góc chia sẻ (Blog)
                    </span>
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tiêu đề chính</label>
                        <input
                          type="text"
                          value={blog.title}
                          onChange={(e) => updateBlog({ title: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Mô tả phụ</label>
                        <input
                          type="text"
                          value={blog.subtitle}
                          onChange={(e) => updateBlog({ subtitle: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CTA Block section */}
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2">
                      Kêu gọi hành động (CTA)
                    </span>
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tiêu đề</label>
                        <input
                          type="text"
                          value={cta.title}
                          onChange={(e) => updateCta({ title: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Button Text</label>
                        <input
                          type="text"
                          value={cta.buttonText}
                          onChange={(e) => updateCta({ buttonText: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact settings */}
                  <div className="space-y-3 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/60">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block border-b border-zinc-800 pb-1.5 mb-2">
                      Thông tin liên hệ (Footer)
                    </span>
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Địa chỉ</label>
                        <input
                          type="text"
                          value={footer.address}
                          onChange={(e) => updateFooter({ address: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Số điện thoại</label>
                        <input
                          type="text"
                          value={footer.phone}
                          onChange={(e) => updateFooter({ phone: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-semibold">Email</label>
                        <input
                          type="email"
                          value={footer.email}
                          onChange={(e) => updateFooter({ email: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex gap-4">
              <button
                onClick={() => {
                  if (confirm('Khôi phục toàn bộ giao diện và nội dung về mặc định?')) {
                    resetAll();
                  }
                }}
                className="flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-bold py-3.5 px-4 rounded-2xl text-xs transition-all cursor-pointer hover:bg-zinc-900 text-center"
              >
                Reset mặc định
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-4 rounded-2xl text-xs transition-all cursor-pointer shadow-lg shadow-rose-500/20 text-center"
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
