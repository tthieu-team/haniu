'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from './Logo';
import Navbar from './Navbar';
import Icon from '@/components/common/Icons';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useThemeStore } from '@/store/theme';
import { useWishlistStore } from '@/store/wishlist';
import { authService } from '@/services/auth.service';
import { productService } from '@/services/product.service';
import { getFullImageUrl } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { header, announcementBar } = useHomeLayoutStore();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  const wishlistItems = useWishlistStore((state) => state.items);

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchCache = useRef<{ [key: string]: any[] }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s) {
      setSearchVal(s);
      setShowSearchInput(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);  useEffect(() => {
    if (showMobileSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileSearch]);

  useEffect(() => {
    const trimmedVal = searchVal.trim();
    if (!trimmedVal) {
      setSuggestions([]);
      return;
    }

    // Check client-side memory cache for instantaneous retrieval (0ms network request)
    if (searchCache.current[trimmedVal]) {
      setSuggestions(searchCache.current[trimmedVal]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await productService.searchProducts(trimmedVal, 0, 5);
        if (res && res.content) {
          searchCache.current[trimmedVal] = res.content;
          setSuggestions(res.content);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchVal]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setShowDropdown(false);
      setShowMobileSearch(false);
    } else {
      router.push('/products');
      setShowDropdown(false);
      setShowMobileSearch(false);
    }
  };

  const rawMenuLinks = header?.menuLinks?.length ? header.menuLinks : [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Bộ sưu tập', href: '/collections' },
    { name: 'Câu chuyện', href: '/#story' },
  ];
  const menuLinks = [
    ...rawMenuLinks.filter(link => link.href !== '/wishlist' && link.name !== 'Yêu thích'),
    { name: 'Tra cứu đơn hàng', href: '/orders/lookup' }
  ];


  return (
    <div className={`w-full z-50 transition-all duration-300 mobile-landscape-hide-sticky ${
      header.isSticky ? 'fixed top-0 left-0 right-0' : 'relative'
    } ${isScrolled ? 'is-scrolled' : ''}`}>
      {/* Mobile Search Backdrop (Click to close mobile search) */}
      {showMobileSearch && (
        <div
          onClick={() => {
            setShowMobileSearch(false);
            setSuggestions([]);
          }}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 backdrop-blur-xs md:hidden"
        />
      )}
      {/* 2. ANNOUNCEMENT BAR */}
      {announcementBar.isEnabled && (
        <div className="w-full bg-rose-600 text-white text-[10px] sm:text-[11px] py-2 sm:py-2.5 px-2 sm:px-4 text-center font-semibold tracking-wide transition-all duration-350 shadow-sm">
          <a
            href={announcementBar.linkHref || '#products'}
            className="hover:underline flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 cursor-pointer leading-relaxed"
          >
            <span>{announcementBar.text}</span>
            {announcementBar.linkText && (
              <span className="underline font-bold">{announcementBar.linkText} →</span>
            )}
          </a>
        </div>
      )}

      <header
        className={`w-full transition-all duration-300 relative z-50 ${
          isScrolled
            ? 'bg-white/90 dark:bg-zinc-950/90 shadow-sm backdrop-blur-md border-b border-slate-200/60 dark:border-zinc-900/80 py-2.5 text-slate-800 dark:text-zinc-100'
            : 'bg-transparent py-3.5 text-slate-800 dark:text-zinc-100 border-transparent'
        }`}
      >
        {/* Mobile Search Overlay (Beautiful animation and search suggestions) */}
        {showMobileSearch && (
          <div
            className="absolute inset-0 bg-white/98 dark:bg-zinc-950/98 backdrop-blur-md z-[60] flex items-center px-4 animate-slide-down border-b border-slate-200/80 dark:border-zinc-800/80"
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full relative">
              <Icon name="search" size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm set quà..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-base text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none py-2"
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchVal('');
                    setSuggestions([]);
                  }}
                  className="text-slate-400 hover:text-slate-650 p-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowMobileSearch(false);
                  setSuggestions([]);
                }}
                className="text-xs font-bold text-slate-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 px-2 py-1 shrink-0 cursor-pointer"
              >
                Hủy
              </button>

              {/* Suggestions Dropdown for Mobile Search Overlay */}
              {searchVal.trim().length > 0 && (
                <div className="absolute top-[calc(100%+1px)] left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-2xl p-3 space-y-1 z-[70] max-h-[70vh] overflow-y-auto scrollbar-thin rounded-b-2xl">
                  {loadingSuggestions ? (
                    <div className="flex items-center justify-center p-6 text-xs text-slate-450 dark:text-zinc-500 gap-2">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-rose-500" />
                      <span>Đang tìm kiếm...</span>
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-450 dark:text-zinc-500">
                      Không tìm thấy kết quả phù hợp
                    </div>
                  ) : (
                    <>
                      <div className="text-[9px] font-extrabold text-slate-400 dark:text-zinc-500 px-3 py-1 uppercase tracking-wider">
                        Gợi ý sản phẩm ({suggestions.length})
                      </div>
                      {suggestions.map((product) => {
                        const priceVal = product.salePrice || product.basePrice || product.price || 0;
                        return (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={() => {
                              setShowMobileSearch(false);
                              setSuggestions([]);
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <img
                              src={getFullImageUrl(product.thumbnailUrl || product.media?.find((m: any) => m.isThumbnail)?.url || product.media?.[0]?.url || 'https://placehold.co/100')}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{product.name}</h4>
                              <span className="text-[10px] font-extrabold text-rose-500">{priceVal.toLocaleString('vi-VN')}đ</span>
                            </div>
                          </Link>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
        )}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Center: Navigation Menu */}
          <div className="hidden md:block">
            <Navbar isScrolled={isScrolled} menuLinks={menuLinks} />
          </div>
          {/* Right: Search, Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-5">
            {/* Search Bar Form (Desktop Only) */}
            <form
              ref={searchRef}
              onSubmit={handleSearchSubmit}
              className="hidden md:flex relative items-center"
            >
              <Icon name="search" size={13} className="absolute left-3 text-slate-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm set quà..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className={`text-xs pl-8 pr-8 py-1.5 rounded-full border bg-slate-50/50 dark:bg-zinc-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white dark:focus:bg-zinc-950 transition-all duration-300 w-36 lg:w-44 xl:w-52 text-slate-750 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-550 border-slate-200/80 dark:border-zinc-800/80`}
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchVal('');
                    setSuggestions([]);
                  }}
                  className="absolute right-3 text-slate-450 dark:text-zinc-500 hover:text-rose-500 text-[10px] cursor-pointer"
                >
                  ✕
                </button>
              )}

              {/* Suggestions Dropdown */}
              {showDropdown && searchVal.trim().length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl z-50 p-2 overflow-hidden animate-scale-up">
                  {loadingSuggestions ? (
                    <div className="flex items-center justify-center p-6 text-xs text-slate-400 dark:text-zinc-500 gap-2">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-rose-500" />
                      <span>Đang tìm kiếm...</span>
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 dark:text-zinc-500">
                      Không tìm thấy kết quả phù hợp
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-[9px] font-extrabold text-slate-400 dark:text-zinc-500 px-3 py-1 uppercase tracking-wider">
                        Gợi ý sản phẩm ({suggestions.length})
                      </div>
                      <div className="max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                        {suggestions.map((product) => {
                          const priceVal = product.salePrice || product.basePrice || product.price || 0;
                          const originalPriceVal = product.salePrice ? (product.basePrice || product.price) : undefined;
                          const discountPercent = originalPriceVal ? Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100) : 0;
                          const isOutOfStock = product.stock === 0;
                          const isLowStock = product.stock > 0 && product.stock <= 5;

                          return (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-rose-500/[0.04] dark:hover:bg-rose-500/[0.06] hover:translate-x-1 transition-all duration-200 group border border-transparent hover:border-rose-100/50 dark:hover:border-rose-950/20"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 dark:bg-zinc-950 shrink-0 border border-slate-200/60 dark:border-zinc-800/80 relative">
                                <img
                                  src={getFullImageUrl(product.thumbnailUrl || product.media?.find((m: any) => m.isThumbnail)?.url || product.media?.[0]?.url || 'https://placehold.co/100')}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                                {isOutOfStock && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[7px] text-white font-bold uppercase">
                                    Hết hàng
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1.5 justify-between">
                                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-rose-500 transition-colors truncate flex-1">
                                    {product.name}
                                  </h4>
                                </div>
                                
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[9px] text-slate-400 dark:text-zinc-550 font-bold bg-slate-100 dark:bg-zinc-800 px-1 py-0.5 rounded-sm">
                                    {product.sku}
                                  </span>
                                  {product.isCustomizable && (
                                    <span className="text-[8px] text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 px-1 py-0.5 rounded-sm font-bold flex items-center gap-0.5 shrink-0">
                                      🎨 Khắc tên
                                    </span>
                                  )}
                                  {isLowStock && (
                                    <span className="text-[8px] text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20 px-1 py-0.5 rounded-sm font-black shrink-0">
                                      Sắp hết
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-baseline gap-1.5 pt-0.5">
                                  <span className="text-xs font-black text-rose-500">
                                    {priceVal.toLocaleString('vi-VN')}đ
                                  </span>
                                  {originalPriceVal && (
                                    <>
                                      <span className="text-[9px] text-slate-400 line-through">
                                        {originalPriceVal.toLocaleString('vi-VN')}đ
                                      </span>
                                      <span className="text-[8px] font-bold text-rose-500">
                                        -{discountPercent}%
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      <button
                        type="submit"
                        className="w-full text-center block text-[10px] font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 py-2 border-t border-slate-200/80 dark:border-zinc-800/80 mt-1 cursor-pointer transition-colors"
                      >
                        Xem tất cả kết quả cho "{searchVal}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Wishlist Link (Desktop Only) - chỉ hiện khi có item */}
            <Link
              href="/wishlist"
              className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors items-center relative cursor-pointer"
              title="Danh sách yêu thích"
            >
              <Icon name="heart" size={16} className="text-rose-500" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-rose-500 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-zinc-950 shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Mobile Search Button (Visible next to cart on mobile) */}
            <button
              type="button"
              onClick={() => setShowMobileSearch(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors flex md:hidden items-center cursor-pointer text-slate-800 dark:text-zinc-100"
              title="Tìm kiếm"
            >
              <Icon name="search" size={16} />
            </button>

            {/* Cart Link (Always Show) */}
            <Link
              href="/cart"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors flex items-center relative cursor-pointer"
              title="Giỏ hàng"
            >
              <Icon name="cart" size={16} />
              <span className="absolute -top-1.5 -right-1 bg-amber-500 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-zinc-950 shadow-sm">
                {cart?.totalItems || 0}
              </span>
            </Link>

            {/* Theme Toggle (Desktop Only) */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors items-center cursor-pointer"
              title={mounted && theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              <Icon name={mounted && theme === 'dark' ? 'sun' : 'moon'} size={16} />
            </button>

            {/* User Account / Login (Desktop Only) */}
            {isAuthenticated ? (
              <div className="hidden md:block relative group py-2">
                <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-rose-500 dark:hover:text-rose-400 cursor-pointer">
                  <Icon name="user" size={16} /> <span className="hidden sm:inline">{user?.fullName.split(' ').slice(-1)[0]}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 w-44 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl p-3 flex flex-col gap-2">
                    <span className="text-[10px] text-slate-400 font-bold px-2 uppercase flex items-center gap-1">
                      {user?.role === 'ADMIN' ? (
                        <>
                          <Icon name="shield" size={10} className="text-amber-500" />
                          <span>Quản trị viên</span>
                        </>
                      ) : (
                        <>
                          <Icon name="user" size={10} />
                          <span>Khách hàng</span>
                        </>
                      )}
                    </span>
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin/products"
                        className="text-xs font-semibold px-2 py-1.5 rounded-xl hover:bg-rose-500/[0.04] dark:hover:bg-rose-500/[0.06] text-slate-700 dark:text-zinc-300 border border-transparent hover:border-rose-100/50 dark:hover:border-rose-950/20"
                      >
                        Quản trị Admin
                      </Link>
                    )}
                    <button
                      onClick={() => authService.logout()}
                      className="text-left text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1.5 rounded-xl hover:bg-rose-500/[0.06] dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-100/50 dark:hover:border-rose-950/20 cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors items-center cursor-pointer"
                title="Đăng nhập"
              >
                <Icon name="user" size={16} />
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 md:hidden cursor-pointer"
            >
              <span className="text-sm font-semibold flex items-center justify-center">
                {mobileOpen ? <Icon name="close" size={18} /> : <Icon name="menu" size={18} />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-6 space-y-6 shadow-xl animate-fade-in text-slate-800 dark:text-zinc-100">
            <div className="flex flex-col gap-4">
              {menuLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-bold hover:text-rose-500 px-2 py-2 border-b border-slate-100 dark:border-zinc-900/40 transition-all"
                >
                  {link.name}
                </Link>
              ))}

              <hr className="border-slate-200/80 dark:border-zinc-800/80 my-1" />

              {/* Mobile Search inside drawer */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm set quà..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full text-xs px-4 py-2.5 rounded-full border border-slate-200/85 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-800 dark:text-zinc-100 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs flex items-center justify-center"
                >
                  <Icon name="search" size={14} className="text-slate-400" />
                </button>
              </form>

              {/* Wishlist, Theme Toggle and Account for Mobile Drawer */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {/* Theme Toggle Mobile */}
                <button
                  onClick={toggleTheme}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50 text-slate-700 dark:text-zinc-350 border border-slate-200/80 dark:border-zinc-800/80 cursor-pointer"
                >
                  <Icon name={mounted && theme === 'dark' ? 'sun' : 'moon'} size={13} />
                  <span>{mounted && theme === 'dark' ? 'Sáng' : 'Tối'}</span>
                </button>

                {/* Wishlist Link Mobile */}
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50 text-rose-500 border border-slate-200/80 dark:border-zinc-800/80 cursor-pointer"
                >
                  <Icon name="heart" size={13} className="text-rose-500" />
                  <span>Yêu thích ({wishlistItems.length})</span>
                </Link>
              </div>

              {/* User Account / Login Mobile */}
              <div className="pt-1">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 text-slate-700 dark:text-zinc-350">
                      <Icon name="user" size={13} />
                      <span>Chào, {user?.fullName.split(' ').slice(-1)[0]}</span>
                    </div>
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin/products"
                        onClick={() => setMobileOpen(false)}
                        className="w-full text-center bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Icon name="shield" size={13} /> Quản trị Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        authService.logout();
                        setMobileOpen(false);
                      }}
                      className="w-full text-center bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center bg-slate-900 text-white dark:bg-zinc-800 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Icon name="user" size={13} /> Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
