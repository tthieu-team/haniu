'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Recipient } from '@/services/catalog.service';
import { useRecipientStore } from '@/store/recipient';
import { RecipientTable } from './components/RecipientTable';
import { RecipientFormModal } from './components/RecipientFormModal';
import {
  AdminPageHeader,
  AdminKPICards,
  AdminFilterTabs,
  AdminSearchToolbar,
  KPICardItem,
  TabItem,
} from '@/app/admin/components/common';
import Icon from '@/components/common/Icons';

export default function AdminRecipientsPage() {
  const { recipients, loading, fetchRecipients, saveRecipient, deleteRecipient } = useRecipientStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Recipient | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const loadRecipients = async () => {
    await fetchRecipients();
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Recipient) => {
    setEditingItem(item);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (payload: Recipient) => {
    await saveRecipient(payload);
    setSuccessMsg(payload.id ? 'Cập nhật đối tượng thành công! 🎉' : 'Thêm đối tượng mới thành công! 🎉');
    setTimeout(() => {
      setIsModalOpen(false);
    }, 800);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đối tượng nhận này không?')) return;
    try {
      await deleteRecipient(id);
      setSuccessMsg('Xóa đối tượng thành công! 🎉');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa đối tượng.');
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    return {
      total: recipients.length,
      active: recipients.filter((r) => r.isActive).length,
      inactive: recipients.filter((r) => !r.isActive).length,
      withImage: recipients.filter((r) => Boolean(r.imageUrl)).length,
    };
  }, [recipients]);

  // Status Tab Counts
  const statusCounts = useMemo(() => {
    return {
      ALL: recipients.length,
      ACTIVE: recipients.filter((r) => r.isActive).length,
      INACTIVE: recipients.filter((r) => !r.isActive).length,
    };
  }, [recipients]);

  // KPI Items
  const kpiItems: KPICardItem[] = useMemo(() => [
    {
      id: 'total',
      label: 'Tổng đối tượng',
      value: metrics.total,
      subtext: 'nhóm người nhận quà',
      icon: 'users',
      variant: 'rose',
    },
    {
      id: 'active',
      label: 'Đang hiển thị',
      value: metrics.active,
      subtext: 'bộ lọc quà tặng',
      icon: 'check',
      variant: 'emerald',
    },
    {
      id: 'inactive',
      label: 'Bản nháp / Đang ẩn',
      value: metrics.inactive,
      subtext: 'chưa kích hoạt',
      icon: 'alert',
      variant: 'amber',
    },
    {
      id: 'image',
      label: 'Đã gắn ảnh đại diện',
      value: metrics.withImage,
      subtext: 'trực quan sinh động',
      icon: 'sparkles',
      variant: 'purple',
    },
  ], [metrics]);

  // Status Tab List
  const statusTabs: TabItem[] = useMemo(() => [
    { id: 'ALL', label: 'Tất cả đối tượng', count: statusCounts.ALL, activeColor: 'rose' },
    { id: 'ACTIVE', label: 'Đang hiển thị', count: statusCounts.ACTIVE, activeColor: 'emerald' },
    { id: 'INACTIVE', label: 'Đang ẩn', count: statusCounts.INACTIVE, activeColor: 'amber' },
  ], [statusCounts]);

  // Filtered list
  const filteredRecipients = useMemo(() => {
    return recipients.filter((item) => {
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
  }, [recipients, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] max-w-full space-y-3.5 min-h-0">
      {/* 1. Header Title & KPI Cards */}
      <div className="shrink-0 space-y-3">
        <AdminPageHeader
          title="Quản Lý Đối Tượng Nhận Quà (Recipients)"
          description="Phân loại quà tặng theo đối tượng nhận (Bạn gái, Người yêu, Bố mẹ, Đồng nghiệp, Thầy cô, Bé yêu)."
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
          searchPlaceholder="Tìm theo tên đối tượng, mô tả, slug..."
          loading={loading}
          onRefresh={loadRecipients}
          primaryAction={{
            label: 'Thêm đối tượng',
            onClick: handleOpenAddModal,
            icon: 'plus',
          }}
        />
      </div>

      {/* 4. Table Container (Scroll-only body) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <RecipientTable
          recipients={filteredRecipients}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <RecipientFormModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
