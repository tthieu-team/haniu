'use client';

// React hooks
import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { useLanguage } from '@/providers/LanguageProvider';

import { useTranslate } from '@/lib/translator';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price?: number;
  basePrice?: number;
  salePrice?: number;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
  category?: { name: string; slug: string };
  media?: Array<{ url: string; isThumbnail: boolean }>;
  occasions?: Array<{ name: string; slug: string }>;
  recipients?: Array<{ name: string; slug: string }>;
}

interface OccasionFilter {
  name: string;
  slug: string;
}

interface RecipientFilter {
  name: string;
  slug: string;
}

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedOccasion: string;
  setSelectedOccasion: (val: string) => void;
  selectedRecipient: string;
  setSelectedRecipient: (val: string) => void;
  occasions: OccasionFilter[];
  recipients: RecipientFilter[];
  hasNextPage: boolean;
  handleLoadMore: () => void;
}

const getOccasionIcon = (slug: string) => {
  switch (slug) {
    case '': return '✨';
    case 'sinh-nhat': return '🎂';
    case 'valentine': return '💖';
    case '20-11': return '👩‍🏫';
    case 'quoc-khanh': return '🇻🇳';
    default: return '🎉';
  }
};

const getRecipientIcon = (slug: string) => {
  switch (slug) {
    case '': return '👥';
    case 'ban-gai': return '👩';
    case 'ban-trai': return '👨';
    case 'thay-co': return '🧑‍🏫';
    case 'doi-tac': return '🤝';
    default: return '🎁';
  }
};

