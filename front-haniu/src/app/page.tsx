'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/services/product.service';
import ProductCard from '@/components/product/ProductCard';

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
    media: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80", isThumbnail: true }],
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
    media: [{ url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80", isThumbnail: true }],
    occasions: [{ name: "Kỷ Niệm", slug: "ky-niem" }, { name: "Ngày Nhà Giáo 20-11", slug: "20-11" }],
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
    media: [{ url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80", isThumbnail: true }],
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
    media: [{ url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&auto=format&fit=crop&q=80", isThumbnail: true }],
    occasions: [{ name: "Quốc Khánh 2-9", slug: "quoc-khanh" }, { name: "Sự Kiện Đối Ngoại", slug: "su-kien" }],
    recipients: [{ name: "Đối Tác", slug: "doi-tac" }, { name: "Người Nước Ngoài", slug: "nuoc-ngoai" }]
  }
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  
  // Cursor states
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const occasions = [
    { name: "Tất cả dịp", slug: "" },
    { name: "Sinh Nhật", slug: "sinh-nhat" },
    { name: "Lễ Tình Nhân", slug: "valentine" },
    { name: "Ngày Nhà Giáo 20-11", slug: "20-11" },
    { name: "Quốc Khánh 2-9", slug: "quoc-khanh" }
  ];

  const recipients = [
    { name: "Tất cả đối tượng", slug: "" },
    { name: "Bạn Gái", slug: "ban-gai" },
    { name: "Bạn Trai", slug: "ban-trai" },
    { name: "Thầy Cô", slug: "thay-co" },
    { name: "Đối Tác", slug: "doi-tac" }
  ];

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
        // Fallback or fuzzy search (usually standard pagination because Elasticsearch ranks by score)
        resData = await productService.searchProducts(searchTerm, 0, size);
      } else {
        // Use cursor-based pagination!
        resData = await productService.getProductsCursor({
          cursor: cursorVal || undefined,
          size
        });
      }

      const list = resData?.content || [];
      const hasNext = resData?.hasNext || false;
      const nextC = resData?.nextCursor || null;

      if (list && list.length > 0) {
        const adapted = list.map((p: any) => ({
          ...p,
          basePrice: p.price || p.basePrice
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

  return (
    <div className="space-y-12">
      {/* Hero banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white py-20 px-8 sm:px-12 text-center md:text-left md:flex md:items-center md:justify-between gap-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#fda4af,transparent_50%)] opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900 to-transparent" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-rose-400">
            💝 Nghệ thuật tặng quà cá nhân hóa
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Gửi Trao Yêu Thương <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
              Trọn Vẹn Ý Nghĩa
            </span>
          </h1>
          <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
            Hộp quà kết hợp cao cấp, ly tách gốm sứ độc bản, sổ tay da thật khắc tên cùng hệ thống cá nhân hóa giúp bạn lưu lại mọi kỷ niệm tinh tế nhất.
          </p>
        </div>

        <div className="relative z-10 mt-10 md:mt-0 flex justify-center">
          <div className="glassmorphism p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl max-w-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-amber-300">🔥 Đang diễn ra: Flash Sale</h3>
            <p className="text-[11px] text-slate-300">Nhập mã <code className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">HANIU29</code> giảm ngay 15% cho set quà yêu nước nhân dịp Quốc khánh.</p>
            <button onClick={() => setSelectedOccasion("quoc-khanh")} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-md shadow-rose-500/20">
              Săn Set Quà Ngay
            </button>
          </div>
        </div>
      </section>

      {/* Advanced Filters */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-zinc-800 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:max-w-md relative">
            <input
              type="text"
              placeholder="Tìm quà tặng (VD: ly sứ khắc tên, set quà lãng mạn...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 dark:focus:ring-rose-400 text-sm shadow-sm transition-all"
            />
            <span className="absolute left-3 top-3.5 text-slate-400">🔍</span>
          </div>

          <div className="text-xs text-slate-400 italic">
            Hiển thị {products.length} sản phẩm quà tặng độc đáo
          </div>
        </div>

        {/* Occasions Filters */}
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Chọn theo dịp lễ</span>
          <div className="flex flex-wrap gap-2">
            {occasions.map(occ => (
              <button
                key={occ.slug}
                onClick={() => setSelectedOccasion(occ.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedOccasion === occ.slug
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-700'
                }`}
              >
                {occ.name}
              </button>
            ))}
          </div>
        </div>

        {/* Recipients Filters */}
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Đối tượng nhận quà</span>
          <div className="flex flex-wrap gap-2">
            {recipients.map(rec => (
              <button
                key={rec.slug}
                onClick={() => setSelectedRecipient(rec.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedRecipient === rec.slug
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-700'
                }`}
              >
                {rec.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 space-y-4 animate-pulse">
              <div className="bg-slate-200 dark:bg-zinc-800 h-48 w-full rounded-xl" />
              <div className="h-4 bg-slate-200 dark:bg-zinc-800 w-2/3 rounded" />
              <div className="h-4 bg-slate-200 dark:bg-zinc-800 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 text-center py-16 px-4 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-3">
          <span className="text-4xl">🎁</span>
          <h3 className="font-bold text-lg text-slate-700 dark:text-zinc-300">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Vui lòng thử lại bằng cách chọn một dịp khác hoặc gõ từ khóa tìm kiếm mới.</p>
          <button onClick={() => { setSearchTerm(''); setSelectedOccasion(''); setSelectedRecipient(''); }} className="mt-4 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all">
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Cursor Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold py-3 px-8 rounded-2xl text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500" />
                    Đang tải thêm...
                  </>
                ) : (
                  'Xem thêm sản phẩm quà tặng ⏳'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
