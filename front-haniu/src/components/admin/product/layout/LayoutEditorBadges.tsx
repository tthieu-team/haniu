'use client';

import React from 'react';

interface TrustBadges {
  useGlobalConfig: boolean;
  showGenuine: boolean;
  showReturns: boolean;
  showShipping: boolean;
  showPayment: boolean;
  showSupport: boolean;
}

interface LayoutEditorBadgesProps {
  trustBadges: TrustBadges;
  onChangeBadge: (field: keyof TrustBadges, val: boolean) => void;
}

export default function LayoutEditorBadges({
  trustBadges,
  onChangeBadge
}: LayoutEditorBadgesProps) {
  const badgesList = [
    { id: 'showGenuine', label: 'Chính hãng' },
    { id: 'showReturns', label: 'Đổi trả 7 ngày' },
    { id: 'showShipping', label: 'Giao hàng toàn quốc' },
    { id: 'showPayment', label: 'Thanh toán an toàn' },
    { id: 'showSupport', label: 'Hỗ trợ 24/7' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-[10px] text-slate-400">
          Cấu hình hiển thị các huy hiệu tin cậy cho riêng sản phẩm này.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badgesList.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                {badge.label}
              </span>
              <button
                type="button"
                onClick={() => onChangeBadge(badge.id, !trustBadges[badge.id])}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  trustBadges[badge.id] ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    trustBadges[badge.id] ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
