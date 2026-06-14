'use client';

import { useState } from 'react';
import Icon from '@/components/common/Icons';
import { Category, Brand, Collection, Occasion } from '@/services/catalog.service';
import { useTranslate } from '@/lib/translator';

export interface FilterSidebarProps {
  selectedCat: string;
  setSelectedCat: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedCollection: string;
  setSelectedCollection: (coll: string) => void;
  selectedOccasion: string;
  setSelectedOccasion: (occ: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  customizableOnly: boolean;
  setCustomizableOnly: (val: boolean) => void;
  adminChatOnly: boolean;
  setAdminChatOnly: (val: boolean) => void;
  photoboothOnly: boolean;
  setPhotoboothOnly: (val: boolean) => void;
  featuredOnly: boolean;
  setFeaturedOnly: (val: boolean) => void;
  newOnly: boolean;
  setNewOnly: (val: boolean) => void;
  priceMin: number | '';
  setPriceMin: (val: number | '') => void;
  priceMax: number | '';
  setPriceMax: (val: number | '') => void;
  clearAllFilters: () => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  categories: Category[];
  brands: Brand[];
  collections: Collection[];
  occasions: Occasion[];
}

export default function FilterSidebar({
  selectedCat,
  setSelectedCat,
  selectedBrand,
  setSelectedBrand,
  selectedCollection,
  setSelectedCollection,
  selectedOccasion,
  setSelectedOccasion,
  searchQuery,
  setSearchQuery,
  customizableOnly,
  setCustomizableOnly,
  adminChatOnly,
  setAdminChatOnly,
  photoboothOnly,
  setPhotoboothOnly,
  featuredOnly,
  setFeaturedOnly,
  newOnly,
  setNewOnly,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  clearAllFilters,
  handleSearchSubmit,
  categories,
  brands,
  collections,
  occasions,
}: FilterSidebarProps) {
  const trans = useTranslate();
  const [expanded, setExpanded] = useState({
    categories: true,
    brands: true,
    collections: true,
    occasions: true,
    price: true,
    service: true,
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters =
    selectedCat ||
    selectedBrand ||
    selectedCollection ||
    selectedOccasion ||
    searchQuery ||
    customizableOnly ||
    priceMin !== '' ||
    priceMax !== '';

  const activeQuickPrice = () => {
    if (priceMin === '' && priceMax === '') return 'all';
    if (priceMin === '' && priceMax === 200000) return 'under-200';
    if (priceMin === 200000 && priceMax === 500000) return '200-500';
    if (priceMin === 500000 && priceMax === 1000000) return '500-1000';
    if (priceMin === 1000000 && priceMax === '') return 'over-1000';
    return 'custom';
  };

  const setQuickPrice = (type: string) => {
    switch (type) {
      case 'all':
        setPriceMin('');
        setPriceMax('');
        break;
      case 'under-200':
        setPriceMin('');
        setPriceMax(200000);
        break;
      case '200-500':
        setPriceMin(200000);
        setPriceMax(500000);
        break;
      case '500-1000':
        setPriceMin(500000);
        setPriceMax(1000000);
        break;
      case 'over-1000':
        setPriceMin(1000000);
        setPriceMax('');
        break;
    }
  };

  return (
    <aside className="hidden lg:block w-72 shrink-0 sticky top-24 space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-[32px] border border-slate-200/60 dark:border-zinc-800 shadow-sm shadow-slate-100/50 dark:shadow-none">
      {/* Title & Clear Filters Button */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Icon name="filter" size={14} className="text-rose-500" />
          <h3 className="font-black text-xs text-slate-800 dark:text-zinc-100 uppercase tracking-widest">
            {trans('Bộ lọc tìm kiếm')}
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 rounded-full"
          >
            {trans('Xóa tất cả')}
          </button>
        )}
      </div>

      {/* 1. Keyword Search */}
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
          {trans('Tìm kiếm từ khóa')}
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={trans('Nhập tên quà tặng...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-3 pr-10 border border-slate-100 dark:border-zinc-800/80 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-zinc-950 text-slate-700 dark:text-zinc-200 transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Icon name="close" size={12} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-455 hover:text-rose-500 transition-colors"
          >
            <Icon name="search" size={13} />
          </button>
        </div>
      </form>

      {/* 2. Categories Accordion */}
      <div className="border-b border-slate-100 dark:border-zinc-800/60 pb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between py-2 text-left focus:outline-none cursor-pointer"
        >
          <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            {trans('Danh mục quà tặng')} ({categories.length})
          </span>
          <span className={`text-slate-455 transition-transform duration-300 ${expanded.categories ? 'rotate-180' : ''}`}>
            <Icon name="chevron-down" size={12} />
          </span>
        </button>
        {expanded.categories && (
          <div className="flex flex-col gap-1 mt-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            <button
              onClick={() => setSelectedCat('')}
              className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                selectedCat === ''
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-slate-650 dark:text-zinc-350 font-medium'
              }`}
            >
              <span>{trans('Tất cả danh mục')}</span>
              {selectedCat === '' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            </button>
            {categories.map((cat) => {
              const isActive = selectedCat === cat.id || selectedCat === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id || cat.slug)}
                  className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-slate-650 dark:text-zinc-350 font-medium'
                  }`}
                >
                  <span className="truncate pr-2">{trans(cat.name)}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Occasions Accordion */}
      {occasions.length > 0 && (
        <div className="border-b border-slate-100 dark:border-zinc-800/60 pb-4">
          <button
            onClick={() => toggleSection('occasions')}
            className="w-full flex items-center justify-between py-2 text-left focus:outline-none cursor-pointer"
          >
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              {trans('Chọn theo dịp lễ')} ({occasions.length})
            </span>
            <span className={`text-slate-455 transition-transform duration-300 ${expanded.occasions ? 'rotate-180' : ''}`}>
              <Icon name="chevron-down" size={12} />
            </span>
          </button>
          {expanded.occasions && (
            <div className="flex flex-col gap-1 mt-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              <button
                onClick={() => setSelectedOccasion('')}
                className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                  selectedOccasion === ''
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-slate-650 dark:text-zinc-350 font-medium'
                }`}
              >
                <span>{trans('Tất cả dịp lễ')}</span>
                {selectedOccasion === '' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
              </button>
              {occasions.map((occ) => {
                const isActive = selectedOccasion === occ.slug || selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.slug || occ.id || '')}
                    className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-slate-650 dark:text-zinc-350 font-medium'
                    }`}
                  >
                    <span className="truncate pr-2">{trans(occ.name)}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Brands Accordion */}
      {brands.length > 0 && (
        <div className="border-b border-slate-100 dark:border-zinc-800/60 pb-4">
          <button
            onClick={() => toggleSection('brands')}
            className="w-full flex items-center justify-between py-2 text-left focus:outline-none cursor-pointer"
          >
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              {trans('Thương hiệu')} ({brands.length})
            </span>
            <span className={`text-slate-455 transition-transform duration-300 ${expanded.brands ? 'rotate-180' : ''}`}>
              <Icon name="chevron-down" size={12} />
            </span>
          </button>
          {expanded.brands && (
            <div className="flex flex-col gap-1 mt-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              <button
                onClick={() => setSelectedBrand('')}
                className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                  selectedBrand === ''
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-slate-650 dark:text-zinc-350 font-medium'
                }`}
              >
                <span>{trans('Tất cả thương hiệu')}</span>
                {selectedBrand === '' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
              </button>
              {brands.map((brand) => {
                const isActive = selectedBrand === brand.id || selectedBrand === brand.slug;
                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id || brand.slug)}
                    className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-slate-650 dark:text-zinc-350 font-medium'
                    }`}
                  >
                    <span className="truncate pr-2">{trans(brand.name)}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Collections Accordion */}
      {collections.length > 0 && (
        <div className="border-b border-slate-100 dark:border-zinc-800/60 pb-4">
          <button
            onClick={() => toggleSection('collections')}
            className="w-full flex items-center justify-between py-2 text-left focus:outline-none cursor-pointer"
          >
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              {trans('Bộ sưu tập')} ({collections.length})
            </span>
            <span className={`text-slate-455 transition-transform duration-300 ${expanded.collections ? 'rotate-180' : ''}`}>
              <Icon name="chevron-down" size={12} />
            </span>
          </button>
          {expanded.collections && (
            <div className="flex flex-col gap-1 mt-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              <button
                onClick={() => setSelectedCollection('')}
                className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                  selectedCollection === ''
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-slate-650 dark:text-zinc-350 font-medium'
                }`}
              >
                <span>{trans('Tất cả bộ sưu tập')}</span>
                {selectedCollection === '' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
              </button>
              {collections.map((coll) => {
                const isActive = selectedCollection === coll.id || selectedCollection === coll.slug;
                return (
                  <button
                    key={coll.id}
                    onClick={() => setSelectedCollection(coll.id || coll.slug)}
                    className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60 text-slate-650 dark:text-zinc-350 font-medium'
                    }`}
                  >
                    <span className="truncate pr-2">{trans(coll.name)}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Customization Toggle */}
      <div className="border-b border-slate-100 dark:border-zinc-800/60 pb-4">
        <button
          onClick={() => toggleSection('service')}
          className="w-full flex items-center justify-between py-2 text-left focus:outline-none cursor-pointer"
        >
          <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            {trans('Dịch vụ cá nhân hóa')}
          </span>
          <span className={`text-slate-455 transition-transform duration-300 ${expanded.service ? 'rotate-180' : ''}`}>
            <Icon name="chevron-down" size={12} />
          </span>
        </button>
        {expanded.service && (
          <div className="mt-2.5 space-y-2">
            <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all select-none">
              <input
                type="checkbox"
                checked={customizableOnly}
                onChange={(e) => setCustomizableOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 accent-rose-500 cursor-pointer"
              />
              <span className="text-xs text-slate-655 dark:text-zinc-300 font-semibold">
                {trans('Cho phép Khắc tên / Cá nhân hóa quà')}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all select-none">
              <input
                type="checkbox"
                checked={adminChatOnly}
                onChange={(e) => setAdminChatOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 accent-rose-500 cursor-pointer"
              />
              <span className="text-xs text-slate-655 dark:text-zinc-300 font-semibold">
                {trans('Có thể chat với Admin')}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all select-none">
              <input
                type="checkbox"
                checked={photoboothOnly}
                onChange={(e) => setPhotoboothOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 accent-rose-500 cursor-pointer"
              />
              <span className="text-xs text-slate-655 dark:text-zinc-300 font-semibold">
                {trans('Studio Photobooth Haniu - In ảnh tặng kèm')}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all select-none">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 accent-rose-500 cursor-pointer"
              />
              <span className="text-xs text-slate-655 dark:text-zinc-300 font-semibold">
                {trans('Sản phẩm Nổi bật (Featured)')}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all select-none">
              <input
                type="checkbox"
                checked={newOnly}
                onChange={(e) => setNewOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 accent-rose-500 cursor-pointer"
              />
              <span className="text-xs text-slate-655 dark:text-zinc-300 font-semibold">
                {trans('Sản phẩm mới (New)')}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* 6. Price Filters Accordion */}
      <div className="pb-2">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-2 text-left focus:outline-none cursor-pointer"
        >
          <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            {trans('Khoảng giá (VNĐ)')}
          </span>
          <span className={`text-slate-455 transition-transform duration-300 ${expanded.price ? 'rotate-180' : ''}`}>
            <Icon name="chevron-down" size={12} />
          </span>
        </button>
        {expanded.price && (
          <div className="space-y-4 mt-3">
            {/* Quick Price Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQuickPrice('under-200')}
                className={`text-[10px] py-2 px-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  activeQuickPrice() === 'under-200'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-200/60 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                {trans('Dưới 200k')}
              </button>
              <button
                type="button"
                onClick={() => setQuickPrice('200-500')}
                className={`text-[10px] py-2 px-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  activeQuickPrice() === '200-500'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-200/60 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                {trans('200k - 500k')}
              </button>
              <button
                type="button"
                onClick={() => setQuickPrice('500-1000')}
                className={`text-[10px] py-2 px-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  activeQuickPrice() === '500-1000'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-200/60 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                {trans('500k - 1M')}
              </button>
              <button
                type="button"
                onClick={() => setQuickPrice('over-1000')}
                className={`text-[10px] py-2 px-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  activeQuickPrice() === 'over-1000'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-200/60 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                {trans('Trên 1M')}
              </button>
            </div>

            {/* Custom Price Inputs */}
            <div className="flex items-center gap-2">
              <div className="relative w-1/2">
                <input
                  type="number"
                  placeholder={trans('Từ')}
                  value={priceMin}
                  onChange={(e) =>
                    setPriceMin(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full text-[11px] bg-slate-50 dark:bg-zinc-900 rounded-xl px-2.5 py-2.5 border border-slate-200/60 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-zinc-950 font-medium"
                />
                {priceMin !== '' && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 select-none">
                    đ
                  </span>
                )}
              </div>
              <span className="text-slate-355 dark:text-zinc-650 font-light">-</span>
              <div className="relative w-1/2">
                <input
                  type="number"
                  placeholder={trans('Đến')}
                  value={priceMax}
                  onChange={(e) =>
                    setPriceMax(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full text-[11px] bg-slate-50 dark:bg-zinc-900 rounded-xl px-2.5 py-2.5 border border-slate-200/60 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-zinc-950 font-medium"
                />
                {priceMax !== '' && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 select-none">
                    đ
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
