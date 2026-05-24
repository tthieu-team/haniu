'use client';

import React from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { FileUploadInput } from './FileUploadInput';

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
    footer,
    updateFooter,
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
