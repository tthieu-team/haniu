'use client';

import Link from 'next/link';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function Footer() {
  const footer = useHomeLayoutStore((state) => state.footer);
  const header = useHomeLayoutStore((state) => state.header);

  return (
    <footer className="border-t border-slate-100 bg-white dark:border-zinc-900 dark:bg-zinc-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              {header.logoText}
            </span>
            <p className="text-[12px] text-slate-400 dark:text-zinc-500 leading-relaxed font-light max-w-sm">
              {footer.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {footer.facebookUrl && (
                <a href={footer.facebookUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-xs hover:text-rose-500 transition-colors">
                  FB
                </a>
              )}
              {footer.instagramUrl && (
                <a href={footer.instagramUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-xs hover:text-rose-500 transition-colors">
                  IG
                </a>
              )}
              {footer.tiktokUrl && (
                <a href={footer.tiktokUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-xs hover:text-rose-500 transition-colors">
                  TT
                </a>
              )}
            </div>
          </div>

          {/* Directory Col */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-widest">
              Đường Dẫn Nhanh
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-zinc-400">
              {(
                [
                  ...(header?.menuLinks?.length ? header.menuLinks : [
                    { name: 'Trang chủ', href: '/' },
                    { name: 'Sản phẩm', href: '/products' },
                    { name: 'Bộ sưu tập', href: '/#collections' },
                    { name: 'Câu chuyện', href: '/#story' },
                  ]).filter(link => link.href !== '/wishlist' && link.name !== 'Yêu thích'),
                  { name: 'Tra cứu đơn hàng', href: '/orders/lookup' }
                ]
              ).map((link, idx) => (
                <Link key={idx} href={link.href} className="hover:text-rose-500 transition-colors font-light">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>


          {/* Contact Col */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-widest">
              Thông Tin Liên Hệ
            </h4>
            <div className="space-y-3 text-xs text-slate-500 dark:text-zinc-400 font-light">
              <p className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5"><Icon name="📍" size={14} /></span>
                <span>{footer.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-rose-500"><Icon name="📞" size={14} /></span>
                <span>{footer.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-rose-500"><Icon name="✉️" size={14} /></span>
                <span>{footer.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sub-footer copyright */}
        <div className="border-t border-slate-100 dark:border-zinc-900 pt-8 text-center md:flex md:justify-between md:items-center text-[11px] text-slate-450 dark:text-zinc-500 font-light">
          <p>
            &copy; {new Date().getFullYear()} {header.logoText} Inc. Nền tảng quà tặng cao cấp & cá nhân hóa Việt Nam.
          </p>
          <div className="mt-4 md:mt-0 flex justify-center gap-6">
            <span className="hover:text-rose-500 cursor-pointer">Bảo mật thông tin</span>
            <span className="hover:text-rose-500 cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:text-rose-500 cursor-pointer">Quy chế hoạt động</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

