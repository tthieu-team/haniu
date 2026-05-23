'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/product';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/product/QuickViewModal';
import Icon from '@/components/common/Icons';

// Modular Subcomponents
import FilterSidebar from './components/FilterSidebar';
import FilterDrawer from './components/FilterDrawer';
import ProductToolbar from './components/ProductToolbar';
import SkeletonCard from './components/SkeletonCard';

// Rich Mock Catalog Data for full offline fallback
const MOCK_CATALOG_PRODUCTS = [
  {
    id: "m1",
    name: "Hộp Quà Lãng Mạn - Eternal Love Special Edition",
    slug: "hop-qua-lang-man-eternal-love",
    sku: "GIFT-EL-001",
    description: "Set quà tặng cao cấp gồm hoa sáp thơm, ly sứ khắc tên, thiệp viết tay và đèn LED trang trí lãng mạn.",
    basePrice: 590000,
    salePrice: 490000,
    stock: 50,
    isFeatured: true,
    isNew: true,
    isCustomizable: true,
    category: { name: "Combo Quà Tặng", slug: "combo-qua-tang" },
    media: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m2",
    name: "Sổ Tay Da Thật Khắc Tên Cá Nhân Hóa",
    slug: "so-tay-da-that-khac-ten",
    sku: "GIFT-NB-002",
    description: "Sổ bìa da bò thật cao cấp, giấy nhám kraft vintage, hỗ trợ khắc laze tên và lời chúc ý nghĩa theo yêu cầu.",
    basePrice: 350000,
    stock: 120,
    isFeatured: true,
    isNew: false,
    isCustomizable: true,
    category: { name: "Sổ Da & Bút", slug: "so-da-but" },
    media: [{ url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m3",
    name: "Ly Sứ Cao Cấp Vẽ Tay - Men Hỏa Biến",
    slug: "ly-su-men-hoa-bien",
    sku: "GIFT-MUG-003",
    description: "Ly sứ Bát Tràng tráng men hỏa biến độc bản, chế tác tinh xảo, màu sắc biến đổi theo nhiệt độ lò.",
    basePrice: 220000,
    salePrice: 180000,
    stock: 200,
    isFeatured: false,
    isNew: true,
    isCustomizable: false,
    category: { name: "Ly Sứ", slug: "ly-su" },
    media: [{ url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m4",
    name: "Set Quà Lưu Niệm Đồ Gỗ Bản Đồ Việt Nam",
    slug: "tranh-go-ban-do-viet-nam",
    sku: "GIFT-WOOD-004",
    description: "Tranh khắc gỗ 3D Bản đồ Việt Nam đầy đủ Hoàng Sa, Trường Sa, sử dụng chất liệu gỗ tự nhiên sơn dầu bảo vệ.",
    basePrice: 1200000,
    salePrice: 950000,
    stock: 15,
    isFeatured: true,
    isNew: true,
    isCustomizable: true,
    category: { name: "Đồ Lưu Niệm", slug: "do-luu-niem" },
    media: [{ url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m5",
    name: "Bút Ký Kim Loại Khắc Tên Mạ Vàng Lux",
    slug: "but-ky-kim-loai-khac-ten",
    sku: "GIFT-PEN-005",
    description: "Bút dạ bi kim loại mạ vàng sang trọng, nét mực trơn tru, đi kèm hộp nhung lót lụa cao cấp làm quà tặng doanh nghiệp.",
    basePrice: 290000,
    stock: 80,
    isFeatured: false,
    isNew: false,
    isCustomizable: true,
    category: { name: "Sổ Da & Bút", slug: "so-da-but" },
    media: [{ url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m6",
    name: "Cốc Giữ Nhiệt Laze Khắc Logo Hộp Sang Trọng",
    slug: "coc-giu-nhiet-khac-logo",
    sku: "GIFT-MUG-006",
    description: "Ly giữ nhiệt thép không gỉ 304 dung tích 500ml, giữ nóng lạnh 12 giờ, hỗ trợ thiết kế khắc laze tên hoặc logo doanh nghiệp.",
    basePrice: 280000,
    salePrice: 240000,
    stock: 150,
    isFeatured: false,
    isNew: true,
    isCustomizable: true,
    category: { name: "Ly Sứ", slug: "ly-su" },
    media: [{ url: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m7",
    name: "Set Hộp Trà Cao Cấp Gỗ Hương Tự Nhiên",
    slug: "set-hop-tra-go-huong",
    sku: "GIFT-TEA-007",
    description: "Hộp đựng trà chế tác thủ công từ gỗ hương đỏ nguyên khối, mùi thơm tự nhiên kết hợp cùng trà ô long thượng hạng.",
    basePrice: 750000,
    stock: 35,
    isFeatured: true,
    isNew: false,
    isCustomizable: false,
    category: { name: "Đồ Lưu Niệm", slug: "do-luu-niem" },
    media: [{ url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m8",
    name: "Album Ảnh Gỗ Gấp Gọn Lưu Giữ Kỷ Niệm",
    slug: "album-anh-go-luu-niem",
    sku: "GIFT-ALB-008",
    description: "Album ảnh trang bìa gỗ ép cao cấp, ruột giấy mỹ thuật đen dày dặn, tặng kèm decal góc dán ảnh và bút nhũ viết lời chúc.",
    basePrice: 420000,
    salePrice: 380000,
    stock: 90,
    isFeatured: true,
    isNew: false,
    isCustomizable: true,
    category: { name: "Đồ Lưu Niệm", slug: "do-luu-niem" },
    media: [{ url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  }
];

const CATEGORIES = [
  { name: 'Tất cả danh mục', slug: '' },
  { name: 'Combo Quà Tặng', slug: 'combo-qua-tang' },
  { name: 'Sổ Da & Bút', slug: 'so-da-but' },
  { name: 'Ly Sứ', slug: 'ly-su' },
  { name: 'Đồ Lưu Niệm', slug: 'do-luu-niem' }
];

const SORT_OPTIONS = [
  { name: 'Mới nhất', value: 'newest' },
  { name: 'Giá tăng dần', value: 'price-asc' },
  { name: 'Giá giảm dần', value: 'price-desc' },
  { name: 'Phổ biến/Bán chạy', value: 'sales' }
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search parameters mapping
  const paramSearch = searchParams.get('search') || '';
  const paramCat = searchParams.get('category') || '';
  const paramSort = searchParams.get('sort') || 'newest';

  // Zustand Store binding
  const storeProducts = useProductStore((state) => state.products);
  const fetchStoreProducts = useProductStore((state) => state.fetchProducts);
  const searchStoreProducts = useProductStore((state) => state.searchProducts);

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Filter conditions states
  const [searchQuery, setSearchQuery] = useState(paramSearch);
  const [selectedCat, setSelectedCat] = useState(paramCat);
  const [sortOption, setSortOption] = useState(paramSort);
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');

  // Fallback to Mock Catalog Data if store is empty
  const products = storeProducts.length > 0 ? storeProducts : MOCK_CATALOG_PRODUCTS;

  // Synchronize URL search params
  useEffect(() => {
    setSearchQuery(paramSearch);
    setSelectedCat(paramCat);
    setSortOption(paramSort);
  }, [paramSearch, paramCat, paramSort]);

  // Load products from Zustand store
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (selectedCat) {
        filters.categoryId = selectedCat;
      }
      if (sortOption === 'price-asc') {
        filters.sortBy = 'basePrice';
        filters.sortDir = 'asc';
      } else if (sortOption === 'price-desc') {
        filters.sortBy = 'basePrice';
        filters.sortDir = 'desc';
      }

      if (searchQuery.trim()) {
        await searchStoreProducts(searchQuery, 0, 40);
      } else {
        await fetchStoreProducts(filters);
      }
    } catch (error) {
      console.error("Zustand store fetch failed:", error);
    } finally {
      // Soft skeleton rendering duration
      setTimeout(() => setLoading(false), 450);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCat, sortOption]);

  // Advanced client-side filtering logic (handles complex tags that backend might lack)
  const filteredProducts = products.filter((product: any) => {
    // 1. Category Filter
    if (selectedCat && product.category?.slug !== selectedCat && product.category?.id !== selectedCat) {
      return false;
    }
    // 2. Customizable check
    if (customizableOnly && !product.isCustomizable) {
      return false;
    }
    // 3. Price range check
    const currentPrice = product.salePrice || product.basePrice || 0;
    if (priceMin !== '' && currentPrice < priceMin) {
      return false;
    }
    if (priceMax !== '' && currentPrice > priceMax) {
      return false;
    }
    // 4. Client Search Query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name?.toLowerCase().includes(q);
      const matchDesc = product.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  // Client side sorting logic (as helper)
  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    const priceA = a.salePrice || a.basePrice || 0;
    const priceB = b.salePrice || b.basePrice || 0;

    if (sortOption === 'price-asc') return priceA - priceB;
    if (sortOption === 'price-desc') return priceB - priceA;
    if (sortOption === 'sales') return b.stock - a.stock;
    return b.id.localeCompare(a.id);
  });

  const clearAllFilters = () => {
    setSelectedCat('');
    setSearchQuery('');
    setCustomizableOnly(false);
    setPriceMin('');
    setPriceMax('');
    setSortOption('newest');
    router.push('/products');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCat) params.set('category', selectedCat);
    params.set('sort', sortOption);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="w-full py-20 relative overflow-hidden font-sans min-h-screen">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-400 dark:text-zinc-500 mb-6 flex items-center gap-1.5 font-light">
        <Link href="/" className="hover:text-rose-500 transition-colors">Trang chủ</Link>
        <span>&gt;</span>
        <span className="text-slate-600 dark:text-zinc-300 font-normal">Bộ sưu tập quà tặng</span>
      </nav>

      {/* Hero Category Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-6 mb-8 gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-800 dark:text-zinc-100 tracking-tight uppercase">
            {CATEGORIES.find(c => c.slug === selectedCat)?.name || 'Bộ Sưu Tập Quà Tặng'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-light max-w-xl leading-relaxed">
            Khám phá thế giới quà tặng thủ công được chế tác tỉ mỉ, hỗ trợ cá nhân hóa khắc tên và thiết kế riêng biệt gửi trọn tâm ý của bạn.
          </p>
        </div>
        <div className="text-xs text-slate-400 dark:text-zinc-500 font-light whitespace-nowrap self-start md:self-end bg-slate-50 dark:bg-zinc-900/40 px-4 py-2 rounded-full border border-slate-100 dark:border-zinc-800/80">
          Hiển thị <span className="font-semibold text-slate-700 dark:text-zinc-200">{sortedProducts.length}</span> sản phẩm
        </div>
      </div>

      {/* Main Catalog View Grid */}
      <div className="flex flex-col lg:flex-row gap-8 relative items-start">
        
        {/* 1. Desktop Sticky Filter Sidebar */}
        <FilterSidebar
          selectedCat={selectedCat}
          setSelectedCat={setSelectedCat}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          customizableOnly={customizableOnly}
          setCustomizableOnly={setCustomizableOnly}
          priceMin={priceMin}
          setPriceMin={setPriceMin}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          clearAllFilters={clearAllFilters}
          handleSearchSubmit={handleSearchSubmit}
          categories={CATEGORIES}
        />

        {/* 2. Product Area (Toolbar + Grid) */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Sticky Toolbar bar */}
          <ProductToolbar
            onOpenFilters={() => setMobileFilterOpen(true)}
            sortOption={sortOption}
            setSortOption={setSortOption}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortOptions={SORT_OPTIONS}
          />

          {/* Product Grid Area */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 bg-slate-50/50 dark:bg-zinc-900/10 rounded-[32px] border border-dashed border-slate-200 dark:border-zinc-850">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center shadow-xs">
                <Icon name="search" size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-zinc-150">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-light max-w-sm">
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc để tìm sản phẩm mong muốn.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="bg-rose-500 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-md hover:bg-rose-600 active:scale-98 transition-all cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* List View mode */
            <div className="space-y-4">
              {sortedProducts.map((product: any) => (
                <div 
                  key={product.id}
                  className="group bg-white dark:bg-zinc-900 rounded-[28px] border border-slate-100 dark:border-zinc-800/80 p-5 flex flex-col sm:flex-row gap-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="w-full sm:w-44 aspect-square bg-slate-50 dark:bg-zinc-950 rounded-2xl overflow-hidden shrink-0 relative">
                    <img 
                      src={product.media?.[0]?.url || 'https://via.placeholder.com/300'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  </div>
                  {/* Info details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-rose-500 tracking-wider">
                        {product.category?.name}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-800 dark:text-zinc-150 hover:text-rose-500 transition-colors">
                        <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-zinc-500 font-light line-clamp-2 max-w-xl">
                        {product.description}
                      </p>
                    </div>
                    {/* Price and buy details */}
                    <div className="flex items-end justify-between pt-4 sm:pt-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-rose-500">
                          {(product.salePrice || product.basePrice || 0).toLocaleString('vi-VN')}đ
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {(product.basePrice || 0).toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="bg-slate-50 dark:bg-zinc-800 hover:bg-rose-50 text-slate-600 dark:text-zinc-300 dark:hover:text-rose-400 p-2.5 rounded-xl border border-slate-200/50 dark:border-zinc-800/80 transition-all cursor-pointer"
                          title="Xem nhanh"
                        >
                          <Icon name="eye" size={13} />
                        </button>
                        <Link 
                          href={`/products/${product.slug}`}
                          className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-98"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Standard Grid view mode */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}

          {/* Simple load more hybrid pagination */}
          {sortedProducts.length > 0 && (
            <div className="pt-8 text-center">
              <span className="inline-block text-xs text-slate-400 dark:text-zinc-500 font-light mb-3 block">
                Đang hiển thị {sortedProducts.length} / {products.length} sản phẩm
              </span>
              <button
                disabled={loading}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300 font-bold px-8 py-3.5 rounded-2xl text-xs shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
              >
                Tải thêm sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Mobile Filter Drawer / Bottom Sheet */}
      <FilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        selectedCat={selectedCat}
        setSelectedCat={setSelectedCat}
        customizableOnly={customizableOnly}
        setCustomizableOnly={setCustomizableOnly}
        priceMin={priceMin}
        setPriceMin={setPriceMin}
        priceMax={priceMax}
        setPriceMax={setPriceMax}
        clearAllFilters={clearAllFilters}
        categories={CATEGORIES}
      />

      {/* Reusable Quick View Modal Component */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
