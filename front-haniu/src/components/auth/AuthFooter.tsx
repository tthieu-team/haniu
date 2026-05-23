'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icons';

export default function AuthFooter() {
  return (
    <div className="w-full pt-4 xl:pt-6 border-t border-slate-100 dark:border-zinc-800 text-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
        <Link href="/support" className="hover:text-rose-500 transition-colors">
          Hỗ trợ & Hotline
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-rose-500 transition-colors">
          Điều khoản sử dụng
        </Link>
        <span>•</span>
        <Link href="/privacy" className="hover:text-rose-500 transition-colors">
          Chính sách bảo mật
        </Link>
      </div>

      <p className="mt-3 xl:mt-4 text-[10px] text-slate-400 dark:text-zinc-650">
        © {new Date().getFullYear()} Haniu. All rights reserved.
      </p>
    </div>
  );
}
