import { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { catalogService } from '@/services/catalog.service';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const categoryParam = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;

  let title = 'Bộ Sưu Tập Quà Tặng Cao Cấp | Haniu';
  let description = 'Hộp quà tặng thủ công nghệ thuật cá nhân hóa khắc tên riêng và lời chúc theo yêu cầu, chế tác độc bản gửi trọn thành ý của bạn.';

  if (categoryParam) {
    try {
      const categories = await catalogService.getAllCategories();
      const activeCat = categories?.find(c => c.id === categoryParam || c.slug === categoryParam);
      if (activeCat) {
        title = `${activeCat.name} | Haniu Gift Shop`;
        description = activeCat.description || `Khám phá các sản phẩm quà tặng thuộc danh mục ${activeCat.name} tại Haniu.`;
      }
    } catch (e) {
      console.error('Error generating metadata for products page:', e);
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://haniu.vercel.app/products${categoryParam ? `?category=${categoryParam}` : ''}`,
      images: [
        {
          url: '/banner.png',
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/banner.png'],
    }
  };
}

export default function ProductsPage() {
  return <ProductsClient />;
}
