'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/services/product.service';
import { catalogService } from '@/services/catalog.service';
import {
  HeroSection,
  BrandIntroSection,
  CategoriesSection,
  FeaturedProductsSection,
  BenefitsSection,
  SocialProofSection,
  CTASection,
  FAQSection,
  LiveConfigPanel,
  TrustBar,
  VideoBanner,
  CollectionsSection,
  UgcFeedSection,
  BlogSection,
  HowItWorksSection,
  StorySection,
  ScrollReveal,
  BackToTop,
} from '@/components/home';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price?: number;
  basePrice?: number;
  salePrice?: number;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
  category?: { name: string; slug: string };
  media?: Array<{ url: string; isThumbnail: boolean }>;
  occasions?: Array<{ name: string; slug: string }>;
  recipients?: Array<{ name: string; slug: string }>;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "m1",
    name: "Hộp Quà Lãng Mạn - Eternal Love Special Edition",
    slug: "hop-qua-lang-man-eternal-love",
    sku: "GIFT-EL-001",
    description: "Set quà tặng cao cấp gồm hoa sáp thơm, ly sứ khắc tên, thiệp viết tay và đèn LED trang trí lãng mạn.",
    basePrice: 590000,
    salePrice: 490000,
    stock: 50,
    isFeatured: true,
    isNew: true,
    isCustomizable: true,
    category: { name: "Combo Quà Tặng", slug: "combo-qua-tang" },
    media: [
      { url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80", isThumbnail: true },
      { url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80", isThumbnail: false }
    ],
    occasions: [{ name: "Lễ Tình Nhân", slug: "valentine" }, { name: "Sinh Nhật", slug: "sinh-nhat" }],
    recipients: [{ name: "Bạn Gái", slug: "ban-gai" }]
  },
  {
    id: "m2",
    name: "Sổ Tay Da Thật Khắc Tên Cá Nhân Hóa",
    slug: "so-tay-da-that-khac-ten",
    sku: "GIFT-NB-002",
    description: "Sổ bìa da bò thật cao cấp, giấy nhám kraft vintage, hỗ trợ khắc laze tên và lời chúc ý nghĩa theo yêu cầu.",
    basePrice: 350000,
    stock: 120,
    isFeatured: true,
    isNew: false,
    isCustomizable: true,
    category: { name: "Sổ Da & Bút", slug: "so-da-but" },
    media: [
      { url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80", isThumbnail: true },
      { url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80", isThumbnail: false }
    ],
    occasions: [{ name: "Kỷ Niệm", slug: "ky-niem" }, { name: "Ngày Ngày Nhà Giáo 20-11", slug: "20-11" }],
    recipients: [{ name: "Thầy Cô", slug: "thay-co" }, { name: "Đối Tác", slug: "doi-tac" }]
  },
  {
    id: "m3",
    name: "Ly Sứ Cao Cấp Vẽ Tay - Men Hỏa Biến",
    slug: "ly-su-men-hoa-bien",
    sku: "GIFT-MUG-003",
    description: "Ly sứ Bát Tràng tráng men hỏa biến độc bản, chế tác tinh xảo, màu sắc biến đổi theo nhiệt độ lò.",
    basePrice: 220000,
    salePrice: 180000,
    stock: 200,
    isFeatured: false,
    isNew: true,
    isCustomizable: false,
    category: { name: "Ly Sứ", slug: "ly-su" },
    media: [
      { url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80", isThumbnail: true },
      { url: "https://images.unsplash.com/photo-1536304997881-a372c179924b?w=500&auto=format&fit=crop&q=80", isThumbnail: false }
    ],
    occasions: [{ name: "Sinh Nhật", slug: "sinh-nhat" }],
    recipients: [{ name: "Bạn Bè", slug: "ban-be" }]
  },
  {
    id: "m4",
    name: "Set Quà Lưu Niệm Đồ Gỗ Yêu Nước - Bản Đồ Việt Nam",
    slug: "tranh-go-ban-do-viet-nam",
    sku: "GIFT-WOOD-004",
    description: "Tranh khắc gỗ 3D Bản đồ Việt Nam đầy đủ Hoàng Sa, Trường Sa, sử dụng chất liệu gỗ tự nhiên sơn dầu bảo vệ.",
    basePrice: 1200000,
    salePrice: 950000,
    stock: 15,
    isFeatured: true,
    isNew: true,
    isCustomizable: true,
    category: { name: "Đồ Lưu Niệm", slug: "do-luu-niem" },
    media: [
      { url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&auto=format&fit=crop&q=80", isThumbnail: true },
      { url: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500&auto=format&fit=crop&q=80", isThumbnail: false }
    ],
    occasions: [{ name: "Quốc Khánh 2-9", slug: "quoc-khanh" }, { name: "Sự Kiện Đối Ngoại", slug: "su-kien" }],
    recipients: [{ name: "Đối Tác", slug: "doi-tac" }, { name: "Người Nước Ngoài", slug: "nuoc-ngoai" }]
  }
];

function HomeContent() {
  const searchParams = useSearchParams();
  const searchParamVal = searchParams.get('search') || '';
  const occasionParamVal = searchParams.get('occasion') || '';
  const recipientParamVal = searchParams.get('recipient') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState(occasionParamVal);
  const [selectedRecipient, setSelectedRecipient] = useState(recipientParamVal);
  
  // Cursor states
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [dbOccasions, setDbOccasions] = useState<any[]>([]);
  const [dbRecipients, setDbRecipients] = useState<any[]>([]);

  // Sync filters from URL params (khi navigate từ Navbar)
  useEffect(() => {
    if (occasionParamVal !== selectedOccasion) {
      setSelectedOccasion(occasionParamVal);
    }
  }, [occasionParamVal]); // eslint-disable-line

  useEffect(() => {
    if (recipientParamVal !== selectedRecipient) {
      setSelectedRecipient(recipientParamVal);
    }
  }, [recipientParamVal]); // eslint-disable-line

  useEffect(() => {
    const loadDbOccasions = async () => {
      try {
        const data = await catalogService.getAllOccasions();
        const active = (data || []).filter(o => {
          const val = o.isActive !== undefined ? o.isActive : (o as any).active;
          return val !== false;
        });
        setDbOccasions([
          { name: "Tất cả dịp", slug: "" },
          ...active
        ]);
      } catch (err) {
        console.error('Failed to load occasions for filters:', err);
      }
    };
    loadDbOccasions();
  }, []);

  useEffect(() => {
    const loadDbRecipients = async () => {
      try {
        const data = await catalogService.getAllRecipients();
        const active = (data || []).filter((r: any) => {
          const val = r.isActive !== undefined ? r.isActive : r.active;
          return val !== false;
        });
        setDbRecipients([
          { name: "Tất cả đối tượng", slug: "" },
          ...active
        ]);
      } catch (err) {
        console.error('Failed to load recipients for filters:', err);
      }
    };
    loadDbRecipients();
  }, []);

  const fallbackOccasions = [
    { name: "Tất cả dịp", slug: "" },
    { name: "Sinh Nhật", slug: "sinh-nhat" },
    { name: "Lễ Tình Nhân", slug: "valentine" },
    { name: "Ngày Nhà Giáo 20-11", slug: "20-11" },
    { name: "Quốc Khánh 2-9", slug: "quoc-khanh" }
  ];

  const fallbackRecipients = [
    { name: "Tất cả đối tượng", slug: "" },
    { name: "Bạn Gái", slug: "ban-gai" },
    { name: "Bạn Trai", slug: "ban-trai" },
    { name: "Thầy Cô", slug: "thay-co" },
    { name: "Đối Tác", slug: "doi-tac" }
  ];

  const occasionsList = dbOccasions.length > 1 ? dbOccasions : fallbackOccasions;
  const recipients = dbRecipients.length > 1 ? dbRecipients : fallbackRecipients;

  // Sync Search term from Header query parameters
  useEffect(() => {
    setSearchTerm(searchParamVal);
  }, [searchParamVal]);

  const loadProducts = async (cursorVal: string | null = null, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let resData;
      const size = 8; // Load 8 products at a time

      if (searchTerm.trim()) {
        resData = await productService.searchProducts(searchTerm, 0, size);
      } else {
        resData = await productService.getProductsCursor({
          cursor: cursorVal || undefined,
          occasionSlug: selectedOccasion || undefined,
          recipientSlug: selectedRecipient || undefined,
          size
        });
      }

      const list = resData?.content || [];
      const hasNext = resData?.hasNext || false;
      const nextC = resData?.nextCursor || null;

      if (list && list.length > 0) {
        const adapted = list.map((p: any) => ({
          ...p,
          basePrice: p.price || p.basePrice,
          category: p.category || (p.categoryName ? { name: p.categoryName } : undefined),
          media: p.media || p.medias || (p.thumbnailUrl ? [{ url: p.thumbnailUrl, isThumbnail: true }] : [])
        }));

        if (append) {
          setProducts(prev => [...prev, ...adapted]);
        } else {
          setProducts(adapted);
        }
        setNextCursor(nextC);
        setHasNextPage(hasNext);
      } else {
        if (!append) {
          filterMockProducts();
        }
      }
    } catch (err) {
      if (!append) {
        filterMockProducts();
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      loadProducts(nextCursor, true);
    }
  };

  const filterMockProducts = () => {
    let filtered = [...MOCK_PRODUCTS];
    if (searchTerm.trim()) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedOccasion) {
      filtered = filtered.filter(p => p.occasions?.some(o => o.slug === selectedOccasion));
    }
    if (selectedRecipient) {
      filtered = filtered.filter(p => p.recipients?.some(r => r.slug === selectedRecipient));
    }
    setProducts(filtered);
    setHasNextPage(false);
    setNextCursor(null);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadProducts(null, false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedOccasion, selectedRecipient]);

  // Occasion Select trigger (scrolls to products & sets value)
  const handleOccasionClick = (slug: string) => {
    setSelectedOccasion(slug);
    const target = document.getElementById('products');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 pb-12 sm:pb-16 md:pb-24 font-sans">
      {/* 3. HERO BANNER */}
      <HeroSection onOccasionSelect={handleOccasionClick} />

      {/* 4. TRUST BAR */}
      <TrustBar />

      {/* BRAND INTRO / ABOUT */}
      <ScrollReveal>
        <BrandIntroSection />
      </ScrollReveal>

      {/* 5. CATEGORIES SECTION */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoriesSection
            onOccasionSelect={handleOccasionClick}
            selectedOccasion={selectedOccasion}
            occasions={dbOccasions.filter(o => o.slug !== "")}
          />
        </div>
      </ScrollReveal>

      {/* 6. FEATURED PRODUCTS (with search filtering) */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedProductsSection
            products={products}
            loading={loading}
            loadingMore={loadingMore}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedOccasion={selectedOccasion}
            setSelectedOccasion={setSelectedOccasion}
            selectedRecipient={selectedRecipient}
            setSelectedRecipient={setSelectedRecipient}
            occasions={occasionsList}
            recipients={recipients}
            hasNextPage={hasNextPage}
            handleLoadMore={handleLoadMore}
          />
        </div>
      </ScrollReveal>

      {/* 9. COLLECTIONS SECTION */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CollectionsSection />
        </div>
      </ScrollReveal>

      {/* 7. BENEFITS SECTION */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BenefitsSection />
        </div>
      </ScrollReveal>

      {/* HOW IT WORKS */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HowItWorksSection />
        </div>
      </ScrollReveal>

      {/* 8. VIDEO BANNER */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VideoBanner />
        </div>
      </ScrollReveal>

      {/* STORY / CONTENT */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StorySection />
        </div>
      </ScrollReveal>

      {/* 10. REVIEWS SECTION */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SocialProofSection />
        </div>
      </ScrollReveal>

      {/* 11. UGC / INSTAGRAM / TIKTOK FEED */}
      <ScrollReveal>
        <UgcFeedSection />
      </ScrollReveal>

      {/* 12. BLOG SECTION */}
      <ScrollReveal>
        <BlogSection />
      </ScrollReveal>

      {/* 13. CTA BANNER */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTASection />
        </div>
      </ScrollReveal>

      {/* FAQ Accordions */}
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection />
        </div>
      </ScrollReveal>

      {/* Live Configuration Panel */}
      <LiveConfigPanel />

      {/* Back to Top button with scroll progress */}
      <BackToTop />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
