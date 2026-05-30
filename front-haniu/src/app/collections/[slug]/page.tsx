import { Metadata } from 'next';
import { catalogService, Collection } from '@/services/catalog.service';
import { productService } from '@/services/product.service';
import CollectionDetailClient from './CollectionDetailClient';

export const revalidate = 60; // Revalidate static cache every 60 seconds

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

async function getCollectionData(slug: string) {
  try {
    const collection = await catalogService.getCollectionBySlug(slug);
    let products: any[] = [];
    if (collection && collection.id) {
      const productsData = await productService.getProducts({
        collectionId: collection.id,
        sortBy: 'createdAt',
        sortDir: 'desc',
        size: 40,
        status: 'PUBLISHED'
      });
      products = productsData?.content || [];
    }
    return { collection, products };
  } catch (error) {
    console.error(`Error loading collection slug "${slug}" on server:`, error);
    return { collection: null, products: [] };
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { collection } = await getCollectionData(slug);

  if (!collection) {
    return {
      title: 'Không tìm thấy Bộ sưu tập',
    };
  }

  const title = `${collection.name} | Bộ Sưu Tập Quà Tặng Haniu`;
  const description = collection.description || `Khám phá các sản phẩm quà tặng độc bản thuộc bộ sưu tập ${collection.name} của Haniu.`;
  const imageUrl = collection.imageUrl || '/banner.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://haniu.vercel.app/collections/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: collection.name,
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

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const { collection, products } = await getCollectionData(slug);

  // Schema markup
  const schemaMarkup = collection ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": collection.name,
    "description": collection.description,
    "url": `https://haniu.vercel.app/collections/${slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.map((prod, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://haniu.vercel.app/products/${prod.slug}`,
        "name": prod.name
      }))
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
      <CollectionDetailClient slug={slug} initialCollection={collection} initialProducts={products} />
    </>
  );
}
