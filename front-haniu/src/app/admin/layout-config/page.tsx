'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { HeroTab } from './components/HeroTab';
import { VisibilityTab } from './components/VisibilityTab';
import { SectionsTab } from './components/SectionsTab';
import { PaymentMethodsTab } from './components/PaymentMethodsTab';

type TabType = 'hero' | 'visibility' | 'sections' | 'payment-methods';

export default function AdminLayoutConfigPage() {
  const {
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

  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const hasLoadedRef = useRef(hasLoaded);
  useEffect(() => {
    hasLoadedRef.current = hasLoaded;
  }, [hasLoaded]);

  // Auto-save when navigating away / page unmounts
  useEffect(() => {
    return () => {
      if (hasLoadedRef.current && activeTabRef.current !== 'payment-methods') {
        useHomeLayoutStore.getState().saveConfigToServer().catch((err) => {
          console.error('Lỗi tự động lưu khi rời trang:', err);
        });
      }
    };
  }, []);

  const handleTabChange = async (newTab: TabType) => {
    if (hasLoaded && activeTab !== 'payment-methods' && activeTab !== newTab) {
      setSuccessMsg('Đang tự động lưu cấu hình...');
      try {
        await saveConfigToServer();
        setSuccessMsg('Đã tự động lưu cấu hình! ✓');
        setTimeout(() => setSuccessMsg(''), 2500);
      } catch (err: any) {
        setErrorMsg(err.message || 'Lỗi tự động lưu. Vui lòng kiểm tra kết nối backend.');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    }
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

  const handleReset = () => {
    if (
      confirm(
        'Bạn có chắc chắn muốn khôi phục toàn bộ giao diện và nội dung về mặc định? Mọi thay đổi chưa lưu sẽ bị ghi đè.'
      )
    ) {
      resetAll();
      setSuccessMsg('Đã khôi phục về mặc định thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  if (initError) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-xs rounded-xl font-semibold space-y-4">
        <p className="flex items-center gap-2">
          <Icon name="close" size={16} />
          <span>Không thể tải cấu hình từ máy chủ. Vui lòng kiểm tra kết nối Backend.</span>
        </p>
        <button
          onClick={() => {
            setInitError(false);
            fetchConfigFromServer().then(() => setHasLoaded(true)).catch(() => setInitError(true));
          }}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!hasLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="animate-spin h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            Cấu hình Giao diện trang chủ
          </h1>
          <p className="text-xs text-slate-400">
            Tùy biến màn hình Hero, bố cục slideshow banner, thông tin chân trang và hiển thị các khối nội dung. (Giao diện tự động lưu khi chuyển tab hoặc rời trang)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 active:scale-95 transition-all cursor-pointer"
          >
            Khôi phục mặc định
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <Icon name="save" size={14} />
            )}
            <span>Lưu cấu hình lên Server</span>
          </button>
        </div>
      </div>

      {/* 2. Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
          <Icon name="check" size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
          <Icon name="close" size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-zinc-800 flex gap-2">
        <button
          onClick={() => handleTabChange('hero')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-650 dark:hover:text-zinc-300'
          }`}
        >
          <Icon name="✨" size={14} />
          <span>Hero Banner & Slideshow</span>
        </button>
        <button
          onClick={() => handleTabChange('visibility')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'visibility'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-650 dark:hover:text-zinc-300'
          }`}
        >
          <Icon name="eye" size={14} />
          <span>Trạng thái hiển thị (Visibility)</span>
        </button>
        <button
          onClick={() => handleTabChange('sections')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'sections'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-650 dark:hover:text-zinc-300'
          }`}
        >
          <Icon name="palette" size={14} />
          <span>Cấu hình chi tiết các khối</span>
        </button>

        <button
          onClick={() => handleTabChange('payment-methods')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'payment-methods'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-650 dark:hover:text-zinc-300'
          }`}
        >
          <Icon name="💳" size={14} />
          <span>Phương thức thanh toán</span>
        </button>
      </div>

      {/* 4. Tab contents */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm p-6">
        {activeTab === 'hero' && <HeroTab />}
        {activeTab === 'visibility' && <VisibilityTab />}
        {activeTab === 'sections' && <SectionsTab />}

        {activeTab === 'payment-methods' && <PaymentMethodsTab />}
      </div>
    </div>
  );
}
