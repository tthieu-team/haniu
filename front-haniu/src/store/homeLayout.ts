import { create } from 'zustand';
import { systemConfigService } from '@/services/systemConfig.service';

export interface HeaderConfig {
  logoText: string;
  logoSubtitle: string;
  menuLinks: Array<{ name: string; href: string }>;
  isSticky: boolean;
}

export interface AnnouncementBarConfig {
  text: string;
  linkText?: string;
  linkHref?: string;
  isEnabled: boolean;
}

export interface HeroSlide {
  id: string;
  backgroundImage: string;
  scriptTitle: string;
  boldTitle: string;
  badgeText: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  textLayout: 'left' | 'right' | 'center';
  circleBadgeText: string;
  cardTitle: string;
  cardSubtitle: string;
}

export interface GridFeatureCard {
  id: string;
  icon: string;
  title: string;
  desc: string;
  image: string;
  tagText?: string;
}

export interface HeroConfig {
  layoutType: 'slider' | 'split-grid';
  slides: HeroSlide[];
  autoplay: boolean;
  autoplaySpeed: number;
  gridMainSlideId: string;
  gridSubSlideId: string;
  gridFeatures: GridFeatureCard[];
}

export interface TrustItem {
  icon: string;
  text: string;
  title?: string;
  desc?: string;
}

export interface TrustBarConfig {
  items: TrustItem[];
}

export interface CategoryItem {
  name: string;
  slug: string;
  image: string;
  count: string;
}

export interface FeaturedProductsConfig {
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface CategoriesConfig {
  title: string;
  subtitle: string;
  badge?: string;
  items: CategoryItem[];
}

export interface BenefitItem {
  icon: string;
  title: string;
  desc: string;
}

export interface BenefitsConfig {
  title: string;
  items: BenefitItem[];
}

export interface VideoBannerConfig {
  title: string;
  subtitle: string;
  videoUrl: string;
  placeholderImage: string;
  buttonText: string;
  buttonHref: string;
}

export interface CollectionItem {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export interface CollectionsConfig {
  title: string;
  subtitle: string;
  badge?: string;
  limitedTag?: string;
  buyNowText?: string;
  items: CollectionItem[];
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface SocialProofConfig {
  title: string;
  ratingScore: string;
  reviewsCount: string;
  badge?: string;
  reviews: ReviewItem[];
}

export interface HowItWorksStep {
  number: string;
  title: string;
  desc: string;
  image: string;
}

export interface HowItWorksConfig {
  title: string;
  subtitle: string;
  badge?: string;
  steps: HowItWorksStep[];
}

export interface UgcItem {
  id: string;
  imageUrl: string;
  link: string;
}

export interface UgcFeedConfig {
  title: string;
  hashtag: string;
  badge?: string;
  items: UgcItem[];
}

export interface BlogItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  href: string;
}

export interface BlogConfig {
  title: string;
  subtitle: string;
  badge?: string;
  buttonText?: string;
  items: BlogItem[];
}

export interface StoryConfig {
  title: string;
  titleHighlight?: string;
  titlePart2?: string;
  subtitle: string;
  content: string;
  videoPlaceholderUrl: string;
  videoTitle: string;
  videoUrl: string;
}

export interface CtaConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqConfig {
  title: string;
  items: FaqItem[];
}

export interface FooterConfig {
  description: string;
  address: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export interface BrandIntroStat {
  label: string;
  value: string;
}

export interface BrandIntroConfig {
  title: string;
  subtitle: string;
  description: string;
  stats: BrandIntroStat[];
}

export interface WelcomeScreenConfig {
  isEnabled: boolean;
  welcomeText: string;
  welcomeSubtitle: string;
  durationMs: number;
}

export interface TrustBadgesConfig {
  showGenuine: boolean;
  showReturns: boolean;
  showShipping: boolean;
  showPayment: boolean;
  showSupport: boolean;
}

export interface WhyChooseUsItem {
  icon: string;
  text: string;
}

export interface DeliveryPolicyLine {
  label: string;
  value: string;
}

export interface ProductDetailsSectionConfig {
  showPromotions: boolean;
  promotions: string[];
  showWhyChooseUs: boolean;
  whyChooseUs: WhyChooseUsItem[];
  showDeliveryPolicy: boolean;
  deliveryPolicy: {
    lines: DeliveryPolicyLine[];
    bulletPoints: string[];
  };
  showBrandCommitment: boolean;
  brandCommitment: string[];
}

export interface HomeLayoutState {
  // Visibility toggles for the 10 main page body blocks
  visibility: {
    hero: boolean;
    trustBar: boolean;
    brandIntro: boolean;
    categories: boolean;
    featuredProducts: boolean;
    collections: boolean;
    benefits: boolean;
    videoBanner: boolean;
    socialProof: boolean;
    howItWorks: boolean;
    ugcFeed: boolean;
    blog: boolean;
    story: boolean;
    cta: boolean;
    faq: boolean;
  };

