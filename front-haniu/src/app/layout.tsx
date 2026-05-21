import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haniu - Cửa Hàng Quà Tặng Cao Cấp",
  description: "Trải nghiệm quà tặng cá nhân hóa cao cấp - Hộp quà lãng mạn, đồ lưu niệm độc bản",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        {/* Premium Header */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  HANIU
                </span>
                <span className="hidden text-xs font-semibold tracking-wider text-slate-400 uppercase sm:inline-block">
                  GIFT SHOP
                </span>
              </Link>
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
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all gap-1.5"
              >
                🛒 Giỏ hàng
              </Link>
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all"
              >
                🔒 Quản trị Admin
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Premium Footer */}
        <footer className="border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Haniu Inc. Nền tảng quà tặng cao cấp & cá nhân hóa Việt Nam.
            </p>
            <div className="mt-4 sm:mt-0 flex justify-center gap-4 text-xs text-slate-400">
              <span className="hover:text-rose-500 cursor-pointer">Bảo mật</span>
              <span className="hover:text-rose-500 cursor-pointer">Điều khoản</span>
              <span className="hover:text-rose-500 cursor-pointer">Liên hệ</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
