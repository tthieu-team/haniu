'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MediaGallery from '@/components/product/MediaGallery';
import PersonalizationForm from '@/components/product/PersonalizationForm';
import { useProductStore } from '@/store/product';
import { useCartStore } from '@/store/cart';
import { cartService } from '@/services/cart.service';
import Icon from '@/components/common/Icons';

// Upgraded subcomponents
import ProductInfo from '@/components/product/ProductInfo';
import ProductSpecifications from '@/components/product/ProductSpecifications';
import dynamic from 'next/dynamic';
const RealtimePreview = dynamic(() => import('@/components/product/RealtimePreview'), { ssr: false });
import ProductReviews from '@/components/product/ProductReviews';
import ProductPolicies from '@/components/product/ProductPolicies';
import StickyBuyBar from '@/components/product/StickyBuyBar';

// New detail components
import ProductPromotions from '@/components/product/ProductPromotions';
import ProductWhyChooseUs from '@/components/product/ProductWhyChooseUs';
import ProductDeliveryPolicy from '@/components/product/ProductDeliveryPolicy';
import ProductTrustBadges from '@/components/product/ProductTrustBadges';
import ProductBrandCommitment from '@/components/product/ProductBrandCommitment';
import ProductSeoDescription from '@/components/product/ProductSeoDescription';
import RelatedProducts from '@/components/product/RelatedProducts';

interface Variant {
  id: string;
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
  id: string;
  url: string;
  type: string;
  altText?: string;
  isThumbnail: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  basePrice: number;
  salePrice?: number | null;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
  allowAdminChat?: boolean;
  allowPhotoUpload?: boolean;
  allowPhotobooth?: boolean;
  category?: { id?: string; name: string; slug: string };
  brand?: { id?: string; name: string; slug: string } | null;
  collection?: { id?: string; name: string; slug: string } | null;
  occasions?: Array<{ id: string; name: string; slug: string }>;
  recipients?: Array<{ id: string; name: string; slug: string }>;
  attributes?: Array<{ id: string; name: string; value: string }>;
  specifications?: string;
  includedItems?: string;
  layoutTemplate?: string;
  layoutConfig?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  variants?: Variant[];
  media?: Media[];
}

interface ProductDetailClientProps {
  slug: string;
  initialProduct: Product | null;
}

