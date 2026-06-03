'use client';

import React from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { FileUploadInput } from './FileUploadInput';
import Icon from '@/components/common/Icons';

export function SectionsTab() {
  const {
    announcementBar,
    updateAnnouncementBar,
    welcomeScreen,
    updateWelcomeScreen,
    brandIntro,
    updateBrandIntro,
    videoBanner,
    updateVideoBanner,
    collections,
    updateCollections,
    story,
    updateStory,
    socialProof,
    updateSocialProof,
    footer,
    updateFooter,
    howItWorks,
    updateHowItWorks,
  } = useHomeLayoutStore();

  return (
    <div className="space-y-8 divide-y divide-slate-150 dark:divide-zinc-800">
      {/* Announcement & Welcome Splash */}
      <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
            Thanh thông báo hàng đầu (Announcement Bar)
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Bật thanh thông báo</label>
              <input
                type="checkbox"
                checked={announcementBar.isEnabled}
                onChange={(e) => updateAnnouncementBar({ isEnabled: e.target.checked })}
                className="rounded border-slate-350 bg-slate-50 text-rose-500 focus:ring-rose-500 h-4 w-4 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Nội dung dòng chạy chữ</label>
              <input
                type="text"
                value={announcementBar.text}
                onChange={(e) => updateAnnouncementBar({ text: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
            Màn hình chào mừng (Welcome Splash)
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Dòng chữ chính</label>
                <input
                  type="text"
                  value={welcomeScreen?.welcomeText || ''}
                  onChange={(e) => updateWelcomeScreen({ welcomeText: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Phụ đề</label>
                <input
                  type="text"
                  value={welcomeScreen?.welcomeSubtitle || ''}
                  onChange={(e) => updateWelcomeScreen({ welcomeSubtitle: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Thời gian hiển thị (ms)</label>
              <input
                type="number"
                step={500}
                value={welcomeScreen?.durationMs || 2500}
                onChange={(e) => updateWelcomeScreen({ durationMs: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Intro & Stats */}
      <div className="py-6 space-y-4">
        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
          Giới thiệu thương hiệu & Chỉ số (Brand Intro)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề phụ góc</label>
              <input
                type="text"
                value={brandIntro.subtitle}
                onChange={(e) => updateBrandIntro({ subtitle: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề giới thiệu chính</label>
              <input
                type="text"
                value={brandIntro.title}
                onChange={(e) => updateBrandIntro({ title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Mô tả chi tiết</label>
              <textarea
                rows={3}
                value={brandIntro.description}
                onChange={(e) => updateBrandIntro({ description: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="space-y-3 bg-slate-50/50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 dark:border-zinc-800 pb-1.5">
              Các con số thống kê (Stats)
            </span>
            <div className="space-y-2.5">
              {(brandIntro.stats || []).map((stat, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={stat.value}
                    placeholder="Giá trị (ví dụ: 50.000+)"
                    onChange={(e) => {
                      const newStats = [...brandIntro.stats];
                      newStats[idx].value = e.target.value;
                      updateBrandIntro({ stats: newStats });
                    }}
                    className="bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-center font-bold"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    placeholder="Mô tả (ví dụ: Khách chọn)"
                    onChange={(e) => {
                      const newStats = [...brandIntro.stats];
                      newStats[idx].label = e.target.value;
                      updateBrandIntro({ stats: newStats });
                    }}
                    className="bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quy trình dịch vụ (How It Works) */}
      <div className="py-6 space-y-4">
        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
          Quy trình dịch vụ (How It Works)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề lớn</label>
              <input
                type="text"
                value={howItWorks.title}
                onChange={(e) => updateHowItWorks({ title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Mô tả phụ</label>
              <textarea
                rows={3}
                value={howItWorks.subtitle}
                onChange={(e) => updateHowItWorks({ subtitle: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="space-y-3 bg-slate-50/50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 dark:border-zinc-800 pb-1.5">
              Các bước thực hiện (Steps)
            </span>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {(howItWorks.steps || []).map((step, idx) => (
                <div key={idx} className="space-y-2 border-b border-slate-200/50 dark:border-zinc-800 pb-3 last:border-b-0 last:pb-0">
                  <span className="text-[10px] font-bold text-rose-500">Bước {step.number}</span>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      value={step.title}
                      placeholder="Tiêu đề bước"
                      onChange={(e) => {
                        const newSteps = [...howItWorks.steps];
                        newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                        updateHowItWorks({ steps: newSteps });
                      }}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={step.desc}
                      placeholder="Mô tả bước"
                      onChange={(e) => {
                        const newSteps = [...howItWorks.steps];
                        newSteps[idx] = { ...newSteps[idx], desc: e.target.value };
                        updateHowItWorks({ steps: newSteps });
                      }}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs"
                    />
                    <FileUploadInput
                      label="Ảnh minh họa"
                      value={step.image || ''}
                      onChange={(url) => {
                        const newSteps = [...howItWorks.steps];
                        newSteps[idx] = { ...newSteps[idx], image: url };
                        updateHowItWorks({ steps: newSteps });
                      }}
                      accept="image/*"
                      type="image"
                      placeholder="Đường dẫn ảnh..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video banner & Collections headers */}
      <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Banner with File Uploader */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
            Cinematic Video Banner
          </h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề Video</label>
              <input
                type="text"
                value={videoBanner.title}
                onChange={(e) => updateVideoBanner({ title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Dòng phụ đề Video</label>
              <input
                type="text"
                value={videoBanner.subtitle}
                onChange={(e) => updateVideoBanner({ subtitle: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            {/* Video file uploader */}
            <div>
              <FileUploadInput
                label="Tải lên Video Banner (.mp4)"
                value={videoBanner.videoUrl}
                onChange={(url) => updateVideoBanner({ videoUrl: url })}
                accept="video/*"
                type="video"
                placeholder="Tải lên tệp video hoặc điền link video..."
              />
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
            Khối Bộ sưu tập (Collections Header)
          </h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề lớn</label>
              <input
                type="text"
                value={collections.title}
                onChange={(e) => updateCollections({ title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề phụ</label>
              <input
                type="text"
                value={collections.subtitle}
                onChange={(e) => updateCollections({ subtitle: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Story (Câu chuyện chế tác) */}
      <div className="py-6 space-y-4">
        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
          Câu chuyện thương hiệu & Chế tác (Story Section)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề lớn (Phần đầu)</label>
              <input
                type="text"
                value={story.title}
                onChange={(e) => updateStory({ title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Từ khóa nổi bật (Nghiêng - Gradient)</label>
              <input
                type="text"
                value={story.titleHighlight || ''}
                onChange={(e) => updateStory({ titleHighlight: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề lớn (Phần cuối)</label>
              <input
                type="text"
                value={story.titlePart2 || ''}
                onChange={(e) => updateStory({ titlePart2: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề phụ</label>
              <input
                type="text"
                value={story.subtitle}
                onChange={(e) => updateStory({ subtitle: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề nút xem video</label>
              <input
                type="text"
                value={story.videoTitle}
                onChange={(e) => updateStory({ videoTitle: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Nội dung câu chuyện</label>
              <textarea
                rows={3}
                value={story.content}
                onChange={(e) => updateStory({ content: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <FileUploadInput
                label="Ảnh bìa Video chế tác"
                value={story.videoPlaceholderUrl}
                onChange={(url) => updateStory({ videoPlaceholderUrl: url })}
                accept="image/*"
                type="image"
                placeholder="Tải lên tệp ảnh hoặc điền link ảnh..."
              />
            </div>
            <div>
              <FileUploadInput
                label="Đường dẫn Video (.mp4)"
                value={story.videoUrl || ''}
                onChange={(url) => updateStory({ videoUrl: url })}
                accept="video/*"
                type="video"
                placeholder="Tải lên tệp video hoặc điền link video..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof (Đánh giá khách hàng) */}
      <div className="py-6 space-y-6">
        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
          Đánh giá từ khách hàng (Social Proof / Testimonials)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Tiêu đề chính</label>
            <input
              type="text"
              value={socialProof.title}
              onChange={(e) => updateSocialProof({ title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Điểm đánh giá trung bình</label>
            <input
              type="text"
              value={socialProof.ratingScore}
              onChange={(e) => updateSocialProof({ ratingScore: e.target.value })}
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Số lượng lượt đánh giá hiển thị</label>
            <input
              type="text"
              value={socialProof.reviewsCount}
              onChange={(e) => updateSocialProof({ reviewsCount: e.target.value })}
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
            />
          </div>
        </div>

        {/* Testimonials List Manager */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Danh sách ý kiến phản hồi (Reviews)
            </span>
            <button
              type="button"
              onClick={() => {
                const newReview = {
                  id: 'rev-' + Date.now(),
                  name: 'Khách Hàng Mới',
                  role: 'Khách mua sản phẩm',
                  content: 'Nhập nội dung đánh giá ở đây...',
                  rating: 5,
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                };
                updateSocialProof({ reviews: [...(socialProof.reviews || []), newReview] });
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <Icon name="plus" size={10} />
              <span>Thêm đánh giá</span>
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {(socialProof.reviews || []).map((rev, idx) => (
              <div
                key={rev.id || idx}
                className="p-4 rounded-2xl border border-slate-150 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-850/30 space-y-3 relative group"
              >
                <div className="absolute top-4 right-4 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const updatedReviews = socialProof.reviews.filter((_, i) => i !== idx);
                      updateSocialProof({ reviews: updatedReviews });
                    }}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                    title="Xóa đánh giá này"
                  >
                    <Icon name="trash" size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Họ và tên</label>
                      <input
                        type="text"
                        value={rev.name}
                        onChange={(e) => {
                          const updatedReviews = [...socialProof.reviews];
                          updatedReviews[idx] = { ...updatedReviews[idx], name: e.target.value };
                          updateSocialProof({ reviews: updatedReviews });
                        }}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-2 py-1 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Vai trò / Mô tả</label>
                      <input
                        type="text"
                        value={rev.role}
                        onChange={(e) => {
                          const updatedReviews = [...socialProof.reviews];
                          updatedReviews[idx] = { ...updatedReviews[idx], role: e.target.value };
                          updateSocialProof({ reviews: updatedReviews });
                        }}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-2 py-1 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">Số sao đánh giá (1-5)</label>
                      <select
                        value={rev.rating}
                        onChange={(e) => {
                          const updatedReviews = [...socialProof.reviews];
                          updatedReviews[idx] = { ...updatedReviews[idx], rating: Number(e.target.value) };
                          updateSocialProof({ reviews: updatedReviews });
                        }}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-2 py-1 text-xs"
                      >
                        <option value={1}>1 Sao ★</option>
                        <option value={2}>2 Sao ★★</option>
                        <option value={3}>3 Sao ★★★</option>
                        <option value={4}>4 Sao ★★★★</option>
                        <option value={5}>5 Sao ★★★★★</option>
                      </select>
                    </div>
                    <div>
                      <FileUploadInput
                        label="Ảnh đại diện (Avatar)"
                        value={rev.avatar}
                        onChange={(url) => {
                          const updatedReviews = [...socialProof.reviews];
                          updatedReviews[idx] = { ...updatedReviews[idx], avatar: url };
                          updateSocialProof({ reviews: updatedReviews });
                        }}
                        accept="image/*"
                        type="image"
                        placeholder="Avatar url..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Nội dung đánh giá</label>
                  <textarea
                    rows={2}
                    value={rev.content}
                    onChange={(e) => {
                      const updatedReviews = [...socialProof.reviews];
                      updatedReviews[idx] = { ...updatedReviews[idx], content: e.target.value };
                      updateSocialProof({ reviews: updatedReviews });
                    }}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-2 py-1 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer details */}
      <div className="py-6 space-y-4">

        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">
          Thông tin Chân trang (Footer Configurations)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Lời giới thiệu Footer</label>
              <textarea
                rows={2}
                value={footer.description}
                onChange={(e) => updateFooter({ description: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Địa chỉ shop</label>
              <input
                type="text"
                value={footer.address}
                onChange={(e) => updateFooter({ address: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Số điện thoại liên hệ</label>
              <input
                type="text"
                value={footer.phone}
                onChange={(e) => updateFooter({ phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Email liên hệ</label>
              <input
                type="email"
                value={footer.email}
                onChange={(e) => updateFooter({ email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Facebook Link</label>
              <input
                type="text"
                value={footer.facebookUrl}
                onChange={(e) => updateFooter({ facebookUrl: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Instagram Link</label>
              <input
                type="text"
                value={footer.instagramUrl}
                onChange={(e) => updateFooter({ instagramUrl: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
