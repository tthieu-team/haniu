'use client';

import { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/product/QuickViewModal';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (!isVisible) return null;

  return (
    <section id="products" className="py-16 space-y-12 scroll-mt-20 font-sans">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-4 py-1.5 rounded-full inline-block">
          BỘ SƯU TẬP ĐỘC QUYỀN
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 dark:text-zinc-100">
          Sản Phẩm Quà Tặng Thiết Kế
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          Khám phá bộ sưu tập quà tặng tinh tế hỗ trợ cá nhân hóa riêng theo thông điệp của bạn
        </p>
      </div>

      {/* Advanced Filters block */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-md border border-slate-100 dark:border-zinc-800/60 space-y-8">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="w-full md:max-w-md relative">
            <input
              type="text"
              placeholder="Tìm quà tặng (VD: ly sứ khắc tên, set quà lãng mạn...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800/80 dark:focus:ring-rose-400 text-xs md:text-sm shadow-sm transition-all text-slate-800 dark:text-zinc-100"
            />
            <span className="absolute left-4 top-[15px] text-slate-400 dark:text-zinc-500">
              <Icon name="Search" size={16} />
            </span>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-700 flex items-center justify-center cursor-pointer"
              >
                <Icon name="close" size={12} />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 dark:text-zinc-500 font-light italic self-end md:self-center">
            Hiển thị <span className="font-semibold text-slate-700 dark:text-zinc-350">{products.length}</span> sản phẩm quà tặng độc đáo
          </div>
        </div>

        {/* Occasions Filters */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-zinc-500 uppercase block">
            Chọn theo dịp lễ
          </span>
          <div className="flex flex-wrap gap-2.5">
            {occasions.map((occ) => {
              const isSelected = selectedOccasion === occ.slug;
              return (
                <button
                  key={occ.slug}
                  onClick={() => setSelectedOccasion(occ.slug)}
                  className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25 scale-[1.02]'
                      : 'bg-slate-50 text-slate-600 border-slate-200/50 hover:bg-slate-100 dark:bg-zinc-800/60 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-700/80'
                  }`}
                >
                  <Icon name={getOccasionIcon(occ.slug)} size={16} />
                  <span>{occ.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipients Filters */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-zinc-500 uppercase block">
            Đối tượng nhận quà
          </span>
          <div className="flex flex-wrap gap-2.5">
            {recipients.map((rec) => {
              const isSelected = selectedRecipient === rec.slug;
              return (
                <button
                  key={rec.slug}
                  onClick={() => setSelectedRecipient(rec.slug)}
                  className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'bg-slate-50 text-slate-600 border-slate-200/50 hover:bg-slate-100 dark:bg-zinc-800/60 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-700/80'
                  }`}
                >
                  <Icon name={getRecipientIcon(rec.slug)} size={16} />
                  <span>{rec.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 rounded-[28px] p-5 border border-slate-100 dark:border-zinc-800/60 space-y-4 animate-pulse"
            >
              <div className="bg-slate-200 dark:bg-zinc-800 h-48 w-full rounded-2xl" />
              <div className="h-4 bg-slate-200 dark:bg-zinc-800 w-2/3 rounded-lg" />
              <div className="h-4 bg-slate-200 dark:bg-zinc-800 w-1/3 rounded-lg" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 text-center py-20 px-6 rounded-[32px] border border-slate-100 dark:border-zinc-800/60 space-y-5 shadow-sm">
          <span className="text-slate-300 dark:text-zinc-700 block animate-bounce flex justify-center">
            <Icon name="🎁" size={56} />
          </span>
          <h3 className="font-extrabold text-lg text-slate-700 dark:text-zinc-300">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-xs text-slate-450 dark:text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
            Vui lòng thử lại bằng cách chọn một dịp khác hoặc gõ từ khóa tìm kiếm mới.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedOccasion('');
              setSelectedRecipient('');
            }}
            className="mt-4 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 text-white font-bold py-3 px-8 rounded-2xl text-xs transition-all cursor-pointer shadow-sm active:scale-98"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={(p) => setQuickViewProduct(p)} 
              />
            ))}
          </div>

          {/* Cursor Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-200 font-bold py-3.5 px-10 rounded-2xl text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer hover:border-slate-300"
              >
                {loadingMore ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500" />
                    Đang tải thêm...
                  </>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Xem thêm sản phẩm quà tặng <Icon name="⏳" size={14} />
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
