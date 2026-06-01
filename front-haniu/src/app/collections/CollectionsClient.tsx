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
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden w-full h-[32vh] md:h-[42vh] flex items-center justify-center text-center bg-gradient-to-tr from-rose-500/5 via-slate-50 to-amber-500/5 dark:from-zinc-900/30 dark:via-zinc-950 dark:to-zinc-900/40 border-b border-slate-200/50 dark:border-zinc-900/80">
        
        {/* Decorative Grid Dots */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(198,123,113,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(198,123,113,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        {/* Abstract Glowing Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-rose-400/10 dark:bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[250px] h-[250px] bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Banner Details */}
        <div className="relative z-10 px-4 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-[#C67B71] dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/10 border border-[#F5D0CD]/40 dark:border-rose-900/30">
            <Icon name="sparkles" size={10} className="animate-pulse text-[#C67B71] dark:text-rose-400" /> Haniu Masterpieces
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 dark:text-zinc-150 uppercase drop-shadow-xs">
            Bộ Sưu Tập
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
            Khám phá những bộ sưu tập quà tặng độc bản, chế tác thủ công tinh tế giúp bạn gửi trọn tấm lòng gửi tới những người thân yêu.
          </p>
        </div>
      </div>

      {/* 2. BREADCRUMBS & CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
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
