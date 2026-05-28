'use client';

import { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { catalogService, Collection } from '@/services/catalog.service';
import { productService } from '@/services/product.service';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/product/QuickViewModal';
import Icon from '@/components/common/Icons';
import { getFullImageUrl } from '@/lib/api';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

function CollectionContent({ params }: CollectionPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort States
  const [sortOption, setSortOption] = useState('newest');
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Fetch Collection and its products
  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Fetch collection details
        const collectionData = await catalogService.getCollectionBySlug(slug);
        setCollection(collectionData);

        if (collectionData && collectionData.id) {
          // 2. Fetch products in this collection
          // We can fetch up to 40 products for this collection page
          let sortBy = 'createdAt';
          let sortDir = 'desc';
          if (sortOption === 'price-asc') {
            sortBy = 'price';
            sortDir = 'asc';
          } else if (sortOption === 'price-desc') {
            sortBy = 'price';
            sortDir = 'desc';
          } else if (sortOption === 'sales') {
            sortBy = 'totalSold';
            sortDir = 'desc';
          }

          const productsData = await productService.getProducts({
            collectionId: collectionData.id,
            sortBy,
            sortDir,
            size: 40,
            status: 'PUBLISHED'
          });

          setProducts(productsData?.content || []);
        }
      } catch (err: any) {
        console.error('Error fetching collection:', err);
        setError(err.message || 'Không thể tải thông tin bộ sưu tập.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [slug, sortOption]);

  // Set Page Title for SEO
  useEffect(() => {
    if (collection) {
      document.title = `${collection.name} | Haniu Curated Series`;
    }
  }, [collection]);

  // Filter products client-side for extra properties if needed
  const filteredProducts = products.filter((product) => {
    if (customizableOnly && !product.isCustomizable) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-color mb-4" />
        <p className="text-xs text-muted-color font-medium uppercase tracking-wider">Đang tải bộ sưu tập...</p>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-color/10 text-primary-color flex items-center justify-center text-2xl mb-4">
          <Icon name="alert-triangle" size={28} />
        </div>
        <h2 className="text-xl font-black text-foreground mb-2">Không tìm thấy Bộ sưu tập</h2>
        <p className="text-xs text-muted-color max-w-sm mb-6 leading-relaxed">
          Đường dẫn không tồn tại hoặc bộ sưu tập đã bị ẩn. Vui lòng quay lại trang chủ.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-primary-color hover:bg-primary-color/90 text-white font-bold rounded-xl shadow-md shadow-primary-color/20 text-xs active:scale-95 transition-all"
        >
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const hasBanner = !!collection.bannerUrl;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden w-full h-[32vh] md:h-[42vh] flex items-center justify-center text-center">
        {/* Background Image / Gradient */}
        {hasBanner ? (
          <>
            <img
              src={getFullImageUrl(collection.bannerUrl)}
              alt={collection.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark premium overlay with theme background fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-color/20 via-card-bg to-accent-color/30" />
        )}

        {/* Decorative Grid Dots */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Banner Details */}
        <div className="relative z-15 px-4 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-primary-color bg-primary-color/10 border border-primary-color/25">
            <Icon name="✨" size={10} className="animate-pulse" /> Curated Series
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground uppercase drop-shadow-md">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-xs md:text-sm text-muted-color font-light max-w-xl mx-auto leading-relaxed drop-shadow-sm">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* 2. BREADCRUMBS & FILTERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Breadcrumbs Navigation */}
        <nav className="text-xs text-muted-color mb-6 flex items-center gap-1.5 font-medium">
          <Link href="/" className="hover:text-primary-color transition-colors">Trang chủ</Link>
          <span>&gt;</span>
          <span className="text-muted-color">Bộ sưu tập</span>
          <span>&gt;</span>
          <span className="text-primary-color font-bold">{collection.name}</span>
        </nav>

        {/* Filtering & Sorting Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-card-bg border border-border-color p-4 rounded-2xl md:rounded-[28px] shadow-xs mb-8">
          
          {/* Total products count & filter active tags */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-foreground">
              Có {filteredProducts.length} sản phẩm
            </span>
            <div className="h-4 w-px bg-border-color" />
            
            {/* Customizable Filter Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={customizableOnly}
                onChange={(e) => setCustomizableOnly(e.target.checked)}
                className="rounded border-border-color text-primary-color focus:ring-primary-color w-4 h-4 cursor-pointer"
              />
              <span className="text-[11px] font-bold text-muted-color">Khắc tên theo yêu cầu</span>
            </label>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 font-bold text-xs">
            <span className="text-muted-color font-semibold shrink-0">Sắp xếp:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-background border border-border-color hover:border-primary-color/50 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary-color cursor-pointer transition-all"
            >
              <option value="newest">Mới nhất</option>
              <option value="sales">Bán chạy nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {/* 3. PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="bg-card-bg border border-border-color rounded-[32px] p-16 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-background border border-border-color flex items-center justify-center text-2xl mx-auto">
              <Icon name="gift" size={28} />
            </div>
            <h3 className="text-base font-extrabold text-foreground">Không có sản phẩm nào</h3>
            <p className="text-xs text-muted-color max-w-sm mx-auto leading-relaxed">
              Bộ sưu tập hiện chưa có sản phẩm nào phù hợp với bộ lọc đã chọn. Vui lòng quay lại sau.
            </p>
            <button
              onClick={() => { setCustomizableOnly(false); }}
              className="px-5 py-2.5 bg-primary-color hover:bg-primary-color/90 text-white font-bold rounded-xl shadow-md shadow-primary-color/20 text-xs active:scale-95 transition-all cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  basePrice: product.basePrice || product.price
                }}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick view modal details */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
}

export default function CollectionPage({ params }: CollectionPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-color" />
      </div>
    }>
      <CollectionContent params={params} />
    </Suspense>
  );
}
