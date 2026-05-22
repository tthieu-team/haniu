'use client';

import Header from './header';
import Footer from './footer';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const isSticky = useHomeLayoutStore((state) => state.header.isSticky);
  const isAnnouncementBar = useHomeLayoutStore((state) => state.announcementBar.isEnabled);

  const ptClass = isSticky 
    ? (isAnnouncementBar ? 'pt-28 sm:pt-32 md:pt-36' : 'pt-20 sm:pt-24 md:pt-28') 
    : 'pt-0';

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-20 bg-white dark:bg-zinc-950" />}>
        <Header />
      </Suspense>
      {isHome ? (
        <main className="flex-1 w-full">
          {children}
        </main>
      ) : (
        <main className={`flex-1 w-full mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${ptClass}`}>
          {children}
        </main>
      )}
      <Footer />
    </div>
  );
}
