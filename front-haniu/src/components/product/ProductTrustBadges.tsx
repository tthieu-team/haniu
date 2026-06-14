'use client';

import React from 'react';
import Icon from '@/components/common/Icons';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { useTranslate } from '@/lib/translator';

interface ProductTrustBadgesProps {
  product?: {
    layoutConfig?: string;
  };
}

export default function ProductTrustBadges({ product }: ProductTrustBadgesProps) {
  const globalTrustBadges = useHomeLayoutStore((state) => state.trustBadges);
  const trans = useTranslate();

  const globalConfig = globalTrustBadges || {
    showGenuine: true,
    showReturns: true,
    showShipping: true,
    showPayment: true,
    showSupport: true,
  };

  let finalConfig = { ...globalConfig };

  if (product?.layoutConfig) {
    try {
      const parsed = JSON.parse(product.layoutConfig);
      if (parsed.trustBadges && parsed.trustBadges.useGlobalConfig === false) {
        finalConfig = {
          showGenuine: parsed.trustBadges.showGenuine ?? true,
          showReturns: parsed.trustBadges.showReturns ?? true,
          showShipping: parsed.trustBadges.showShipping ?? true,
          showPayment: parsed.trustBadges.showPayment ?? true,
          showSupport: parsed.trustBadges.showSupport ?? true,
        };
      }
    } catch (e) {
      console.error('Failed to parse product trust badges layoutConfig:', e);
    }
  }

  const allBadges = [
    { id: 'showGenuine', text: 'Chính hãng', icon: 'check' },
    { id: 'showReturns', text: 'Đổi trả 7 ngày', icon: 'check' },
    { id: 'showShipping', text: 'Giao hàng toàn quốc', icon: 'check' },
    { id: 'showPayment', text: 'Thanh toán an toàn', icon: 'check' },
    { id: 'showSupport', text: 'Hỗ trợ 24/7', icon: 'check' }
  ];

  const badges = allBadges.filter(b => finalConfig[b.id as keyof typeof finalConfig]);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-around gap-4 sm:gap-6 py-5 px-4 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 rounded-2xl shadow-sm">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-650 dark:text-zinc-300">
          <Icon name={badge.icon} size={14} className="text-emerald-500 shrink-0" />
          <span>{trans(badge.text)}</span>
        </div>
      ))}
    </div>
  );
}


