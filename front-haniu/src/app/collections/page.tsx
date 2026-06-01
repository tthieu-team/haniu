import { Metadata } from 'next';
import { catalogService } from '@/services/catalog.service';
import CollectionsClient from './CollectionsClient';

export const revalidate = 60; // Revalidate cache every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Bộ Sưu Tập Quà Tặng Độc Bản | Haniu';
  const description = 'Khám phá các bộ sưu tập quà tặng cao cấp, độc bản, được thiết kế thủ công tinh xảo của Haniu cho từng dịp ý nghĩa.';
  const imageUrl = '/banner.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://haniu.vercel.app/collections',
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl],
    }
  };
}

export default async function CollectionsPage() {
  let collections: any[] = [];
  try {
    const rawCollections = await catalogService.getAllCollections();
    // Filter active collections only
    collections = rawCollections.filter(
      (c) => c.isActive !== false && (c as any).active !== false
    );
  } catch (error) {
    console.error('Error fetching collections on server:', error);
  }

  // Schema markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Bộ Sưu Tập Quà Tặng | Haniu",
    "description": "Khám phá các bộ sưu tập quà tặng cao cấp, độc bản của Haniu.",
    "url": "https://haniu.vercel.app/collections",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": collections.length,
      "itemListElement": collections.map((col, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://haniu.vercel.app/collections/${col.slug}`,
        "name": col.name
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <CollectionsClient initialCollections={collections} />
    </>
  );
}
