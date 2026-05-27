'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

export default function ProductTrustBadges() {
  const badges = [
    { text: 'Chính hãng', icon: 'check' },
    { text: 'Đổi trả 7 ngày', icon: 'check' },
    { text: 'Giao hàng toàn quốc', icon: 'check' },
    { text: 'Thanh toán an toàn', icon: 'check' },
    { text: 'Hỗ trợ 24/7', icon: 'check' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-5 px-4 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 rounded-2xl shadow-sm">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center gap-2 justify-center text-[10px] font-bold text-slate-650 dark:text-zinc-300">
          <Icon name={badge.icon} size={14} className="text-emerald-500 shrink-0" />
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

