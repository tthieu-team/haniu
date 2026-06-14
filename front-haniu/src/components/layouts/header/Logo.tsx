'use client';

import Link from "next/link";
import { useHomeLayoutStore } from "@/store/homeLayout";
import LogoSvg from "@/components/common/LogoSvg";

export default function Logo() {
  const logoSubtitle = useHomeLayoutStore((state) => state.header.logoSubtitle);

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <LogoSvg className="w-12 h-12 md:w-14 md:h-14 text-slate-800 dark:text-zinc-100 transition-transform duration-300 group-hover:scale-105" />
      {logoSubtitle && (
        <span className="hidden text-[9px] font-bold tracking-widest text-slate-400 uppercase sm:inline-block pl-1">
          {logoSubtitle}
        </span>
      )}
    </Link>
  );
}
