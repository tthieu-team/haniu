'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from './Logo';
import Navbar from './Navbar';
import Icon from '@/components/common/Icons';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { header, announcementBar } = useHomeLayoutStore();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/?search=${encodeURIComponent(searchVal.trim())}#products`);
    } else {
      router.push('/');
    }
  };

  const menuLinks = [
    { name: 'Shop', href: '/#products' },
    { name: 'Collections', href: '/#collections' },
    { name: 'About', href: '/#story' },
    { name: 'Blog', href: '/#blog' },
  ];

  return (
    <div className={`w-full z-50 transition-all duration-300 ${
      header.isSticky ? 'fixed top-0 left-0 right-0' : 'relative'
    }`}>
      {/* 2. ANNOUNCEMENT BAR */}
      {announcementBar.isEnabled && (
        <div className="w-full bg-rose-600 text-white text-[11px] py-2.5 px-4 text-center font-semibold tracking-wide transition-all duration-350 shadow-sm">
          <a
            href={announcementBar.linkHref || '#products'}
            className="hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{announcementBar.text}</span>
            {announcementBar.linkText && (
              <span className="underline font-bold ml-1">{announcementBar.linkText} →</span>
            )}
          </a>
        </div>
      )}

      {/* 1. HEADER MAIN NAVBAR */}
      <header
        className={`w-full transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 dark:bg-zinc-950/95 shadow-lg backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 py-4 text-slate-800 dark:text-zinc-100'
            : 'bg-transparent py-5 text-slate-800 dark:text-zinc-100 border-transparent'
        }`}
      >
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
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Search Bar Form */}
            <form
              onSubmit={handleSearchSubmit}
              className={`relative items-center ${
                showSearchInput ? 'flex' : 'hidden md:flex'
              }`}
            >
              <input
                type="text"
                placeholder="Tìm kiếm set quà..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className={`text-xs px-4 py-2 rounded-full border bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all duration-300 w-40 lg:w-48 ${
                  isScrolled
                    ? 'border-slate-200 text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'
                    : 'border-slate-200/80 text-slate-800 placeholder-slate-500 dark:border-zinc-800/60 dark:text-zinc-200 focus:bg-white/30'
                }`}
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => setSearchVal('')}
                  className="absolute right-3 text-slate-400 dark:text-zinc-500 hover:text-rose-500 text-[10px] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Mobile search toggle */}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 md:hidden cursor-pointer"
              title="Tìm kiếm"
            >
              <Icon name="search" size={16} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors flex items-center relative cursor-pointer"
              title="Danh sách yêu thích"
            >
              <Icon name="heart" size={16} className="text-rose-500" />
              <span className="absolute -top-1.5 -right-1 bg-rose-500 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-zinc-950 shadow-sm">
                0
              </span>
            </Link>

            {/* Cart Link */}
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

            {/* User Account / Login */}
            {isAuthenticated ? (
              <div className="relative group py-2">
                <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-rose-500 dark:hover:text-rose-450 cursor-pointer">
                  <Icon name="user" size={16} /> <span className="hidden sm:inline">{user?.fullName.split(' ').slice(-1)[0]}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 w-44 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-xl p-3 flex flex-col gap-2">
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
                        className="text-xs font-semibold px-2 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300"
                      >
                        Quản trị Admin
                      </Link>
                    )}
                    <button
                      onClick={clearAuth}
                      className="text-left text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Đăng nhập"
              >
                <Icon name="user" size={16} /> <span className="hidden sm:inline">Đăng nhập</span>
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
          <div className="md:hidden border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-6 shadow-xl animate-fade-in text-slate-800 dark:text-zinc-100">
            <div className="flex flex-col gap-4">
              {menuLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-semibold hover:text-rose-500 px-2 py-1 transition-all"
                >
                  {link.name}
                </Link>
              ))}

              <hr className="border-slate-100 dark:border-zinc-850" />

              {/* Mobile Search inside drawer */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm set quà..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full text-xs px-4 py-2.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs flex items-center justify-center"
                >
                  <Icon name="search" size={14} className="text-slate-400" />
                </button>
              </form>

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin/products"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center bg-slate-900 text-white dark:bg-zinc-800 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Icon name="shield" size={14} /> Quản trị Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
