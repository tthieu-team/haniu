'use client';

import React from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export function VisibilityTab() {
  const { visibility, welcomeScreen, trustBadges, toggleVisibility, updateWelcomeScreen, updateTrustBadges } = useHomeLayoutStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          Trạng thái Bật/Tắt các phần chính ở trang chủ
        </h3>
        <p className="text-[10px] text-slate-400">
          Ẩn hoặc hiện các khối giao diện ở trang chủ giúp bạn tối ưu hóa giao diện cho các mùa lễ hội hoặc chiến dịch khuyến mãi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Welcome Splash */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-rose-500/10 bg-rose-500/5">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <Icon name="✨" size={14} className="animate-pulse" /> Splash Welcome Screen
            </span>
            <p className="text-[9px] text-slate-400">Màn hình hoạt họa chào mừng khi mở web</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={welcomeScreen?.isEnabled || false}
              onChange={(e) => updateWelcomeScreen({ isEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-350 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {/* Home body blocks */}
        {Object.entries(visibility).map(([section, value]) => {
          let vietnameseName = section;
          let desc = 'Khối thông tin trang chủ';
          switch (section) {
            case 'hero':
              vietnameseName = 'Màn hình Hero (Banners)';
              desc = 'Banner lớn slideshow';
              break;
            case 'trustBar':
              vietnameseName = 'Thanh Tin cậy (Trust Bar)';
              desc = 'Cam kết vận chuyển, đổi trả';
              break;
            case 'brandIntro':
              vietnameseName = 'Giới thiệu Haniu (Brand Intro)';
              desc = 'Về câu chuyện thương hiệu';
              break;
            case 'categories':
              vietnameseName = 'Danh mục dịp lễ';
              desc = 'Bộ sưu tập quà tặng theo dịp';
              break;
            case 'featuredProducts':
              vietnameseName = 'Khối Sản Phẩm Nổi Bật';
              desc = 'Lưới danh sách sản phẩm';
              break;
            case 'collections':
              vietnameseName = 'Bộ sưu tập (Collections)';
              desc = 'Sản phẩm nổi bật theo mùa';
              break;
            case 'benefits':
              vietnameseName = 'Lợi ích dịch vụ (Benefits)';
              desc = 'Khắc tên, gói quà tỉ mỉ';
              break;
            case 'videoBanner':
              vietnameseName = 'Video Banner Cinematic';
              desc = 'Video youtube/mp4 tự động chạy';
              break;
            case 'socialProof':
              vietnameseName = 'Đánh giá khách hàng (Reviews)';
              desc = 'Lời chứng thực từ người mua';
              break;
            case 'howItWorks':
              vietnameseName = 'Quy trình mua hàng';
              desc = 'Các bước đặt và nhận quà';
              break;
            case 'ugcFeed':
              vietnameseName = 'Mạng xã hội (UGC Feed)';
              desc = 'Ảnh từ Instagram, Tiktok';
              break;
            case 'blog':
              vietnameseName = 'Góc chia sẻ (Blog)';
              desc = 'Bài viết cẩm nang tặng quà';
              break;
            case 'story':
              vietnameseName = 'Câu chuyện chế tác';
              desc = 'Chi tiết nghệ thuật làm tay';
              break;
            case 'cta':
              vietnameseName = 'Khối kêu gọi (CTA Banner)';
              desc = 'Nút bắt đầu thiết kế quà';
              break;
            case 'faq':
              vietnameseName = 'Hỏi đáp thường gặp (FAQs)';
              desc = 'Các câu trả lời thắc mắc';
              break;
          }

          return (
            <div
              key={section}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-150 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-850/50 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 capitalize">
                  {vietnameseName}
                </span>
                <p className="text-[9px] text-slate-400">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleVisibility(section as any)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-350 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
              </label>
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          Cấu hình Huy hiệu Tin cậy sản phẩm (Áp dụng toàn cục)
        </h3>
        <p className="text-[10px] text-slate-400 mb-4">
          Bật/Tắt hiển thị các huy hiệu tin cậy ở phần thông tin chi tiết của tất cả sản phẩm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { id: 'showGenuine', label: 'Chính hãng', desc: 'Huy hiệu cam kết sản phẩm chính hãng' },
            { id: 'showReturns', label: 'Đổi trả 7 ngày', desc: 'Cam kết đổi trả trong vòng 7 ngày' },
            { id: 'showShipping', label: 'Giao hàng toàn quốc', desc: 'Hỗ trợ giao hàng trên toàn lãnh thổ' },
            { id: 'showPayment', label: 'Thanh toán an toàn', desc: 'Bảo mật thông tin giao dịch' },
            { id: 'showSupport', label: 'Hỗ trợ 24/7', desc: 'Đội ngũ CSKH trực tuyến 24/7' },
          ].map((item) => {
            const isChecked = trustBadges?.[item.id as keyof typeof trustBadges] ?? true;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-150 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-850/50 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                    {item.label}
                  </span>
                  <p className="text-[9px] text-slate-400">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => updateTrustBadges({ [item.id]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-350 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
