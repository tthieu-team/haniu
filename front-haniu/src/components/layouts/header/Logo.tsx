'use client';

import Link from "next/link";
import { useHomeLayoutStore } from "@/store/homeLayout";

export default function Logo() {
  const logoText = useHomeLayoutStore((state) => state.header.logoText);
  const logoSubtitle = useHomeLayoutStore((state) => state.header.logoSubtitle);

  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
        {logoText}
      </span>
      {logoSubtitle && (
        <span className="hidden text-xs font-semibold tracking-wider text-slate-400 uppercase sm:inline-block">
          {logoSubtitle}
        </span>
      )}
    </Link>
  );
}

