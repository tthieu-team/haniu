'use client';

import Link from "next/link";
import Image from "next/image";
import { useHomeLayoutStore } from "@/store/homeLayout";

export default function Logo() {
  const logoText = useHomeLayoutStore((state) => state.header.logoText);
  const logoSubtitle = useHomeLayoutStore((state) => state.header.logoSubtitle);

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative w-8 h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/logo/logo-transparent.png"
          alt="Haniu Logo"
          fill
          sizes="(max-width: 768px) 32px, 36px"
          className="object-contain dark:brightness-110"
          priority
        />
      </div>
      <span className="text-lg lg:text-xl font-black tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent transition-opacity group-hover:opacity-90">
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

