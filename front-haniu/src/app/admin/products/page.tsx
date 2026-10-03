'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProductStore, Product } from '@/store/product';
import { productService } from '@/services/product.service';
import { AdminPageHeader, AdminKPICards, AdminFilterTabs, AdminSearchToolbar, KPICardItem, TabItem } from '@/app/admin/components/common';
import { ProductsTable } from './components/ProductsTable';
import { DeleteProductModal } from './components/DeleteProductModal';
import { ProductsBottomBar } from './components/ProductsBottomBar';
import Icon from '@/components/common/Icons';

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
    };
  }, [products]);

  // KPI Items
  const kpiItems: KPICardItem[] = useMemo(() => [
    {
      id: 'total',
      label: 'Tổng sản phẩm',
      value: metrics.total,
      subtext: 'trong hệ thống',
      icon: 'gift',
      variant: 'rose',
    },
    {
      id: 'published',
      label: 'Đang mở bán',
      value: metrics.published,
      subtext: 'hiển thị khách',
      icon: 'check',
      variant: 'emerald',
    },
    {
      id: 'lowStock',
      label: 'Cảnh báo tồn kho',
      value: metrics.lowStock,
      subtext: 'sắp hết hàng',
      icon: 'alert',
      variant: 'amber',
    },
    {
      id: 'combo',
      label: 'Combo & Khắc chữ',
      value: metrics.customizableOrCombo,
      subtext: 'quà cá nhân hóa',
      icon: 'sparkles',
      variant: 'purple',
    },
  ], [metrics]);

  // Status Tab List
  const statusTabs: TabItem[] = useMemo(() => [
    { id: 'ALL', label: 'Tất cả sản phẩm', count: statusCounts.ALL, activeColor: 'rose' },
    { id: 'PUBLISHED', label: 'Đang mở bán', count: statusCounts.PUBLISHED, activeColor: 'emerald' },
    { id: 'DRAFT', label: 'Bản nháp / Tạm ẩn', count: statusCounts.DRAFT, activeColor: 'amber' },
  ], [statusCounts]);

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
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] max-w-full space-y-3.5 min-h-0">
      
      {/* 1. Header Title & KPI Cards */}
      <div className="shrink-0 space-y-3">
        <AdminPageHeader
          title="Quản Lý Sản Phẩm & Kho Quà Tặng"
          description="Kiểm soát danh mục quà tặng, thiết lập giá bán, số lượng tồn kho và cấu hình combo khắc laser."
        />

        <AdminKPICards items={kpiItems} columns={4} />
      </div>

      {/* 2. Status & Feature Tabs */}
      <div className="shrink-0">
        <AdminFilterTabs
          tabs={statusTabs}
          activeTab={filterStatus}
          onSelectTab={setFilterStatus}
          rightElement={
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mr-1 hidden md:inline">
                Phân loại:
              </span>
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'FEATURED', label: 'Nổi bật', icon: 'star' },
                { id: 'CUSTOMIZABLE', label: 'Khắc chữ', icon: 'edit' },
                { id: 'COMBO', label: 'Set Combo', icon: 'box' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterFeature(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    filterFeature === f.id
                      ? 'bg-slate-800 text-white dark:bg-zinc-700 dark:text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {f.icon && <Icon name={f.icon} size={11} />}
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          }
        />
      </div>

      {/* 3. Search & Sorter Toolbar */}
      <div className="shrink-0">
        <AdminSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Tìm theo tên sản phẩm, mã SKU, danh mục..."
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { value: 'NEWEST', label: 'Mới tạo gần đây' },
            { value: 'PRICE_ASC', label: 'Giá: Thấp đến Cao' },
            { value: 'PRICE_DESC', label: 'Giá: Cao đến Thấp' },
            { value: 'STOCK_ASC', label: 'Tồn kho: Ít đến Nhiều' },
          ]}
          loading={loading}
          onRefresh={() => loadProducts(cursorHistory[currentPageIndex] || '')}
          primaryAction={{
            label: 'Thêm mới',
            href: '/admin/products/new',
            icon: 'plus',
          }}
        />
      </div>

      {/* 4. Main Content: Products Table & Pagination (Only Table body scrolls!) */}
      <div className="flex-1 min-h-0 flex flex-col space-y-2.5 overflow-hidden">
        <ProductsTable
          products={filteredProducts}
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
          onRequestDelete={setProductToDelete}
          formatVND={formatVND}
          loading={loading}
        />

        <div className="shrink-0">
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
