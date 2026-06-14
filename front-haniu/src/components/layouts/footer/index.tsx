'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useHomeLayoutStore, DEFAULT_STATE } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { useLanguage } from '@/providers/LanguageProvider';
import { useTranslate } from '@/lib/translator';

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();
  const trans = useTranslate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const storeFooter = useHomeLayoutStore((state) => state.footer);
  const storeHeader = useHomeLayoutStore((state) => state.header);

  const footer = isMounted ? storeFooter : DEFAULT_STATE.footer;
  const header = isMounted ? storeHeader : DEFAULT_STATE.header;

  const getTranslatedName = (name: string) => {
    const norm = name.toLowerCase().trim();
    if (norm === 'trang chủ' || norm === 'home') return t('nav.home');
    if (norm === 'sản phẩm' || norm === 'products' || norm === 'shop') return t('nav.products');
    if (norm === 'bộ sưu tập' || norm === 'collections') return t('nav.collections');
    if (norm === 'câu chuyện' || norm === 'story' || norm === 'blog') return t('nav.story');
    if (norm === 'tra cứu đơn hàng' || norm === 'order lookup') return t('nav.order_lookup');
    if (norm === 'tin tức' || norm === 'news') return t('nav.blog');
    return name;
  };

  return (
    <footer className="border-t border-slate-100 bg-white dark:border-zinc-900 dark:bg-zinc-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              {header.logoText}
            </span>
            <p className="text-[12px] text-slate-400 dark:text-zinc-550 leading-relaxed font-light max-w-sm">
              {trans(footer.description)}
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
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-widest">
              {t('footer.directory')}
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-zinc-400">
              {(
                [
                  ...(header?.menuLinks?.length ? header.menuLinks : [
                    { name: 'Trang chủ', href: '/' },
                    { name: 'Sản phẩm', href: '/products' },
                    { name: 'Bộ sưu tập', href: '/collections' },
                    { name: 'Câu chuyện', href: '/story' },
                    { name: 'Tin tức', href: '/blog' },
                  ]).filter(link => 
                    link.href !== '/wishlist' && 
                    link.name !== 'Yêu thích' &&
                    link.href !== '/about' &&
                    link.href !== '/faq' &&
                    link.href !== '/contact'
                  )
                ]
              ).map((link, idx) => (
                <Link key={idx} href={link.href} className="hover:text-rose-500 transition-colors font-light">
                  {getTranslatedName(link.name)}
                </Link>
              ))}
            </div>
          </div>

          {/* Support Col */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-widest">
              {t('footer.support')}
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-zinc-400">
              <Link href="/about" className="hover:text-rose-500 transition-colors font-light">
                {t('footer.about_us')}
              </Link>
              <Link href="/faq" className="hover:text-rose-500 transition-colors font-light">
                {t('footer.faq')}
              </Link>
              <Link href="/contact" className="hover:text-rose-500 transition-colors font-light">
                {t('footer.contact_us')}
              </Link>
              <Link href="/reviews" className="hover:text-rose-500 transition-colors font-light">
                {t('footer.reviews')}
              </Link>
              <Link href="/orders/lookup" className="hover:text-rose-500 transition-colors font-light">
                {t('footer.order_lookup')}
              </Link>
            </div>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-widest">
              {t('footer.contact')}
            </h4>
            <div className="space-y-3 text-xs text-slate-500 dark:text-zinc-400 font-light">
              <p className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5"><Icon name="📍" size={14} /></span>
                <span>{trans(footer.address)}</span>
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
            &copy; {new Date().getFullYear()} {header.logoText} Inc. {t('footer.tagline')}
          </p>
          <div className="mt-4 md:mt-0 flex justify-center gap-6">
            <span className="hover:text-rose-500 cursor-pointer">{t('footer.privacy')}</span>
            <span className="hover:text-rose-500 cursor-pointer">{t('footer.terms')}</span>
            <span className="hover:text-rose-500 cursor-pointer">{t('footer.policy')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
