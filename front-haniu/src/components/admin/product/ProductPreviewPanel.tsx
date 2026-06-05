'use client';

import { useState, useEffect } from 'react';
import MediaGallery from '@/components/product/MediaGallery';
import PersonalizationForm from '@/components/product/PersonalizationForm';
import GiftWrapSelector from '@/components/product/GiftWrapSelector';
import Icon from '@/components/common/Icons';

interface Variant {
  id?: string;
  sku: string;
  name: string;
  color?: string;
  size?: string;
  material?: string;
  price: number;
  salePrice?: number;
  stock: number;
  imageUrl?: string;
}

interface Media {
  id?: string;
  url: string;
  type: string;
  altText?: string;
  isThumbnail: boolean;
}

interface PreviewProduct {
  name: string;
  sku: string;
  description: string;
  basePrice: number;
  salePrice?: number | null;
  stock: number;
  isCustomizable: boolean;
  categoryName?: string;
  brandName?: string;
  collectionName?: string;
  specifications: Record<string, string>; // parsed specs
  includedItems?: Record<string, string>; // parsed included items
  attributes: Record<string, string>; // parsed category/global attributes
  media: Media[];
  variants: Variant[];
  layoutConfig?: string;
}

interface ProductPreviewPanelProps {
  product: PreviewProduct;
}

export default function ProductPreviewPanel({ product }: ProductPreviewPanelProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // Customization fields state
  const [engravingText, setEngravingText] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [giftWrap, setGiftWrap] = useState('Red Ribbon');

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product.variants]);

  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.basePrice;
  const originalPrice = selectedVariant?.salePrice ? selectedVariant.price : (product.salePrice ? product.basePrice : null);

  // Combine specifications (JSONB dynamic specs) and category attributes for display
  const combinedSpecs = {
    ...product.specifications,
    ...product.attributes,
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-zinc-100 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-slate-100 dark:border-zinc-800 shadow-md">
      {/* Category and Badges */}
      <div className="flex flex-wrap gap-2 items-center">
        {product.categoryName && (
          <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {product.categoryName}
          </span>
        )}
        {product.brandName && (
          <span className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded">
            Hãng: {product.brandName}
          </span>
        )}
        {product.collectionName && (
          <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">
            {product.collectionName}
          </span>
        )}
      </div>

      {/* Name and SKU */}
      <div className="space-y-1.5">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
          {product.name}
        </h1>
        <p className="text-[10px] text-slate-400">
          Mã SKU: <span className="font-mono">{selectedVariant?.sku || product.sku || 'N/A'}</span>
        </p>
      </div>

      {/* Media Gallery */}
      <div className="w-full">
        <MediaGallery mediaList={product.media} name={product.name} />
      </div>

      {/* Price Box */}
      <div className="bg-rose-500/[0.03] dark:bg-rose-500/[0.01] border border-rose-500/10 p-4 rounded-2xl flex items-baseline gap-4">
        <span className="text-2xl font-black text-rose-500">
          {currentPrice ? currentPrice.toLocaleString('vi-VN') : '0'}đ
        </span>
        {originalPrice && originalPrice > currentPrice && (
          <span className="text-xs text-slate-400 line-through">
            {originalPrice.toLocaleString('vi-VN')}đ
          </span>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Mô tả sản phẩm</h4>
        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line text-xs font-normal">
          {product.description || 'Chưa nhập mô tả cho sản phẩm quà tặng này...'}
        </p>
      </div>

      {/* Variants Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Chọn mẫu hộp quà / màu sắc</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.variants.map((v, idx) => (
              <button
                key={v.id || idx}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`p-2.5 text-left rounded-xl border transition-all ${selectedVariant?.sku === v.sku
                    ? 'border-rose-500 bg-rose-50/10 text-rose-600 dark:border-rose-400 dark:text-rose-400 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
              >
                <div className="font-bold text-[11px] truncate">{v.name || `Biến thể ${idx + 1}`}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Giá: {v.price.toLocaleString('vi-VN')}đ • Kho: {v.stock} chiếc</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Personalization Section */}
      {(() => {
        let customizationConfig = undefined;
        if (product.layoutConfig) {
          try {
            const parsedLayout = typeof product.layoutConfig === 'string'
              ? JSON.parse(product.layoutConfig)
              : product.layoutConfig;
            customizationConfig = parsedLayout?.customizationConfig;
          } catch (e) {
            console.error('Failed to parse layoutConfig in ProductPreviewPanel', e);
          }
        }

        return product.isCustomizable && (
          <div className="pointer-events-none opacity-80 space-y-4">
            <PersonalizationForm
              engravingText={engravingText}
              setEngravingText={setEngravingText}
              cardMessage={cardMessage}
              setCardMessage={setCardMessage}
              config={customizationConfig}
            />
            <GiftWrapSelector
              giftWrap={giftWrap}
              setGiftWrap={setGiftWrap}
              options={customizationConfig?.giftWrapOptions}
              label={customizationConfig?.giftWrapLabel}
              show={customizationConfig?.showGiftWrap}
            />
          </div>
        );
      })()}

      {/* Specifications combined */}
      {Object.keys(combinedSpecs).length > 0 && (
        <div className="bg-slate-50 dark:bg-zinc-950/30 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800/60 space-y-3">
          <h3 className="font-bold text-[10px] tracking-wider uppercase text-slate-400 border-b border-slate-200/50 dark:border-zinc-800/50 pb-1">
            Thông số & Thuộc tính chi tiết
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
            {Object.entries(combinedSpecs).map(([key, val]) => {
              if (!val) return null;
              return (
                <div key={key} className="border-b border-slate-200/30 dark:border-zinc-800/20 pb-1.5 font-normal">
                  <dt className="text-slate-400">{key}</dt>
                  <dd className="text-slate-700 dark:text-zinc-200 font-bold mt-0.5">{val}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}

      {/* Included items preview */}
      {product.includedItems && Object.keys(product.includedItems).length > 0 && (
        <div className="bg-slate-50 dark:bg-zinc-950/30 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800/60 space-y-3">
          <h3 className="font-bold text-[10px] tracking-wider uppercase text-slate-400 border-b border-slate-200/50 dark:border-zinc-800/50 pb-1.5 flex items-center gap-1">
            🎁 Chi tiết bộ quà tặng gồm
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
            {Object.entries(product.includedItems).map(([item, qty]) => (
              <div key={item} className="border-b border-slate-200/30 dark:border-zinc-800/20 pb-1.5 font-normal">
                <dt className="text-slate-400">{item}</dt>
                <dd className="text-slate-700 dark:text-zinc-200 font-bold mt-0.5">{qty}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          disabled
          className="flex-1 bg-slate-900 dark:bg-zinc-100 dark:text-zinc-950 text-white font-bold py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 opacity-80"
        >
          <Icon name="🛍️" size={14} /> Thêm Vào Giỏ Hàng
        </button>
        <button
          type="button"
          disabled
          className="bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-[11px] opacity-80"
        >
          Mua Ngay
        </button>
      </div>
    </div>
  );
}
