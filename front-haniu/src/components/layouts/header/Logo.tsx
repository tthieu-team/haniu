'use client';

import Link from "next/link";
import { useHomeLayoutStore } from "@/store/homeLayout";

export default function Logo() {
  const logoText = useHomeLayoutStore((state) => state.header.logoText);
  const logoSubtitle = useHomeLayoutStore((state) => state.header.logoSubtitle);

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <span className="text-xl lg:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent transition-opacity group-hover:opacity-90">
        {logoText}
      </span>
      {logoSubtitle && (
        <span className="hidden text-[9px] font-bold tracking-widest text-slate-400 uppercase sm:inline-block border-l border-slate-200 dark:border-zinc-800 pl-2">
          {logoSubtitle}
        </span>
      )}
    </Link>
  );
}

