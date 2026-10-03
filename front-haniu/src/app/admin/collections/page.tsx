'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Collection } from '@/services/catalog.service';
import { useCollectionStore } from '@/store/collection';
import { CollectionTable } from './components/CollectionTable';
import { CollectionFormModal } from './components/CollectionFormModal';
import {
  AdminPageHeader,
  AdminKPICards,
  AdminFilterTabs,
  AdminSearchToolbar,
  KPICardItem,
  TabItem,
} from '@/app/admin/components/common';
import Icon from '@/components/common/Icons';

export default function AdminCollectionsPage() {
  const { collections, loading, fetchCollections, saveCollection, deleteCollection } = useCollectionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Collection | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const loadCollections = async () => {
    await fetchCollections();
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Collection) => {
    setEditingItem(item);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (payload: Collection) => {
    await saveCollection(payload);
    setSuccessMsg(payload.id ? 'Cập nhật bộ sưu tập thành công! 🎉' : 'Thêm bộ sưu tập mới thành công! 🎉');
    setTimeout(() => {
      setIsModalOpen(false);
    }, 800);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bộ sưu tập này không? Các sản phẩm trong bộ sưu tập sẽ không bị xóa.')) return;
    try {
      await deleteCollection(id);
      setSuccessMsg('Xóa bộ sưu tập thành công! 🎉');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa bộ sưu tập.');
    }
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    return {
      total: collections.length,
      active: collections.filter((c) => c.isActive).length,
      inactive: collections.filter((c) => !c.isActive).length,
      withBanner: collections.filter((c) => Boolean(c.bannerUrl)).length,
    };
  }, [collections]);

  // Status Tab Counts
  const statusCounts = useMemo(() => {
    return {
      ALL: collections.length,
      ACTIVE: collections.filter((c) => c.isActive).length,
      INACTIVE: collections.filter((c) => !c.isActive).length,
    };
  }, [collections]);

  // KPI Items
  const kpiItems: KPICardItem[] = useMemo(() => [
    {
      id: 'total',
      label: 'Tổng bộ sưu tập',
      value: metrics.total,
      subtext: 'trong hệ thống',
      icon: 'box',
      variant: 'rose',
    },
    {
      id: 'active',
      label: 'Đang mở bán',
      value: metrics.active,
      subtext: 'hiển thị trên web',
      icon: 'check',
      variant: 'emerald',
    },
    {
      id: 'inactive',
      label: 'Bản nháp / Đang ẩn',
      value: metrics.inactive,
      subtext: 'chưa công khai',
      icon: 'alert',
      variant: 'amber',
    },
    {
      id: 'banner',
      label: 'Có ảnh bìa Banner',
      value: metrics.withBanner,
      subtext: 'thiết kế nổi bật',
      icon: 'sparkles',
      variant: 'purple',
    },
  ], [metrics]);

  // Status Tab List
  const statusTabs: TabItem[] = useMemo(() => [
    { id: 'ALL', label: 'Tất cả bộ sưu tập', count: statusCounts.ALL, activeColor: 'rose' },
    { id: 'ACTIVE', label: 'Đang hoạt động', count: statusCounts.ACTIVE, activeColor: 'emerald' },
    { id: 'INACTIVE', label: 'Đang ẩn', count: statusCounts.INACTIVE, activeColor: 'amber' },
  ], [statusCounts]);

  // Filtered & Search logic
  const filteredCollections = useMemo(() => {
    return collections.filter((item) => {
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

      return matchesSearch && matchesStatus;
    });
  }, [collections, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] max-w-full space-y-3.5 min-h-0">
      {/* 1. Header Title & KPI Cards */}
      <div className="shrink-0 space-y-3">
        <AdminPageHeader
          title="Quản Lý Bộ Sưu Tập (Collections)"
          description="Thiết kế các set bộ sưu tập theo chủ đề, banner sự kiện và tối ưu luồng mua sắm."
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
        />
      </div>

      {/* 3. Search & Toolbar */}
      <div className="shrink-0">
        <AdminSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Tìm theo tên bộ sưu tập, mô tả, slug..."
          loading={loading}
          onRefresh={loadCollections}
          primaryAction={{
            label: 'Thêm bộ sưu tập',
            onClick: handleOpenAddModal,
            icon: 'plus',
          }}
        />
      </div>

      {/* 4. Table Container (Scroll-only body) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <CollectionTable
          collections={filteredCollections}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <CollectionFormModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
