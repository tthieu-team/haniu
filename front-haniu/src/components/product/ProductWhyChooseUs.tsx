'use client';

import React from 'react';
import Icon from '@/components/common/Icons';
import { useHomeLayoutStore } from '@/store/homeLayout';

interface WhyChooseUsItem {
  icon: string;
  text: string;
}

interface ProductWhyChooseUsProps {
  product: {
    layoutConfig?: string;
  };
}

export default function ProductWhyChooseUs({ product }: ProductWhyChooseUsProps) {
  const globalProductDetails = useHomeLayoutStore((state) => state.productDetails);

  const globalConfig = globalProductDetails || {
    showWhyChooseUs: true,
    whyChooseUs: [
      { icon: "🌹", text: "Hoa sáp thơm giữ màu tới 3 năm" },
      { icon: "🎁", text: "Tặng kèm hộp quà cao cấp" },
      { icon: "✨", text: "Có thể cá nhân hóa khắc tên" },
      { icon: "🚚", text: "Giao nhanh toàn quốc" },
      { icon: "💝", text: "Phù hợp mọi dịp đặc biệt" }
    ]
  };

  let finalConfig = {
    show: globalConfig.showWhyChooseUs,
    list: globalConfig.whyChooseUs
  };

  if (product?.layoutConfig) {
    try {
      const parsed = typeof product.layoutConfig === 'string' ? JSON.parse(product.layoutConfig) : product.layoutConfig;
      if (parsed.whyChooseUsConfig && parsed.whyChooseUsConfig.useGlobalConfig === false) {
        finalConfig = {
          show: parsed.whyChooseUsConfig.show !== false,
          list: parsed.whyChooseUsConfig.list || []
        };
      }
    } catch (e) {
      console.error('Failed to parse layoutConfig in ProductWhyChooseUs', e);
    }
  }

  if (!finalConfig.show) return null;

  return (
    <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-450 dark:text-zinc-400 flex items-center gap-2">
        <Icon name="✨" size={14} className="text-rose-500 animate-pulse" /> Lý do nên chọn Haniu
      </h3>
      <div className="space-y-3.5 pl-1">
        {finalConfig.list.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center border border-rose-100/50 dark:border-rose-900/30 shrink-0">
              <Icon name={item.icon} size={14} />
            </span>
            <span className="text-xs text-slate-650 dark:text-zinc-300 font-semibold leading-normal">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


