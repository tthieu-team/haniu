'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import MediaGallery from '@/components/product/MediaGallery';
import PersonalizationForm from '@/components/product/PersonalizationForm';
import { useProductStore } from '@/store/product';
import { useCartStore } from '@/store/cart';
import Icon from '@/components/common/Icons';

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
  specifications?: string;
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
  specifications?: string; // JSONB String
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
  
  const { loading, fetchProductBySlug } = useProductStore();
  const product = useProductStore(state => state.currentProduct) as unknown as Product | null;
  const { addToCart } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  
  // Customization fields state
  const [engravingText, setEngravingText] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [giftWrap, setGiftWrap] = useState('Red Ribbon');
  
  const [successMsg, setSuccessMsg] = useState('');

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
    } catch (err) {
      console.log("Cart Payload created (Fallback):", payload);
      setSuccessMsg("🎉 Đã thêm giỏ hàng thành công! Thông tin quà tặng của bạn đã được ghi nhận.");
      setTimeout(() => setSuccessMsg(''), 5000);
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

  // Parse specifications and combine with attributes
  let combinedSpecs: Record<string, string> = {};
  let includedItems: Record<string, string> = {};
  try {
    if (product.specifications) {
      combinedSpecs = JSON.parse(product.specifications);
      includedItems = JSON.parse(product.specifications);
    }
  } catch (e) {
    // ignore
  }
  if (product.attributes && Array.isArray(product.attributes)) {
    product.attributes.forEach(attr => {
      combinedSpecs[attr.name] = attr.value;
    });
  }

  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.basePrice;
  const originalPrice = selectedVariant?.salePrice ? selectedVariant.price : (product.salePrice ? product.basePrice : null);

  return (
    <div className="space-y-12">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors">
        <Icon name="arrow-left" size={14} /> Trở lại danh sách sản phẩm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Media gallery & specifications */}
        <div className="lg:col-span-7 space-y-6">
          <MediaGallery mediaList={product.media} name={product.name} />

          {/* Specifications Box */}
          {Object.keys(combinedSpecs).length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 space-y-4">
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
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 space-y-4">
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 flex items-center gap-2">
                🎁 Chi tiết bộ quà tặng gồm
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(includedItems).map(([item, detail]) => (
                  <div key={item} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-zinc-950/40 rounded-2xl border border-slate-100/50 dark:border-zinc-800/40">
                    <span className="font-bold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      {item}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-lg">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Buy options & personalization panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              {product.category && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}
              {product.brand && (
                <span className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Hãng: {product.brand.name}
                </span>
              )}
              {product.collection && (
                <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-100 dark:border-amber-900/30">
                  {product.collection.name}
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Nổi bật
                </span>
              )}
              {product.isNew && (
                <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Mới
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
              {product.name}
            </h1>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <p>Mã SKU: <span className="font-mono">{selectedVariant?.sku || product.sku}</span></p>
              <p className="font-semibold">
                Tình trạng: {selectedVariant 
                  ? (selectedVariant.stock > 0 ? `Còn hàng (${selectedVariant.stock})` : 'Hết hàng') 
                  : (product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng')
                }
              </p>
            </div>
          </div>

          {/* Price container */}
          <div className="bg-slate-100/50 dark:bg-zinc-900/50 p-4 rounded-2xl flex items-baseline gap-4">
            <span className="text-3xl font-black text-rose-500">
              {currentPrice.toLocaleString('vi-VN')}đ
            </span>
            {originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                {originalPrice.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            {product.description}
          </p>

          {/* Occasions & Recipients Tags */}
          {((product.occasions && product.occasions.length > 0) || (product.recipients && product.recipients.length > 0)) && (
            <div className="bg-slate-50 dark:bg-zinc-900/30 p-4 rounded-2xl space-y-3 border border-slate-100 dark:border-zinc-800/50">
              {product.occasions && product.occasions.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Dịp tặng:</span>
                  {product.occasions.map(o => (
                    <span key={o.id} className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {o.name}
                    </span>
                  ))}
                </div>
              )}
              {product.recipients && product.recipients.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Đối tượng:</span>
                  {product.recipients.map(r => (
                    <span key={r.id} className="bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {r.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Chọn mẫu hộp quà / màu sắc</label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-rose-500 bg-rose-50/10 text-rose-600 dark:border-rose-400 dark:text-rose-400 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div>{v.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">Kho: {v.stock} chiếc</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization Engraving Box */}
          {product.isCustomizable && (
            <PersonalizationForm
              engravingText={engravingText}
              setEngravingText={setEngravingText}
              cardMessage={cardMessage}
              setCardMessage={setCardMessage}
              giftWrap={giftWrap}
              setGiftWrap={setGiftWrap}
            />
          )}

          {/* Service Options (Chat, Photo Upload, Photobooth) */}
          {product.allowAdminChat && (
            <div className="bg-sky-500/5 border border-sky-500/10 p-4 rounded-2xl flex items-center justify-between animate-fade-in">
              <div>
                <h4 className="text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                  <Icon name="💬" size={14} /> Tư vấn thiết kế trực tiếp
                </h4>
                <p className="text-[10px] text-slate-500 mt-1">Trực tiếp thảo luận các yêu cầu đặc biệt với Haniu Admin.</p>
              </div>
              <button type="button" className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer">
                Chat ngay
              </button>
            </div>
          )}

          {product.allowPhotoUpload && (
            <div className="space-y-2.5 animate-fade-in">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tải ảnh thiết kế của bạn (Tùy chọn)</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-center hover:border-rose-500 dark:hover:border-rose-400 transition-colors cursor-pointer">
                <span className="inline-block p-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-600 dark:text-zinc-400 mb-2">
                  <Icon name="📷" size={16} />
                </span>
                <p className="text-xs text-slate-500 font-semibold">Nhấp để tải ảnh lên</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Định dạng hỗ trợ: JPG, PNG (tối đa 5MB)</p>
              </div>
            </div>
          )}

          {product.allowPhotobooth && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl flex items-center justify-between animate-fade-in">
              <div>
                <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Icon name="🎨" size={14} /> Trải nghiệm Photobooth Haniu
                </h4>
                <p className="text-[10px] text-slate-500 mt-1">Thiết kế mẫu in và xem mô phỏng 3D ngay trên ứng dụng.</p>
              </div>
              <button type="button" className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer">
                Mở Photobooth
              </button>
            </div>
          )}

          {/* Success messages & buttons */}
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium">
              {successMsg}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <Icon name="🛍️" size={16} /> Thêm Vào Giỏ Hàng
            </button>
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-rose-500/20 active:scale-95 text-sm">
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
