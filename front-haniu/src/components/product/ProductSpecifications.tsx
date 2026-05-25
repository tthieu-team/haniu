'use client';

import React from 'react';

interface Attribute {
  id: string;
  name: string;
  value: string;
}



export default function ProductSpecifications({
  specificationsString,
  includedItemsString,
  attributes
}: ProductSpecificationsProps) {
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
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400">Thông số kỹ thuật</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {Object.entries(combinedSpecs).map(([key, val]) => (
              <div key={key} className="border-b border-slate-50 dark:border-zinc-800 pb-2 text-xs">
                <dt className="text-slate-400 font-medium">{key}</dt>
                <dd className="text-sm font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Included Items Box */}
      {Object.keys(includedItems).length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 flex items-center gap-2">
            🎁 Chi tiết bộ quà tặng gồm
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {Object.entries(includedItems).map(([item, detail]) => (
              <div key={item} className="border-b border-slate-50 dark:border-zinc-800 pb-2 text-xs">
                <dt className="text-slate-400 font-medium">{item}</dt>
                <dd className="text-sm font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
