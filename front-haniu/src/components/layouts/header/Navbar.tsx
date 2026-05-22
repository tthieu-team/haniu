'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

interface NavbarProps {
  isScrolled: boolean;
  menuLinks: Array<{ name: string; href: string }>;
}

export default function Navbar({ isScrolled, menuLinks }: NavbarProps) {
  const categories = useHomeLayoutStore((state) => state.categories);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  return (
    <nav className="hidden md:flex items-center gap-8 relative h-full">
      {menuLinks.map((link, idx) => {
        const isShopMenu = link.name.toLowerCase() === 'shop' || link.name.toLowerCase() === 'sản phẩm';
        const isCollectionsMenu = link.name.toLowerCase() === 'collections' || link.name.toLowerCase() === 'bộ sưu tập';
        const hasDropdown = isShopMenu || isCollectionsMenu;

        return (
          <div
            key={idx}
            className="relative py-5"
            onMouseEnter={() => hasDropdown && setShowMegaMenu(true)}
            onMouseLeave={() => hasDropdown && setShowMegaMenu(false)}
          >
            {hasDropdown ? (
              <button
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-slate-700 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-450"
              >
                {link.name}{' '}
                <span className="opacity-70 transition-transform duration-300 group-hover:rotate-180 flex items-center justify-center">
                  <Icon name="chevron-down" size={10} />
                </span>
              </button>
            ) : (
              <Link
                href={link.href}
                className="text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-slate-700 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-450"
              >
                {link.name}
              </Link>
            )}

            {/* Mega Menu Dropdown Panel */}
            {hasDropdown && showMegaMenu && (
              <div className="absolute top-[56px] left-1/2 -translate-x-1/2 z-50 w-[580px] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl grid grid-cols-2 gap-6 animate-fade-in text-slate-800 dark:text-zinc-100">
                <div className="space-y-4">
                  <span className="text-[10px] font-extrabold tracking-widest text-rose-500 uppercase flex items-center gap-1">
                    <Icon name="gift" size={12} /> Dịp tặng quà ý nghĩa
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.items.map((cat, cIdx) => (
                      <Link
                        key={cIdx}
                        href={`/?occasion=${cat.slug}#products`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-rose-500 dark:group-hover:text-rose-455 transition-colors">
                            {cat.name}
                          </h4>
                          <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-light">
                            {cat.count}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-950 p-5 rounded-2xl flex flex-col justify-between border border-slate-100/50 dark:border-zinc-850">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold tracking-wider text-amber-500 uppercase bg-amber-550/10 px-2.5 py-1 rounded">
                      Set quà bán chạy
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 leading-snug">
                      Combo Quà Tặng Lãng Mạn Eternal Love
                    </h4>
                    <p className="text-[10px] text-slate-450 dark:text-zinc-400 leading-relaxed font-light">
                      Miễn phí khắc tên và chúc mừng bằng laser lên gốm tre. Tặng thiệp viết tay chân thành từ Haniu.
                    </p>
                  </div>
                  <Link
                    href="/?category=combo-qua-tang"
                    className="mt-4 inline-flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 px-4 rounded-xl text-[10px] shadow-sm hover:shadow-md transition-all text-center"
                  >
                    Xem tất cả combo quà
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
