'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface ProductBrandCommitmentProps {
  product: {
    layoutConfig?: string;
  };
}

export default function ProductBrandCommitment({ product }: ProductBrandCommitmentProps) {
  let config: any = {};
  try {
    if (product.layoutConfig) {
      config = typeof product.layoutConfig === 'string' ? JSON.parse(product.layoutConfig) : product.layoutConfig;
    }
  } catch (e) {
    console.error('Failed to parse layoutConfig in ProductBrandCommitment', e);
  }

  const show = config.showBrandCommitment !== false;
  if (!show) return null;

  const list: string[] = config.brandCommitment || [
    "Hình ảnh sản phẩm thật 100% tự chụp",
    "Đóng gói cẩn thận, chống va đập, bảo vệ tối đa",
    "Hoàn tiền hoặc đổi mới ngay lập tức nếu sản phẩm không giống mô tả"
  ];

  return (
    <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-450 dark:text-zinc-400 flex items-center gap-2">
        <Icon name="🤝" size={14} className="text-rose-500" /> Haniu cam kết:
      </h3>
      <div className="space-y-3 pl-1">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-650 dark:text-zinc-300">
            <Icon name="check" size={14} className="text-rose-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

