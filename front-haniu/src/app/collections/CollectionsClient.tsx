'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Collection } from '@/services/catalog.service';
import Icon from '@/components/common/Icons';
import { getFullImageUrl } from '@/lib/api';

interface CollectionsClientProps {
  initialCollections: Collection[];
}

export default function CollectionsClient({ initialCollections }: CollectionsClientProps) {
  const [collections] = useState<Collection[]>(initialCollections);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 pb-24">
      {/* 1. HERO BANNER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-[32px] overflow-hidden bg-slate-100/60 dark:bg-zinc-950 text-slate-800 dark:text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-200 dark:border-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent opacity-60 dark:opacity-40 pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-[#C67B71] dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/10 border border-[#F5D0CD]/40 dark:border-rose-900/30">
              <Icon name="sparkles" size={10} className="animate-pulse text-[#C67B71]" /> Haniu Masterpieces
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight py-1 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500 uppercase">
              Bộ Sưu Tập
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-350 leading-relaxed font-light tracking-wide max-w-xl">
              Khám phá những bộ sưu tập quà tặng độc bản, chế tác thủ công tinh tế giúp bạn gửi trọn tấm lòng gửi tới những người thân yêu.
            </p>
          </div>
        </div>
      </div>

      {/* 2. BREADCRUMBS & CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6 sm:space-y-8">
        
        {/* Breadcrumbs Navigation */}
        <nav className="text-xs text-slate-450 dark:text-zinc-500 flex items-center gap-1.5 font-medium">
          <Link href="/" className="hover:text-rose-500 transition-colors">Trang chủ</Link>
          <span>&gt;</span>
          <span className="text-rose-500 font-bold">Bộ sưu tập</span>
        </nav>

        {/* 3. COLLECTIONS GRID */}
        {collections.length === 0 ? (
          <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-[32px] p-16 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-2xl mx-auto">
              <Icon name="gift" size={28} className="text-[#C67B71] dark:text-rose-400" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-zinc-200">Không tìm thấy bộ sưu tập nào</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Hiện tại các bộ sưu tập đang được cập nhật. Vui lòng quay lại trang chủ để khám phá các sản phẩm khác.
            </p>
            <Link
              href="/"
              className="inline-flex px-5 py-2.5 bg-gradient-to-r from-[#E07A7C] to-[#C67B71] hover:scale-105 text-white font-bold rounded-xl shadow-md shadow-[#C67B71]/20 text-xs active:scale-95 transition-all cursor-pointer"
            >
              Quay lại trang chủ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {collections.map((col) => {
              const coverImg = col.imageUrl 
                ? getFullImageUrl(col.imageUrl) 
                : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80';
              
              return (
                <div
                  key={col.id || col.slug}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 h-[420px]"
                >
                  {/* Card Visual Header (Image) */}
                  <div className="relative w-full h-52 overflow-hidden shrink-0">
                    <img
                      src={coverImg}
                      alt={col.name}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:rotate-[0.5deg]"
                    />
                    {/* Shadow overlay to improve text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Tiny organic floating stamp */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-zinc-800/80 shadow-md">
                      <span className="text-[8px] sm:text-[9px] font-bold text-[#C67B71] dark:text-rose-400 tracking-widest uppercase flex items-center gap-1">
                        <Icon name="sparkles" size={10} /> BST Độc Quyền
                      </span>
                    </div>
                  </div>

                  {/* Card Text Content Details */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-zinc-150 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors line-clamp-1 leading-snug tracking-wide uppercase">
                        {col.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-light line-clamp-3 leading-relaxed">
                        {col.description || 'Không có mô tả chi tiết cho bộ sưu tập này. Khám phá ngay các set quà tặng độc bản nghệ thuật được thiết kế cao cấp.'}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/collections/${col.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E07A7C] to-[#C67B71] hover:from-rose-500 hover:to-rose-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-[#C67B71]/15 hover:shadow-lg hover:shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer text-center"
                      >
                        <span>Khám phá bộ sưu tập</span>
                        <Icon name="arrow-right" size={12} className="text-white" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
