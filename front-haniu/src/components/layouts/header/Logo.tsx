import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
        HANIU
      </span>
      <span className="hidden text-xs font-semibold tracking-wider text-slate-400 uppercase sm:inline-block">
        GIFT SHOP
      </span>
    </Link>
  );
}
