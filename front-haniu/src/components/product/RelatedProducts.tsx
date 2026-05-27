'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { productService } from '@/services/product.service';
import Icon from '@/components/common/Icons';

const MOCK_CATALOG_PRODUCTS = [
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
    media: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
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
    media: [{ url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
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
    media: [{ url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m4",
    name: "Set Quà Lưu Niệm Đồ Gỗ Bản Đồ Việt Nam",
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
    media: [{ url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m5",
    name: "Bút Ký Kim Loại Khắc Tên Mạ Vàng Lux",
    slug: "but-ky-kim-loai-khac-ten",
    sku: "GIFT-PEN-005",
    description: "Bút dạ bi kim loại mạ vàng sang trọng, nét mực trơn tru, đi kèm hộp nhung lót lụa cao cấp làm quà tặng doanh nghiệp.",
    basePrice: 290000,
    stock: 80,
    isFeatured: false,
    isNew: false,
    isCustomizable: true,
    category: { name: "Sổ Da & Bút", slug: "so-da-but" },
    media: [{ url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m6",
    name: "Cốc Giữ Nhiệt Laze Khắc Logo Hộp Sang Trọng",
    slug: "coc-giu-nhiet-khac-logo",
    sku: "GIFT-MUG-006",
    description: "Ly giữ nhiệt thép không gỉ 304 dung tích 500ml, giữ nóng lạnh 12 giờ, hỗ trợ thiết kế khắc laze tên hoặc logo doanh nghiệp.",
    basePrice: 280000,
    salePrice: 240000,
    stock: 150,
    isFeatured: false,
    isNew: true,
    isCustomizable: true,
    category: { name: "Ly Sứ", slug: "ly-su" },
    media: [{ url: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m7",
    name: "Set Hộp Trà Cao Cấp Gỗ Hương Tự Nhiên",
    slug: "set-hop-tra-go-huong",
    sku: "GIFT-TEA-007",
    description: "Hộp đựng trà chế tác thủ công từ gỗ hương đỏ nguyên khối, mùi thơm tự nhiên kết hợp cùng trà ô long thượng hạng.",
    basePrice: 750000,
    stock: 35,
    isFeatured: true,
    isNew: false,
    isCustomizable: false,
    category: { name: "Đồ Lưu Niệm", slug: "do-luu-niem" },
    media: [{ url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m8",
    name: "Album Ảnh Gỗ Gấp Gọn Lưu Giữ Kỷ Niệm",
    slug: "album-anh-go-luu-niem",
    sku: "GIFT-ALB-008",
    description: "Album ảnh trang bìa gỗ ép cao cấp, ruột giấy mỹ thuật đen dày dặn, tặng kèm decal góc dán ảnh và bút nhũ viết lời chúc.",
    basePrice: 420000,
    salePrice: 380000,
    stock: 90,
    isFeatured: true,
    isNew: false,
    isCustomizable: true,
    category: { name: "Đồ Lưu Niệm", slug: "do-luu-niem" },
    media: [{ url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80", isThumbnail: true }]
  }
];

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
  category?: { id?: string; name: string; slug: string };
  collection?: { id?: string; name: string; slug: string } | null;
  media?: any[];
}

export default function RelatedProducts({ currentProduct }: { currentProduct: Product }) {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    async function loadRelated() {
      try {
        const res = await productService.getProducts();
        const items = res?.content || (Array.isArray(res) ? res : []);
        setRelatedProducts(items);
      } catch (err) {
        console.error("Failed to load related products", err);
      } finally {
        setLoadingRelated(false);
      }
    }
    loadRelated();
  }, []);

  const allProducts = relatedProducts.length > 0 ? relatedProducts : MOCK_CATALOG_PRODUCTS;

  const filtered = allProducts
    .filter((p) => p.id !== currentProduct.id)
    .filter((p) => {
      const sameCategory = p.category && currentProduct.category && (
        p.category.name === currentProduct.category.name ||
        (p.category as any).slug === currentProduct.category.slug
      );
      const sameCollection = p.collection && currentProduct.collection && (
        p.collection.name === currentProduct.collection.name ||
        (p.collection as any).slug === currentProduct.collection.slug
      );
      return sameCategory || sameCollection || p.isFeatured;
    })
    .slice(0, 4);

  if (loadingRelated && relatedProducts.length === 0) return null;
  if (filtered.length === 0) return null;

  return (
    <div className="space-y-6 pt-12 border-t border-slate-100 dark:border-zinc-800/80">
      <h2 className="text-lg font-black text-slate-800 dark:text-zinc-100 tracking-tight uppercase flex items-center gap-2">
        <Icon name="gift" size={18} className="text-rose-500 animate-pulse" /> Có thể bạn sẽ thích
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map((item: any) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
