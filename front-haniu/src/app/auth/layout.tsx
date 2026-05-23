'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import BrandingPanel from '@/components/auth/BrandingPanel';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 font-sans flex flex-col">
      {/* 1. Minimal Header */}
      <header className="absolute top-0 left-0 right-0 z-30 w-full py-4 px-4 sm:px-6 lg:px-12 flex justify-between items-center bg-transparent">
        {/* Left Side: Back Button (Always visible, glassmorphic pill on mobile) */}
        <div>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 lg:px-0 lg:py-0 rounded-full lg:rounded-none bg-slate-50/80 dark:bg-zinc-900/80 lg:bg-transparent dark:lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border border-slate-100 dark:border-zinc-800 lg:border-none text-[11px] lg:text-xs font-bold text-slate-600 dark:text-zinc-300 lg:text-slate-500 lg:dark:text-zinc-400 hover:text-rose-500 transition-colors shadow-sm lg:shadow-none"
          >
            <Icon name="arrow-left" size={12} />
            <span>Trở về Cửa hàng</span>
          </Link>
        </div>

        {/* Right Side: Mobile Logo & Support Link */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="lg:hidden">
            <Link href="/" className="flex items-center">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                Haniu
              </span>
            </Link>
          </div>
          <span className="text-slate-200 dark:text-zinc-800 lg:hidden">|</span>
          <a
            href="/support"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-rose-500 transition-colors"
          >
            <Icon name="phone" size={12} className="text-slate-400 dark:text-zinc-500" />
            <span className="hidden sm:inline">Hỗ trợ</span>
          </a>
        </div>
      </header>

      {/* 2. Main Layout Split Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Branding Panel (Desktop Only) */}
        <BrandingPanel />

        {/* Right: Auth Card Content Form Container */}
        <div className="relative flex-1 flex flex-col items-center px-4 py-16 bg-white dark:bg-zinc-950 overflow-y-auto scrollbar-none">
          {/* Subtle Background Accent on Right side */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 dark:bg-amber-500/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/5 dark:bg-rose-500/2 blur-3xl pointer-events-none" />

          {/* Children: Login / Register card container */}
          <div className="w-full max-w-[420px] mx-auto relative z-10 animate-fade-in my-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
