'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Occasion } from '@/services/catalog.service';
import { useOccasionStore } from '@/store/occasion';
import { OccasionTable } from './components/OccasionTable';
import { OccasionFormModal } from './components/OccasionFormModal';
import {
  AdminPageHeader,
  AdminKPICards,
  AdminFilterTabs,
  AdminSearchToolbar,
  KPICardItem,
  TabItem,
} from '@/app/admin/components/common';
import Icon from '@/components/common/Icons';

export default function AdminOccasionsPage() {
  const { occasions, loading, fetchOccasions, saveOccasion, deleteOccasion } = useOccasionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Occasion | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const loadOccasions = async () => {
    await fetchOccasions();
  };

  useEffect(() => {
    loadOccasions();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Occasion) => {
    setEditingItem(item);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (payload: Occasion) => {
    await saveOccasion(payload);
    setSuccessMsg(payload.id ? 'Cập nhật dịp lễ thành công! 🎉' : 'Thêm dịp lễ mới thành công! 🎉');
    setTimeout(() => {
      setIsModalOpen(false);
    }, 800);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dịp lễ này không?')) return;
    try {
      await deleteOccasion(id);
      setSuccessMsg('Xóa dịp lễ thành công! 🎉');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa dịp lễ.');
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    return {
      total: occasions.length,
      active: occasions.filter((o) => o.isActive).length,
      inactive: occasions.filter((o) => !o.isActive).length,
      seasonal: occasions.filter((o) => Boolean(o.startDate || o.endDate)).length,
    };
  }, [occasions]);

  // Status Tab Counts
  const statusCounts = useMemo(() => {
    return {
      ALL: occasions.length,
      ACTIVE: occasions.filter((o) => o.isActive).length,
      INACTIVE: occasions.filter((o) => !o.isActive).length,
    };
  }, [occasions]);

  // KPI Items
  const kpiItems: KPICardItem[] = useMemo(() => [
    {
      id: 'total',
      label: 'Tổng dịp lễ & Sự kiện',
      value: metrics.total,
      subtext: 'chủ đề sự kiện',
      icon: 'calendar',
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
      id: 'inactive',
      label: 'Bản nháp / Đang ẩn',
      value: metrics.inactive,
      subtext: 'chưa công khai',
      icon: 'alert',
      variant: 'amber',
    },
    {
      id: 'seasonal',
      label: 'Sự kiện theo mùa',
      value: metrics.seasonal,
      subtext: 'có mốc thời gian',
      icon: 'sparkles',
      variant: 'purple',
    },
  ], [metrics]);

  // Status Tab List
  const statusTabs: TabItem[] = useMemo(() => [
    { id: 'ALL', label: 'Tất cả dịp lễ', count: statusCounts.ALL, activeColor: 'rose' },
    { id: 'ACTIVE', label: 'Đang hoạt động', count: statusCounts.ACTIVE, activeColor: 'emerald' },
    { id: 'INACTIVE', label: 'Đang ẩn', count: statusCounts.INACTIVE, activeColor: 'amber' },
  ], [statusCounts]);

  // Filtered list
  const filteredOccasions = useMemo(() => {
    return occasions.filter((item) => {
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
  }, [occasions, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] max-w-full space-y-3.5 min-h-0">
      {/* 1. Header Title & KPI Cards */}
      <div className="shrink-0 space-y-3">
        <AdminPageHeader
          title="Quản Lý Dịp Lễ & Sự Kiện (Occasions)"
          description="Thiết lập các dịp lễ tặng quà (Tốt nghiệp, Sinh nhật, 20/10, Valentine, Giáng Sinh) để khách hàng chọn quà nhanh."
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
          searchPlaceholder="Tìm theo tên dịp lễ, mô tả, slug..."
          loading={loading}
          onRefresh={loadOccasions}
          primaryAction={{
            label: 'Thêm dịp lễ mới',
            onClick: handleOpenAddModal,
            icon: 'plus',
          }}
        />
      </div>

      {/* 4. Table Container (Scroll-only body) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <OccasionTable
          occasions={filteredOccasions}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <OccasionFormModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
