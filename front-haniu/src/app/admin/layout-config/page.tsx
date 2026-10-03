'use client';

import React, { useState, useEffect } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { HeroTab } from './components/HeroTab';
import { VisibilityTab } from './components/VisibilityTab';
import { SectionsTab } from './components/SectionsTab';
import { PaymentMethodsTab } from './components/PaymentMethodsTab';

type TabType = 'hero' | 'visibility' | 'sections' | 'payment-methods';

export default function AdminLayoutConfigPage() {
  const {
    isDirty,
    isSaving,
    isLoading,
    resetAll,
    saveConfigToServer,
    fetchConfigFromServer,
  } = useHomeLayoutStore();

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [initError, setInitError] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await fetchConfigFromServer();
        setHasLoaded(true);
      } catch (err) {
        console.error('Failed to init layout config:', err);
        setInitError(true);
      }
    };
    init();
  }, [fetchConfigFromServer]);

  // Tab change: Simply switch the tab view
  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
  };

  const handleSave = async () => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await saveConfigToServer();
      setSuccessMsg('Cập nhật cấu hình giao diện lên máy chủ thành công! 🎉');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi đồng bộ cấu hình lên máy chủ.');
    }
  };

  const handleDiscardChanges = async () => {
    if (confirm('Bạn có chắc muốn hủy các thay đổi chưa lưu và tải lại cấu hình gốc từ máy chủ?')) {
      try {
        await fetchConfigFromServer();
        setSuccessMsg('Đã hủy các thay đổi chưa lưu và tải lại từ máy chủ thành công!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err: any) {
        setErrorMsg('Không thể tải lại từ máy chủ: ' + err.message);
      }
    }
  };

  const handleReset = () => {
    let confirmMsg = 'Bạn có chắc chắn muốn khôi phục toàn bộ giao diện và nội dung về mặc định? Mọi thay đổi chưa lưu sẽ bị ghi đè.';
    let resetFn = resetAll;

    if (activeTab === 'sections') {
      confirmMsg = 'Bạn có chắc chắn muốn khôi phục Cấu hình chi tiết các khối về mặc định? Mọi thay đổi chưa lưu ở tab này sẽ bị ghi đè.';
      resetFn = useHomeLayoutStore.getState().resetSections;
    } else if (activeTab === 'hero') {
      confirmMsg = 'Bạn có chắc chắn muốn khôi phục Hero Banner & Slideshow về mặc định? Mọi thay đổi chưa lưu ở tab này sẽ bị ghi đè.';
      resetFn = useHomeLayoutStore.getState().resetHero;
    } else if (activeTab === 'visibility') {
      confirmMsg = 'Bạn có chắc chắn muốn khôi phục Trạng thái hiển thị về mặc định? Mọi thay đổi chưa lưu ở tab này sẽ bị ghi đè.';
      resetFn = useHomeLayoutStore.getState().resetVisibility;
    }

    if (confirm(confirmMsg)) {
      resetFn();
      setSuccessMsg('Đã khôi phục phần hiện tại về mặc định thành công! Nhấp "Lưu cấu hình" để hoàn tất.');
      setTimeout(() => setSuccessMsg(''), 4500);
    }
  };

  if (initError) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-2xl font-semibold space-y-4">
        <p className="flex items-center gap-2">
          <Icon name="close" size={16} />
          <span>Không thể tải cấu hình từ máy chủ. Vui lòng kiểm tra kết nối Backend.</span>
        </p>
        <button
          onClick={() => {
            setInitError(false);
            fetchConfigFromServer().then(() => setHasLoaded(true)).catch(() => setInitError(true));
          }}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold cursor-pointer transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!hasLoaded || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Đang tải cấu hình giao diện...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full pb-12 font-sans">
      
      {/* 1. Header Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
            <Icon name="palette" size={18} className="text-rose-500" />
            <span>Cấu hình Giao diện Trang Chủ</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
            Tùy biến màn hình Hero, slideshow banner, trạng thái hiển thị và thông tin chi tiết các khối.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Discard unsaved changes */}
          {isDirty && (
            <button
              onClick={handleDiscardChanges}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              title="Hủy bỏ các sửa đổi chưa lưu"
            >
              <Icon name="rotate" size={13} />
              <span>Hủy thay đổi</span>
            </button>
          )}

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer"
          >
            Khôi phục mặc định
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Icon name="save" size={14} />
            )}
            <span>Lưu cấu hình</span>
          </button>
        </div>
      </div>

      {/* 2. Status Alert Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-2xl font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <Icon name="check" size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-2xl font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <Icon name="close" size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80 dark:border-zinc-800">
        <button
          onClick={() => handleTabChange('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Icon name="sparkles" size={14} className={activeTab === 'hero' ? 'text-white' : 'text-slate-400'} />
          <span>Hero Banner & Slideshow</span>
        </button>

        <button
          onClick={() => handleTabChange('visibility')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'visibility'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Icon name="eye" size={14} className={activeTab === 'visibility' ? 'text-white' : 'text-slate-400'} />
          <span>Trạng thái hiển thị (Visibility)</span>
        </button>

        <button
          onClick={() => handleTabChange('sections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'sections'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Icon name="palette" size={14} className={activeTab === 'sections' ? 'text-white' : 'text-slate-400'} />
          <span>Cấu hình chi tiết các khối</span>
        </button>

        <button
          onClick={() => handleTabChange('payment-methods')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'payment-methods'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Icon name="credit-card" size={14} className={activeTab === 'payment-methods' ? 'text-white' : 'text-slate-400'} />
          <span>Phương thức thanh toán</span>
        </button>
      </div>

      {/* 4. Tab Content Panels */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs p-6">
        {activeTab === 'hero' && <HeroTab onSave={handleSave} isSaving={isSaving} />}
        {activeTab === 'visibility' && <VisibilityTab onSave={handleSave} isSaving={isSaving} />}
        {activeTab === 'sections' && <SectionsTab onSave={handleSave} isSaving={isSaving} />}
        {activeTab === 'payment-methods' && <PaymentMethodsTab />}
      </div>

    </div>
  );
}
