'use client';

import Icon from '@/components/common/Icons';

export interface FilterSidebarProps {
  selectedCat: string;
  setSelectedCat: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  customizableOnly: boolean;
  setCustomizableOnly: (val: boolean) => void;
  priceMin: number | '';
  setPriceMin: (val: number | '') => void;
  priceMax: number | '';
  setPriceMax: (val: number | '') => void;
  clearAllFilters: () => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  categories: Array<{ name: string; slug: string }>;
}

export default function FilterSidebar({
  selectedCat,
  setSelectedCat,
  searchQuery,
  setSearchQuery,
  customizableOnly,
  setCustomizableOnly,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  clearAllFilters,
  handleSearchSubmit,
  categories,
}: FilterSidebarProps) {
  const hasActiveFilters = selectedCat || searchQuery || customizableOnly || priceMin !== '' || priceMax !== '';

  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-24 space-y-8 bg-white dark:bg-zinc-950 p-6 rounded-[28px] border border-slate-100 dark:border-zinc-850 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-zinc-100 uppercase tracking-widest">Bộ lọc</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-[10px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Search box within filters */}
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Tìm kiếm</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-zinc-900 rounded-xl px-3 py-2.5 pr-8 border border-slate-100 dark:border-zinc-800/60 focus:outline-none focus:border-rose-500 text-slate-700 dark:text-zinc-200 font-light"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500">
            <Icon name="search" size={13} />
          </button>
        </div>
      </form>

      {/* Category List */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Danh mục</label>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCat(cat.slug)}
              className={`text-left text-xs px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                selectedCat === cat.slug
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400'
              }`}
            >
              <span>{cat.name}</span>
              {selectedCat === cat.slug && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Customization Toggle */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Dịch vụ</label>
        <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
          <input
            type="checkbox"
            checked={customizableOnly}
            onChange={(e) => setCustomizableOnly(e.target.checked)}
            className="rounded text-rose-500 focus:ring-rose-500 accent-rose-500"
          />
          <span className="text-xs text-slate-600 dark:text-zinc-300 font-medium">Khắc tên / Lời chúc</span>
        </label>
      </div>

      {/* Price Filters */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Khoảng giá (VNĐ)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-1/2 text-xs bg-slate-50 dark:bg-zinc-900 rounded-xl px-2.5 py-2 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 focus:outline-none"
          />
          <span className="text-slate-300">-</span>
          <input
            type="number"
            placeholder="Đến"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-1/2 text-xs bg-slate-50 dark:bg-zinc-900 rounded-xl px-2.5 py-2 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 focus:outline-none"
          />
        </div>
      </div>
    </aside>
  );
}
