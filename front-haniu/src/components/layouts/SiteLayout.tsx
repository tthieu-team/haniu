'use client';

import { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { useHomeLayoutStore, DEFAULT_STATE } from '@/store/homeLayout';
import WelcomeSplash from '@/components/common/WelcomeSplash';
import PromoPopup from '@/components/common/PromoPopup';
import ScrollToTop from '@/components/common/ScrollToTop';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const storeIsSticky = useHomeLayoutStore((state) => state.header.isSticky);
  const storeIsAnnouncementBar = useHomeLayoutStore((state) => state.announcementBar.isEnabled);

  const isSticky = isMounted ? storeIsSticky : DEFAULT_STATE.header.isSticky;
  const isAnnouncementBar = isMounted ? storeIsAnnouncementBar : DEFAULT_STATE.announcementBar.isEnabled;

  const isFullWidth = isHome || 
    pathname?.startsWith('/collections') || 
    pathname?.startsWith('/story') || 
    pathname?.startsWith('/about') || 
    pathname?.startsWith('/faq') || 
    pathname?.startsWith('/contact') || 
    pathname?.startsWith('/blog') || 
    pathname?.startsWith('/reviews') ||
    pathname?.startsWith('/orders') ||
    pathname === '/products';
  const isAuth = pathname?.startsWith('/auth');
  const isAdmin = pathname?.startsWith('/admin');

  const ptClass = isSticky && (!isFullWidth || !isHome)
    ? (isAnnouncementBar ? 'pt-28 sm:pt-32' : 'pt-20 sm:pt-24')
    : (isFullWidth ? 'pt-0' : 'pt-8');

  if (isAuth || isAdmin) {
    return (
      <>
        <ScrollToTop />
        {isAuth && <WelcomeSplash />}
        {children}
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <WelcomeSplash />
      <PromoPopup />
      <Suspense fallback={<div className="h-20 bg-white dark:bg-zinc-950" />} >
        <Header />
      </Suspense>
      {isFullWidth ? (
        <main className={`flex-1 w-full ${ptClass}`}>
          {children}
        </main>
      ) : (
        <main className={`flex-1 w-full mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 ${ptClass}`}>
          {children}
        </main>
      )}
      <Footer />
    </div>
  );
}
