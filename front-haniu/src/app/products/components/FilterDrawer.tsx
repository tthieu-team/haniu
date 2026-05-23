'use client';

import Icon from '@/components/common/Icons';

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCat: string;
  setSelectedCat: (cat: string) => void;
  customizableOnly: boolean;
  setCustomizableOnly: (val: boolean) => void;
  priceMin: number | '';
  setPriceMin: (val: number | '') => void;
  priceMax: number | '';
  setPriceMax: (val: number | '') => void;
  clearAllFilters: () => void;
  categories: Array<{ name: string; slug: string }>;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  selectedCat,
  setSelectedCat,
  customizableOnly,
  setCustomizableOnly,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  clearAllFilters,
  categories,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
      {/* Backdrop blur overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />
      
      {/* Drawer Box */}
      <div className="relative w-80 max-w-full bg-white dark:bg-zinc-950 h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between border-l border-slate-100 dark:border-zinc-850">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <span className="font-extrabold text-xs text-slate-800 dark:text-zinc-100 uppercase tracking-widest">Bộ lọc nâng cao</span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <Icon name="close" size={16} />
            </button>
          </div>

          {/* Mobile Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Danh mục</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCat(cat.slug)}
                  className={`text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                    selectedCat === cat.slug
                      ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                      : 'border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Customization Toggle Mobile */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Dịch vụ</label>
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40">
              <input
                type="checkbox"
                checked={customizableOnly}
                onChange={(e) => setCustomizableOnly(e.target.checked)}
                className="rounded text-rose-500 focus:ring-rose-500 accent-rose-500"
              />
              <span className="text-xs text-slate-600 dark:text-zinc-300 font-medium">Khắc tên / Bản khắc Laser</span>
            </label>
          </div>

          {/* Price filter Mobile */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Khoảng giá (VNĐ)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-1/2 text-xs bg-slate-50 dark:bg-zinc-900 rounded-xl px-3 py-2 border border-slate-100 dark:border-zinc-800 focus:outline-none"
              />
              <span className="text-slate-300">-</span>
              <input
                type="number"
                placeholder="Đến"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-1/2 text-xs bg-slate-50 dark:bg-zinc-900 rounded-xl px-3 py-2 border border-slate-100 dark:border-zinc-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Mobile apply drawer actions */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex gap-3">
          <button 
            onClick={clearAllFilters}
            className="w-1/3 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 py-3 rounded-xl text-xs font-bold cursor-pointer"
          >
            Xóa lọc
          </button>
          <button 
            onClick={onClose}
            className="w-2/3 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
