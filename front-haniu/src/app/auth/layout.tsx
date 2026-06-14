'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import LogoSvg from '@/components/common/LogoSvg';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-zinc-950 font-sans overflow-x-hidden">
      
      {/* 1. Dynamic Premium Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glowing Orbs */}
        <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-400/10 dark:bg-rose-900/10 blur-[120px] animate-pulse duration-[8s]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-400/10 dark:bg-amber-900/10 blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute top-[30%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-pink-400/5 dark:bg-pink-900/5 blur-[100px]" />
        
        {/* Subtle grid line overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      {/* 2. Top Minimal Bar (Float) */}
      <header className="absolute top-0 left-0 right-0 z-20 w-full py-5 px-6 sm:px-12 flex justify-between items-center bg-transparent pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-100 dark:border-zinc-800/80 text-[11px] sm:text-xs font-extrabold text-slate-600 dark:text-zinc-350 hover:text-rose-500 dark:hover:text-rose-400 shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Icon name="arrow-left" size={12} />
          <span>Trở về Cửa hàng</span>
        </Link>

        <a
          href="/support"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-100 dark:border-zinc-800/80 text-[11px] sm:text-xs font-extrabold text-slate-600 dark:text-zinc-350 hover:text-rose-500 dark:hover:text-rose-400 shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Icon name="phone" size={12} className="text-slate-400 dark:text-zinc-550" />
          <span>Hỗ trợ</span>
        </a>
      </header>

      {/* 3. Center Wrapper (Logo + Card Content) */}
      <main className="relative z-10 w-full max-w-[440px] flex flex-col items-center justify-center my-auto pt-8">
        
        {/* Brand Identity Header Above Card */}
        <div className="flex flex-col items-center gap-2.5 mb-8 animate-fade-in">
          <LogoSvg className="w-14 h-14 text-slate-800 dark:text-zinc-100 transition-transform duration-500 hover:rotate-6 drop-shadow-[0_4px_12px_rgba(244,63,94,0.15)]" />
          <div className="text-center">
            <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent uppercase">
              Haniu
            </span>
            <span className="block text-[9px] font-black tracking-[0.25em] text-slate-400 dark:text-zinc-500 uppercase mt-0.5">
              Premium Gift Shop
            </span>
          </div>
        </div>

        {/* Children Rendered Card */}
        <div className="w-full">
          {children}
        </div>

      </main>

      {/* 4. Elegant Minimal Footer */}
      <footer className="relative z-10 mt-12 text-[10px] font-medium text-slate-400 dark:text-zinc-650 text-center pointer-events-none">
        &copy; {new Date().getFullYear()} Haniu Inc. Nền tảng quà tặng cao cấp & cá nhân hóa.
      </footer>

    </div>
  );
}