export default function FeaturedProductsSection({
  products,
  loading,
  loadingMore,
  searchTerm,
  setSearchTerm,
  selectedOccasion,
  setSelectedOccasion,
  selectedRecipient,
  setSelectedRecipient,
  occasions,
  recipients,
  hasNextPage,
  handleLoadMore,
}: FeaturedProductsSectionProps) {
  const isVisible = useHomeLayoutStore((state) => state.visibility.featuredProducts);
  const featuredProducts = useHomeLayoutStore((state) => state.featuredProducts);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const { t } = useLanguage();
  const trans = useTranslate();

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        setSearchTerm(localSearch);
      }
    }, 600); // 600ms debounce
    return () => clearTimeout(timer);
  }, [localSearch, searchTerm, setSearchTerm]);

  if (!isVisible) return null;

  return (
    <section id="products" className="py-6 sm:py-10 space-y-8 sm:space-y-12 scroll-mt-20 font-sans">
      {/* Title */}
      <div className="text-center space-y-3 sm:space-y-5 max-w-3xl mx-auto px-3 sm:px-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
          <Icon name="✨" size={10} className="animate-pulse" /> {trans(featuredProducts?.badge || 'Set quà bán chạy')}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          {trans(featuredProducts?.title || 'Sản phẩm nổi bật')}
        </h2>
        <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          {trans(featuredProducts?.subtitle || 'Những set quà được yêu thích nhất thiết kế chỉn chu riêng cho bạn')}
        </p>
      </div>

      {/* Advanced Filters block */}
      <div className="bg-gradient-to-b from-white/95 to-slate-50/70 dark:from-zinc-900/90 dark:to-zinc-900/50 backdrop-blur-md rounded-2xl sm:rounded-[32px] p-4 sm:p-8 shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-200 dark:border-zinc-800/60 space-y-6 sm:space-y-8">
        {/* Search bar & statistics row */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 justify-between items-stretch lg:items-center">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder={t('home.products.search_placeholder')}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-3 sm:pl-12 sm:pr-10 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:focus:ring-rose-500/5 dark:focus:border-rose-500 text-base md:text-sm shadow-xs transition-all duration-300 text-slate-800 dark:text-zinc-100"
            />
            <span className="absolute left-3.5 top-[13px] sm:left-4.5 sm:top-[17px] text-slate-400 dark:text-zinc-500 transition-colors group-focus-within:text-rose-500">
              <Icon name="Search" size={16} />
            </span>
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSearchTerm('');
                }}
                className="absolute right-2.5 top-2.5 sm:right-3.5 sm:top-3.5 text-slate-400 hover:text-slate-650 dark:hover:text-zinc-300 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Icon name="close" size={10} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-stretch sm:self-start lg:self-center">
            {/* Quick Clear Filter */}
            {(localSearch || selectedOccasion || selectedRecipient) && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSearchTerm('');
                  setSelectedOccasion('');
                  setSelectedRecipient('');
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-rose-200/60 dark:border-rose-950/30 text-rose-500 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 text-[10px] sm:text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
              >
                <Icon name="close" size={12} />
                {t('home.products.clear_filters')}
              </button>
            )}

            {/* Display Counter */}
            <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 px-3.5 py-2.5 sm:px-4.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs text-slate-500 dark:text-zinc-400 font-medium shadow-xs">
              <span>{t('home.products.showing')}</span>
              <span className="font-extrabold text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded-md">{products.length}</span>
              <span>{t('home.products.unique_gifts')}</span>
            </div>
          </div>
        </div>

        {/* Occasions Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-extrabold tracking-widest text-slate-450 dark:text-zinc-500 uppercase block whitespace-nowrap">
              {t('home.products.filter_occasion')}
            </span>
            <div className="h-[1px] flex-1 bg-slate-200/60 dark:bg-zinc-800/50" />
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-5 justify-start sm:justify-start">
            {occasions.map((occ) => {
              const isSelected = selectedOccasion === occ.slug;
              return (
                <button
                  key={occ.slug}
                  onClick={() => setSelectedOccasion(occ.slug)}
                  className="flex flex-col items-center gap-1 sm:gap-2 group cursor-pointer active:scale-95 transition-all duration-300 min-w-[58px] sm:min-w-[80px] max-w-[66px] sm:max-w-none"
                >
                  {/* Circle Icon Container */}
                  <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-2xl flex items-center justify-center transition-all duration-300 border relative ${isSelected
                    ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white border-rose-500 shadow-lg shadow-rose-500/25 scale-105 ring-4 ring-rose-500/10'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50/50 hover:text-rose-600 hover:border-rose-300/80 hover:scale-105 hover:shadow-md hover:shadow-rose-500/5 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 dark:hover:border-rose-900/40'
                    }`}>
                    <Icon name={getOccasionIcon(occ.slug)} size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-pink-600 text-white border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[7px] sm:text-[9px] font-bold animate-scale-up">
                        ✓
                      </span>
                    )}
                  </div>
                  {/* Text Label */}
                  <span className={`text-[9px] sm:text-[10px] font-bold tracking-wide transition-colors text-center leading-tight line-clamp-2 ${isSelected ? 'text-rose-500' : 'text-slate-500 dark:text-zinc-400 group-hover:text-rose-600 dark:group-hover:text-rose-400'
                    }`}>
                    {occ.slug === '' ? t('home.products.all_occasions') : occ.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipients Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-extrabold tracking-widest text-slate-450 dark:text-zinc-550 uppercase block whitespace-nowrap">
              {t('home.products.filter_recipient')}
            </span>
            <div className="h-[1px] flex-1 bg-slate-200/60 dark:bg-zinc-800/50" />
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-5 justify-start sm:justify-start">
            {recipients.map((rec) => {
              const isSelected = selectedRecipient === rec.slug;
              return (
                <button
                  key={rec.slug}
                  onClick={() => setSelectedRecipient(rec.slug)}
                  className="flex flex-col items-center gap-1 sm:gap-2 group cursor-pointer active:scale-95 transition-all duration-300 min-w-[58px] sm:min-w-[80px] max-w-[66px] sm:max-w-none"
                >
                  {/* Circle Icon Container */}
                  <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-2xl flex items-center justify-center transition-all duration-300 border relative ${isSelected
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-500 shadow-lg shadow-amber-500/25 scale-105 ring-4 ring-amber-500/10'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50/50 hover:text-amber-600 hover:border-rose-300/80 hover:scale-105 hover:shadow-md hover:shadow-amber-500/5 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-amber-950/20 dark:hover:text-amber-400 dark:hover:border-amber-900/40'
                    }`}>
                    <Icon name={getRecipientIcon(rec.slug)} size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-orange-600 text-white border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[7px] sm:text-[9px] font-bold animate-scale-up">
                        ✓
                      </span>
                    )}
                  </div>
                  {/* Text Label */}
                  <span className={`text-[9px] sm:text-[10px] font-bold tracking-wide transition-colors text-center leading-tight line-clamp-2 ${isSelected ? 'text-amber-600 dark:text-amber-500' : 'text-slate-500 dark:text-zinc-400 group-hover:text-amber-650 dark:group-hover:text-amber-500'
                    }`}>
                    {rec.slug === '' ? t('home.products.all_recipients') : rec.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product List Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 border border-slate-200 dark:border-zinc-800/60 space-y-3 sm:space-y-4 animate-pulse"
            >
              <div className="bg-slate-200 dark:bg-zinc-850 aspect-square w-full rounded-xl sm:rounded-2xl" />
              <div className="h-4 bg-slate-200 dark:bg-zinc-850 w-2/3 rounded-lg" />
              <div className="h-4 bg-slate-200 dark:bg-zinc-850 w-1/3 rounded-lg" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 text-center py-20 px-6 rounded-[32px] border border-slate-200 dark:border-zinc-800/60 space-y-5 shadow-sm">
          <span className="text-slate-300 dark:text-zinc-700 block animate-bounce flex justify-center">
            <Icon name="🎁" size={56} />
          </span>
          <h3 className="font-extrabold text-lg text-slate-700 dark:text-zinc-300">
            {t('home.products.no_products')}
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
            {t('home.products.no_products_desc')}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedOccasion('');
              setSelectedRecipient('');
            }}
            className="mt-4 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 text-white font-bold py-3 px-8 rounded-2xl text-xs transition-all cursor-pointer shadow-sm active:scale-98"
          >
            {t('home.products.clear_filters')}
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {/* Cursor Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold py-3.5 px-10 rounded-2xl text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer hover:border-slate-300"
              >
                {loadingMore ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500" />
                    {t('home.products.loading_more')}
                  </>
                ) : (
                  <span className="flex items-center gap-1.5">
                    {t('home.products.load_more')} <Icon name="⏳" size={14} />
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      )}


    </section>
  );
}
