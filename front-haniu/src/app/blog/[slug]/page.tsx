import { Metadata } from 'next';
import Link from 'next/link';
import { postService } from '@/services/post.service';
import Icon from '@/components/common/Icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    const post = await postService.getPostBySlug(slug);
    return post || null;
  } catch (error) {
    console.error(`Error fetching post slug "${slug}" on server:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Không tìm thấy bài viết | Haniu',
    };
  }

  const title = `${post.title} | Góc Chia Sẻ Haniu`;
  const description = post.summary || '';
  const imageUrl = post.imageUrl || '/banner.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://haniu.vercel.app/blog/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
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

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="bg-slate-50/50 dark:bg-zinc-950 min-h-screen pt-12 pb-24 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200">Không tìm thấy bài viết</h2>
          <p className="text-xs text-slate-400">Bài viết có thể đã bị xóa hoặc không còn tồn tại.</p>
          <Link 
            href="/blog" 
            className="inline-block px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs"
          >
            Quay lại Blog
          </Link>
        </div>
      </div>
    );
  }

  // Generate Article JSON-LD Schema (AEO/GEO optimization)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.summary,
    'image': post.imageUrl || 'https://haniu.vn/logo.png',
    'datePublished': post.publishedAt || post.createdAt,
    'dateModified': post.updatedAt || post.publishedAt || post.createdAt,
    'author': {
      '@type': 'Organization',
      'name': 'Haniu Team',
      'url': 'https://haniu.vn'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Haniu',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://haniu.vn/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://haniu.vn/blog/${slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="bg-slate-50/50 dark:bg-zinc-950 min-h-screen pt-4 pb-8 sm:pb-12 animate-fade-in">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back button */}
          <div>
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-500 font-bold transition-colors cursor-pointer"
            >
              <Icon name="arrow-left" size={12} />
              <span>Quay lại danh sách bài viết</span>
            </Link>
          </div>

          {/* Article Header */}
          <header className="space-y-6">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-zinc-100 tracking-tight leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zinc-500 border-y border-slate-100 dark:border-zinc-800 py-3.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Icon name="user" size={11} />
                <span>Đăng bởi Haniu Team</span>
              </span>
              <span>•</span>
              <span>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : '---'}
              </span>
            </div>
          </header>

          {/* Post Image Banner */}
          {post.imageUrl && (
            <div className="relative aspect-1.8 overflow-hidden rounded-[32px] border border-slate-200 dark:border-zinc-800 shadow-md">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <article 
            className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-zinc-300 font-light leading-relaxed tracking-wide space-y-6"
          >
            {/* Display HTML content safely */}
            <div 
              className="blog-content-container whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </article>

          {/* CTA Box inside blog post */}
          <div className="mt-16 bg-gradient-to-br from-amber-500/5 to-rose-500/5 border border-rose-500/10 rounded-[36px] p-8 text-center space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
              Bạn đang tìm kiếm set quà độc đáo cho người thương?
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto font-light leading-relaxed">
              Khám phá ngay bộ sưu tập quà tặng gỗ khắc tên, cốc sứ, và hoa sáp cao cấp được cá nhân hóa tại Haniu Gift Shop.
            </p>
            <div className="pt-2">
              <Link 
                href="/products" 
                className="inline-block px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/15"
              >
                Khám phá sản phẩm Haniu
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
