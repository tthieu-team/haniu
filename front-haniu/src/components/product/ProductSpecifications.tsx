'use client';

import React from 'react';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

interface Attribute {
  id: string;
  name: string;
  value: string;
}
interface ProductSpecificationsProps {
  specificationsString?: string | null;
  includedItemsString?: string | null;
  attributes?: Attribute[];
}

export default function ProductSpecifications({
  specificationsString,
  includedItemsString,
  attributes
}: ProductSpecificationsProps) {
  const trans = useTranslate();
  let combinedSpecs: Record<string, string> = {};
  let includedItems: Record<string, string> = {};

  try {
    if (specificationsString) {
      combinedSpecs = JSON.parse(specificationsString);
    }
  } catch (e) {
    // Ignore error
  }

  try {
    if (includedItemsString) {
      includedItems = JSON.parse(includedItemsString);
    }
  } catch (e) {
    // Ignore error
  }

  if (attributes && Array.isArray(attributes)) {
    attributes.forEach(attr => {
      combinedSpecs[attr.name] = attr.value;
    });
  }

  const hasSpecs = Object.keys(combinedSpecs).length > 0;
  const hasIncludedItems = Object.keys(includedItems).length > 0;

  if (!hasSpecs && !hasIncludedItems) return null;

  return (
    <div className="space-y-6">
      {/* Specifications Box */}
      {hasSpecs && (
        <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-455 dark:text-zinc-400 flex items-center gap-2">
            <Icon name="settings" size={14} className="text-rose-500" /> {trans("Thông số kỹ thuật")}
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {Object.entries(combinedSpecs).map(([key, val]) => (
              <div key={key} className="border-b border-slate-100 dark:border-zinc-800/80 pb-2 text-xs">
                <dt className="text-slate-450 font-semibold">{trans(key)}</dt>
                <dd className="text-sm font-extrabold text-slate-700 dark:text-zinc-200 mt-0.5">{trans(val)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Included Items Box */}
      {Object.keys(includedItems).length > 0 && (
        <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="font-extrabold text-xs tracking-wider uppercase text-slate-455 dark:text-zinc-400 flex items-center gap-2">
            <Icon name="gift" size={14} className="text-rose-500" /> {trans("Chi tiết bộ quà tặng gồm")}
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {Object.entries(includedItems).map(([item, detail]) => (
              <div key={item} className="border-b border-slate-100 dark:border-zinc-800/80 pb-2 text-xs">
                <dt className="text-slate-450 font-semibold">{trans(item)}</dt>
                <dd className="text-sm font-extrabold text-slate-700 dark:text-zinc-200 mt-0.5">{trans(detail)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

