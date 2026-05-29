'use client';

import Icon from '@/components/common/Icons';
import { Category, Brand, Collection } from '@/services/catalog.service';

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCat: string;
  setSelectedCat: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedCollection: string;
  setSelectedCollection: (coll: string) => void;
  customizableOnly: boolean;
  setCustomizableOnly: (val: boolean) => void;
  priceMin: number | '';
  setPriceMin: (val: number | '') => void;
  priceMax: number | '';
  setPriceMax: (val: number | '') => void;
  clearAllFilters: () => void;
  categories: Category[];
  brands: Brand[];
  collections: Collection[];
}

export default function FilterDrawer({
  isOpen,
  onClose,
  selectedCat,
  setSelectedCat,
  selectedBrand,
  setSelectedBrand,
  selectedCollection,
  setSelectedCollection,
  customizableOnly,
  setCustomizableOnly,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  clearAllFilters,
  categories,
  brands,
  collections,
}: FilterDrawerProps) {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[100] flex justify-end lg:hidden">
      {/* Backdrop blur overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      />

      {/* Drawer Box */}
      <div className="relative w-80 max-w-full bg-white dark:bg-zinc-950 h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between border-l border-slate-100 dark:border-zinc-850 animate-slideLeft rounded-l-[32px]">
        <div className="space-y-6 flex-1 overflow-y-auto pr-1 pb-4 scrollbar-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-1.5">
              <Icon name="filter" size={14} className="text-rose-500" />
              <span className="font-extrabold text-xs text-slate-800 dark:text-zinc-100 uppercase tracking-widest">
                Bộ lọc nâng cao
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          {/* 1. Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Danh mục quà tặng
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCat('')}
                className={`text-[10px] px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer font-bold ${
                  selectedCat === ''
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-450 hover:bg-slate-50 dark:hover:bg-zinc-900/60'
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => {
                const isActive = selectedCat === cat.id || selectedCat === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id || cat.slug)}
                    className={`text-[10px] px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer font-bold ${
                      isActive
                        ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-450 hover:bg-slate-50 dark:hover:bg-zinc-900/60'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Brands */}
          {brands.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                Thương hiệu
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedBrand('')}
                  className={`text-[10px] px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer font-bold ${
                    selectedBrand === ''
                      ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-450 hover:bg-slate-50 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  Tất cả
                </button>
                {brands.map((brand) => {
                  const isActive = selectedBrand === brand.id || selectedBrand === brand.slug;
                  return (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id || brand.slug)}
                      className={`text-[10px] px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer font-bold ${
                        isActive
                          ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-450 hover:bg-slate-50 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      {brand.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Collections */}
          {collections.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                Bộ sưu tập
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCollection('')}
                  className={`text-[10px] px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer font-bold ${
                    selectedCollection === ''
                      ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-450 hover:bg-slate-50 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  Tất cả
                </button>
                {collections.map((coll) => {
                  const isActive = selectedCollection === coll.id || selectedCollection === coll.slug;
                  return (
                    <button
                      key={coll.id}
                      onClick={() => setSelectedCollection(coll.id || coll.slug)}
                      className={`text-[10px] px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer font-bold ${
                        isActive
                          ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-450 hover:bg-slate-50 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      {coll.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Customizable service */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Dịch vụ
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl border border-slate-100 dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-900/40 select-none">
              <input
                type="checkbox"
                checked={customizableOnly}
                onChange={(e) => setCustomizableOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 accent-rose-500 cursor-pointer"
              />
              <span className="text-xs text-slate-650 dark:text-zinc-300 font-semibold">
                Khắc tên / Lời chúc theo yêu cầu
              </span>
            </label>
          </div>

          {/* 5. Price filter Mobile */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
              Khoảng giá (VNĐ)
            </label>

            {/* Quick Price Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQuickPrice('under-200')}
                className={`text-[10px] py-2 px-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  activeQuickPrice() === 'under-200'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                Dưới 200k
              </button>
              <button
                type="button"
                onClick={() => setQuickPrice('200-500')}
                className={`text-[10px] py-2 px-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  activeQuickPrice() === '200-500'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                200k - 500k
              </button>
              <button
                type="button"
                onClick={() => setQuickPrice('500-1000')}
                className={`text-[10px] py-2 px-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  activeQuickPrice() === '500-1000'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                500k - 1M
              </button>
              <button
                type="button"
                onClick={() => setQuickPrice('over-1000')}
                className={`text-[10px] py-2 px-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  activeQuickPrice() === 'over-1000'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-slate-100 dark:border-zinc-850 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                Trên 1M
              </button>
            </div>

            {/* Custom Inputs */}
            <div className="flex items-center gap-2">
              <div className="relative w-1/2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={priceMin}
                  onChange={(e) =>
                    setPriceMin(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full text-base md:text-sm bg-slate-50 dark:bg-zinc-900 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-zinc-850 text-slate-705 dark:text-zinc-200 focus:outline-none"
                />
                {priceMin !== '' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-455 select-none">
                    đ
                  </span>
                )}
              </div>
              <span className="text-slate-350">-</span>
              <div className="relative w-1/2">
                <input
                  type="number"
                  placeholder="Đến"
                  value={priceMax}
                  onChange={(e) =>
                    setPriceMax(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full text-base md:text-sm bg-slate-50 dark:bg-zinc-900 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-zinc-850 text-slate-705 dark:text-zinc-200 focus:outline-none"
                />
                {priceMax !== '' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-455 select-none">
                    đ
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Apply and clear actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex gap-3 shrink-0">
          <button
            onClick={() => {
              clearAllFilters();
              onClose();
            }}
            className="w-1/3 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 py-3.5 rounded-2xl text-xs font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Hủy lọc
          </button>
          <button
            onClick={onClose}
            className="w-2/3 bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-2xl text-xs font-bold shadow-md shadow-rose-500/10 transition-colors cursor-pointer"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
