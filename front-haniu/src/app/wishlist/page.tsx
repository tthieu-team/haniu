'use client';

import { useState } from 'react';
import { useWishlistStore } from '@/store/wishlist';
import ProductCard from '@/components/product/ProductCard';

import Link from 'next/link';
import Icon from '@/components/common/Icons';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();


  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Title & Banner Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-rose-500/5 via-amber-500/5 to-rose-500/5 border border-rose-100/50 dark:border-zinc-800/60 p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400">
            <Icon name="heart" size={10} className="fill-rose-500 text-rose-500 animate-pulse" /> Bộ sưu tập cá nhân
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2.5">
            Danh Sách Yêu Thích 
            <Icon name="heart" size={28} className="text-rose-500 fill-rose-500 shrink-0 filter drop-shadow-sm" />
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
            Lưu giữ những set quà tinh tế bạn yêu thích để dễ dàng tham khảo, tùy biến cá nhân hóa và lựa chọn sau này.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs text-slate-450 dark:text-zinc-500 font-bold bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-xs">
              Đang lưu: <span className="text-rose-500 font-black">{items.length}</span> set quà
            </div>
            <button
              onClick={clearWishlist}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200/60 dark:border-rose-950/30 text-rose-500 bg-rose-50/50 hover:bg-rose-100/80 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 shadow-xs"
            >
              <Icon name="trash" size={13} />
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* Onboarding / First-time Guide for users */}
      {items.length > 0 && (
        <div className="hidden md:flex bg-amber-50/60 dark:bg-zinc-900/40 border border-amber-200/40 dark:border-zinc-800/80 rounded-2xl p-4 items-start gap-3 text-slate-600 dark:text-zinc-350 shadow-xs">
          <span className="text-amber-500 shrink-0 mt-0.5">
            <Icon name="sparkles" size={16} className="animate-pulse" />
          </span>
          <div className="text-xs leading-relaxed font-light">
            <strong className="font-bold text-slate-700 dark:text-zinc-200">💡 Hướng dẫn nhanh:</strong> Nhấp vào nút <strong className="font-bold text-rose-500">Chi tiết</strong> bên dưới mỗi sản phẩm để mở trang chi tiết tùy biến cá nhân hóa (khắc laser thông điệp riêng, chọn mẫu thiệp viết tay miễn phí) và thêm vào giỏ hàng.
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {items.length === 0 ? (
        <div className="space-y-12">
          {/* Empty state card */}
          <div className="bg-white dark:bg-zinc-900 text-center py-16 px-6 rounded-[32px] border border-slate-200 dark:border-zinc-800/60 space-y-6 shadow-sm max-w-2xl mx-auto mt-4">
            <span className="text-rose-350 dark:text-zinc-700 block animate-bounce flex justify-center">
              <Icon name="heart" size={56} className="text-rose-500 fill-rose-100 dark:fill-zinc-800" />
            </span>
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg md:text-xl text-slate-700 dark:text-zinc-300">
                Danh sách yêu thích của bạn đang trống
              </h3>
              <p className="text-xs text-slate-450 dark:text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
                Hãy bắt đầu hành trình tìm kiếm những món quà ý nghĩa nhất dành cho những người thân yêu.
              </p>
            </div>
            <Link
              href="/#products"
              className="inline-flex bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 text-white font-bold py-3.5 px-10 rounded-2xl text-xs transition-all cursor-pointer shadow-md active:scale-98"
            >
              Khám phá set quà ngay
            </Link>
          </div>

          {/* Easy Step-by-Step Guide for First-time Users */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-black uppercase tracking-wider text-rose-500">
                3 BƯỚC ĐƠN GIẢN ĐỂ SỞ HỮU MÓN QUÀ THIẾT KẾ RIÊNG
              </h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 font-light">
                Haniu hỗ trợ cá nhân hóa mọi chi tiết để thông điệp của bạn trở nên trọn vẹn nhất
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-slate-50/60 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/50 rounded-2xl p-5 text-center space-y-3 hover:scale-102 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 font-black text-sm flex items-center justify-center mx-auto">
                  01
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Tìm kiếm & Chọn Lựa</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
                  Lướt qua các set quà tặng độc bản theo từng dịp lễ hoặc đối tượng phù hợp với nhu cầu của bạn.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50/60 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/50 rounded-2xl p-5 text-center space-y-3 hover:scale-102 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 font-black text-sm flex items-center justify-center mx-auto">
                  02
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Nhấp Yêu Thích</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
                  Nhấn vào biểu tượng trái tim <Icon name="heart" size={10} className="inline text-rose-500 fill-rose-500" /> ở góc ảnh sản phẩm để lưu lại và dễ dàng so sánh sau này.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50/60 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/50 rounded-2xl p-5 text-center space-y-3 hover:scale-102 transition-transform duration-300">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 font-black text-sm flex items-center justify-center mx-auto">
                  03
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Tùy Biến & Đặt Hàng</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
                  Xem chi tiết để tùy chọn khắc tên laser lên cốc/gỗ, gửi gắm lời chúc ý nghĩa trên thiệp viết tay.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}


    </div>
  );
}
