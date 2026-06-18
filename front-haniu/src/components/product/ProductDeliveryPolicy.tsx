'use client';

import React from 'react';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

interface ProductDeliveryPolicyProps {
  product: {
    layoutConfig?: string;
  };
}

export default function ProductDeliveryPolicy({ product }: ProductDeliveryPolicyProps) {
  const trans = useTranslate();

  const defaultLocalConfig = {
    showDeliveryPolicy: true,
    deliveryPolicy: {
      lines: [
        { label: "Nội thành Hà Nội", value: "2 - 4h (Hỏa tốc)" },
        { label: "Toàn quốc", value: "2 - 5 ngày" }
      ],
      bulletPoints: [
        "Kiểm tra hàng trước khi thanh toán (Đồng kiểm)",
        "Đóng gói kín đáo, bảo mật thông tin quà tặng"
      ]
    }
  };

  let finalConfig = {
    show: defaultLocalConfig.showDeliveryPolicy,
    lines: defaultLocalConfig.deliveryPolicy?.lines || [],
    bulletPoints: defaultLocalConfig.deliveryPolicy?.bulletPoints || []
  };

  if (product?.layoutConfig) {
    try {
      const parsed = typeof product.layoutConfig === 'string' ? JSON.parse(product.layoutConfig) : product.layoutConfig;
      if (parsed.deliveryPolicyConfig) {
        finalConfig = {
          show: parsed.deliveryPolicyConfig.show !== false,
          lines: parsed.deliveryPolicyConfig.lines || [],
          bulletPoints: parsed.deliveryPolicyConfig.bulletPoints || []
        };
      }
    } catch (e) {
      console.error('Failed to parse layoutConfig in ProductDeliveryPolicy', e);
    }
  }

  if (!finalConfig.show) return null;

  return (
    <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-450 dark:text-zinc-400 flex items-center gap-2">
        <Icon name="🚚" size={14} className="text-rose-500" /> {trans("Chính sách giao hàng")}
      </h3>
      <div className="space-y-3.5">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
          {finalConfig.lines.map((line: any, idx: number) => (
            <div key={idx} className="text-xs">
              <dt className="text-slate-450 font-semibold">{trans(line.label)}</dt>
              <dd className="text-sm font-extrabold text-slate-700 dark:text-zinc-200 mt-0.5">{trans(line.value)}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-2.5 pt-1">
          {finalConfig.bulletPoints.map((point: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-650 dark:text-zinc-300">
              <Icon name="check" size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{trans(point)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


