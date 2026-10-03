'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Category } from '@/services/catalog.service';
import { useCategoryStore } from '@/store/category';
import CategoryTable from './CategoryTable';
import CategoryFormModal from './CategoryFormModal';
import {
  AdminPageHeader,
  AdminKPICards,
  AdminFilterTabs,
  AdminSearchToolbar,
  KPICardItem,
  TabItem,
} from '@/app/admin/components/common';
import Icon from '@/components/common/Icons';

export default function AdminCategoriesPage() {
  const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'ACCESSORY'>('ALL');

  // Modal and editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const loadCategories = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (payload: Category) => {
    try {
      if (payload.id) {
        await updateCategory(payload.id, payload);
        setSuccessMsg('Cập nhật danh mục thành công! 🎉');
      } else {
        await createCategory(payload);
        setSuccessMsg('Thêm danh mục mới thành công! 🎉');
      }
      
      setTimeout(() => {
        setIsModalOpen(false);
      }, 800);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      throw new Error(err.message || 'Lỗi khi lưu thông tin danh mục.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này? Các sản phẩm thuộc danh mục này có thể cần được phân loại lại.')) {
      return;
    }
    
    try {
      await deleteCategory(id);
      setSuccessMsg('Xóa danh mục thành công! 🎉');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa danh mục.');
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    return {
      total: categories.length,
      active: categories.filter(c => c.isActive).length,
      featured: categories.filter(c => c.isFeatured).length,
      accessory: categories.filter(c => c.isAccessory).length,
    };
  }, [categories]);

  // Status tab counts
  const statusCounts = useMemo(() => {
    return {
      ALL: categories.length,
      ACTIVE: categories.filter(c => c.isActive).length,
      INACTIVE: categories.filter(c => !c.isActive).length,
    };
  }, [categories]);

  // KPI Items
  const kpiItems: KPICardItem[] = useMemo(() => [
    {
      id: 'total',
      label: 'Tổng danh mục',
      value: metrics.total,
      subtext: 'trong hệ thống',
      icon: 'tag',
      variant: 'rose',
    },
    {
      id: 'active',
      label: 'Đang hoạt động',
      value: metrics.active,
      subtext: 'hiển thị trên web',
      icon: 'check',
      variant: 'emerald',
    },
    {
      id: 'featured',
      label: 'Danh mục nổi bật',
      value: metrics.featured,
      subtext: 'ưu tiên trang chủ',
      icon: 'star',
      variant: 'amber',
    },
    {
      id: 'accessory',
      label: 'Phụ kiện quà tặng',
      value: metrics.accessory,
      subtext: 'mua kèm combo',
      icon: 'gift',
      variant: 'purple',
    },
  ], [metrics]);

  // Status tabs list
  const statusTabs: TabItem[] = useMemo(() => [
    { id: 'ALL', label: 'Tất cả danh mục', count: statusCounts.ALL, activeColor: 'rose' },
    { id: 'ACTIVE', label: 'Đang hoạt động', count: statusCounts.ACTIVE, activeColor: 'emerald' },
    { id: 'INACTIVE', label: 'Đang ẩn', count: statusCounts.INACTIVE, activeColor: 'amber' },
  ], [statusCounts]);

  // Search & Filter Logic
  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.slug.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && item.isActive) ||
        (statusFilter === 'INACTIVE' && !item.isActive);

      const matchesFeatured =
        featuredFilter === 'ALL' ||
        (featuredFilter === 'FEATURED' && item.isFeatured) ||
        (featuredFilter === 'ACCESSORY' && item.isAccessory);

      return matchesSearch && matchesStatus && matchesFeatured;
    });
  }, [categories, searchQuery, statusFilter, featuredFilter]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] max-w-full space-y-3.5 min-h-0">
      
      {/* 1. Header Title & KPI Cards */}
      <div className="shrink-0 space-y-3">
        <AdminPageHeader
          title="Quản Lý Danh Mục Quà Tặng"
          description="Tạo mới, phân cấp danh mục, tối ưu SEO và cấu hình phụ kiện quà tặng kèm."
        />

        <AdminKPICards items={kpiItems} columns={4} />
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-bold flex items-center gap-2 shrink-0 animate-in fade-in duration-150">
          <Icon name="check" size={15} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Status Tabs */}
      <div className="shrink-0">
        <AdminFilterTabs
          tabs={statusTabs}
          activeTab={statusFilter}
          onSelectTab={(id) => setStatusFilter(id as any)}
          rightElement={
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 mr-1 hidden md:inline">
                Thuộc tính:
              </span>
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'FEATURED', label: 'Nổi bật ★' },
                { id: 'ACCESSORY', label: 'Phụ kiện 🎁' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFeaturedFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    featuredFilter === f.id
                      ? 'bg-slate-800 text-white dark:bg-zinc-700 dark:text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          }
        />
      </div>

      {/* 3. Search & Filter Toolbar */}
      <div className="shrink-0">
        <AdminSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Tìm theo tên danh mục, mô tả, slug..."
          loading={loading}
          onRefresh={loadCategories}
          primaryAction={{
            label: 'Thêm danh mục',
            onClick: handleOpenAddModal,
            icon: 'plus',
          }}
        />
      </div>

      {/* 4. Table Container (Scroll-only body) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <CategoryTable
          categories={filteredCategories}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteCategory}
        />
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <CategoryFormModal
          isOpen={isModalOpen}
          editingCategory={editingCategory}
          allCategories={categories}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}
