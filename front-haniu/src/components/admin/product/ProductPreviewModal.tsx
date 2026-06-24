'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IframePreview } from '@/app/admin/layout-config/components/IframePreview';
import Icon from '@/components/common/Icons';

// Import detail page subcomponents
import MediaGallery from '@/components/product/MediaGallery';
import PersonalizationForm from '@/components/product/PersonalizationForm';
import GiftWrapSelector from '@/components/product/GiftWrapSelector';
import ProductInfo from '@/components/product/ProductInfo';
import ProductSpecifications from '@/components/product/ProductSpecifications';
import ProductReviews from '@/components/product/ProductReviews';
import ProductPolicies from '@/components/product/ProductPolicies';

import ProductPromotions from '@/components/product/ProductPromotions';
import ProductWhyChooseUs from '@/components/product/ProductWhyChooseUs';
import ProductDeliveryPolicy from '@/components/product/ProductDeliveryPolicy';
import ProductTrustBadges from '@/components/product/ProductTrustBadges';
import ProductBrandCommitment from '@/components/product/ProductBrandCommitment';
import ProductSeoDescription from '@/components/product/ProductSeoDescription';
import RelatedProducts from '@/components/product/RelatedProducts';

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

  const [avgRating, setAvgRating] = useState(4.8);
  const [totalReviews, setTotalReviews] = useState(128);
  const [activeDetailTab, setActiveDetailTab] = useState('description');

  const handleReviewsUpdated = (newAvg: number, newCount: number) => {
    setAvgRating(newAvg);
    setTotalReviews(newCount);
  };

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product.variants]);

  let customizationConfig = {
    showEngraving: false,
    showEngravingMockup: false,
    engravingLabel: "Khắc chữ / Tên theo yêu cầu (Miễn phí)",
    engravingPlaceholder: "Nhập tên hoặc lời chúc muốn khắc (tối đa 50 ký tự)",
    engravingMaxLength: 50,
    showCardMessage: true,
    showCardMessageMockup: true,
    cardMessageLabel: "Lời nhắn trên thiệp chúc mừng",
    cardMessagePlaceholder: "Nhập nội dung thư chúc mừng gửi tới người nhận...",
    showGiftWrap: true,
    giftWrapLabel: "Chọn ruy băng nơ / hộp gói",
    giftWrapOptions: [
      "🎀 Ruy băng Đỏ Lãng Mạn",
      "✨ Ruy băng Vàng Hoàng Gia",
      "📦 Gói bọc giấy Kraft Hoài Cổ"
    ],
    variantsLabel: "Chọn mẫu hộp quà / màu sắc"
  };

  if (product.layoutConfig) {
    try {
      const parsedLayout = typeof product.layoutConfig === 'string'
        ? JSON.parse(product.layoutConfig)
        : product.layoutConfig;
      if (parsedLayout?.customizationConfig) {
        customizationConfig = {
          ...customizationConfig,
          ...parsedLayout.customizationConfig
        };
      }
    } catch (e) {
      console.error('Failed to parse layoutConfig in ProductPreviewModal', e);
    }
  }

  // Adapter to ensure product has the expected category shape
  const adaptedProduct = {
    ...product,
    category: product.category || {
      name: product.categoryName || 'Combo Quà Tặng',
      slug: product.categorySlug || 'combo-qua-tang'
    },
    brand: product.brand || (product.brandName ? { name: product.brandName } : null),
    collection: product.collection || (product.collectionName ? { name: product.collectionName } : null)
  };

  return (
    <div className="space-y-6 md:space-y-12 text-slate-800 dark:text-zinc-150">
      {/* Back button */}
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors cursor-pointer">
        <Icon name="arrow-left" size={14} /> Trở lại danh sách sản phẩm
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* Left Column: Media gallery (Sticky) */}
        <div className="lg:col-span-7">
          <MediaGallery mediaList={product.media} name={product.name} videoUrl={product.videoUrl} />
        </div>

        {/* Right Column: Buy options, Personalization Form & Live Mockup */}
        <div className="lg:col-span-5 space-y-8">
           <ProductInfo
            product={adaptedProduct}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            averageRating={avgRating}
            totalReviews={totalReviews}
            onReviewsClick={() => {
              setActiveDetailTab('reviews');
              const el = document.getElementById('detail-tabs');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            giftWrap={giftWrap}
            setGiftWrap={setGiftWrap}
            giftWrapOptions={customizationConfig.giftWrapOptions}
            giftWrapLabel={customizationConfig.giftWrapLabel}
            showGiftWrap={customizationConfig.showGiftWrap}
            variantsLabel={customizationConfig.variantsLabel}
          />

          {/* Personalization Inputs */}
          {product.isCustomizable && (
            <div className="space-y-4">
              <PersonalizationForm
                engravingText={engravingText}
                setEngravingText={setEngravingText}
                cardMessage={cardMessage}
                setCardMessage={setCardMessage}
                config={customizationConfig}
              />
            </div>
          )}



          {/* Service options trigger block */}
          {product.allowAdminChat && (
            <div className="bg-sky-500/5 border border-sky-500/10 p-4 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                  <Icon name="phone" size={14} className="text-sky-500" /> Tư vấn thiết kế trực tiếp
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1">Trực tiếp thảo luận các yêu cầu đặc biệt với Haniu Admin.</p>
              </div>
              <button 
                type="button" 
                onClick={() => window.open('https://web.facebook.com/profile.php?id=61590521378095', '_blank')}
                className="bg-sky-500 text-white font-bold px-4 py-2 rounded-xl"
              >
                Chat ngay
              </button>
            </div>
          )}

          {product.allowPhotoUpload && (
            <div className="space-y-2.5 text-xs font-semibold">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tải ảnh thiết kế của bạn (Tùy chọn)</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-center hover:border-rose-500 dark:hover:border-rose-450 transition-colors">
                <span className="inline-block p-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-650 dark:text-zinc-400 mb-2">
                  <Icon name="camera" size={20} />
                </span>
                <p className="text-slate-500 font-semibold">Nhập để tải ảnh lên hoặc kéo thả vào đây</p>
                <p className="text-[9px] text-slate-400 mt-0.5 font-normal">Định dạng hỗ trợ: JPG, PNG (tối đa 5MB)</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 sm:gap-4">
            <button
              disabled
              className="flex-1 bg-slate-900 dark:bg-zinc-100 dark:text-zinc-950 text-white font-bold py-3 px-4 sm:py-3.5 sm:px-6 rounded-2xl transition-all shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 opacity-80"
            >
              <Icon name="bag" size={16} /> Thêm Vào Giỏ Hàng
            </button>
            <button disabled className="bg-rose-500 text-white font-bold py-3 px-4 sm:py-3.5 sm:px-6 rounded-2xl transition-all shadow-md shadow-rose-500/20 text-xs sm:text-sm opacity-80 flex items-center justify-center gap-2">
              <Icon name="zap" size={16} /> Mua Ngay
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <ProductTrustBadges product={adaptedProduct} />

      {/* Detailed Info & Reviews Split Section */}
      <div id="detail-tabs" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pt-6 md:pt-12 border-t border-slate-200 dark:border-zinc-800/80 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Tab buttons header */}
          <div className="flex gap-1 bg-slate-100/80 dark:bg-zinc-900/60 p-1.5 rounded-2xl border border-slate-200/50 dark:border-zinc-800/60 overflow-x-auto scrollbar-none w-full">
            {[
              { id: 'description', label: 'Mô tả & Câu chuyện', icon: 'gift' },
              { id: 'specifications', label: 'Thông số kỹ thuật', icon: 'settings' },
              { id: 'policies', label: 'Chính sách & Hướng dẫn', icon: 'shield' },
              { id: 'reviews', label: `Đánh giá (${totalReviews})`, icon: 'star' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDetailTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer text-xs font-bold ${activeDetailTab === tab.id
                  ? 'bg-white dark:bg-zinc-800 text-rose-500 dark:text-rose-400 shadow-md shadow-slate-200/50 dark:shadow-none'
                  : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
              >
                <Icon name={tab.icon} size={14} className={activeDetailTab === tab.id ? 'text-rose-500' : 'text-slate-400'} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          <div className="transition-all duration-300">
            {activeDetailTab === 'description' && (
              <div className="animate-fade-in">
                <ProductSeoDescription product={adaptedProduct} />
              </div>
            )}
            {activeDetailTab === 'specifications' && (
              <div className="animate-fade-in">
                <ProductSpecifications
                  specificationsString={typeof product.specifications === 'string' ? product.specifications : JSON.stringify(product.specifications)}
                  includedItemsString={typeof product.includedItems === 'string' ? product.includedItems : JSON.stringify(product.includedItems)}
                  attributes={product.attributes ? (Array.isArray(product.attributes) ? product.attributes : Object.entries(product.attributes).map(([name, value]) => ({ id: name, name, value }))) : []}
                />
              </div>
            )}
            {activeDetailTab === 'policies' && (
              <div className="animate-fade-in">
                <ProductPolicies product={adaptedProduct} />
              </div>
            )}
            {activeDetailTab === 'reviews' && (
              <div className="animate-fade-in">
                <ProductReviews
                  productId={product.id || 'preview-id'}
                  onReviewsUpdated={handleReviewsUpdated}
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <ProductPromotions product={adaptedProduct} />
          <ProductWhyChooseUs product={adaptedProduct} />
          <ProductDeliveryPolicy product={adaptedProduct} />
          <ProductBrandCommitment product={adaptedProduct} />
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProduct={adaptedProduct} />
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
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      ),
    },
    tablet: {
      name: 'Máy tính bảng',
      width: 768,
      height: 850,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <line x1="12" x2="12" y1="18" y2="18" />
        </svg>
      ),
    },
    mobile: {
      name: 'Điện thoại',
      width: 375,
      height: 667,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isActive
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
