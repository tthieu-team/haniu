export default function Footer() {
  return (
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
  );
}
