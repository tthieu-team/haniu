'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProductStore, Product } from '@/store/product';
import { productService } from '@/services/product.service';
import { ProductsKPICards } from './components/ProductsKPICards';
import { ProductsTabsHeader } from './components/ProductsTabsHeader';
import { ProductsFilterToolbar } from './components/ProductsFilterToolbar';
import { ProductsTable } from './components/ProductsTable';
import { ProductDetailInspector } from './components/ProductDetailInspector';
import { DeleteProductModal } from './components/DeleteProductModal';
import { ProductsBottomBar } from './components/ProductsBottomBar';

function formatVND(amount: number | undefined | null) {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

const getIncludedItemsCount = (jsonStr?: string) => {
  if (!jsonStr) return 0;
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.keys(parsed).length;
    }
  } catch {
    return 0;
  }
  return 0;
};

export default function AdminProductsPage() {
  const { products, loading, deleteProduct } = useProductStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterFeature, setFilterFeature] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('NEWEST');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination states
  const [cursorHistory, setCursorHistory] = useState<string[]>(['']);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);

  const loadProducts = useCallback(async (cursorVal: string = '') => {
    useProductStore.setState({ loading: true });
    try {
      const data = await productService.getProductsCursor({ cursor: cursorVal, size: 15 });
      if (data && data.content) {
        const list = data.content.map((p: any) => ({
          ...p,
          basePrice: p.price || p.basePrice || 0,
        }));
        useProductStore.setState({ products: list, loading: false });
        setNextCursor(data.nextCursor || null);
        setHasNext(Boolean(data.hasNext));
      } else {
        useProductStore.setState({ products: [], loading: false });
        setHasNext(false);
        setNextCursor(null);
      }
    } catch (err: any) {
      useProductStore.setState({ products: [], loading: false });
      setHasNext(false);
      setNextCursor(null);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Sync selected product
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    } else if (selectedProduct) {
      const refreshed = products.find(p => p.id === selectedProduct.id);
      if (refreshed) setSelectedProduct(refreshed);
    }
  }, [products]);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
      await loadProducts(cursorHistory[currentPageIndex] || '');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa sản phẩm');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNextPage = () => {
    if (hasNext && nextCursor) {
      const newHistory = [...cursorHistory.slice(0, currentPageIndex + 1), nextCursor];
      setCursorHistory(newHistory);
      setCurrentPageIndex(currentPageIndex + 1);
      loadProducts(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      const prevCursor = cursorHistory[currentPageIndex - 1] || '';
      setCurrentPageIndex(currentPageIndex - 1);
      loadProducts(prevCursor);
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    return {
      total: products.length,
      published: products.filter(p => p.status === 'PUBLISHED').length,
      lowStock: products.filter(p => (p.stock || 0) <= 10).length,
      customizableOrCombo: products.filter(p => p.isCustomizable || getIncludedItemsCount(p.includedItems) > 0).length,
    };
  }, [products]);

  // Status tab counts
  const statusCounts = useMemo(() => {
    return {
      ALL: products.length,
      PUBLISHED: products.filter(p => p.status === 'PUBLISHED').length,
      DRAFT: products.filter(p => p.status === 'DRAFT').length,
      ARCHIVED: products.filter(p => p.status === 'ARCHIVED').length,
    };
  }, [products]);

  // Filtered & Sorted list
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
        if (filterFeature === 'FEATURED' && !p.isFeatured) return false;
        if (filterFeature === 'CUSTOMIZABLE' && !p.isCustomizable) return false;
        if (filterFeature === 'COMBO' && getIncludedItemsCount(p.includedItems) === 0) return false;

        const q = searchQuery.toLowerCase().trim();
        if (q) {
          const matchName = p.name?.toLowerCase().includes(q);
          const matchSku = p.sku?.toLowerCase().includes(q);
          const matchCat = p.category?.name?.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'PRICE_ASC') return (a.basePrice || 0) - (b.basePrice || 0);
        if (sortBy === 'PRICE_DESC') return (b.basePrice || 0) - (a.basePrice || 0);
        if (sortBy === 'STOCK_ASC') return (a.stock || 0) - (b.stock || 0);
        return 0;
      });
  }, [products, filterStatus, filterFeature, searchQuery, sortBy]);

  return (
    <div className="space-y-6 max-w-full pb-10">
      {/* 1. Header Title & KPI Cards */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-zinc-100 uppercase tracking-tight">
            Quản Lý Sản Phẩm & Kho Quà Tặng
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
            Kiểm soát danh mục quà tặng, thiết lập giá bán, số lượng tồn kho và cấu hình combo khắc laser.
          </p>
        </div>

        <ProductsKPICards metrics={metrics} />
      </div>

      {/* 2. Status & Feature Tabs */}
      <ProductsTabsHeader
        filterStatus={filterStatus}
        onSelectStatus={setFilterStatus}
        filterFeature={filterFeature}
        onSelectFeature={setFilterFeature}
        statusCounts={statusCounts}
      />

      {/* 3. Search & Sorter Toolbar */}
      <ProductsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        loading={loading}
        onRefresh={() => loadProducts(cursorHistory[currentPageIndex] || '')}
      />

      {/* 4. Main 2-Column Split: Table + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Products Table */}
        <div className="lg:col-span-7 space-y-4">
          <ProductsTable
            products={filteredProducts}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            onRequestDelete={setProductToDelete}
            formatVND={formatVND}
            loading={loading}
          />

          <ProductsBottomBar
            totalCount={products.length}
            filteredCount={filteredProducts.length}
            currentPageIndex={currentPageIndex}
            hasNext={hasNext}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            loading={loading}
          />
        </div>

        {/* Right: Product Inspector */}
        <div className="lg:col-span-5 sticky top-4">
          <ProductDetailInspector
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onRequestDelete={setProductToDelete}
            formatVND={formatVND}
          />
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        product={productToDelete}
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
