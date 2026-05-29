'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MediaGallery from '@/components/product/MediaGallery';
import PersonalizationForm from '@/components/product/PersonalizationForm';
import { useProductStore } from '@/store/product';
import { productService } from '@/services/product.service';
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

const MOCK_PRODUCTS: Record<string, Product> = {
  "hop-qua-lang-man-eternal-love": {
    id: "m1",
    name: "Hộp Quà Lãng Mạn - Eternal Love Special Edition",
    slug: "hop-qua-lang-man-eternal-love",
    sku: "GIFT-EL-001",
    description: "Set quà tặng cao cấp lý tưởng cho ngày kỷ niệm và lễ tình nhân. Bộ sản phẩm được bọc gói nghệ thuật trong hộp carton cứng sang trọng kèm nơ lụa. Bên trong gồm: 1 ly sứ đôi vẽ vàng cao cấp, 1 bó hoa hồng sáp thơm vĩnh cửu tinh tế, 1 tấm thiệp chúc mừng thiết kế riêng, và hệ thống đèn LED đom đóm lãng mạn cắm sẵn.",
    basePrice: 590000,
    salePrice: 490000,
    stock: 50,
    isFeatured: true,
    isNew: true,
    isCustomizable: true,
    category: { name: "Combo Quà Tặng", slug: "combo-qua-tang" },
    brand: { name: "Haniu Craft", slug: "haniu-craft" },
    collection: { name: "Bộ Sưu Tập Lãng Mạn", slug: "bst-lang-man" },
    specifications: JSON.stringify({
      "Chất liệu hộp": "Giấy Carton cứng bọc mỹ thuật",
      "Kích thước": "25 x 25 x 12 cm",
      "Số lượng chi tiết": "4 phụ kiện",
      "Xuất xứ": "Việt Nam"
    }),
    media: [
      { id: "md1", url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80", type: "IMAGE", isThumbnail: true },
      { id: "md2", url: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80", type: "IMAGE", isThumbnail: false }
    ],
    variants: [
      { id: "v1_1", sku: "GIFT-EL-001-RED", name: "Hộp Quà Lãng Mạn (Hoa Hồng Đỏ)", color: "Đỏ", size: "M", price: 590000, salePrice: 490000, stock: 30, imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80" },
      { id: "v1_2", sku: "GIFT-EL-001-PINK", name: "Hộp Quà Lãng Mạn (Hoa Hồng Hồng)", color: "Hồng", size: "M", price: 590000, salePrice: 490000, stock: 20, imageUrl: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80" }
    ]
  },
  "so-tay-da-that-khac-ten": {
    id: "m2",
    name: "Sổ Tay Da Thật Khắc Tên Cá Nhân Hóa",
    slug: "so-tay-da-that-khac-ten",
    sku: "GIFT-NB-002",
    description: "Sổ bìa da bò nguyên tấm với kỹ thuật may tay thủ công tạo điểm nhấn vintage mộc mạc. Giấy viết chất liệu kraft cao cấp chống lóa mỏi mắt, thấm mực nhanh. Thích hợp làm quà tặng ý nghĩa cho thầy cô giáo, đối tác trong các dịp đặc biệt. Đi kèm dịch vụ khắc laze tên hoặc logo doanh nghiệp.",
    basePrice: 350000,
    stock: 120,
    isFeatured: true,
    isNew: false,
    isCustomizable: true,
    category: { name: "Sổ Da & Bút", slug: "so-da-but" },
    brand: { name: "Haniu Craft", slug: "haniu-craft" },
    specifications: JSON.stringify({
      "Chất liệu bìa": "Da bò thật 100% nguyên tấm",
      "Kích thước giấy": "A5 (14.8 x 21 cm)",
      "Số trang": "200 trang",
      "Định lượng giấy": "100 gsm"
    }),
    media: [
      { id: "md3", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80", type: "IMAGE", isThumbnail: true }
    ],
    variants: [
      { id: "v2_1", sku: "GIFT-NB-002-BR", name: "Sổ Tay Da Thật (Nâu Đất)", color: "Nâu Đất", price: 350000, stock: 80 },
      { id: "v2_2", sku: "GIFT-NB-002-BL", name: "Sổ Tay Da Thật (Đen Đá)", color: "Đen", price: 350000, stock: 40 }
    ]
  }
};




export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const { loading, fetchProductBySlug } = useProductStore();
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
    async function loadProduct() {
      const data = await fetchProductBySlug(slug);

      if (data) {
        // Adapt backend price, boolean, and media thumbnail fields
        const adapted: Product = {
          ...data,
          basePrice: data.basePrice || (data as any).price || 0,
          isFeatured: (data as any).featured ?? (data as any).isFeatured ?? false,
          isNew: (data as any).new ?? (data as any).isNew ?? false,
          isCustomizable: (data as any).customizable ?? (data as any).isCustomizable ?? false,
          media: data.media?.map((m: any) => ({
            ...m,
            isThumbnail: m.thumbnail ?? m.isThumbnail ?? false
          })) || []
        } as unknown as Product;
        useProductStore.setState({ currentProduct: adapted as any });

        if (adapted.variants && adapted.variants.length > 0) {
          setSelectedVariant(adapted.variants[0] as unknown as Variant);
        }
      } else {
        fallbackMock();
      }
    }

    function fallbackMock() {
      const mock = MOCK_PRODUCTS[slug];
      if (mock) {
        useProductStore.setState({ currentProduct: mock as any });
        if (mock.variants && mock.variants.length > 0) {
          setSelectedVariant(mock.variants[0]);
        }
      } else {
        useProductStore.setState({ currentProduct: null });
      }
    }

    loadProduct();
  }, [slug, fetchProductBySlug]);

  // Dynamic SEO metadata client-side update
  useEffect(() => {
    if (product) {
      document.title = product.seoTitle || `${product.name} | Haniu Gift Shop`;

      // Set description meta tag
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', product.seoDescription || product.description || '');

      // Set keywords meta tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', product.seoKeywords || '');
    }
  }, [product]);

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

  // Schema structured SEO markup JSON-LD
  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.media && product.media.length > 0 ? product.media.map(m => m.url) : [''],
    "description": product.description,
    "sku": selectedVariant?.sku || product.sku,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "VND",
      "price": selectedVariant?.price || product.basePrice,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": (selectedVariant?.stock ?? product.stock) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": totalReviews > 0 ? totalReviews : 1
    }
  };

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
      console.error('Failed to parse layoutConfig in ProductDetailPage', e);
    }
  }

  return (
    <div className="space-y-6 md:space-y-12">
      {/* Schema JSON LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

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

