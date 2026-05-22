import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link href="/" className="text-sm font-medium text-slate-600 hover:text-rose-500 transition-colors dark:text-zinc-300 dark:hover:text-rose-400">
        Trang chủ
      </Link>
      <Link href="/?category=gift-set" className="text-sm font-medium text-slate-600 hover:text-rose-500 transition-colors dark:text-zinc-300 dark:hover:text-rose-400">
        Hộp Quà Set
      </Link>
      <Link href="/?occasion=sinh-nhat" className="text-sm font-medium text-slate-600 hover:text-rose-500 transition-colors dark:text-zinc-300 dark:hover:text-rose-400">
        Quà Sinh Nhật
      </Link>
    </nav>
  );
}
