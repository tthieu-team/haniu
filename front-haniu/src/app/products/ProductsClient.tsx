'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';
import { useOccasionStore } from '@/store/occasion';

// Modular Subcomponents
import FilterSidebar from './components/FilterSidebar';
import FilterDrawer from './components/FilterDrawer';
import ProductToolbar from './components/ProductToolbar';
import SkeletonCard from './components/SkeletonCard';
import CategoryPillsBar from './components/CategoryPillsBar';
import ActiveFilterTags from './components/ActiveFilterTags';
import EmptyState from './components/EmptyState';
import ProductListSeo from './components/ProductListSeo';
import { MOCK_CATALOG_PRODUCTS, SORT_OPTIONS } from './components/mockProducts';

import { catalogService, Category, Brand, Collection } from '@/services/catalog.service';
import { productService } from '@/services/product.service';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trans = useTranslate();

  // Read URL search params
  const paramSearch = searchParams.get('search') || '';
  const paramCat = searchParams.get('category') || '';
  const paramBrand = searchParams.get('brand') || '';
  const paramCollection = searchParams.get('collection') || '';
  const paramSort = searchParams.get('sort') || 'newest';
  const paramMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : '';
  const paramMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : '';
  const paramCustomizable = searchParams.get('customizable') === 'true';
  const paramAdminChat = searchParams.get('adminChat') === 'true';
  const paramPhotobooth = searchParams.get('photobooth') === 'true';
  const paramFeatured = searchParams.get('featured') === 'true';
  const paramNew = searchParams.get('new') === 'true';
  const paramOccasion = searchParams.get('occasion') || '';

  // Dynamic lists from backend
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(paramSearch);
  const [selectedCat, setSelectedCat] = useState(paramCat);
  const [selectedBrand, setSelectedBrand] = useState(paramBrand);
  const [selectedCollection, setSelectedCollection] = useState(paramCollection);
  const [sortOption, setSortOption] = useState(paramSort);
  const [customizableOnly, setCustomizableOnly] = useState(paramCustomizable);
  const [adminChatOnly, setAdminChatOnly] = useState(paramAdminChat);
  const [photoboothOnly, setPhotoboothOnly] = useState(paramPhotobooth);
  const [featuredOnly, setFeaturedOnly] = useState(paramFeatured);
  const [newOnly, setNewOnly] = useState(paramNew);
  const [selectedOccasion, setSelectedOccasion] = useState(paramOccasion);
  const [priceMin, setPriceMin] = useState<number | ''>(paramMinPrice);
  const [priceMax, setPriceMax] = useState<number | ''>(paramMaxPrice);

  // Products and loading
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination cursor and page states
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Helper to resolve UUID from slug
  const resolveSlugToId = (slugOrId: string, list: Array<{ id?: string; slug: string }>) => {
    if (!slugOrId) return undefined;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(slugOrId)) return slugOrId;
    const found = list.find((item) => item.slug === slugOrId);
    return found?.id;
  };

  // Sync title tag for SEO on client side (for dynamic interactive updates)
  useEffect(() => {
    if (catalogLoaded) {
      const activeCat = categories.find(c => c.id === selectedCat || c.slug === selectedCat);
      const title = activeCat ? `${trans(activeCat.name)} | ${trans('Haniu Quà Tặng')}` : trans('Bộ Sưu Tập Quà Tặng Cao Cấp | Haniu');
      document.title = title;
    }
  }, [selectedCat, categories, catalogLoaded, trans]);

  // Fetch catalogs on mount
  const { occasions, fetchOccasions } = useOccasionStore();

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [catsData, brandsData, collsData] = await Promise.all([
          catalogService.getAllCategories(),
          catalogService.getAllBrands(),
          catalogService.getAllCollections()
        ]);
        setCategories(catsData || []);
        setBrands(brandsData || []);
        setCollections(collsData || []);
      } catch (err) {
        console.error("Failed to load catalog data:", err);
      } finally {
        setCatalogLoaded(true);
      }
    };
    fetchCatalogs();
    if (occasions.length === 0) fetchOccasions();
  }, []);

  // Update states whenever URL params change
  useEffect(() => {
    setSearchQuery(paramSearch);
    setSelectedCat(paramCat);
    setSelectedBrand(paramBrand);
    setSelectedCollection(paramCollection);
    setSortOption(paramSort);
    setPriceMin(paramMinPrice);
    setPriceMax(paramMaxPrice);
    setCustomizableOnly(paramCustomizable);
    setAdminChatOnly(paramAdminChat);
    setPhotoboothOnly(paramPhotobooth);
    setFeaturedOnly(paramFeatured);
    setNewOnly(paramNew);
    setSelectedOccasion(paramOccasion);
  }, [
    paramSearch,
    paramCat,
    paramBrand,
    paramCollection,
    paramSort,
    paramMinPrice,
    paramMaxPrice,
    paramCustomizable,
    paramAdminChat,
    paramPhotobooth,
    paramFeatured,
    paramNew,
    paramOccasion
  ]);

  // Function to push parameters to URL (Source of truth)
  const updateUrlParams = (updates: any) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(updates).forEach((key) => {
      const val = updates[key];
      if (val === undefined || val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  // Local mock filtering helper for fallback
  const filterMockProductsLocal = () => {
    let list = [...MOCK_CATALOG_PRODUCTS];
    if (paramSearch.trim()) {
      const q = paramSearch.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (selectedCat) {
      list = list.filter(p => p.category?.slug === selectedCat || (p.category as any)?.id === selectedCat);
    }
    if (selectedOccasion) {
      list = list.filter(p => {
        const pOccs = (p as any).occasions || [];
        return pOccs.some((o: any) => o.slug === selectedOccasion || o.id === selectedOccasion || o === selectedOccasion);
      });
    }
    if (customizableOnly) {
      list = list.filter(p => p.isCustomizable);
    }
    if (priceMin !== '') {
      list = list.filter(p => (p.salePrice || p.basePrice || 0) >= priceMin);
    }
    if (priceMax !== '') {
      list = list.filter(p => (p.salePrice || p.basePrice || 0) <= priceMax);
    }
    list = [...list].sort((a: any, b: any) => {
      const priceA = a.salePrice || a.basePrice || 0;
      const priceB = b.salePrice || b.basePrice || 0;
      if (sortOption === 'price-asc') return priceA - priceB;
      if (sortOption === 'price-desc') return priceB - priceA;
      if (sortOption === 'sales') return b.stock - a.stock;
      return b.id.localeCompare(a.id);
    });
    return list;
  };

  // Main loader function
  const loadProducts = async (reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const size = 12;
      const targetPage = reset ? 0 : currentPage + 1;
      const cursorVal = reset ? null : nextCursor;

      const catId = resolveSlugToId(paramCat, categories);
      const brandId = resolveSlugToId(paramBrand, brands);
      const collId = resolveSlugToId(paramCollection, collections);

      let resData: any = null;
      let newProducts: any[] = [];
      let hasNext = false;
      let nextC: string | null = null;
      let totalP = 1;

      if (paramSearch.trim() !== '') {
        // Mode A: Search Mode (page-based)
        resData = await productService.searchProducts(paramSearch, targetPage, size);
        if (resData) {
          const content = resData.content || [];
          newProducts = content.map((item: any) => ({
            ...item,
            id: item.id || item._id,
            basePrice: item.price !== undefined ? item.price : item.basePrice,
            category: item.categoryName ? { id: item.categoryId, name: item.categoryName } : item.category
          }));
          totalP = resData.totalPages || 1;
          hasNext = targetPage < totalP - 1;
        }
      } else if (paramSort === 'newest') {
        // Mode C: Cursor Mode (default sorting newest)
        resData = await productService.getProductsCursor({
          categoryId: catId,
          brandId: brandId,
          collectionId: collId,
          occasionSlug: paramOccasion || undefined,
          cursor: cursorVal || undefined,
          size
        });
        if (resData) {
          newProducts = resData.content || [];
          nextC = resData.nextCursor || null;
          hasNext = resData.hasNext || false;
        }
      } else {
        // Mode B: Standard/Offset Mode (price sorting/sales, page-based)
        let sortBy = 'createdAt';
        let sortDir = 'desc';
        if (paramSort === 'price-asc') {
          sortBy = 'price';
          sortDir = 'asc';
        } else if (paramSort === 'price-desc') {
          sortBy = 'price';
          sortDir = 'desc';
        } else if (paramSort === 'sales') {
          sortBy = 'totalSold';
          sortDir = 'desc';
        }

        resData = await productService.getProducts({
          categoryId: catId,
          brandId: brandId,
          collectionId: collId,
          occasionSlug: paramOccasion || undefined,
          page: targetPage,
          size,
          sortBy,
          sortDir,
          status: 'PUBLISHED'
        });
        if (resData) {
          newProducts = resData.content || [];
          totalP = resData.totalPages || 1;
          hasNext = targetPage < totalP - 1;
        }
      }

      // Offline mock fallback if no items are in database
      if (reset && (!newProducts || newProducts.length === 0)) {
        const fallback = filterMockProductsLocal();
        setProducts(fallback);
        setHasNextPage(false);
        setNextCursor(null);
        setCurrentPage(0);
        setTotalPages(1);
      } else {
        if (reset) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }
        setNextCursor(nextC);
        setHasNextPage(hasNext);
        setCurrentPage(targetPage);
        setTotalPages(totalP);
      }
    } catch (err) {
      console.error("Failed to load products from backend:", err);
      if (reset) {
        const fallback = filterMockProductsLocal();
        setProducts(fallback);
        setHasNextPage(false);
        setNextCursor(null);
        setCurrentPage(0);
        setTotalPages(1);
      }
    } finally {
      // Small visual delay for loading transitions
      setTimeout(() => {
        setLoading(false);
        setLoadingMore(false);
      }, 350);
    }
  };

  // Trigger product fetch whenever URL query parameters change (and after catalog loads)
  useEffect(() => {
    if (catalogLoaded) {
      loadProducts(true);
    }
  }, [
    catalogLoaded,
    paramSearch,
    paramCat,
    paramBrand,
    paramCollection,
    paramSort,
    paramMinPrice,
    paramMaxPrice,
    paramCustomizable,
    paramAdminChat,
    paramPhotobooth,
    paramFeatured,
    paramNew,
    paramOccasion
  ]);

  // Client side filters (for price and custom check tags)
  const filteredProducts = products.filter((product: any) => {
    // 1. Customizable
    const isCustomizable = product.isCustomizable || product.is_customizable || product.customizable;
    if (customizableOnly && !isCustomizable) return false;
    // 2. Admin Chat
    const allowAdminChat = product.allowAdminChat || product.allow_admin_chat;
    if (adminChatOnly && !allowAdminChat) return false;
    // 3. Photobooth
    const allowPhotobooth = product.allowPhotobooth || product.allowPhotoUpload || product.allow_photobooth || product.allow_photo_upload;
    if (photoboothOnly && !allowPhotobooth) return false;
    // 4. Featured
    const isFeatured = product.isFeatured || product.is_featured || product.featured;
    if (featuredOnly && !isFeatured) return false;
    // 5. New
    const isNew = product.isNew || product.is_new || product.new;
    if (newOnly && !isNew) return false;
    // 6. Price range
    const price = product.salePrice || product.basePrice || product.price || 0;
    if (priceMin !== '' && price < priceMin) return false;
    if (priceMax !== '' && price > priceMax) return false;
    return true;
  });

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCat('');
    setSelectedBrand('');
    setSelectedCollection('');
    setSelectedOccasion('');
    setCustomizableOnly(false);
    setAdminChatOnly(false);
    setPhotoboothOnly(false);
    setFeaturedOnly(false);
    setNewOnly(false);
    setPriceMin('');
    setPriceMax('');
    setSortOption('newest');
    router.push('/products');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchQuery });
  };

  // Build active filters array
  const getActiveFilters = () => {
    const list = [];
    if (selectedCat) {
      const found = categories.find(c => c.id === selectedCat || c.slug === selectedCat);
      list.push({ key: 'category', label: `${trans('Danh mục')}: ${found ? trans(found.name) : selectedCat}` });
    }
    if (selectedBrand) {
      const found = brands.find(b => b.id === selectedBrand || b.slug === selectedBrand);
      list.push({ key: 'brand', label: `${trans('Thương hiệu')}: ${found ? trans(found.name) : selectedBrand}` });
    }
    if (selectedCollection) {
      const found = collections.find(c => c.id === selectedCollection || c.slug === selectedCollection);
      list.push({ key: 'collection', label: `${trans('Bộ sưu tập')}: ${found ? trans(found.name) : selectedCollection}` });
    }
    if (selectedOccasion) {
      const found = occasions.find(o => o.id === selectedOccasion || o.slug === selectedOccasion);
      list.push({ key: 'occasion', label: `${trans('Dịp lễ')}: ${found ? trans(found.name) : selectedOccasion}` });
    }
    if (customizableOnly) {
      list.push({ key: 'customizable', label: trans('Cho phép Khắc tên / Cá nhân hóa quà') });
    }
    if (adminChatOnly) {
      list.push({ key: 'adminChat', label: trans('Có thể chat với Admin') });
    }
    if (photoboothOnly) {
      list.push({ key: 'photobooth', label: trans('Studio Photobooth Haniu - In ảnh tặng kèm') });
    }
    if (featuredOnly) {
      list.push({ key: 'featured', label: trans('Sản phẩm Nổi bật (Featured)') });
    }
    if (newOnly) {
      list.push({ key: 'new', label: trans('Sản phẩm mới (New)') });
    }
    if (priceMin !== '' || priceMax !== '') {
      let label = trans('Giá') + ': ';
      if (priceMin !== '' && priceMax !== '') label += `${(priceMin / 1000)}k - ${(priceMax / 1000)}k`;
      else if (priceMin !== '') label += `> ${(priceMin / 1000)}k`;
      else if (priceMax !== '') label += `< ${(priceMax / 1000)}k`;
      list.push({ key: 'price', label });
    }
    if (searchQuery.trim()) {
      list.push({ key: 'search', label: `${trans('Tìm kiếm')}: "${searchQuery}"` });
    }
    return list;
  };

  const removeFilter = (key: string) => {
    switch (key) {
      case 'category':
        updateUrlParams({ category: '' });
        break;
      case 'brand':
        updateUrlParams({ brand: '' });
        break;
      case 'collection':
        updateUrlParams({ collection: '' });
        break;
      case 'occasion':
        updateUrlParams({ occasion: '' });
        break;
      case 'customizable':
        updateUrlParams({ customizable: '' });
        break;
      case 'adminChat':
        updateUrlParams({ adminChat: '' });
        break;
      case 'photobooth':
        updateUrlParams({ photobooth: '' });
        break;
      case 'featured':
        updateUrlParams({ featured: '' });
        break;
      case 'new':
        updateUrlParams({ new: '' });
        break;
      case 'price':
        updateUrlParams({ minPrice: '', maxPrice: '' });
        break;
      case 'search':
        updateUrlParams({ search: '' });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 pb-16 font-sans">
      {/* 1. HERO BANNER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-[32px] overflow-hidden bg-slate-100/60 dark:bg-zinc-950 text-slate-800 dark:text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-200 dark:border-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent opacity-60 dark:opacity-40 pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 border border-rose-500/25">
              <Icon name="gift" size={10} className="animate-pulse" /> {trans('Haniu Catalog')}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight py-1 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500 uppercase">
              {trans(categories.find((c) => c.id === selectedCat || c.slug === selectedCat)?.name || 'Sản Phẩm Quà Tặng')}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-350 leading-relaxed font-light tracking-wide max-w-xl">
              {trans('Hộp quà tặng thủ công nghệ thuật cá nhân hóa khắc tên riêng và lời chúc theo yêu cầu, chế tác độc bản gửi trọn thành ý của bạn.')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6 sm:space-y-8">
        {/* Breadcrumbs Navigation */}
        <nav className="text-xs text-slate-450 dark:text-zinc-500 flex items-center gap-1.5 font-medium">
          <Link href="/" className="hover:text-rose-500 transition-colors">{trans('Trang chủ')}</Link>
          <span>&gt;</span>
          <span className="text-slate-655 dark:text-zinc-300">{trans('Sản phẩm quà tặng')}</span>
          {selectedCat && (
            <>
              <span>&gt;</span>
              <span className="text-rose-500 font-bold">
                {categories.find(c => c.id === selectedCat || c.slug === selectedCat)?.name || selectedCat}
              </span>
            </>
          )}
        </nav>

        {/* Horizontal scrollable occasion pill bar on top for quick selector */}
        <CategoryPillsBar
          categories={occasions}
          selectedCat={selectedOccasion}
          onSelectCategory={(occ) => updateUrlParams({ occasion: occ })}
          allLabel={trans('Tất cả sản phẩm')}
        />

        {/* Active Filter Tags Row */}
        <ActiveFilterTags
          activeFilters={getActiveFilters()}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />

        {/* Main Catalog View Grid */}
        <div className="flex flex-col lg:flex-row gap-8 relative items-start">

          {/* Desktop Sidebar filter */}
          <FilterSidebar
            selectedCat={selectedCat}
            setSelectedCat={(cat) => updateUrlParams({ category: cat })}
            selectedBrand={selectedBrand}
            setSelectedBrand={(brand) => updateUrlParams({ brand: brand })}
            selectedCollection={selectedCollection}
            setSelectedCollection={(coll) => updateUrlParams({ collection: coll })}
            selectedOccasion={selectedOccasion}
            setSelectedOccasion={(occ) => updateUrlParams({ occasion: occ })}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            customizableOnly={customizableOnly}
            setCustomizableOnly={(val) => updateUrlParams({ customizable: val ? 'true' : '' })}
            adminChatOnly={adminChatOnly}
            setAdminChatOnly={(val) => updateUrlParams({ adminChat: val ? 'true' : '' })}
            photoboothOnly={photoboothOnly}
            setPhotoboothOnly={(val) => updateUrlParams({ photobooth: val ? 'true' : '' })}
            featuredOnly={featuredOnly}
            setFeaturedOnly={(val) => updateUrlParams({ featured: val ? 'true' : '' })}
            newOnly={newOnly}
            setNewOnly={(val) => updateUrlParams({ new: val ? 'true' : '' })}
            priceMin={priceMin}
            setPriceMin={(val) => updateUrlParams({ minPrice: val })}
            priceMax={priceMax}
            setPriceMax={(val) => updateUrlParams({ maxPrice: val })}
            clearAllFilters={clearAllFilters}
            handleSearchSubmit={handleSearchSubmit}
            categories={categories}
            brands={brands}
            collections={collections}
            occasions={occasions}
          />

          {/* Product grid list panel */}
          <div className="flex-1 w-full space-y-6 relative z-10">

            {/* Toolbar sorting and display toggles */}
            <ProductToolbar
              onOpenFilters={() => setMobileFilterOpen(true)}
              sortOption={sortOption}
              setSortOption={(opt) => updateUrlParams({ sort: opt })}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortOptions={SORT_OPTIONS}
              totalCount={filteredProducts.length}
            />

            {/* Content loading state */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty state matching the home styling */
              <EmptyState onClearFilters={clearAllFilters} />
            ) : viewMode === 'list' ? (
              /* List Mode layout */
              <div className="space-y-4">
                {filteredProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="group bg-white dark:bg-zinc-950 rounded-[28px] border border-slate-100 dark:border-zinc-850 p-5 flex flex-col sm:flex-row gap-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="w-full sm:w-44 aspect-square bg-slate-50 dark:bg-zinc-900 rounded-2xl overflow-hidden shrink-0 relative">
                      <img
                        src={product.media?.[0]?.url || product.thumbnailUrl || 'https://placehold.co/300'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                      {product.isFeatured && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                          {trans('Nổi bật')}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-rose-500 tracking-wider">
                          {trans(product.category?.name || 'Quà Tặng')}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-zinc-150 hover:text-rose-500 transition-colors">
                          <Link href={`/products/${product.slug}`}>{trans(product.name)}</Link>
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 font-light line-clamp-2 max-w-xl leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-end justify-between pt-4 sm:pt-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-rose-500">
                            {(product.salePrice || product.basePrice || product.price || 0).toLocaleString('vi-VN')}đ
                          </span>
                          {(product.salePrice && product.basePrice) && (
                            <span className="text-xs text-slate-400 line-through">
                              {(product.basePrice || 0).toLocaleString('vi-VN')}đ
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-98"
                          >
                            {trans('Chi tiết')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Grid Mode layout */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      // Adapt schema differences
                      basePrice: product.basePrice || product.price
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination Load More footer control */}
            {hasNextPage && (
              <div className="pt-8 text-center space-y-3">
                <span className="inline-block text-[10px] text-slate-400 dark:text-zinc-550 font-medium tracking-wider uppercase block">
                  {trans('Đã tải')} {products.length} {trans('sản phẩm từ hệ thống')}
                </span>
                <button
                  onClick={() => loadProducts(false)}
                  disabled={loadingMore}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-350 dark:hover:border-zinc-750 text-slate-700 dark:text-zinc-300 font-bold px-8 py-3.5 rounded-2xl text-xs shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {loadingMore && <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-600 dark:border-zinc-300" />}
                  <span>{trans('Tải thêm sản phẩm')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rich SEO Content Section at the bottom of the page */}
        <ProductListSeo />

      </div>

      {/* Mobile Drawer filter panel */}
      <FilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        selectedCat={selectedCat}
        setSelectedCat={(cat) => updateUrlParams({ category: cat })}
        selectedBrand={selectedBrand}
        setSelectedBrand={(brand) => updateUrlParams({ brand: brand })}
        selectedCollection={selectedCollection}
        setSelectedCollection={(coll) => updateUrlParams({ collection: coll })}
        selectedOccasion={selectedOccasion}
        setSelectedOccasion={(occ) => updateUrlParams({ occasion: occ })}
        customizableOnly={customizableOnly}
        setCustomizableOnly={(val) => updateUrlParams({ customizable: val ? 'true' : '' })}
        adminChatOnly={adminChatOnly}
        setAdminChatOnly={(val) => updateUrlParams({ adminChat: val ? 'true' : '' })}
        photoboothOnly={photoboothOnly}
        setPhotoboothOnly={(val) => updateUrlParams({ photobooth: val ? 'true' : '' })}
        featuredOnly={featuredOnly}
        setFeaturedOnly={(val) => updateUrlParams({ featured: val ? 'true' : '' })}
        newOnly={newOnly}
        setNewOnly={(val) => updateUrlParams({ new: val ? 'true' : '' })}
        priceMin={priceMin}
        setPriceMin={(val) => updateUrlParams({ minPrice: val })}
        priceMax={priceMax}
        setPriceMax={(val) => updateUrlParams({ maxPrice: val })}
        clearAllFilters={clearAllFilters}
        categories={categories}
        brands={brands}
        collections={collections}
        occasions={occasions}
      />


    </div>
  );
}

export default function ProductsClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