export default function ProductDetailClient({ slug, initialProduct }: ProductDetailClientProps) {
  const router = useRouter();

  const { loading } = useProductStore();
  const product = useProductStore(state => state.currentProduct) as unknown as Product | null;
  const { addToCart } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // Customization fields state
  const [engravingText, setEngravingText] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [giftWrap, setGiftWrap] = useState('Red Ribbon');

  const [successMsg, setSuccessMsg] = useState('');

  // Rating and review counters synchronized dynamically with reviews list
  const [avgRating, setAvgRating] = useState(4.8);
  const [totalReviews, setTotalReviews] = useState(128);
  const [activeDetailTab, setActiveDetailTab] = useState('description');

  const handleReviewsUpdated = (newAvg: number, newCount: number) => {
    setAvgRating(newAvg);
    setTotalReviews(newCount);
  };

  useEffect(() => {
    if (initialProduct) {
      useProductStore.setState({ currentProduct: initialProduct as any });
      if (initialProduct.variants && initialProduct.variants.length > 0) {
        setSelectedVariant(initialProduct.variants[0] as unknown as Variant);
      }
    } else {
      useProductStore.setState({ currentProduct: null });
    }
  }, [initialProduct]);

  const handleAddToCart = async () => {
    if (!product) return;

    const payload = {
      productId: product.id,
      variantId: selectedVariant?.id || undefined,
      quantity: 1,
      customizationInfo: product.isCustomizable ? JSON.stringify({
        engravingText,
        cardMessage,
        giftWrap
      }) : undefined
    };

    try {
      await addToCart(payload);
      setSuccessMsg("🎉 Đã thêm giỏ hàng thành công! Thông tin quà tặng của bạn đã được ghi nhận.");
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      console.error("Add to cart failed:", err);
      setSuccessMsg(`❌ Lỗi: ${err.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại!'}`);
      setTimeout(() => setSuccessMsg(''), 6000);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    const payload = {
      productId: product.id,
      variantId: selectedVariant?.id || undefined,
      quantity: 1,
      customizationInfo: product.isCustomizable ? JSON.stringify({
        engravingText,
        cardMessage,
        giftWrap
      }) : undefined
    };

    try {
      const buyNowCart = await cartService.createBuyNowCart(payload);
      if (buyNowCart && buyNowCart.id) {
        router.push(`/checkout?cartId=${buyNowCart.id}&buyNow=true`);
      } else {
        await addToCart(payload);
        router.push('/checkout');
      }
    } catch (err) {
      console.error("Buy now failed:", err);
      try {
        await addToCart(payload);
        router.push('/checkout');
      } catch (e) {
        router.push('/cart');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm quà tặng</h2>
        <Link href="/" className="text-rose-500 hover:underline">Về trang chủ</Link>
      </div>
    );
  }

  let customizationConfig = {
    showEngraving: true,
    showEngravingMockup: true,
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
      "Ruy băng Đỏ Lãng Mạn",
      "Ruy băng Vàng Hoàng Gia",
      "Gói bọc giấy Kraft Hoài Cổ"
    ]
  };

  if (product && product.layoutConfig) {
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
      console.error('Failed to parse layoutConfig in ProductDetailClient', e);
    }
  }

  return (
    <div className="space-y-6 md:space-y-12">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors">
        <Icon name="arrow-left" size={14} /> Trở lại danh sách sản phẩm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* Left Column: Media gallery (Sticky) */}
        <div className="lg:col-span-7 lg:sticky lg:top-28">
          <MediaGallery mediaList={product.media} name={product.name} />
        </div>

        {/* Right Column: Buy options, Personalization Form & Live Mockup */}
        <div className="lg:col-span-5 space-y-8">
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            averageRating={avgRating}
            totalReviews={totalReviews}
            onReviewsClick={() => {
              setActiveDetailTab('reviews');
              document.getElementById('detail-tabs')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Personalization Inputs */}
          {product.isCustomizable && (
            <PersonalizationForm
              engravingText={engravingText}
              setEngravingText={setEngravingText}
              cardMessage={cardMessage}
              setCardMessage={setCardMessage}
              giftWrap={giftWrap}
              setGiftWrap={setGiftWrap}
              config={customizationConfig}
            />
          )}

          {/* Real-time mockup engraving canvas */}
          <RealtimePreview
            engravingText={engravingText}
            cardMessage={cardMessage}
            giftWrap={giftWrap}
            isCustomizable={product.isCustomizable}
            config={customizationConfig}
          />

          {/* Service options trigger block */}
          {product.allowAdminChat && (
            <div className="bg-sky-500/5 border border-sky-500/10 p-4 rounded-2xl flex items-center justify-between animate-fade-in text-xs">
              <div>
                <h4 className="font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                  <Icon name="phone" size={14} className="text-sky-500" /> Tư vấn thiết kế trực tiếp
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1">Trực tiếp thảo luận các yêu cầu đặc biệt với Haniu Admin.</p>
              </div>
              <button type="button" className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer">
                Chat ngay
              </button>
            </div>
          )}

          {product.allowPhotoUpload && (
            <div className="space-y-2.5 animate-fade-in text-xs font-semibold">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tải ảnh thiết kế của bạn (Tùy chọn)</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-center hover:border-rose-500 dark:hover:border-rose-450 transition-colors cursor-pointer">
                <span className="inline-block p-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-650 dark:text-zinc-400 mb-2">
                  <Icon name="camera" size={20} />
                </span>
                <p className="text-slate-500 font-semibold">Nhập để tải ảnh lên hoặc kéo thả vào đây</p>
                <p className="text-[9px] text-slate-400 mt-0.5 font-normal">Định dạng hỗ trợ: JPG, PNG (tối đa 5MB)</p>
              </div>
            </div>
          )}

          {/* Success messages & CTAs */}
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium animate-fade-in flex items-center gap-2">
              <Icon name="check" size={14} className="text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-slate-900 hover:bg-slate-850 dark:bg-zinc-100 dark:text-zinc-950 text-white font-bold py-3 px-4 sm:py-3.5 sm:px-6 rounded-2xl transition-all shadow-md active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Icon name="bag" size={16} /> Thêm Vào Giỏ Hàng
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 sm:py-3.5 sm:px-6 rounded-2xl transition-all shadow-md shadow-rose-500/20 active:scale-95 text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="zap" size={16} /> Mua Ngay
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges (Horizontal safety bar) */}
      <ProductTrustBadges product={product} />

      {/* Detailed Information & Reviews Split Section */}
      <div id="detail-tabs" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pt-6 md:pt-12 border-t border-slate-200 dark:border-zinc-800/80 items-start">
        {/* Left Column: Tabbed Content (Description, Specs, Reviews) */}
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
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer text-xs font-bold ${
                  activeDetailTab === tab.id
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
                <ProductSeoDescription product={product} />
              </div>
            )}
            {activeDetailTab === 'specifications' && (
              <div className="animate-fade-in">
                <ProductSpecifications
                  specificationsString={product.specifications}
                  includedItemsString={product.includedItems}
                  attributes={product.attributes}
                />
              </div>
            )}
            {activeDetailTab === 'policies' && (
              <div className="animate-fade-in">
                <ProductPolicies product={product} />
              </div>
            )}
            {activeDetailTab === 'reviews' && (
              <div className="animate-fade-in">
                <ProductReviews
                  productId={product.id}
                  onReviewsUpdated={handleReviewsUpdated}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assurances & Trust Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Promotions */}
          <ProductPromotions product={product} />

          {/* Why Choose Us */}
          <ProductWhyChooseUs product={product} />

          {/* Delivery Policy */}
          <ProductDeliveryPolicy product={product} />

          {/* Brand Commitment */}
          <ProductBrandCommitment product={product} />
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProduct={product} />

      {/* Floating Sticky Buy Bar on scroll */}
      <StickyBuyBar
        product={product}
        selectedVariant={selectedVariant}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}
