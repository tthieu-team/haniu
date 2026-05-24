'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IframePreview } from '@/app/admin/layout-config/components/IframePreview';
import MediaGallery from '@/components/product/MediaGallery';
import PersonalizationForm from '@/components/product/PersonalizationForm';
import Icon from '@/components/common/Icons';

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

function ProductDetailPreview({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
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

  let parsedSpecs: Record<string, string> = {};
  if (product.specifications) {
    if (typeof product.specifications === 'string') {
      try {
        parsedSpecs = JSON.parse(product.specifications);
      } catch (e) {
        parsedSpecs = {};
      }
    } else {
      parsedSpecs = product.specifications;
    }
  }

  // Combine with attributes if present for display in specifications
  const combinedSpecs: Record<string, string> = {
    ...parsedSpecs,
    ...(product.attributes as Record<string, string> || {}),
  };

  return (
    <div className="space-y-12 text-slate-800 dark:text-zinc-150">
      {/* Back button */}
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors cursor-pointer">
        <Icon name="arrow-left" size={14} /> Trở lại danh sách sản phẩm
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Media gallery & specifications */}
        <div className="lg:col-span-7 space-y-6">
          <MediaGallery mediaList={product.media} name={product.name} />

          {/* Specifications Box */}
          {Object.keys(combinedSpecs).length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 space-y-4">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400">Thông số kỹ thuật</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {Object.entries(combinedSpecs).map(([key, val]) => {
                  if (!val) return null;
                  return (
                    <div key={key} className="border-b border-slate-50 dark:border-zinc-800 pb-2 text-xs">
                      <dt className="text-slate-400 font-medium">{key}</dt>
                      <dd className="text-sm font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">{val}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}
        </div>

        {/* Right: Buy options & personalization panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              {(product.categoryName || product.category) && (
                <span className="bg-rose-100 dark:bg-rose-955/30 text-rose-700 dark:text-rose-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.categoryName || product.category?.name}
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-amber-100 dark:bg-amber-955/30 text-amber-800 dark:text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Nổi bật
                </span>
              )}
              {product.isNew && (
                <span className="bg-emerald-100 dark:bg-emerald-955/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Mới
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400">
              Mã SKU: <span className="font-mono">{selectedVariant?.sku || product.sku}</span>
            </p>
          </div>

          {/* Price container */}
          <div className="bg-slate-100/50 dark:bg-zinc-900/50 p-4 rounded-2xl flex items-baseline gap-4">
            <span className="text-3xl font-black text-rose-500">
              {currentPrice ? currentPrice.toLocaleString('vi-VN') : '0'}đ
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-sm text-slate-400 line-through">
                {originalPrice.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>

          <p className="text-sm text-slate-650 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
            {product.description || 'Chưa nhập mô tả cho sản phẩm quà tặng này...'}
          </p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Chọn mẫu hộp quà / màu sắc</label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v: any, idx: number) => (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                      selectedVariant?.sku === v.sku
                        ? 'border-rose-500 bg-rose-50/10 text-rose-600 dark:border-rose-400 dark:text-rose-400 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className="truncate font-bold">{v.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">Kho: {v.stock} chiếc</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization Engraving Box */}
          {product.isCustomizable && (
            <div className="pointer-events-none opacity-90">
              <PersonalizationForm
                engravingText={engravingText}
                setEngravingText={setEngravingText}
                cardMessage={cardMessage}
                setCardMessage={setCardMessage}
                giftWrap={giftWrap}
                setGiftWrap={setGiftWrap}
              />
            </div>
          )}

          {/* Service Options (Chat, Photo Upload, Photobooth) */}
          {product.allowAdminChat && (
            <div className="bg-sky-500/5 border border-sky-500/10 p-4 rounded-2xl flex items-center justify-between animate-fade-in pointer-events-none opacity-90">
              <div>
                <h4 className="text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                  <Icon name="💬" size={14} /> Tư vấn thiết kế trực tiếp
                </h4>
                <p className="text-[10px] text-slate-500 mt-1">Trực tiếp thảo luận các yêu cầu đặc biệt với Haniu Admin.</p>
              </div>
              <button type="button" className="bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1">
                Chat ngay
              </button>
            </div>
          )}

          {product.allowPhotoUpload && (
            <div className="space-y-2.5 animate-fade-in pointer-events-none opacity-90">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tải ảnh thiết kế của bạn (Tùy chọn)</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-center">
                <span className="inline-block p-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-600 dark:text-zinc-400 mb-2">
                  <Icon name="📷" size={16} />
                </span>
                <p className="text-xs text-slate-500 font-semibold">Nhấp để tải ảnh lên</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Định dạng hỗ trợ: JPG, PNG (tối đa 5MB)</p>
              </div>
            </div>
          )}

          {product.allowPhotobooth && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl flex items-center justify-between animate-fade-in pointer-events-none opacity-90">
              <div>
                <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Icon name="🎨" size={14} /> Trải nghiệm Photobooth Haniu
                </h4>
                <p className="text-[10px] text-slate-500 mt-1">Thiết kế mẫu in và xem mô phỏng 3D ngay trên ứng dụng.</p>
              </div>
              <button type="button" className="bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1">
                Mở Photobooth
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <button
              disabled
              className="flex-1 bg-slate-900 dark:bg-zinc-100 dark:text-zinc-950 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md active:scale-95 text-sm flex items-center justify-center gap-2 opacity-80"
            >
              <Icon name="🛍️" size={16} /> Thêm Vào Giỏ Hàng
            </button>
            <button disabled className="bg-rose-500 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-rose-500/20 active:scale-95 text-sm opacity-80">
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductPreviewModal({ isOpen, onClose, product }: ProductPreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ResizeObserver to track available container size for proper scaling
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      setContainerWidth(entries[0].contentRect.width);
    });

    observer.observe(canvasRef.current);
    
    // Initial size
    setContainerWidth(canvasRef.current.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const devices: Record<DeviceMode, DeviceConfig> = {
    desktop: {
      name: 'Máy tính',
      width: 1280,
      height: 720,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="3" rx="2"/>
          <line x1="8" x2="16" y1="21" y2="21"/>
          <line x1="12" x2="12" y1="17" y2="21"/>
        </svg>
      ),
    },
    tablet: {
      name: 'Máy tính bảng',
      width: 768,
      height: 850,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
          <line x1="12" x2="12" y1="18" y2="18"/>
        </svg>
      ),
    },
    mobile: {
      name: 'Điện thoại',
      width: 375,
      height: 667,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
          <path d="M12 18h.01"/>
        </svg>
      ),
    },
  };

  const currentDevice = devices[deviceMode];
  const targetWidth = currentDevice.width;
  const padding = 40; // margin padding
  const availableWidth = containerWidth - padding;
  const scale = availableWidth < targetWidth && availableWidth > 0 ? availableWidth / targetWidth : 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 transition-all duration-300 animate-fade-in text-xs font-medium">
      <div 
        className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[28px] w-full max-w-[96vw] xl:max-w-[1400px] h-[94vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Xem Trước Giao Diện Chi Tiết Sản Phẩm
              </h3>
              <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold px-2 py-0.5 rounded-full uppercase">
                {product.categoryName || 'Sản phẩm'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Xem trước hiển thị giao diện chi tiết sản phẩm trên các thiết bị khách hàng (chuẩn responsive).
            </p>
          </div>

          {/* Size Selectors & Close */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl flex items-center gap-1">
              {(Object.keys(devices) as DeviceMode[]).map((mode) => {
                const dev = devices[mode];
                const isActive = deviceMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setDeviceMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-zinc-700 text-rose-500 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {dev.icon}
                    <span className="hidden md:inline">{dev.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-650 dark:hover:text-zinc-200 transition-all cursor-pointer active:scale-90"
              aria-label="Close modal"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div 
          ref={canvasRef} 
          className="flex-1 bg-slate-200 dark:bg-zinc-955 p-6 flex items-center justify-center overflow-hidden relative"
          style={{
            backgroundImage: `radial-gradient(circle, var(--border-color, #e2e8f0) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        >
          {/* Simulated Screen with scale container */}
          <div
            style={{
              width: `${targetWidth * scale}px`,
              height: `${currentDevice.height * scale}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
            className="transition-all duration-300 relative shadow-2xl rounded-2xl border border-slate-300 dark:border-zinc-800"
          >
            <div
              style={{
                width: `${targetWidth}px`,
                height: `${currentDevice.height}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
              className="bg-[#FAF5F2] dark:bg-zinc-900 relative flex flex-col shrink-0 overflow-hidden"
            >
              <IframePreview>
                <div className="relative w-full h-full bg-[#FAF5F2] dark:bg-zinc-950 overflow-y-auto p-4 sm:p-6 md:p-8">
                  <div className="max-w-6xl mx-auto pb-16">
                    <ProductDetailPreview product={product} />
                  </div>
                </div>
              </IframePreview>
            </div>
          </div>

          {/* Scale display indicator */}
          {scale < 1 && (
            <div className="absolute bottom-3 right-4 bg-slate-800/90 backdrop-blur-sm text-[10px] text-white/90 px-2.5 py-1 rounded-lg font-bold">
              Đang thu nhỏ: {Math.round(scale * 100)}%
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center text-[10px] text-slate-400 shrink-0">
          <span>Kích thước giả lập: {currentDevice.width} × {currentDevice.height} ({currentDevice.name})</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Kết nối trực tiếp Store
          </span>
        </div>
      </div>
    </div>
  );
}
