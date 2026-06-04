'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { useOccasionStore } from '@/store/occasion';
import { useCollectionStore } from '@/store/collection';
import { getFullImageUrl } from '@/lib/api';

interface NavbarProps {
  isScrolled: boolean;
  menuLinks: Array<{ name: string; href: string }>;
}

export default function Navbar({ isScrolled, menuLinks }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Lấy data từ store (không gọi API lại nếu đã có)
  const { occasions, fetchOccasions } = useOccasionStore();
  const { collections, fetchCollections } = useCollectionStore();

  useEffect(() => {
    if (occasions.length === 0) fetchOccasions();
  }, []);// eslint-disable-line

  useEffect(() => {
    if (collections.length === 0) fetchCollections();
  }, []);// eslint-disable-line

  // Chỉ lấy các item active, tối đa 5 để dropdown gọn
  const activeOccasions = occasions.filter(o => o.isActive !== false && (o as any).active !== false).slice(0, 5);
  const activeCollections = collections.filter(c => c.isActive !== false && (c as any).active !== false).slice(0, 5);

  return (
    <nav className="hidden md:flex items-center gap-4 lg:gap-5 xl:gap-7 relative h-full">
      {menuLinks.map((link, idx) => {
        const isShopMenu = link.name.toLowerCase() === 'shop' || link.name.toLowerCase() === 'sản phẩm';
        const isCollectionsMenu = link.name.toLowerCase() === 'collections' || link.name.toLowerCase() === 'bộ sưu tập';
        const hasDropdown = isShopMenu || isCollectionsMenu;

        return (
          <div
            key={idx}
            className={`relative py-4 lg:py-4.5 ${idx >= 3 ? 'hidden min-[1200px]:block' : ''}`}
            onMouseEnter={() => {
              if (isShopMenu) setActiveDropdown('shop');
              else if (isCollectionsMenu) setActiveDropdown('collections');
            }}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href={link.href}
              className="relative flex items-center gap-1 text-[10px] xl:text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer text-slate-700 dark:text-zinc-200 hover:text-rose-500 dark:hover:text-rose-400 group"
            >
              <span>{link.name}</span>
              {hasDropdown && (
                <span className={`opacity-60 transition-transform duration-300 flex items-center justify-center ${activeDropdown === (isShopMenu ? 'shop' : 'collections') ? 'rotate-180' : ''}`}>
                  <Icon name="chevron-down" size={8} />
                </span>
              )}
              <span className="absolute bottom-[-6px] left-0 w-full h-[1.5px] bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </Link>

            {/* === Dropdown: Sản phẩm theo dịp lễ === */}
            {isShopMenu && activeDropdown === 'shop' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 w-[560px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl grid grid-cols-2 gap-6 animate-fade-in text-slate-800 dark:text-zinc-100 before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']">
                {/* Left: Occasions list */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold tracking-widest text-rose-500 uppercase flex items-center gap-1">
                    <Icon name="gift" size={12} /> Chọn theo dịp lễ
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {activeOccasions.length > 0 ? (
                      activeOccasions.map((occ) => (
                        <Link
                          key={occ.id || occ.slug}
                          href={`/?occasion=${occ.slug}#products`}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-rose-500/[0.04] dark:hover:bg-rose-500/[0.06] hover:translate-x-1 transition-all duration-250 group/item border border-transparent hover:border-rose-100/50 dark:hover:border-rose-950/30"
                        >
                          <span className="w-8 h-8 rounded-lg overflow-hidden bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 flex-shrink-0 flex items-center justify-center transition-all duration-250 group-hover/item:bg-rose-50/60 dark:group-hover/item:bg-rose-950/30 group-hover/item:border-rose-200 dark:group-hover/item:border-rose-900">
                            {occ.imageUrl ? (
                              <img
                                src={getFullImageUrl(occ.imageUrl) || occ.imageUrl}
                                alt={occ.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Icon name="gift" size={14} className="text-rose-400 group-hover/item:text-rose-500" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 group-hover/item:text-rose-500 dark:group-hover/item:text-rose-400 transition-colors truncate">
                              {occ.name}
                            </h4>
                          </div>
                        </Link>
                      ))
                    ) : (
                      // Fallback khi chưa có data
                      ['Sinh nhật', 'Lễ tình nhân', 'Ngày nhà giáo', 'Quốc khánh 2-9'].map((name, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                          <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex-shrink-0" />
                          <div className="h-3 w-24 bg-slate-100 dark:bg-zinc-800 rounded" />
                        </div>
                      ))
                    )}
                    <Link
                      href="/products"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2 p-2 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:underline transition-all mt-1"
                    >
                      Xem tất cả sản phẩm <Icon name="→" size={12} />
                    </Link>
                  </div>
                </div>

                {/* Right: Promo card */}
                <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/20 dark:from-zinc-950 dark:to-zinc-900/60 p-5 rounded-2xl flex flex-col justify-between border border-rose-100 dark:border-zinc-800/80">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold tracking-wider text-amber-500 uppercase bg-amber-500/10 px-2.5 py-1 rounded-full">
                      Set quà bán chạy
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 leading-snug mt-2">
                      Combo Quà Tặng Lãng Mạn Eternal Love
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed font-light">
                      Miễn phí khắc tên và lời chúc bằng laser lên gốm tre. Tặng kèm thiệp viết tay từ Haniu.
                    </p>
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setActiveDropdown(null)}
                    className="mt-4 inline-flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 px-4 rounded-xl text-[10px] shadow-sm hover:shadow-md transition-all text-center gap-1.5"
                  >
                    <Icon name="gift" size={11} /> Xem tất cả quà tặng
                  </Link>
                </div>
              </div>
            )}

            {/* === Dropdown: Bộ sưu tập === */}
            {isCollectionsMenu && activeDropdown === 'collections' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 w-[560px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl grid grid-cols-2 gap-6 animate-fade-in text-slate-800 dark:text-zinc-100 before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']">
                {/* Left: Collections list */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold tracking-widest text-rose-500 uppercase flex items-center gap-1">
                    <Icon name="sparkles" size={12} /> Bộ sưu tập độc quyền
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {activeCollections.length > 0 ? (
                      activeCollections.map((col) => (
                        <Link
                          key={col.id || col.slug}
                          href={`/collections/${col.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-rose-500/[0.04] dark:hover:bg-rose-500/[0.06] hover:translate-x-1 transition-all duration-250 group/item border border-transparent hover:border-rose-100/50 dark:hover:border-rose-950/30"
                        >
                          <span className="w-12 h-8 rounded-lg overflow-hidden bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 flex-shrink-0 transition-all duration-250 group-hover/item:border-rose-200 dark:group-hover/item:border-rose-900">
                            {col.imageUrl ? (
                              <img
                                src={getFullImageUrl(col.imageUrl) || col.imageUrl}
                                alt={col.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon name="sparkles" size={12} className="text-amber-400 group-hover/item:scale-110 transition-transform duration-200" />
                              </div>
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 group-hover/item:text-rose-500 dark:group-hover/item:text-rose-400 transition-colors truncate">
                              {col.name}
                            </h4>
                            {col.description && (
                              <p className="text-[9px] text-slate-450 dark:text-zinc-550 font-light truncate">
                                {col.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))
                    ) : (
                      [1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                          <span className="w-12 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex-shrink-0" />
                          <div className="space-y-1 flex-1">
                            <div className="h-3 w-28 bg-slate-100 dark:bg-zinc-800 rounded" />
                            <div className="h-2 w-20 bg-slate-100 dark:bg-zinc-800 rounded" />
                          </div>
                        </div>
                      ))
                    )}
                    <Link
                      href="/collections"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2 p-2 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:underline transition-all mt-1"
                    >
                      Xem tất cả bộ sưu tập <Icon name="→" size={12} />
                    </Link>
                  </div>
                </div>

                {/* Right: Promo card */}
                <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/20 dark:from-zinc-950 dark:to-zinc-900/60 p-5 rounded-2xl flex flex-col justify-between border border-amber-100 dark:border-zinc-800/80">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold tracking-wider text-rose-500 uppercase bg-rose-500/10 px-2.5 py-1 rounded-full">
                      Ưu đãi đặc biệt
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 leading-snug mt-2">
                      Thiết Kế Độc Bản Theo Yêu Cầu
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed font-light">
                      Khắc laser cá nhân hóa miễn phí cho tất cả set quà thuộc bộ sưu tập mới.
                    </p>
                  </div>
                  <Link
                    href="/collections"
                    onClick={() => setActiveDropdown(null)}
                    className="mt-4 inline-flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 px-4 rounded-xl text-[10px] shadow-sm hover:shadow-md transition-all text-center gap-1.5"
                  >
                    <Icon name="sparkles" size={11} /> Khám phá BST ngay
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* "Thêm" dropdown for screens < 1200px (768px to 1199px) */}
      <div
        className="relative py-4 lg:py-4.5 min-[1200px]:hidden block"
        onMouseEnter={() => setActiveDropdown('more')}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <button
          className="relative flex items-center gap-1 text-[10px] xl:text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer text-slate-700 dark:text-zinc-200 hover:text-rose-500 dark:hover:text-rose-400 group"
        >
          <span>Thêm</span>
          <span className={`opacity-60 transition-transform duration-300 flex items-center justify-center ${activeDropdown === 'more' ? 'rotate-180' : ''}`}>
            <Icon name="chevron-down" size={8} />
          </span>
          <span className="absolute bottom-[-6px] left-0 w-full h-[1.5px] bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
        </button>

        {activeDropdown === 'more' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 w-48 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl p-3 shadow-2xl flex flex-col gap-1 animate-fade-in text-slate-800 dark:text-zinc-100 before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']">
            {menuLinks.slice(3).map((link, subIdx) => (
              <Link
                key={subIdx}
                href={link.href}
                onClick={() => setActiveDropdown(null)}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-rose-500/[0.04] dark:hover:bg-rose-500/[0.06] hover:translate-x-1 transition-all duration-200 text-[10px] font-bold text-slate-700 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