  // Section configs
  header: HeaderConfig;
  announcementBar: AnnouncementBarConfig;
  hero: HeroConfig;
  trustBar: TrustBarConfig;
  brandIntro: BrandIntroConfig;
  categories: CategoriesConfig;
  featuredProducts: FeaturedProductsConfig;
  benefits: BenefitsConfig;
  videoBanner: VideoBannerConfig;
  collections: CollectionsConfig;
  socialProof: SocialProofConfig;
  howItWorks: HowItWorksConfig;
  ugcFeed: UgcFeedConfig;
  blog: BlogConfig;
  story: StoryConfig;
  cta: CtaConfig;
  faq: FaqConfig;
  footer: FooterConfig;
  welcomeScreen: WelcomeScreenConfig;
  trustBadges: TrustBadgesConfig;
  productDetails: ProductDetailsSectionConfig;

  // Actions
  toggleVisibility: (section: keyof HomeLayoutState['visibility']) => void;
  updateHeader: (config: Partial<HeaderConfig>) => void;
  updateAnnouncementBar: (config: Partial<AnnouncementBarConfig>) => void;
  updateHero: (config: Partial<HeroConfig>) => void;
  updateHeroSlide: (slideId: string, config: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (slideId: string) => void;
  moveHeroSlide: (index: number, direction: 'up' | 'down') => void;
  updateHeroSlidesOrder: (slides: HeroSlide[]) => void;
  updateGridFeatureCard: (cardId: string, config: Partial<GridFeatureCard>) => void;
  updateTrustBar: (config: Partial<TrustBarConfig>) => void;
  updateBrandIntro: (config: Partial<BrandIntroConfig>) => void;
  updateCategories: (config: Partial<CategoriesConfig>) => void;
  updateFeaturedProducts: (config: Partial<FeaturedProductsConfig>) => void;
  updateBenefits: (config: Partial<BenefitsConfig>) => void;
  updateVideoBanner: (config: Partial<VideoBannerConfig>) => void;
  updateCollections: (config: Partial<CollectionsConfig>) => void;
  updateSocialProof: (config: Partial<SocialProofConfig>) => void;
  updateHowItWorks: (config: Partial<HowItWorksConfig>) => void;
  updateUgcFeed: (config: Partial<UgcFeedConfig>) => void;
  updateBlog: (config: Partial<BlogConfig>) => void;
  updateStory: (config: Partial<StoryConfig>) => void;
  updateCta: (config: Partial<CtaConfig>) => void;
  updateFaq: (config: Partial<FaqConfig>) => void;
  updateFooter: (config: Partial<FooterConfig>) => void;
  updateWelcomeScreen: (config: Partial<WelcomeScreenConfig>) => void;
  updateTrustBadges: (config: Partial<TrustBadgesConfig>) => void;
  updateProductDetails: (config: Partial<ProductDetailsSectionConfig>) => void;
  resetAll: () => void;
  resetSections: () => void;
  resetHero: () => void;
  resetVisibility: () => void;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  fetchConfigFromServer: () => Promise<void>;
  saveConfigToServer: (options?: RequestInit) => Promise<void>;
}

export const DEFAULT_STATE = {
  visibility: {
    hero: true,
    trustBar: true,
    brandIntro: true,
    categories: true,
    featuredProducts: true,
    collections: true,
    benefits: true,
    videoBanner: true,
    socialProof: true,
    howItWorks: true,
    ugcFeed: true,
    blog: true,
    story: true,
    cta: true,
    faq: true,
  },
  header: {
    logoText: "HANIU",
    logoSubtitle: "",
    menuLinks: [
      { name: "Trang chủ", href: "/" },
      { name: "Sản phẩm", href: "/products" },
      { name: "Bộ sưu tập", href: "/collections" },
      { name: "Câu chuyện", href: "/story" },
      { name: "Tin tức", href: "/blog" },
      { name: "Yêu thích", href: "/wishlist" },
    ],
    isSticky: true,
  },
  announcementBar: {
    text: "💖 Mỗi món quà là một câu chuyện • 🌷 Hoa handmade • 📸 Photobooth • 🧸 Gấu bông • ✨ Được chuẩn bị bằng cả sự tận tâm",
    linkText: "Mua ngay",
    linkHref: "/#products",
    isEnabled: true,
  },
  hero: {
    layoutType: 'slider' as const,
    slides: [
      {
        id: "slide-1",
        backgroundImage: "/7329c11d-7fcf-45e3-a4d3-08c9f6764741.jfif",
        scriptTitle: "Mừng",
        boldTitle: "QUỐC KHÁNH 2/9",
        badgeText: "Quà tặng Quốc khánh • Trao gửi tự hào Việt Nam",
        subtitle: "Những món quà dễ thương mang sắc đỏ Việt Nam, thay lời chúc tốt đẹp trong ngày lễ trọng đại của dân tộc.",
        ctaText: "MUA NGAY",
        ctaHref: "/collections/quoc-khanh",
        textLayout: "left" as const,
        circleBadgeText: "PROUD OF VIETNAM • 02.09 • PROUD OF VIETNAM • 02.09 •",
        cardTitle: "Việt Nam",
        cardSubtitle: "From The Heart",
      },
      {
        id: "slide-2",
        backgroundImage: "/8c23c072-f852-4eb2-bf6b-c133fdb03a46.jfif",
        scriptTitle: "Kỷ niệm",
        boldTitle: "PHOTOBOOTH HANIU",
        badgeText: "Lưu giữ khoảnh khắc • Photobooth Haniu",
        subtitle: "Những dải ảnh photobooth mang phong cách Hàn Quốc, lưu giữ những khoảnh khắc đáng nhớ cùng bạn bè, người yêu và gia đình.",
        ctaText: "KHÁM PHÁ NGAY",
        ctaHref: "/collections/photobooth",
        textLayout: "left" as const,
        circleBadgeText: "PHOTO MEMORIES • HANIU PHOTOBOOTH • PHOTO MEMORIES • HANIU PHOTOBOOTH •",
        cardTitle: "Haniu Photo",
        cardSubtitle: "Keep Memories",
      },
      {
        id: "slide-3",
        backgroundImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80",
        scriptTitle: "Chúc mừng",
        boldTitle: "LỄ TỐT NGHỆP",
        badgeText: "Mừng ngày tốt nghiệp • Khởi đầu hành trình mới",
        subtitle: "Lưu giữ khoảnh khắc đáng nhớ với những món quà ý nghĩa dành cho ngày trưởng thành và những cột mốc quan trọng.",
        ctaText: "XEM QUÀ NGAY",
        ctaHref: "/collections/graduation",
        textLayout: "left" as const,
        circleBadgeText: "CONGRATULATIONS • GRADUATION DAY • CONGRATULATIONS • GRADUATION DAY •",
        cardTitle: "Class Of 2026",
        cardSubtitle: "Dream Big",
      }
    ],
    autoplay: true,
    autoplaySpeed: 5000,
    gridMainSlideId: "slide-1",
    gridSubSlideId: "slide-2",
    gridFeatures: [
      {
        id: "feat-1",
        icon: "heart",
        title: "QUÀ Ý NGHĨA",
        desc: "Gửi gắm thông điệp yêu thương đến người nhận.",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80",
        tagText: "",
      },
      {
        id: "feat-2",
        icon: "sparkles",
        title: "HANDMADE",
        desc: "Sản phẩm được làm thủ công tỉ mỉ và chỉn chu.",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&auto=format&fit=crop&q=80",
        tagText: "From haniu with love",
      },
      {
        id: "feat-3",
        icon: "gift",
        title: "TẶNG GÌ CŨNG ĐÚNG",
        desc: "Đa dạng mẫu mã, phù hợp với mọi dịp đặc biệt.",
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80",
        tagText: "For you",
      }
    ]
  },
  trustBar: {
    items: [
      { icon: "★", text: "50.000+ Khách hàng tin dùng", title: "50.000+", desc: "Khách hàng tin chọn" },
      { icon: "🚚", text: "Giao hỏa tốc 2 giờ nội thành", title: "Giao Hỏa Tốc", desc: "Trong 2 giờ nội thành" },
      { icon: "🔄", text: "Đổi trả dễ dàng trong 30 ngày", title: "Đổi Trả Dễ Dàng", desc: "Miễn phí trong 30 ngày" },
      { icon: "🛡️", text: "Bảo mật thanh toán 100%", title: "Bảo Mật 100%", desc: "Thanh toán tuyệt đối an toàn" },
    ],
  },
  brandIntro: {
    title: "Nơi Những Món Quà Kể Câu Chuyện",
    subtitle: "VỀ HANIU",
    description: "Tại Haniu, mỗi món quà không chỉ là một vật phẩm, mà còn là cách lưu giữ những cảm xúc đẹp nhất. Chúng tôi tuyển chọn và tạo nên những sản phẩm quà tặng mang phong cách trẻ trung, tinh tế và giàu cảm xúc như gấu bông, photobooth, hoa handmade và các set quà cá nhân hóa.\n\nMỗi chi tiết đều được chăm chút với sự tỉ mỉ và tình yêu dành cho nghệ thuật quà tặng, giúp bạn dễ dàng gửi trao lời yêu thương, lời cảm ơn hay lời chúc mừng theo cách đặc biệt nhất.\n\nHaniu mong muốn trở thành người bạn đồng hành trong mọi cột mốc đáng nhớ của bạn và những người thân yêu.",
    stats: [
      { value: "🧸 500+", label: "Khách hàng tin chọn" },
      { value: "📸 2.000+", label: "Khoảnh khắc được lưu giữ" },
      { value: "🎁 100+", label: "Mẫu quà tặng độc đáo" },
      { value: "❤️ Hàng ngàn", label: "Lời yêu thương được trao gửi" }
    ]
  },
  categories: {
    title: "Bộ Sưu Tập Quà Tặng Theo Dịp",
    subtitle: "Lựa chọn món quà hoàn hảo nhất cho những cột mốc ý nghĩa trong cuộc sống",
    badge: "Chọn theo dịp lễ",
    items: [
      { name: "Quà Sinh Nhật", slug: "sinh-nhat", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop&q=80", count: "24+ set quà" },
      { name: "Quà Tốt Nghiệp", slug: "tot-nghiep", image: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&auto=format&fit=crop&q=80", count: "12+ set quà" },
      { name: "Quà Cặp Đôi", slug: "cap-doi", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80", count: "18+ set quà" },
      { name: "Quà Doanh Nghiệp", slug: "doanh-nghiep", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=80", count: "30+ set quà" },
    ],
  },
  featuredProducts: {
    badge: "Set quà bán chạy",
    title: "Sản phẩm nổi bật",
    subtitle: "Những set quà được yêu thích nhất thiết kế chỉn chu riêng cho bạn",
    buttonText: "Xem tất cả sản phẩm"
  },
  benefits: {
    title: "Trải Nghiệm Dịch Vụ Khác Biệt Tại Haniu",
    items: [
      { icon: "✨", title: "Cá Nhân Hóa Riêng", desc: "Hỗ trợ khắc tên, thông điệp laser lên gỗ, da, gốm sứ theo yêu cầu riêng." },
      { icon: "🎨", title: "Thiết Kế Độc Quyền", desc: "Hộp quà, thiệp và cách sắp xếp đều do Haniu tự tay lên ý tưởng, không trùng lặp." },
      { icon: "🚀", title: "Giao Hàng Hỏa Tốc", desc: "Nhận hàng nhanh chóng trong 2 giờ tại khu vực nội thành, hỗ trợ giao toàn quốc." },
      { icon: "💎", title: "Chất Liệu Premium", desc: "Tất cả sản phẩm đều làm từ gỗ tự nhiên, da bò thật và gốm sứ men cao cấp." },
    ],
  },
  videoBanner: {
    title: "Nghệ Thuật Chế Tác Độc Bản",
    subtitle: "Khám phá quy trình tỉ mỉ để tạo ra một tác phẩm quà tặng được khắc laser cá nhân hóa bởi Haniu.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-spinning-gold-glitter-particles-background-40096-large.mp4",
    placeholderImage: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80",
    buttonText: "Xem Thêm Câu Chuyện",
    buttonHref: "/#story",
  },
  collections: {
    title: "Bộ Sưu Tập Độc Quyền",
    subtitle: "Dòng sản phẩm được thiết kế theo mùa và xu hướng nghệ thuật đương đại",
    badge: "Bộ sưu tập độc quyền",
    limitedTag: "Limited Edition",
    buyNowText: "Mua ngay",
    items: [
      {
        title: "Summer Breeze Collection",
        subtitle: "Tông xanh bạc hạ mát lạnh, ly sứ kèm thìa mạ vàng tinh tế",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80",
        href: "/?category=combo-qua-tang"
      },
      {
        title: "Valentine Sweet Love",
        subtitle: "Hộp gỗ thông khắc hình chân dung, nến thơm hoa hồng Pháp quyến rũ",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80",
        href: "/?occasion=valentine"
      },
      {
        title: "Graduation Hope Edition",
        subtitle: "Sổ tay da bò nguyên tấm khắc tên và năm tốt nghiệp kỷ niệm đáng nhớ",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80",
        href: "/?occasion=tot-nghiep"
      }
    ]
  },
  socialProof: {
    title: "Khách Hàng Nói Gì Về Haniu?",
    ratingScore: "4.9",
    reviewsCount: "1.250+",
    badge: "Hơn 1.250+ Khách Hàng Tin Tưởng",
    reviews: [
      { id: "r1", name: "Nguyễn Thu Trang", role: "Khách mua Quà Sinh Nhật", content: "Mình đặt một set quà gồm gấu bông và ảnh photobooth cho bạn thân. Khi mở hộp quà ra, bạn ấy đã rất bất ngờ và xúc động. Mọi thứ được đóng gói cực kỳ dễ thương và chỉn chu.", rating: 5, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" },
      { id: "r2", name: "Trần Anh Tuấn", role: "Khách mua Quà Kỷ Niệm", content: "Dải ảnh photobooth được in rất đẹp, màu sắc rõ nét và giữ được cảm giác như những tấm ảnh Hàn Quốc. Đây là món quà kỷ niệm ý nghĩa nhất mà mình từng tặng cho người yêu.", rating: 5, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" },
      { id: "r3", name: "Lê Minh Thảo", role: "Khách mua Hoa Handmade", content: "Bó hoa len handmade ngoài đời còn đẹp hơn ảnh. Từng chi tiết được làm rất cẩn thận, màu sắc xinh xắn và đặc biệt là có thể lưu giữ lâu dài như một kỷ niệm đáng nhớ.", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
      { id: "r4", name: "Phạm Gia Hân", role: "Khách mua Quà Lễ Tình Nhân", content: "Mình đặt combo gấu bông, hoa handmade và photobooth cho dịp Valentine. Hộp quà được trang trí rất đẹp, nhận hàng đúng như mong đợi. Người nhận thích đến mức chụp ảnh đăng story ngay.", rating: 5, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" },
      { id: "r5", name: "Đỗ Hoàng Nam", role: "Khách mua Quà Tặng Bạn Gái", content: "Dịch vụ tư vấn rất nhiệt tình, giúp mình chọn được món quà phù hợp dù không biết nên tặng gì. Sản phẩm đẹp, giao hàng nhanh và mang lại cảm giác rất đặc biệt khi trao tặng.", rating: 5, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" }
    ],
  },
  howItWorks: {
    title: "Quy Trình Tạo Nên Món Quà Độc Bản",
    subtitle: "Từ ý tưởng đến món quà hoàn thiện, mỗi chi tiết đều được chăm chút để mang đến trải nghiệm trao tặng đầy ý nghĩa.",
    badge: "Quy trình dịch vụ",
    steps: [
      { number: "01", title: "Chọn Mẫu Quà", desc: "Khám phá bộ sưu tập quà tặng được tuyển chọn kỹ lưu hoặc tự do kết hợp các sản phẩm yêu thích để tạo nên set quà mang dấu ấn riêng.", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80" },
      { number: "02", title: "Cá Nhân Hóa", desc: "Thêm tên, ngày kỷ niệm hoặc thông điệp đặc biệt. Công nghệ khắc laser tinh xảo giúp mỗi món quà trở nên duy nhất.", image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&auto=format&fit=crop&q=80" },
      { number: "03", title: "Xác Nhận Thiết Kế", desc: "Nhận bản mô phỏng trực quan từ đội ngũ thiết kế và duyệt trước khi sản phẩm được chế tác chính thức.", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80" },
      { number: "04", title: "Nhận Quà Hoàn Mỹ", desc: "Món quà được hoàn thiện, đóng gói sang trọng cùng thiệp viết tay và giao đến tận nơi với sự chỉn chu trong từng chi tiết.", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80" },
    ],
  },
  ugcFeed: {
    title: "Khoảnh Khắc Của Haniu",
    hashtag: "#mygiftmoment",
    badge: "Khoảnh khắc của Haniu",
    items: [
      { id: "u1", imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80", link: "https://instagram.com" },
      { id: "u2", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80", link: "https://instagram.com" },
      { id: "u3", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80", link: "https://instagram.com" },
      { id: "u4", imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80", link: "https://instagram.com" },
      { id: "u5", imageUrl: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=80", link: "https://instagram.com" },
      { id: "u6", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&auto=format&fit=crop&q=80", link: "https://instagram.com" },
    ],
  },
  blog: {
    title: "Góc Chia Sẻ Kinh Nghiệm",
    subtitle: "Những lời khuyên bổ ích giúp bạn lựa chọn và trao gửi những lời nhắn nhủ tuyệt vời nhất",
    badge: "Góc chia sẻ kinh nghiệm",
    buttonText: "Xem tất cả bài viết",
    items: [
      {
        id: "b1",
        title: "Top 10 món quà tốt nghiệp ý nghĩa lưu giữ kỷ niệm tuổi học trò",
        summary: "Ngày tốt nghiệp là bước ngoặt lớn của cuộc đời. Cùng Haniu điểm qua những set quà lưu niệm độc bản tinh tế thích hợp tặng bạn bè, thầy cô.",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=80",
        date: "22 Tháng 5, 2026",
        href: "/#blog"
      },
      {
        id: "b2",
        title: "Nghệ thuật tặng quà cho đối tác doanh nghiệp nâng tầm thương hiệu",
        summary: "Quà tặng doanh nghiệp không chỉ là phép lịch sự, mà là đại diện cho uy tín. Cách chọn chất liệu hộp gỗ cao cấp và lời chúc tinh tế.",
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=80",
        date: "15 Tháng 5, 2026",
        href: "/#blog"
      },
      {
        id: "b3",
        title: "Cách ghi lời chúc khắc laser cá nhân hóa đầy cảm xúc cho người thương",
        summary: "Ý tưởng chọn câu trích dẫn, ngày kỷ niệm hay lời nhắn ngọt ngào để khắc lên sổ tay da và bình giữ nhiệt gỗ tre tặng người yêu.",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80",
        date: "10 Tháng 5, 2026",
        href: "/#blog"
      },
      {
        id: "b4",
        title: "5 set quà tặng kỷ niệm ngày cưới ngọt ngào và lãng mạn nhất",
        summary: "Gợi ý những set quà tặng kỷ niệm ngày cưới thiết kế tinh tế hỗ trợ khắc tên, ngày cưới kỷ niệm ý nghĩa của hai vợ chồng.",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80",
        date: "05 Tháng 5, 2026",
        href: "/#blog"
      }
    ]
  },
  story: {
    title: "Nghệ Thuật Từ",
    titleHighlight: "Những Bàn Tay",
    titlePart2: "Thủ Công",
    subtitle: "Hành trình chăm chút tỉ mỉ cho từng góc cạnh hộp quà",
    content: "Tại xưởng chế tác của Haniu, mỗi chi tiết nhỏ đều được chúng tôi trân quý. Từ khâu tuyển chọn những tấm da bò nguyên tấm, mài giũa các góc cạnh của gỗ, cho đến kỹ thuật nung men gốm sứ hỏa biến độc bản. Chúng tôi không sản xuất công nghiệp hàng loạt. Mỗi món quà bạn cầm trên tay đều mang hơi ấm và tâm huyết của những người thợ thủ công Việt Nam.",
    videoPlaceholderUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80",
    videoTitle: "Xem video Behind the Scenes",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-spinning-gold-glitter-particles-background-40096-large.mp4",
  },
  cta: {
    title: "Tạo Nên Món Quà Mang Dấu Ấn Riêng Của Bạn",
    subtitle: "Chỉ mất 2 phút để cá nhân hóa một món quà đầy ý nghĩa dành tặng người thương.",
    buttonText: "Bắt đầu thiết kế ngay",
    buttonHref: "/#products",
  },
  faq: {
    title: "Những Câu Hỏi Thường Gặp",
    items: [
      { question: "Thời gian chuẩn bị và giao đơn hàng mất bao lâu?", answer: "Các sản phẩm có sẵn thường được chuẩn bị trong vòng 24 giờ. Đối với các set quà được thiết kế theo yêu cầu hoặc cần đóng gói đặc biệt, thời gian xử lý có thể từ 1 - 3 ngày làm việc. Haniu luôn cố gắng giao hàng nhanh nhất để bạn kịp trao gửi yêu thương." },
      { question: "Tôi có thể tự chọn các sản phẩm để tạo thành một set quà không?", answer: "Có. Bạn có thể kết hợp gấu bông, hoa handmade, ảnh photobooth và các phụ kiện khác để tạo thành một set quà mang dấu ấn riêng. Đội ngũ Haniu sẽ hỗ trợ tư vấn để món quà phù hợp với dịp tặng và người nhận." },
      { question: "Ảnh photobooth được in trên chất liệu gì?", answer: "Ảnh photobooth được in trên giấy ảnh chất lượng cao với màu sắc sắc nét, độ bền tốt và khả năng lưu giữ lâu dài. Đây là món quà nhỏ nhưng chứa đựng những kỷ niệm đáng nhớ dành cho người thân, bạn bè hoặc người yêu." },
      { question: "Haniu có hỗ trợ viết thiệp và gói quà không?", answer: "Có. Hầu hết các đơn hàng đều được hỗ trợ gói quà cẩn thận. Bạn cũng có thể gửi lời nhắn để Haniu chuẩn bị thiệp đính kèm, giúp món quà trở nên ý nghĩa và trọn vẹn hơn khi trao tặng." },
      { question: "Nếu sản phẩm bị lỗi hoặc hư hỏng khi nhận hàng thì sao?", answer: "Trong trường hợp sản phẩm bị lỗi, thiếu phụ kiện hoặc hư hỏng do quá trình vận chuyển, vui lòng liên hệ với Haniu trong vòng 48 giờ kể từ khi nhận hàng. Chúng tôi sẽ hỗ trợ đổi mới hoặc tìm phương án xử lý phù hợp để đảm bảo trải nghiệm tốt nhất cho bạn." }
    ],
  },
  footer: {
    description: "Haniu - Thương hiệu quà tặng thiết kế thủ công và cá nhân hóa hàng đầu Việt Nam. Nơi biến những món quà bình thường thành kỷ vật vô giá.",
    address: "Số 12, Ngõ 192 Kim Mã, Ba Đình, Hà Nội",
    phone: "0987.654.321",
    email: "contact@haniu.vn",
    facebookUrl: "https://facebook.com/haniu",
    instagramUrl: "https://instagram.com/haniu",
    tiktokUrl: "https://tiktok.com/@haniu",
  },
  welcomeScreen: {
    isEnabled: true,
    welcomeText: "HANIU GIFT SHOP",
    welcomeSubtitle: "Trao Một Món Quà, Gửi Ngàn Yêu Thương",
    durationMs: 3500,
  },
  trustBadges: {
    showGenuine: true,
    showReturns: true,
    showShipping: true,
    showPayment: true,
    showSupport: true,
  },
  productDetails: {
    showPromotions: true,
    promotions: [
      "Miễn phí ship cho đơn từ 499k",
      "Giảm 10% khi mua 2 hộp quà",
      "Tặng thiệp viết tay miễn phí",
      "Freeship nội thành Hà Nội"
    ],
    showWhyChooseUs: true,
    whyChooseUs: [
      { icon: "🌹", text: "Hoa sáp thơm giữ màu tới 3 năm" },
      { icon: "🎁", text: "Tặng kèm hộp quà cao cấp" },
      { icon: "✨", text: "Có thể cá nhân hóa khắc tên" },
      { icon: "🚚", text: "Giao nhanh toàn quốc" },
      { icon: "💝", text: "Phù hợp mọi dịp đặc biệt" }
    ],
    showDeliveryPolicy: true,
    deliveryPolicy: {
      lines: [
        { label: "Nội thành Hà Nội", value: "2 - 4h (Hỏa tốc)" },
        { label: "Toàn quốc", value: "2 - 5 ngày" }
      ],
      bulletPoints: [
        "Kiểm tra hàng trước khi thanh toán (Đồng kiểm)",
        "Đóng gói kín đáo, bảo mật thông tin quà tặng"
      ]
    },
    showBrandCommitment: true,
    brandCommitment: [
      "Hình ảnh sản phẩm thật 100% tự chụp",
      "Đóng gói cẩn thận, chống va đập, bảo vệ tối đa",
      "Hoàn tiền hoặc đổi mới ngay lập tức nếu sản phẩm không giống mô tả"
    ]
  }
};

export const useHomeLayoutStore = create<HomeLayoutState>()(
  // persist(
    (realSet, get) => {
      const set = (
        nextStateOrCreator:
          | Partial<HomeLayoutState>
          | ((state: HomeLayoutState) => Partial<HomeLayoutState> | HomeLayoutState)
      ) => {
        realSet((state: HomeLayoutState) => {
          const nextState = typeof nextStateOrCreator === 'function'
            ? nextStateOrCreator(state)
            : nextStateOrCreator;
          let nextDirty = state.isDirty;
          if (nextState && typeof nextState === 'object' && 'isDirty' in nextState) {
            nextDirty = (nextState as any).isDirty ?? state.isDirty;
          } else if (nextState && typeof nextState === 'object') {
            const keys = Object.keys(nextState);
            const updatesConfig = keys.some(key => !['isSaving', 'isLoading', 'isDirty'].includes(key));
            if (updatesConfig) {
              nextDirty = true;
            }
          }
          return {
            ...nextState,
            isDirty: nextDirty
          };
        });
      };

      return {
        ...DEFAULT_STATE,
        isDirty: false,
        isLoading: false,
        isSaving: false,

        toggleVisibility: (section) =>
          set((state) => ({
            visibility: {
              ...state.visibility,
              [section]: !state.visibility[section],
            },
          })),

        updateHeader: (config) =>
          set((state) => ({
            header: { ...state.header, ...config },
          })),

        updateAnnouncementBar: (config) =>
          set((state) => ({
            announcementBar: { ...state.announcementBar, ...config },
          })),

        updateHero: (config) =>
          set((state) => ({
            hero: { ...state.hero, ...config },
          })),

        updateHeroSlide: (slideId, config) =>
          set((state) => ({
            hero: {
              ...state.hero,
              slides: state.hero.slides.map((s) =>
                s.id === slideId ? { ...s, ...config } : s
              ),
            },
          })),

        addHeroSlide: (slide) =>
          set((state) => ({
            hero: {
              ...state.hero,
              slides: [...state.hero.slides, slide],
            },
          })),

        deleteHeroSlide: (slideId) =>
          set((state) => ({
            hero: {
              ...state.hero,
              slides: state.hero.slides.filter((s) => s.id !== slideId),
            },
          })),

        moveHeroSlide: (index, direction) =>
          set((state) => {
            const slides = [...state.hero.slides];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= slides.length) return {};
            const temp = slides[index];
            slides[index] = slides[targetIndex];
            slides[targetIndex] = temp;
            return {
              hero: {
                ...state.hero,
                slides,
              },
            };
          }),

        updateHeroSlidesOrder: (slides) =>
          set((state) => ({
            hero: {
              ...state.hero,
              slides,
            },
          })),

        updateGridFeatureCard: (cardId, config) =>
          set((state) => ({
            hero: {
              ...state.hero,
              gridFeatures: state.hero.gridFeatures.map((card) =>
                card.id === cardId ? { ...card, ...config } : card
              ),
            },
          })),

        updateTrustBar: (config) =>
          set((state) => ({
            trustBar: { ...state.trustBar, ...config },
          })),

        updateBrandIntro: (config) =>
          set((state) => ({
            brandIntro: { ...state.brandIntro, ...config },
          })),

        updateCategories: (config) =>
          set((state) => ({
            categories: { ...state.categories, ...config },
          })),

        updateFeaturedProducts: (config) =>
          set((state) => ({
            featuredProducts: { ...state.featuredProducts, ...config },
          })),

        updateBenefits: (config) =>
          set((state) => ({
            benefits: { ...state.benefits, ...config },
          })),

        updateVideoBanner: (config) =>
          set((state) => ({
            videoBanner: { ...state.videoBanner, ...config },
          })),

        updateCollections: (config) =>
          set((state) => ({
            collections: { ...state.collections, ...config },
          })),

        updateSocialProof: (config) =>
          set((state) => ({
            socialProof: { ...state.socialProof, ...config },
          })),

        updateHowItWorks: (config) =>
          set((state) => ({
            howItWorks: { ...state.howItWorks, ...config },
          })),

        updateUgcFeed: (config) =>
          set((state) => ({
            ugcFeed: { ...state.ugcFeed, ...config },
          })),

        updateBlog: (config) =>
          set((state) => ({
            blog: { ...state.blog, ...config },
          })),

        updateStory: (config) =>
          set((state) => ({
            story: { ...state.story, ...config },
          })),

        updateCta: (config) =>
          set((state) => ({
            cta: { ...state.cta, ...config },
          })),

        updateFaq: (config) =>
          set((state) => ({
            faq: { ...state.faq, ...config },
          })),

        updateFooter: (config) =>
          set((state) => ({
            footer: { ...state.footer, ...config },
          })),

        updateWelcomeScreen: (config) =>
          set((state) => ({
            welcomeScreen: { ...state.welcomeScreen, ...config },
          })),

        updateTrustBadges: (config) =>
          set((state) => ({
            trustBadges: { ...state.trustBadges, ...config },
          })),

        updateProductDetails: (config) =>
          set((state) => ({
            productDetails: { ...state.productDetails, ...config },
          })),

        resetAll: () => set({ ...DEFAULT_STATE, isDirty: false }),

        resetSections: () => set((state) => ({
          announcementBar: DEFAULT_STATE.announcementBar,
          welcomeScreen: DEFAULT_STATE.welcomeScreen,
          brandIntro: DEFAULT_STATE.brandIntro,
          categories: DEFAULT_STATE.categories,
          featuredProducts: DEFAULT_STATE.featuredProducts,
          benefits: DEFAULT_STATE.benefits,
          videoBanner: DEFAULT_STATE.videoBanner,
          collections: DEFAULT_STATE.collections,
          socialProof: DEFAULT_STATE.socialProof,
          howItWorks: DEFAULT_STATE.howItWorks,
          ugcFeed: DEFAULT_STATE.ugcFeed,
          blog: DEFAULT_STATE.blog,
          story: DEFAULT_STATE.story,
          cta: DEFAULT_STATE.cta,
          faq: DEFAULT_STATE.faq,
          footer: DEFAULT_STATE.footer,
          isDirty: true,
        })),

        resetHero: () => set((state) => ({
          hero: DEFAULT_STATE.hero,
          isDirty: true,
        })),

        resetVisibility: () => set((state) => ({
          visibility: DEFAULT_STATE.visibility,
          isDirty: true,
        })),

        fetchConfigFromServer: async () => {
          set({ isLoading: true });
          try {
            const res = await systemConfigService.getConfig('HOME_LAYOUT');
            if (res && res.configValue) {
              const parsed = typeof res.configValue === 'string' ? JSON.parse(res.configValue) : res.configValue;
              // Deep merge: ensure each section config preserves defaults for missing fields
              const deepMerged: Record<string, any> = {};
              for (const key of Object.keys(parsed)) {
                const defaultVal = (DEFAULT_STATE as any)[key];
                const parsedVal = parsed[key];
                if (defaultVal && typeof defaultVal === 'object' && !Array.isArray(defaultVal) && typeof parsedVal === 'object' && !Array.isArray(parsedVal)) {
                  deepMerged[key] = { ...defaultVal, ...parsedVal };
                } else {
                  deepMerged[key] = parsedVal;
                }
              }
              set((state) => ({
                ...state,
                ...deepMerged,
                isLoading: false,
                isDirty: false,
              }));
            } else {
              set({ isLoading: false });
            }
          } catch (err) {
            console.error('Failed to fetch home layout config from server:', err);
            set({ isLoading: false });
          }
        },

        saveConfigToServer: async (options?: RequestInit) => {
          set({ isSaving: true });
          try {
            const state = get();
            const dataToSave = {
              visibility: state.visibility,
              header: state.header,
              announcementBar: state.announcementBar,
              hero: state.hero,
              trustBar: state.trustBar,
              brandIntro: state.brandIntro,
              categories: state.categories,
              featuredProducts: state.featuredProducts,
              benefits: state.benefits,
              videoBanner: state.videoBanner,
              collections: state.collections,
              socialProof: state.socialProof,
              howItWorks: state.howItWorks,
              ugcFeed: state.ugcFeed,
              blog: state.blog,
              story: state.story,
              cta: state.cta,
              faq: state.faq,
              footer: state.footer,
              welcomeScreen: state.welcomeScreen,
              trustBadges: state.trustBadges,
              productDetails: state.productDetails,
            };
            await systemConfigService.updateConfig('HOME_LAYOUT', dataToSave, options);
            set({ isSaving: false, isDirty: false });
          } catch (err) {
            console.error('Failed to save home layout config to server:', err);
            set({ isSaving: false });
            throw err;
          }
        },
      };
    }
  // )
);
