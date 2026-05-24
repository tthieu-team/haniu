import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export interface CategoriesConfig {
  title: string;
  subtitle: string;
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
  reviews: ReviewItem[];
}

export interface HowItWorksStep {
  number: string;
  title: string;
  desc: string;
}

export interface HowItWorksConfig {
  title: string;
  subtitle: string;
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
  items: BlogItem[];
}

export interface StoryConfig {
  title: string;
  subtitle: string;
  content: string;
  videoPlaceholderUrl: string;
  videoTitle: string;
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

  // Actions
  toggleVisibility: (section: keyof HomeLayoutState['visibility']) => void;
  updateHeader: (config: Partial<HeaderConfig>) => void;
  updateAnnouncementBar: (config: Partial<AnnouncementBarConfig>) => void;
  updateHero: (config: Partial<HeroConfig>) => void;
  updateHeroSlide: (slideId: string, config: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (slideId: string) => void;
  updateGridFeatureCard: (cardId: string, config: Partial<GridFeatureCard>) => void;
  updateTrustBar: (config: Partial<TrustBarConfig>) => void;
  updateBrandIntro: (config: Partial<BrandIntroConfig>) => void;
  updateCategories: (config: Partial<CategoriesConfig>) => void;
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
  resetAll: () => void;
  isLoading: boolean;
  isSaving: boolean;
  fetchConfigFromServer: () => Promise<void>;
  saveConfigToServer: () => Promise<void>;
}

const DEFAULT_STATE = {
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
      { name: "Sản phẩm", href: "/#products" },
      { name: "Bộ sưu tập", href: "/#collections" },
      { name: "Câu chuyện", href: "/#story" },
    ],
    isSticky: true,
  },
  announcementBar: {
    text: "🚚 Miễn phí vận chuyển toàn quốc cho tất cả đơn hàng từ 499k",
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
        scriptTitle: "Quà theo",
        boldTitle: "Ý MUỐN",
        badgeText: "Quà ý nghĩa, trao gửi yêu thương",
        subtitle: "Mỗi món quà là một thông điệp yêu thương, được chuẩn bị bằng cả tấm lòng.",
        ctaText: "KHÁM PHÁ NGAY",
        ctaHref: "/#products",
        textLayout: "right" as const,
        circleBadgeText: "HANDMADE • WITH LOVE • HANDMADE • WITH LOVE •",
        cardTitle: "From Love",
        cardSubtitle: "",
      },
      {
        id: "slide-2",
        backgroundImage: "/8c23c072-f852-4eb2-bf6b-c133fdb03a46.jfif",
        scriptTitle: "",
        boldTitle: "QUÀ THEO Ý MUỐN",
        badgeText: "",
        subtitle: "Chọn quà theo sở thích, theo dịp, theo cách riêng của bạn.",
        ctaText: "XEM NGAY",
        ctaHref: "/#products",
        textLayout: "left" as const,
        circleBadgeText: "",
        cardTitle: "",
        cardSubtitle: "",
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
    title: "Kiến Tạo Những Kỷ Niệm Vô Giá",
    subtitle: "VỀ HANIU",
    description: "Được thành lập từ năm 2020, Haniu mang sứ mệnh biến những món quà bình thường thành những kỷ vật vô giá. Chúng tôi tin rằng mỗi món quà trao đi là một thông điệp yêu thương được gửi gắm trọn vẹn, được chế tác thủ công tinh xảo bởi những nghệ nhân lành nghề cùng công nghệ cá nhân hóa laser hiện đại.",
    stats: [
      { value: "2020", label: "Năm thành lập" },
      { value: "50.000+", label: "Khách hàng tin chọn" },
      { value: "100%", label: "Chế tác thủ công" },
      { value: "24/7", label: "Tư vấn thiết kế" }
    ]
  },
  categories: {
    title: "Bộ Sưu Tập Quà Tặng Theo Dịp",
    subtitle: "Lựa chọn món quà hoàn hảo nhất cho những cột mốc ý nghĩa trong cuộc sống",
    items: [
      { name: "Quà Sinh Nhật", slug: "sinh-nhat", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop&q=80", count: "24+ set quà" },
      { name: "Quà Tốt Nghiệp", slug: "tot-nghiep", image: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&auto=format&fit=crop&q=80", count: "12+ set quà" },
      { name: "Quà Cặp Đôi", slug: "cap-doi", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80", count: "18+ set quà" },
      { name: "Quà Doanh Nghiệp", slug: "doanh-nghiep", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=80", count: "30+ set quà" },
    ],
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
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wrapping-a-gift-box-with-ribbon-39922-large.mp4",
    placeholderImage: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80",
    buttonText: "Xem Thêm Câu Chuyện",
    buttonHref: "/#story",
  },
  collections: {
    title: "Bộ Sưu Tập Độc Quyền",
    subtitle: "Dòng sản phẩm được thiết kế theo mùa và xu hướng nghệ thuật đương đại",
    items: [
      {
        title: "Summer Breeze Collection",
        subtitle: "Tông xanh bạc hà mát lạnh, ly sứ kèm thìa mạ vàng tinh tế",
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
    title: "Cảm Nhận Từ Khách Hàng",
    ratingScore: "4.9",
    reviewsCount: "1.250+",
    reviews: [
      { id: "r1", name: "Nguyễn Thu Trang", role: "Khách mua Quà Sinh Nhật", content: "Mình rất bất ngờ về chất lượng khắc tên trên ly sứ. Rất sắc nét và tinh tế! Bạn gái mình nhận quà thích lắm, khóc luôn vì xúc động.", rating: 5, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" },
      { id: "r2", name: "Trần Anh Tuấn", role: "Giám đốc nhân sự TechCorp", content: "Đặt 200 set quà doanh nghiệp khắc logo công ty cho đối tác dịp lễ, Haniu làm siêu nhanh, đóng gói sang trọng, đối tác ai cũng khen chu đáo.", rating: 5, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80" },
      { id: "r3", name: "Lê Minh Thảo", role: "Khách mua Quà Kỷ Niệm", content: "Sổ tay da thật sờ rất sướng tay, thơm mùi da tự nhiên. Dịch vụ khắc laser miễn phí rất chuyên nghiệp. Hộp quà đóng gói siêu đẹp và chắc chắn.", rating: 5, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    ],
  },
  howItWorks: {
    title: "Quy Trình Tạo Nên Món Quà Độc Bản",
    subtitle: "Chỉ với 4 bước đơn giản để tạo ra hộp quà chứa đựng tâm ý của riêng bạn",
    steps: [
      { number: "01", title: "Chọn Mẫu Quà", desc: "Lựa chọn giữa hàng chục set combo quà tặng sẵn có hoặc sản phẩm lẻ của Haniu." },
      { number: "02", title: "Cá Nhân Hóa", desc: "Nhập tên, ngày kỷ niệm hoặc lời nhắn gửi để chúng tôi thiết kế bản khắc laser." },
      { number: "03", title: "Xác Nhận Preview", desc: "Đội ngũ thiết kế gửi bản vẽ mô phỏng cho bạn duyệt trước khi tiến hành chế tác." },
      { number: "04", title: "Nhận Quà Hoàn Mỹ", desc: "Quà được gói hộp sang trọng kèm nơ lụa và thiệp viết tay, giao hỏa tốc đến người nhận." },
    ],
  },
  ugcFeed: {
    title: "Khoảnh Khắc Của Haniu",
    hashtag: "#mygiftmoment",
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
    title: "Nghệ Thuật Từ Những Bàn Tay Thủ Công",
    subtitle: "Hành trình chăm chút tỉ mỉ cho từng góc cạnh hộp quà",
    content: "Tại xưởng chế tác của Haniu, mỗi chi tiết nhỏ đều được chúng tôi trân quý. Từ khâu tuyển chọn những tấm da bò nguyên tấm, mài giũa các góc cạnh của gỗ, cho đến kỹ thuật nung men gốm sứ hỏa biến độc bản. Chúng tôi không sản xuất công nghiệp hàng loạt. Mỗi món quà bạn cầm trên tay đều mang hơi ấm và tâm huyết của những người thợ thủ công Việt Nam.",
    videoPlaceholderUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80",
    videoTitle: "Xem video Behind the Scenes",
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
      { question: "Thời gian khắc laser cá nhân hóa mất bao lâu?", answer: "Haniu sử dụng máy khắc laser công nghệ cao thế hệ mới, quy trình khắc tên thông thường chỉ mất từ 15-30 phút. Do đó, đơn hàng hỏa tốc 2 giờ vẫn được đảm bảo giao đúng hẹn." },
      { question: "Tôi có thể xem trước thiết kế khắc laser trước khi thực hiện không?", answer: "Có, sau khi bạn đặt hàng, bộ phận thiết kế của Haniu sẽ thiết kế layout chữ/hình ảnh và gửi ảnh phác thảo (mockup) qua Zalo/Email để bạn duyệt. Haniu chỉ tiến hành khắc khi bạn đã hoàn toàn đồng ý." },
      { question: "Haniu có chính sách đổi trả như thế nào đối với quà cá nhân hóa?", answer: "Đối với sản phẩm có khắc tên/cá nhân hóa, Haniu cam kết 1 đổi 1 miễn phí nếu có lỗi từ phía sản xuất (sai chính tả so với bản duyệt, trầy xước, nứt vỡ do vận chuyển). Với các sản phẩm không cá nhân hóa, bạn được đổi trả trong vòng 7 ngày." },
      { question: "Hộp quà của Haniu đã bao gồm những gì?", answer: "Tất cả các set combo quà tặng tại Haniu đều được đóng gói tiêu chuẩn bao gồm: Hộp cứng cao cấp lót rơm giấy, ruy băng lụa thắt nơ nghệ thuật, thiệp viết tay theo yêu cầu và túi giấy sang trọng đi kèm để bạn tiện đem tặng." },
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
    welcomeSubtitle: "Thiết kế độc bản - Trọn vẹn yêu thương",
    durationMs: 2500,
  },
};

export const useHomeLayoutStore = create<HomeLayoutState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
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

      resetAll: () => set(DEFAULT_STATE),

      fetchConfigFromServer: async () => {
        set({ isLoading: true });
        try {
          const res = await systemConfigService.getConfig('HOME_LAYOUT');
          if (res && res.configValue) {
            const parsed = typeof res.configValue === 'string' ? JSON.parse(res.configValue) : res.configValue;
            set((state) => ({
              ...state,
              ...parsed,
              isLoading: false,
            }));
          } else {
            set({ isLoading: false });
          }
        } catch (err) {
          console.error('Failed to fetch home layout config from server:', err);
          set({ isLoading: false });
        }
      },

      saveConfigToServer: async () => {
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
          };
          await systemConfigService.updateConfig('HOME_LAYOUT', dataToSave);
          set({ isSaving: false });
        } catch (err) {
          console.error('Failed to save home layout config to server:', err);
          set({ isSaving: false });
          throw err;
        }
      },
    }),
    {
      name: 'haniu-home-layout-config-v7',
    }
  )
);
