'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/services/catalog.service';
import { useCategoryStore } from '@/store/category';
import CategoryTable from './CategoryTable';
import CategoryFormModal from './CategoryFormModal';
import Icon from '@/components/common/Icons';

export default function AdminCategoriesPage() {
  const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'NORMAL'>('ALL');

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
      
      // Close modal
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
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

  // Search & Filter Logic
  const filteredCategories = categories.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && item.isActive) ||
      (statusFilter === 'INACTIVE' && !item.isActive);

    const matchesFeatured =
      featuredFilter === 'ALL' ||
      (featuredFilter === 'FEATURED' && item.isFeatured) ||
      (featuredFilter === 'NORMAL' && !item.isFeatured);

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  return (
    <div className="space-y-8">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            Quản lý Danh mục (Categories)
          </h1>
          <p className="text-xs text-slate-400">
            Tạo, cập nhật, phân cấp danh mục và tối ưu hóa SEO cho danh mục sản phẩm
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Icon name="plus" size={14} /> Thêm Danh Mục Mới
        </button>
      </div>

      {/* Success alert message */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium">
          {successMsg}
        </div>
      )}

      {/* Filter and Search bars */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm w-full">
        
        {/* Search input */}
        <div className="relative w-full xl:w-80">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục theo tên, mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
          />
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Icon name="search" size={14} />
          </span>
        </div>

        {/* Filters dropdown & toggle buttons */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          
          {/* Active status filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">Trạng thái:</span>
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold transition-all cursor-pointer ${
                  statusFilter === f
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                {f === 'ALL' ? 'Tất cả' : f === 'ACTIVE' ? 'Hoạt động' : 'Đang ẩn'}
              </button>
            ))}
          </div>

          {/* Featured filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">Nổi bật:</span>
            {(['ALL', 'FEATURED', 'NORMAL'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFeaturedFilter(f)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold transition-all cursor-pointer ${
                  featuredFilter === f
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                {f === 'ALL' ? 'Tất cả' : f === 'FEATURED' ? 'Nổi bật' : 'Thông thường'}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Categories Table View */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CategoryTable
          categories={filteredCategories}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteCategory}
        />
      </div>

      {/* Category Creation / Edit Modal Dialog */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        allCategories={categories}
      />

    </div>
  );
}
