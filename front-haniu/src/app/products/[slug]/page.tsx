import { Metadata } from 'next';
import { productService } from '@/services/product.service';
import { cookies } from 'next/headers';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60; // Revalidate static cache every 60 seconds

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
  variants?: any[];
  media?: any[];
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
    description: "Sổ bìa da bò thật cao cấp, giấy nhám kraft vintage, hỗ trợ khắc laze tên và lời chúc ý nghĩa theo yêu cầu.",
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

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get('haniu_lang')?.value || 'vi';
    const data = await productService.getProductBySlug(slug, lang);
    if (data) {
      return {
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
    }
  } catch (error) {
    console.error(`Error loading product slug "${slug}" on server:`, error);
  }
  return MOCK_PRODUCTS[slug] || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm quà tặng",
    };
  }

  const title = product.seoTitle || `${product.name} | Quà Tặng Cá Nhân Hóa`;
  const description = product.seoDescription || product.description || '';
  const keywords = product.seoKeywords || `${product.name}, quà tặng haniu, quà tặng thiết kế`;
  const imageUrl = product.media && product.media.length > 0 ? product.media[0].url : '/banner.png';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://haniu.vercel.app/products/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Fallback rating/review configuration for structure
  const avgRating = 4.8;
  const totalReviews = 128;

  // Schema markup
  const schemaMarkup = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.media && product.media.length > 0 ? product.media.map(m => m.url) : [''],
    "description": product.description,
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "VND",
      "price": product.salePrice || product.basePrice,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": totalReviews
    }
  } : null;

  return (
    <>
      {schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      )}
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  );
}
