'use client';

import React from 'react';
import Icon from '@/components/common/Icons';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { useTranslate } from '@/lib/translator';

interface ProductPromotionsProps {
  product: {
    layoutConfig?: string;
  };
}

export default function ProductPromotions({ product }: ProductPromotionsProps) {
  const globalProductDetails = useHomeLayoutStore((state) => state.productDetails);
  const trans = useTranslate();

  const globalConfig = globalProductDetails || {
    showPromotions: true,
    promotions: [
      "Miễn phí ship cho đơn từ 499k",
      "Giảm 10% khi mua 2 hộp quà",
      "Tặng thiệp viết tay miễn phí",
      "Freeship nội thành Hà Nội"
    ]
  };

  let finalConfig = {
    show: globalConfig.showPromotions,
    list: globalConfig.promotions
  };

  if (product?.layoutConfig) {
    try {
      const parsed = typeof product.layoutConfig === 'string' ? JSON.parse(product.layoutConfig) : product.layoutConfig;
      if (parsed.promotionsConfig && parsed.promotionsConfig.useGlobalConfig === false) {
        finalConfig = {
          show: parsed.promotionsConfig.show !== false,
          list: parsed.promotionsConfig.list || []
        };
      }
    } catch (e) {
      console.error('Failed to parse layoutConfig in ProductPromotions', e);
    }
  }

  if (!finalConfig.show) return null;

  return (
    <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-extrabold text-xs tracking-wider uppercase text-rose-500 flex items-center gap-2">
        <Icon name="🎉" size={14} className="text-rose-500 animate-bounce" /> {trans("Ưu đãi hôm nay")}
      </h3>
      <ul className="text-xs space-y-2.5 text-slate-650 dark:text-zinc-300 font-semibold pl-1">
        {finalConfig.list.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <Icon name="check" size={12} className="text-rose-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{trans(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


