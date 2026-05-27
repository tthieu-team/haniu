'use client';

import Icon from '@/components/common/Icons';

interface BasicInfoFormProps {
  name: string;
  setName: (v: string) => void;
  sku: string;
  setSku: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  categories: Array<{ id: string; name: string }>;
  brandId: string;
  setBrandId: (v: string) => void;
  brands: Array<{ id: string; name: string }>;
  collectionId: string;
  setCollectionId: (v: string) => void;
  collections: Array<{ id: string; name: string }>;
  description: string;
  setDescription: (v: string) => void;
  basePrice: number;
  setBasePrice: (v: number) => void;
  salePrice: string | number;
  setSalePrice: (v: any) => void;
  stock: number;
  setStock: (v: number) => void;
  isCustomizable: boolean;
  setIsCustomizable: (v: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (v: boolean) => void;
  isNew: boolean;
  setIsNew: (v: boolean) => void;
  allowAdminChat: boolean;
  setAllowAdminChat: (v: boolean) => void;
  allowPhotoUpload: boolean;
  setAllowPhotoUpload: (v: boolean) => void;
  allowPhotobooth: boolean;
  setAllowPhotobooth: (v: boolean) => void;
}

export default function BasicInfoForm({
  name,
  setName,
  sku,
  setSku,
  slug,
  setSlug,
  categoryId,
  setCategoryId,
  categories,
  brandId,
  setBrandId,
  brands = [],
  collectionId,
  setCollectionId,
  collections = [],
  description,
  setDescription,
  basePrice,
  setBasePrice,
  salePrice,
  setSalePrice,
  stock,
  setStock,
  isCustomizable,
  setIsCustomizable,
  isFeatured,
  setIsFeatured,
  isNew,
  setIsNew,
  allowAdminChat,
  setAllowAdminChat,
  allowPhotoUpload,
  setAllowPhotoUpload,
  allowPhotobooth,
  setAllowPhotobooth,
}: BasicInfoFormProps) {
  const toSlug = (str: string) => {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[^a-z0-9 -]/g, ""); 
    str = str.replace(/\s+/g, "-"); 
    str = str.replace(/-+/g, "-"); 
    return str.trim();
  };

  const generateSku = (nameStr: string) => {
    if (!nameStr) return `HNU-GEN-${Math.floor(1000 + Math.random() * 9000)}`;
    const clean = toSlug(nameStr);
    const words = clean.split('-').filter(Boolean);
    const initials = words.map(w => w[0]).join('').toUpperCase().substring(0, 6);
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `HNU-${initials || 'GIFT'}-${rand}`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2">
        Thông tin cơ bản
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="block text-slate-500">Tên sản phẩm quà tặng *</label>
          <input
            type="text"
            required
            placeholder="VD: Ly sứ vẽ vàng khắc tên"
            value={name || ''}
            onChange={(e) => {
              const val = e.target.value;
              setName(val);
              setSlug(toSlug(val));
              // Auto-set SKU if currently empty
              if (!sku) {
                setSku(generateSku(val));
              }
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-slate-500">Mã SKU định danh *</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="VD: HANIU-MUG-01"
              value={sku || ''}
              onChange={(e) => setSku(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
            />
            <button
              type="button"
              onClick={() => setSku(generateSku(name))}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold rounded-xl border border-slate-200 dark:border-zinc-800 transition-all cursor-pointer text-[10px] flex items-center justify-center shrink-0 active:scale-95"
              title="Tự động sinh mã SKU"
            >
              🔄 Tự sinh
            </button>
          </div>
        </div>
 
        <div className="space-y-2">
          <label className="block text-slate-500">Đường dẫn Slug (Tự động sinh)</label>
          <input
            type="text"
            placeholder="VD: ly-su-khac-ten"
            value={slug || ''}
            onChange={(e) => setSlug(toSlug(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium bg-slate-50 dark:bg-zinc-950 cursor-not-allowed"
            readOnly
          />
        </div>
 
        <div className="space-y-2">
          <label className="block text-slate-500">Danh mục sản phẩm *</label>
          <select
            value={categoryId || ''}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
          >
            <option value="" disabled>Chọn danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-slate-500">Thương hiệu (Brand)</label>
          <select
            value={brandId || ''}
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
          >
            <option value="">Chọn thương hiệu (Tùy chọn)</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-3">
          <label className="block text-slate-500">Bộ sưu tập (Collection)</label>
          <select
            value={collectionId || ''}
            onChange={(e) => setCollectionId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
          >
            <option value="">Chọn bộ sưu tập (Tùy chọn)</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-slate-500">Mô tả quà tặng</label>
        <textarea
          rows={4}
          placeholder="Nhập giới thiệu chi tiết sản phẩm..."
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50 dark:border-zinc-800">
        <div className="space-y-2">
          <label className="block text-slate-500">Giá bán lẻ (đ) *</label>
          <input
            type="number"
            required
            value={basePrice || 0}
            onChange={(e) => setBasePrice(parseFloat(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-semibold"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-slate-500">Giá khuyến mại (Tùy chọn)</label>
          <input
            type="number"
            placeholder="Không giảm giá"
            value={salePrice || ''}
            onChange={(e) => setSalePrice(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-semibold text-rose-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-slate-500">Tồn kho ban đầu *</label>
          <input
            type="number"
            required
            value={stock || 0}
            onChange={(e) => setStock(parseInt(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-50 dark:border-zinc-800">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isCustomizable}
            onChange={(e) => setIsCustomizable(e.target.checked)}
            className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 animate-fade-in"
          />
          <span className="text-slate-600 dark:text-zinc-300 font-bold flex items-center gap-1.5">
            <Icon name="⚙️" size={14} className="text-rose-500" /> Cho phép Khắc tên / Cá nhân hóa quà
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allowAdminChat}
            onChange={(e) => setAllowAdminChat(e.target.checked)}
            className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
          />
          <span className="text-slate-600 dark:text-zinc-300 font-bold flex items-center gap-1.5">
            💬 Có thể chat với Admin
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allowPhotoUpload}
            onChange={(e) => setAllowPhotoUpload(e.target.checked)}
            className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
          />
          <span className="text-slate-600 dark:text-zinc-300 font-bold flex items-center gap-1.5">
            📷 Có thể tải lên ảnh thiết kế
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allowPhotobooth}
            onChange={(e) => setAllowPhotobooth(e.target.checked)}
            className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
          />
          <span className="text-slate-600 dark:text-zinc-300 font-bold flex items-center gap-1.5">
            🖼️ Có thể tải Photobooth bằng ứng dụng
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
          />
          <span className="text-slate-600 dark:text-zinc-300">Sản phẩm Nổi bật (Featured)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
          />
          <span className="text-slate-600 dark:text-zinc-300">Sản phẩm mới (New)</span>
        </label>
      </div>
    </div>
  );
}
