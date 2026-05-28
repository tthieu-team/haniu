
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/common/Icons';
import { fetchApi } from '@/lib/api';

const CONFIG_KEY = 'payment_methods';

interface PaymentMethodConfig {
  code: string;
  label: string;
  desc: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
}

const DEFAULT_METHODS: PaymentMethodConfig[] = [
  {
    code: 'COD',
    label: 'Thanh toán COD',
    desc: 'Nhận hàng rồi mới trả tiền (Thanh toán khi nhận hàng)',
    icon: '💵',
    enabled: true,
    sortOrder: 0,
  },
  {
    code: 'VNPAY',
    label: 'Thẻ ATM / Mobile Banking',
    desc: 'Thanh toán qua cổng VNPAY – hỗ trợ toàn bộ ngân hàng Việt Nam',
    icon: '🏦',
    enabled: true,
    sortOrder: 1,
  },
  {
    code: 'MOMO',
    label: 'Ví điện tử MoMo',
    desc: 'Thanh toán nhanh qua ứng dụng MoMo – tiện lợi, an toàn',
    icon: '🌸',
    enabled: true,
    sortOrder: 2,
  },
];

export function PaymentMethodsTab() {
  const [methods, setMethods] = useState<PaymentMethodConfig[]>(DEFAULT_METHODS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi(`/api/v1/system-configs/${CONFIG_KEY}`);
      if (data && data.configValue) {
        const parsed: PaymentMethodConfig[] = JSON.parse(data.configValue);
        // Merge with defaults to handle new methods added in the future
        const merged = DEFAULT_METHODS.map((def) => {
          const saved = parsed.find((p) => p.code === def.code);
          return saved ? { ...def, ...saved } : def;
        });
        setMethods(merged);
      }
    } catch {
      // No config yet – keep defaults
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const saveToServer = async (updatedMethods: PaymentMethodConfig[]) => {
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await fetchApi(`/api/v1/system-configs/${CONFIG_KEY}`, {
        method: 'POST',
        body: JSON.stringify(updatedMethods),
      });
      setSuccessMsg('Đã lưu tự động! ✓');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi lưu cấu hình.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMethod = (code: string) => {
    const updated = methods.map((m) =>
      m.code === code ? { ...m, enabled: !m.enabled } : m
    );
    const enabledCount = updated.filter((m) => m.enabled).length;
    if (enabledCount === 0) {
      setErrorMsg('Phải có ít nhất 1 phương thức thanh toán được bật.');
      return;
    }
    setMethods(updated);
    saveToServer(updated);
  };

  const handleReset = () => {
    if (confirm('Khôi phục về mặc định? Tất cả phương thức sẽ được bật lại.')) {
      setMethods(DEFAULT_METHODS);
      saveToServer(DEFAULT_METHODS);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Cấu hình Phương thức Thanh toán
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Bật/tắt toggle là lưu ngay — thay đổi có hiệu lực trên trang thanh toán của khách.
          </p>
        </div>
        {/* Auto-save status indicator */}
        <div className="shrink-0 flex items-center gap-1.5 text-[10px] font-semibold">
          {isSaving ? (
            <span className="text-slate-400 flex items-center gap-1">
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang lưu...
            </span>
          ) : successMsg ? (
            <span className="text-emerald-500 flex items-center gap-1">
              <Icon name="check" size={12} /> {successMsg}
            </span>
          ) : null}
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
          <Icon name="close" size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Payment Method Cards */}
      <div className="space-y-3">
        {methods.map((method) => (
          <div
            key={method.code}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              method.enabled
                ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-900/10'
                : 'border-slate-200/60 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-850/30 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  method.enabled ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'bg-slate-100 dark:bg-zinc-800/40'
                }`}
              >
                {method.icon}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                    {method.label}
                  </span>
                  {method.enabled ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                      Đang bật
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400">
                      Đã tắt
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed">{method.desc}</p>
                <p className="text-[9px] font-mono text-slate-300 dark:text-zinc-600 uppercase">
                  Code: {method.code}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={method.enabled}
                onChange={() => toggleMethod(method.code)}
                disabled={isSaving}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-350 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-disabled:opacity-50" />
            </label>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200/40 dark:border-blue-800/30 rounded-xl text-[10px] text-blue-600 dark:text-blue-400 space-y-1">
        <p className="font-bold flex items-center gap-1">
          <Icon name="ℹ️" size={12} /> Lưu ý
        </p>
        <p>
          Phương thức COD (Thanh toán khi nhận hàng) được khuyến nghị bật thường xuyên. Đối với VNPAY và MoMo,
          cần cấu hình API key hợp lệ tại <strong>application.properties</strong> của backend.
        </p>
      </div>

      {/* Reset button only */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
        <button
          onClick={handleReset}
          disabled={isSaving}
          className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          Khôi phục mặc định
        </button>
      </div>
    </div>
  );
}
