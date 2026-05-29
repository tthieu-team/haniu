'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';

interface WhyChooseUsItem {
  icon: string;
  text: string;
}

interface DeliveryPolicyLine {
  label: string;
  value: string;
}

interface ProductDetailsItemConfig<T> {
  useGlobalConfig: boolean;
  show: boolean;
  list: T;
}

interface SeoSection {
  icon: string;
  title: string;
  content: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface LayoutConfig {
  showSeoDescription?: boolean;
  seoDescription?: {
    title: string;
    sections: SeoSection[];
  };
  showPolicies?: boolean;
  policies?: {
    showReturns?: boolean;
    returns?: { title: string; content: string };
    showWarranty?: boolean;
    warranty?: { title: string; content: string };
    showCare?: boolean;
    care?: { title: string; content: string };
    showEngraving?: boolean;
    engraving?: { title: string; content: string };
    showFaq?: boolean;
    faq?: { title: string; content: FaqItem[] };
  };
  trustBadges?: {
    useGlobalConfig: boolean;
    showGenuine: boolean;
    showReturns: boolean;
    showShipping: boolean;
    showPayment: boolean;
    showSupport: boolean;
  };
  promotionsConfig?: ProductDetailsItemConfig<string[]>;
  whyChooseUsConfig?: ProductDetailsItemConfig<WhyChooseUsItem[]>;
  deliveryPolicyConfig?: ProductDetailsItemConfig<{
    lines: DeliveryPolicyLine[];
    bulletPoints: string[];
  }>;
  brandCommitmentConfig?: ProductDetailsItemConfig<string[]>;
  customizationConfig?: {
    showEngraving?: boolean;
    showEngravingMockup?: boolean;
    engravingLabel?: string;
    engravingPlaceholder?: string;
    engravingMaxLength?: number;
    showCardMessage?: boolean;
    showCardMessageMockup?: boolean;
    cardMessageLabel?: string;
    cardMessagePlaceholder?: string;
    showGiftWrap?: boolean;
    giftWrapLabel?: string;
    giftWrapOptions?: string[];
  };
}

interface LayoutConfigEditorProps {
  value: string;
  onChange: (val: string) => void;
  productName?: string;
  categoryName?: string;
}

export default function LayoutConfigEditor({ value, onChange, productName = 'Sản phẩm', categoryName = 'Quà tặng' }: LayoutConfigEditorProps) {
  const [config, setConfig] = useState<LayoutConfig>({});
  const [activeTab, setActiveTab] = useState<'seo' | 'returns' | 'warranty' | 'care' | 'engraving' | 'faq' | 'badges' | 'promotions' | 'whyChooseUs' | 'delivery' | 'commitment' | 'customization'>('seo');

  const [newPromo, setNewPromo] = useState('');
  const [newCommitment, setNewCommitment] = useState('');
  const [newWhyIcon, setNewWhyIcon] = useState('🌹');
  const [newWhyText, setNewWhyText] = useState('');
  const [newDelivLabel, setNewDelivLabel] = useState('');
  const [newDelivVal, setNewDelivVal] = useState('');
  const [newDelivBullet, setNewDelivBullet] = useState('');
  const [newGiftOption, setNewGiftOption] = useState('');

  // Load configuration and set defaults if missing
  useEffect(() => {
    let parsed: LayoutConfig = {};
    try {
      if (value && value.trim()) {
        parsed = JSON.parse(value);
      }
    } catch (e) {
      console.error('Failed to parse layoutConfig value', e);
    }

    // Set default values if not present
    const updated: LayoutConfig = {
      showSeoDescription: parsed.showSeoDescription ?? true,
      seoDescription: {
        title: parsed.seoDescription?.title || "📖 Chi tiết sản phẩm & Câu chuyện thương hiệu",
        sections: parsed.seoDescription?.sections || [
          {
            icon: "🎁",
            title: `Ý nghĩa món quà ${productName}`,
            content: `Mỗi món quà tại Haniu không đơn thuần là vật chất, mà là cả một thông điệp yêu thương được gửi gắm trọn vẹn. Sản phẩm ${productName} được thiết kế đặc biệt nhằm tôn vinh những khoảnh khắc đáng nhớ trong cuộc sống. Dù là dịp sinh nhật, kỷ niệm ngày yêu, ngày cưới hay các dịp lễ tri ân đặc biệt, đây sẽ là cầu nối hoàn hảo gắn kết tình cảm giữa bạn và người nhận quà, đem lại niềm vui bất ngờ đầy ý nghĩa.`
          },
          {
            icon: "💎",
            title: "Chất liệu cao cấp & độ bền vượt trội",
            content: `Chúng tôi luôn đặt tiêu chuẩn chất lượng lên hàng đầu. Sản phẩm thuộc nhóm ${categoryName} này được tuyển chọn từ nguồn nguyên liệu tự nhiên tinh khiết nhất: Hoa sáp thơm mềm mại tự nhiên giữ hương lâu tới 3 năm; hộp đựng làm từ carton lạnh cứng cáp bọc giấy mỹ thuật nhập khẩu sang trọng; các phụ kiện đi kèm hoàn toàn an sau, thân thiện với người dùng.`
          },
          {
            icon: "🛠️",
            title: "Quy trình chế tác thủ công tỉ mỉ",
            content: "Để hoàn thiện một hộp quà hoàn chỉnh đến tay khách hàng, đội ngũ nghệ nhân tại Haniu đã thực hiện một quy trình khép kín tỉ mỉ từ việc cắt ruy băng, phối kết màu sắc hoa sáp hài hòa đến khắc laser tỉ mỉ từng nét chữ cá nhân hóa. Mỗi nét khắc đều được điều chỉnh độ sâu phù hợp trên chất liệu gỗ/da/acrylic để đảm bảo nét chữ sắc sảo, bền vững cùng thời gian."
          },
          {
            icon: "🌱",
            title: "Hướng dẫn bảo quản quà tặng lâu dài",
            content: "Để giữ cho món quà luôn đẹp như mới và giữ được hương thơm lâu dài nhất, quý khách vui lòng lưu ý tránh tiếp xúc nước/độ ẩm cao, không đặt dưới ánh nắng trực tiếp quá lâu, và chỉ cần quét bụi nhẹ bằng cọ mềm định kỳ."
          },
          {
            icon: "📜",
            title: "Câu chuyện sản phẩm Haniu",
            content: "Haniu ra đời từ niềm đam mê khơi dậy những cảm xúc chân thành qua từng món quà trao đi. Chúng tôi tin rằng một món quà tuyệt vời nhất không nằm ở giá trị vật chất của nó, mà nằm ở sự thấu hiểu và dấu ấn riêng biệt của người tặng. Đó chính là lý do Haniu tiên phong cung cấp giải pháp quà tặng thiết kế cá nhân hóa khắc tên riêng theo yêu cầu."
          }
        ]
      },
      showPolicies: parsed.showPolicies ?? true,
      policies: {
        showReturns: parsed.policies?.showReturns ?? true,
        returns: {
          title: parsed.policies?.returns?.title || "🔄 Cam kết đổi trả trong vòng 7 ngày",
          content: parsed.policies?.returns?.content || `Haniu cam kết đổi trả sản phẩm mới 100% hoàn toàn miễn phí hoặc hoàn tiền trong vòng 7 ngày kể từ lúc nhận hàng nếu gặp các trường hợp sau:
- Sản phẩm bị nứt, vỡ, móp méo trong quá trình vận chuyển.
- Nội dung khắc laser sai sót so với yêu cầu đã xác nhận trước đó.
- Sản phẩm lỗi kỹ thuật do nhà sản xuất (hỏng khóa, bung chỉ khâu sổ da, v.v.).

*Lưu ý: Không áp dụng đổi trả đối với sản phẩm cá nhân hóa khắc tên riêng nếu lý do xuất phát từ việc khách hàng đổi ý hoặc nhập sai thông tin khắc ban đầu.`
        },
        showWarranty: parsed.policies?.showWarranty ?? true,
        warranty: {
          title: parsed.policies?.warranty?.title || "🛡️ Thời hạn bảo hành sản phẩm",
          content: parsed.policies?.warranty?.content || `Tại Haniu Gift Shop, tất cả sản phẩm đều được áp dụng chính sách bảo hành chính hãng để đảm bảo sự yên tâm tuyệt đối:
- Sổ bìa da thật: Bảo hành 12 tháng đối với bề mặt da và đường chỉ may thủ công.
- Bình giữ nhiệt tre/treo gỗ: Bảo hành 6 tháng về khả năng giữ nhiệt.
- Phụ kiện hộp gỗ, ly sứ: Bảo hành 3 tháng đối với các chi tiết kim loại, khóa đồng.

Hỗ trợ bảo trì trọn đời (làm mới đồ da, tra dầu gỗ) với chi phí ưu đãi dành cho khách hàng thân thiết.`
        },
        showCare: parsed.policies?.showCare ?? true,
        care: {
          title: parsed.policies?.care?.title || "🌱 Hướng dẫn bảo quản đồ gỗ và da tự nhiên",
          content: parsed.policies?.care?.content || `Sản phẩm của Haniu đa số chế tác từ các vật liệu tự nhiên cao cấp như gỗ thông, tre, da bò thật. Để kéo dài tuổi thọ của quà tặng, quý khách vui lòng:
- Đồ gỗ/Tre: Tránh ngâm nước quá lâu hoặc phơi trực tiếp dưới ánh nắng gắt. Vệ sinh bằng khăn ẩm và lau khô ngay sau đó.
- Đồ da thật: Tránh ẩm ướt, không để ở nơi quá nóng hoặc tiếp xúc hóa chất tẩy rửa mạnh. Nên lau bằng xi chuyên dụng đồ da định kỳ.
- Ly sứ vẽ vàng: Không sử dụng trong lò vi sóng hoặc máy rửa bát để bảo vệ lớp vàng kim 24k vẽ tay tinh xảo.`
        },
        showEngraving: parsed.policies?.showEngraving ?? true,
        engraving: {
          title: parsed.policies?.engraving?.title || "✍️ Hướng dẫn yêu cầu thiết kế khắc Laser",
          content: parsed.policies?.engraving?.content || `Dịch vụ cá nhân hóa khắc tên giúp quà tặng trở nên độc bản và ý nghĩa hơn bao giờ hết:
- Độ dài khuyến nghị: Dưới 30 ký tự (để nét khắc to, rõ và đẹp nhất).
- Font chữ khắc: Haniu hỗ trợ font viết tay hoa văn lãng mạn cho thiệp, font in hoa vuông vắn lịch sự cho sổ da doanh nghiệp.
- Khắc Logo công ty: Khách hàng doanh nghiệp muốn in/khắc logo số lượng lớn vui lòng tải file vector (.PDF, .AI, .SVG) và liên hệ Zalo Admin để nhận bản demo mockup trước khi tiến hành sản xuất hàng loạt.`
        },
        showFaq: parsed.policies?.showFaq ?? true,
        faq: {
          title: parsed.policies?.faq?.title || "💬 Các câu hỏi thường gặp",
          content: Array.isArray(parsed.policies?.faq?.content)
            ? parsed.policies.faq.content
            : [
              { question: "Tôi có được xem bản vẽ demo trước khi khắc thật không?", answer: "Có! Sau khi đặt hàng, nhân viên kỹ thuật Haniu sẽ liên hệ gửi bản vẽ demo mockup 2D thiết kế qua Zalo/Email để bạn duyệt trước khi bấm máy khắc laser." },
              { question: "Thời gian giao hàng khắc tên mất bao lâu?", answer: "Mặc dù là hàng cá nhân hóa, Haniu có quy trình xử lý tối ưu nên thời gian giao hàng cực nhanh: Nội thành Hà Nội giao trong ngày (hỏa tốc 2h), các tỉnh thành khác chỉ từ 2 - 4 ngày làm việc." },
              { question: "Haniu có cung cấp hóa đơn đỏ VAT cho khách hàng doanh nghiệp không?", answer: "Có, Haniu có đầy đủ tư cách pháp nhân để xuất hóa đơn tài chính VAT 8-10% và cung cấp hồ sơ năng lực báo giá cạnh tranh cho các đơn hàng quà tặng doanh nghiệp số lượng lớn." }
            ]
        }
      },
      trustBadges: {
        useGlobalConfig: parsed.trustBadges?.useGlobalConfig ?? true,
        showGenuine: parsed.trustBadges?.showGenuine ?? true,
        showReturns: parsed.trustBadges?.showReturns ?? true,
        showShipping: parsed.trustBadges?.showShipping ?? true,
        showPayment: parsed.trustBadges?.showPayment ?? true,
        showSupport: parsed.trustBadges?.showSupport ?? true,
      },
      promotionsConfig: {
        useGlobalConfig: parsed.promotionsConfig?.useGlobalConfig ?? true,
        show: parsed.promotionsConfig?.show ?? true,
        list: parsed.promotionsConfig?.list || [
          "Miễn phí ship cho đơn từ 499k",
          "Giảm 10% khi mua 2 hộp quà",
          "Tặng thiệp viết tay miễn phí",
          "Freeship nội thành Hà Nội"
        ]
      },
      whyChooseUsConfig: {
        useGlobalConfig: parsed.whyChooseUsConfig?.useGlobalConfig ?? true,
        show: parsed.whyChooseUsConfig?.show ?? true,
        list: parsed.whyChooseUsConfig?.list || [
          { icon: "🌹", text: "Hoa sáp thơm giữ màu tới 3 năm" },
          { icon: "🎁", text: "Tặng kèm hộp quà cao cấp" },
          { icon: "✨", text: "Có thể cá nhân hóa khắc tên" },
          { icon: "🚚", text: "Giao nhanh toàn quốc" },
          { icon: "💝", text: "Phù hợp mọi dịp đặc biệt" }
        ]
      },
      deliveryPolicyConfig: {
        useGlobalConfig: parsed.deliveryPolicyConfig?.useGlobalConfig ?? true,
        show: parsed.deliveryPolicyConfig?.show ?? true,
        list: parsed.deliveryPolicyConfig?.list || {
          lines: [
            { label: "Nội thành Hà Nội", value: "2 - 4h (Hỏa tốc)" },
            { label: "Toàn quốc", value: "2 - 5 ngày" }
          ],
          bulletPoints: [
            "Kiểm tra hàng trước khi thanh toán (Đồng kiểm)",
            "Đóng gói kín đáo, bảo mật thông tin quà tặng"
          ]
        }
      },
      brandCommitmentConfig: {
        useGlobalConfig: parsed.brandCommitmentConfig?.useGlobalConfig ?? true,
        show: parsed.brandCommitmentConfig?.show ?? true,
        list: parsed.brandCommitmentConfig?.list || [
          "Hình ảnh sản phẩm thật 100% tự chụp",
          "Đóng gói cẩn thận, chống va đập, bảo vệ tối đa",
          "Hoàn tiền hoặc đổi mới ngay lập tức nếu sản phẩm không giống mô tả"
        ]
      },
      customizationConfig: {
        showEngraving: parsed.customizationConfig?.showEngraving ?? true,
        showEngravingMockup: parsed.customizationConfig?.showEngravingMockup ?? true,
        engravingLabel: parsed.customizationConfig?.engravingLabel || "Khắc chữ / Tên theo yêu cầu (Miễn phí)",
        engravingPlaceholder: parsed.customizationConfig?.engravingPlaceholder || "Nhập tên hoặc lời chúc muốn khắc (tối đa 50 ký tự)",
        engravingMaxLength: parsed.customizationConfig?.engravingMaxLength ?? 50,
        showCardMessage: parsed.customizationConfig?.showCardMessage ?? true,
        showCardMessageMockup: parsed.customizationConfig?.showCardMessageMockup ?? true,
        cardMessageLabel: parsed.customizationConfig?.cardMessageLabel || "Lời nhắn trên thiệp chúc mừng",
        cardMessagePlaceholder: parsed.customizationConfig?.cardMessagePlaceholder || "Nhập nội dung thư chúc mừng gửi tới người nhận...",
        showGiftWrap: parsed.customizationConfig?.showGiftWrap ?? true,
        giftWrapLabel: parsed.customizationConfig?.giftWrapLabel || "Chọn ruy băng nơ / hộp gói",
        giftWrapOptions: parsed.customizationConfig?.giftWrapOptions || [
          "Ruy băng Đỏ Lãng Mạn",
          "Ruy băng Vàng Hoàng Gia",
          "Gói bọc giấy Kraft Hoài Cổ"
        ]
      }
    };
    setConfig(updated);
  }, [value, productName, categoryName]);

  // Update layoutConfig parent value
  const updateParent = (newConfig: LayoutConfig) => {
    setConfig(newConfig);
    onChange(JSON.stringify(newConfig, null, 2));
  };

  // Toggle helpers
  const toggleSeoDescription = () => {
    updateParent({ ...config, showSeoDescription: !config.showSeoDescription });
  };

  const togglePolicyTab = (tab: 'showReturns' | 'showWarranty' | 'showCare' | 'showEngraving' | 'showFaq') => {
    if (!config.policies) return;
    const updatedPolicies = {
      ...config.policies,
      [tab]: !config.policies[tab]
    };
    updateParent({
      ...config,
      policies: updatedPolicies
    });
  };

  // SEO Description Fields Edit
  const handleSeoTitleChange = (val: string) => {
    if (!config.seoDescription) return;
    updateParent({
      ...config,
      seoDescription: { ...config.seoDescription, title: val }
    });
  };

  const handleSeoSectionChange = (index: number, field: keyof SeoSection, val: string) => {
    if (!config.seoDescription) return;
    const updatedSections = [...config.seoDescription.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: val };
    updateParent({
      ...config,
      seoDescription: { ...config.seoDescription, sections: updatedSections }
    });
  };

  const addSeoSection = () => {
    if (!config.seoDescription) return;
    updateParent({
      ...config,
      seoDescription: {
        ...config.seoDescription,
        sections: [...config.seoDescription.sections, { icon: '✨', title: 'Tiêu đề mục mới', content: 'Nội dung chi tiết mục mới...' }]
      }
    });
  };

  const removeSeoSection = (index: number) => {
    if (!config.seoDescription) return;
    const updatedSections = config.seoDescription.sections.filter((_, i) => i !== index);
    updateParent({
      ...config,
      seoDescription: { ...config.seoDescription, sections: updatedSections }
    });
  };

  // Policy Text Fields Edit
  const handlePolicyChange = (tab: 'returns' | 'warranty' | 'care' | 'engraving', field: 'title' | 'content', val: string) => {
    if (!config.policies) return;
    const tabObj = config.policies[tab] || { title: '', content: '' };
    const updatedPolicies = {
      ...config.policies,
      [tab]: { ...tabObj, [field]: val }
    };
    updateParent({
      ...config,
      policies: updatedPolicies
    });
  };

  // FAQ Fields Edit
  const handleFaqTitleChange = (val: string) => {
    if (!config.policies || !config.policies.faq) return;
    updateParent({
      ...config,
      policies: {
        ...config.policies,
        faq: { ...config.policies.faq, title: val }
      }
    });
  };

  const handleFaqItemChange = (index: number, field: keyof FaqItem, val: string) => {
    if (!config.policies || !config.policies.faq) return;
    const updatedFaqList = [...config.policies.faq.content];
    updatedFaqList[index] = { ...updatedFaqList[index], [field]: val };
    updateParent({
      ...config,
      policies: {
        ...config.policies,
        faq: { ...config.policies.faq, content: updatedFaqList }
      }
    });
  };

  const addFaqItem = () => {
    if (!config.policies || !config.policies.faq) return;
    updateParent({
      ...config,
      policies: {
        ...config.policies,
        faq: {
          ...config.policies.faq,
          content: [...config.policies.faq.content, { question: 'Câu hỏi mới là gì?', answer: 'Câu trả lời chi tiết...' }]
        }
      }
    });
  };

  const removeFaqItem = (index: number) => {
    if (!config.policies || !config.policies.faq) return;
    const updatedFaqList = config.policies.faq.content.filter((_, i) => i !== index);
    updateParent({
      ...config,
      policies: {
        ...config.policies,
        faq: { ...config.policies.faq, content: updatedFaqList }
      }
    });
  };

  const handleTrustBadgeChange = (field: string, val: boolean) => {
    if (!config.trustBadges) return;
    updateParent({
      ...config,
      trustBadges: { ...config.trustBadges, [field]: val }
    });
  };

  const handlePromotionsChange = (field: string, val: any) => {
    if (!config.promotionsConfig) return;
    updateParent({
      ...config,
      promotionsConfig: { ...config.promotionsConfig, [field]: val }
    });
  };

  const handleWhyChooseUsChange = (field: string, val: any) => {
    if (!config.whyChooseUsConfig) return;
    updateParent({
      ...config,
      whyChooseUsConfig: { ...config.whyChooseUsConfig, [field]: val }
    });
  };

  const handleDeliveryPolicyChange = (field: string, val: any) => {
    if (!config.deliveryPolicyConfig) return;
    updateParent({
      ...config,
      deliveryPolicyConfig: { ...config.deliveryPolicyConfig, [field]: val }
    });
  };

  const handleBrandCommitmentChange = (field: string, val: any) => {
    if (!config.brandCommitmentConfig) return;
    updateParent({
      ...config,
      brandCommitmentConfig: { ...config.brandCommitmentConfig, [field]: val }
    });
  };

  const handleCustomizationChange = (field: string, val: any) => {
    const currentCustom = config.customizationConfig || {
      showEngraving: true,
      showEngravingMockup: true,
      engravingLabel: "Khắc chữ / Tên theo yêu cầu (Miễn phí)",
      engravingPlaceholder: "Nhập tên hoặc lời chúc muốn khắc (tối đa 50 ký tự)",
      engravingMaxLength: 50,
      showCardMessage: true,
      showCardMessageMockup: true,
      cardMessageLabel: "Lời nhắn trên thiệp chúc mừng",
      cardMessagePlaceholder: "Nhập nội dung thư chúc mừng gửi tới người nhận...",
      showGiftWrap: true,
      giftWrapLabel: "Chọn ruy băng nơ / hộp gói",
      giftWrapOptions: [
        "Ruy băng Đỏ Lãng Mạn",
        "Ruy băng Vàng Hoàng Gia",
        "Gói bọc giấy Kraft Hoài Cổ"
      ]
    };
    updateParent({
      ...config,
      customizationConfig: { ...currentCustom, [field]: val }
    });
  };

  const promotionsConfig = config.promotionsConfig;
  const whyChooseUsConfig = config.whyChooseUsConfig;
  const deliveryPolicyConfig = config.deliveryPolicyConfig;
  const brandCommitmentConfig = config.brandCommitmentConfig;
  const customizationConfig = config.customizationConfig || {
    showEngraving: true,
    showEngravingMockup: true,
    engravingLabel: "Khắc chữ / Tên theo yêu cầu (Miễn phí)",
    engravingPlaceholder: "Nhập tên hoặc lời chúc muốn khắc (tối đa 50 ký tự)",
    engravingMaxLength: 50,
    showCardMessage: true,
    showCardMessageMockup: true,
    cardMessageLabel: "Lời nhắn trên thiệp chúc mừng",
    cardMessagePlaceholder: "Nhập nội dung thư chúc mừng gửi tới người nhận...",
    showGiftWrap: true,
    giftWrapLabel: "Chọn ruy băng nơ / hộp gói",
    giftWrapOptions: [
      "Ruy băng Đỏ Lãng Mạn",
      "Ruy băng Vàng Hoàng Gia",
      "Gói bọc giấy Kraft Hoài Cổ"
    ]
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
      <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2 flex items-center gap-1.5">
        <Icon name="settings" size={14} /> Cấu hình Chi tiết Sản phẩm & Chính sách
      </h3>

      {/* Selector Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800/50 p-1 rounded-2xl overflow-x-auto scrollbar-none">
        {[
          { id: 'seo', label: 'Mô tả & Câu chuyện', icon: 'gift' },
          { id: 'badges', label: 'Huy hiệu Tin cậy', icon: 'check' },
          { id: 'promotions', label: 'Ưu đãi hôm nay', icon: 'star' },
          { id: 'whyChooseUs', label: 'Lý do chọn Haniu', icon: 'heart' },
          { id: 'delivery', label: 'Chính sách Giao hàng', icon: 'truck' },
          { id: 'commitment', label: 'Haniu cam kết', icon: 'shield' },
          { id: 'customization', label: 'Cá nhân hóa', icon: 'edit' },
          { id: 'returns', label: 'Chính sách Đổi trả', icon: 'refresh' },
          { id: 'warranty', label: 'Bảo hành', icon: 'shield' },
          { id: 'care', label: 'Bảo quản', icon: 'heart' },
          { id: 'engraving', label: 'Khắc tên', icon: 'edit' },
          { id: 'faq', label: 'FAQ', icon: 'help' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? 'bg-white dark:bg-zinc-700 text-rose-500 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="space-y-4 pt-2">
        {activeTab === 'seo' && config.seoDescription && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-slate-500 font-semibold flex items-center gap-2">
                Hiển thị phần "Mô tả & Câu chuyện"
              </label>
              <button
                type="button"
                onClick={toggleSeoDescription}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${config.showSeoDescription ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.showSeoDescription ? 'translate-x-5' : 'translate-x-0'
                  }`} />
              </button>
            </div>

            {config.showSeoDescription && (
              <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
                <div className="space-y-2">
                  <label className="block text-slate-500">Tiêu đề chính</label>
                  <input
                    type="text"
                    value={config.seoDescription.title}
                    onChange={(e) => handleSeoTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs font-semibold"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Các mục câu chuyện</label>

                  {config.seoDescription.sections.map((section, idx) => (
                    <div key={idx} className="bg-slate-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => removeSeoSection(idx)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Xóa mục này"
                      >
                        <Icon name="trash" size={14} />
                      </button>

                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <label className="block text-slate-500 text-[10px]">Icon</label>
                          <input
                            type="text"
                            value={section.icon}
                            onChange={(e) => handleSeoSectionChange(idx, 'icon', e.target.value)}
                            className="w-full text-center px-2 py-2 rounded-xl border border-slate-200 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs"
                          />
                        </div>
                        <div className="col-span-10 md:col-span-11 space-y-2">
                          <label className="block text-slate-500 text-[10px]">Tiêu đề mục</label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => handleSeoSectionChange(idx, 'title', e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-slate-500 text-[10px]">Nội dung chi tiết</label>
                        <textarea
                          rows={3}
                          value={section.content}
                          onChange={(e) => handleSeoSectionChange(idx, 'content', e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs leading-relaxed font-normal"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSeoSection}
                    className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 dark:hover:border-rose-500 text-slate-500 hover:text-rose-500 rounded-2xl flex items-center justify-center gap-1.5 font-bold transition-all text-[11px] cursor-pointer"
                  >
                    <Icon name="plus" size={12} /> Thêm mục mới
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customization' && customizationConfig && (
          <div className="space-y-6">
            <div className="border-l-4 border-amber-500 pl-4 space-y-1">
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Cấu hình Bật/Tắt tab Mô phỏng Cá nhân hóa
              </h4>
              <p className="text-[10px] text-slate-400">
                Lựa chọn các chế độ cá nhân hóa hiển thị ngoài trang chi tiết sản phẩm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Toggle Laser Engraving */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">✍️ Cho phép khắc Laser</span>
                  <span className="text-[9px] text-slate-450 dark:text-zinc-550 block">Hiển thị tab "Xem khắc Laser"</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCustomizationChange('showEngraving', !customizationConfig.showEngraving)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${customizationConfig.showEngraving ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${customizationConfig.showEngraving ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Toggle Greeting Card */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">✉️ Viết thiệp tay</span>
                  <span className="text-[9px] text-slate-450 dark:text-zinc-550 block">Hiển thị tab "Xem thiệp viết tay"</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCustomizationChange('showCardMessage', !customizationConfig.showCardMessage)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${customizationConfig.showCardMessage ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${customizationConfig.showCardMessage ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Toggle Gift Wrap */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">🎁 Chọn mẫu hộp/ruy băng</span>
                  <span className="text-[9px] text-slate-450 dark:text-zinc-550 block">Hiển thị dropdown chọn gói quà</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCustomizationChange('showGiftWrap', !customizationConfig.showGiftWrap)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${customizationConfig.showGiftWrap ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${customizationConfig.showGiftWrap ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Custom Detail Labels / Options */}
            {customizationConfig.showEngraving && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <div className="space-y-2">
                  <label className="block text-slate-500">Nhãn hiển thị khắc Laser (Label)</label>
                  <input
                    type="text"
                    value={customizationConfig.engravingLabel}
                    onChange={(e) => handleCustomizationChange('engravingLabel', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 shadow-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-slate-500">Gợi ý nhập liệu khắc (Placeholder)</label>
                  <input
                    type="text"
                    value={customizationConfig.engravingPlaceholder}
                    onChange={(e) => handleCustomizationChange('engravingPlaceholder', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 shadow-xs"
                  />
                </div>
              </div>
            )}

            {customizationConfig.showCardMessage && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <div className="space-y-2">
                  <label className="block text-slate-500">Nhãn hiển thị Thiệp viết tay</label>
                  <input
                    type="text"
                    value={customizationConfig.cardMessageLabel}
                    onChange={(e) => handleCustomizationChange('cardMessageLabel', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 shadow-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-slate-500">Gợi ý nhập lời chúc</label>
                  <input
                    type="text"
                    value={customizationConfig.cardMessagePlaceholder}
                    onChange={(e) => handleCustomizationChange('cardMessagePlaceholder', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 shadow-xs"
                  />
                </div>
              </div>
            )}

            {customizationConfig.showGiftWrap && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <label className="block text-slate-500 font-bold">Danh sách mẫu ruy băng / hộp quà</label>
                <div className="space-y-2">
                  {customizationConfig.giftWrapOptions?.map((opt: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const list = [...(customizationConfig.giftWrapOptions || [])];
                          list[idx] = e.target.value;
                          handleCustomizationChange('giftWrapOptions', list);
                        }}
                        className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const list = (customizationConfig.giftWrapOptions || []).filter((_: string, i: number) => i !== idx);
                          handleCustomizationChange('giftWrapOptions', list);
                        }}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGiftOption}
                    onChange={(e) => setNewGiftOption(e.target.value)}
                    placeholder="Thêm tùy chọn ruy băng/hộp quà mới..."
                    className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newGiftOption.trim()) return;
                      handleCustomizationChange('giftWrapOptions', [...(customizationConfig.giftWrapOptions || []), newGiftOption.trim()]);
                      setNewGiftOption('');
                    }}
                    className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold cursor-pointer text-xs"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Policies standard tabs (returns, warranty, care, engraving) */}
        {['returns', 'warranty', 'care', 'engraving'].includes(activeTab) && config.policies && (
          <div className="space-y-4">
            {(() => {
              const tab = activeTab as 'returns' | 'warranty' | 'care' | 'engraving';
              const showKey = `show${tab.charAt(0).toUpperCase() + tab.slice(1)}` as 'showReturns' | 'showWarranty' | 'showCare' | 'showEngraving';
              const data = config.policies[tab] || { title: '', content: '' };
              const labelName =
                tab === 'returns' ? 'Đổi trả & Hoàn tiền' :
                  tab === 'warranty' ? 'Chính sách Bảo hành' :
                    tab === 'care' ? 'Hướng dẫn bảo quản' : 'Hướng dẫn khắc tên';

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-500 font-semibold">
                      Hiển thị tab "{labelName}"
                    </label>
                    <button
                      type="button"
                      onClick={() => togglePolicyTab(showKey)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${config.policies?.[showKey] ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                        }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.policies?.[showKey] ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </button>
                  </div>

                  {config.policies?.[showKey] && (
                    <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
                      <div className="space-y-2">
                        <label className="block text-slate-500">Tiêu đề hiển thị</label>
                        <input
                          type="text"
                          value={data.title}
                          onChange={(e) => handlePolicyChange(tab, 'title', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-slate-500">Nội dung chi tiết (Có hỗ trợ xuống dòng)</label>
                        <textarea
                          rows={6}
                          value={data.content}
                          onChange={(e) => handlePolicyChange(tab, 'content', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-855 dark:bg-zinc-800 shadow-xs leading-relaxed font-normal"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* FAQ Tab Editor */}
        {activeTab === 'faq' && config.policies && config.policies.faq && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-slate-500 font-semibold">
                Hiển thị tab "Câu hỏi thường gặp FAQ"
              </label>
              <button
                type="button"
                onClick={() => togglePolicyTab('showFaq')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${config.policies.showFaq ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.policies.showFaq ? 'translate-x-5' : 'translate-x-0'
                  }`} />
              </button>
            </div>

            {config.policies.showFaq && (
              <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
                <div className="space-y-2">
                  <label className="block text-slate-500">Tiêu đề FAQ</label>
                  <input
                    type="text"
                    value={config.policies.faq.title}
                    onChange={(e) => handleFaqTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs font-semibold"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Danh sách câu hỏi & trả lời</label>

                  {config.policies.faq.content.map((item, idx) => (
                    <div key={idx} className="bg-slate-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => removeFaqItem(idx)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Xóa câu hỏi này"
                      >
                        <Icon name="trash" size={14} />
                      </button>

                      <div className="space-y-2">
                        <label className="block text-slate-500 text-[10px]">Câu hỏi (Q)</label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => handleFaqItemChange(idx, 'question', e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-850 dark:bg-zinc-800 shadow-xs font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-slate-500 text-[10px]">Câu trả lời (A)</label>
                        <textarea
                          rows={2}
                          value={item.answer}
                          onChange={(e) => handleFaqItemChange(idx, 'answer', e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-855 dark:bg-zinc-800 shadow-xs leading-relaxed font-normal"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addFaqItem}
                    className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 dark:hover:border-rose-500 text-slate-500 hover:text-rose-500 rounded-2xl flex items-center justify-center gap-1.5 font-bold transition-all text-[11px] cursor-pointer"
                  >
                    <Icon name="plus" size={12} /> Thêm câu hỏi
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'badges' && config.trustBadges && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-slate-500 font-semibold">
                Sử dụng cấu hình huy hiệu toàn cục
              </label>
              <button
                type="button"
                onClick={() => handleTrustBadgeChange('useGlobalConfig', !config.trustBadges?.useGlobalConfig)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${config.trustBadges.useGlobalConfig ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.trustBadges.useGlobalConfig ? 'translate-x-5' : 'translate-x-0'
                  }`} />
              </button>
            </div>

            {!config.trustBadges.useGlobalConfig && (
              <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
                <p className="text-[10px] text-slate-400">
                  Cấu hình hiển thị các huy hiệu tin cậy cho riêng sản phẩm này.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'showGenuine', label: 'Chính hãng' },
                    { id: 'showReturns', label: 'Đổi trả 7 ngày' },
                    { id: 'showShipping', label: 'Giao hàng toàn quốc' },
                    { id: 'showPayment', label: 'Thanh toán an toàn' },
                    { id: 'showSupport', label: 'Hỗ trợ 24/7' },
                  ].map((badge) => (
                    <div key={badge.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{badge.label}</span>
                      <button
                        type="button"
                        onClick={() => handleTrustBadgeChange(badge.id, !config.trustBadges?.[badge.id as keyof typeof config.trustBadges])}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${config.trustBadges?.[badge.id as keyof typeof config.trustBadges] ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                          }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.trustBadges?.[badge.id as keyof typeof config.trustBadges] ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Promotions Tab Editor */}
        {activeTab === 'promotions' && promotionsConfig && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-slate-500 font-semibold">Sử dụng cấu hình Ưu đãi toàn cục</label>
              <button
                type="button"
                onClick={() => handlePromotionsChange('useGlobalConfig', !promotionsConfig?.useGlobalConfig)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${promotionsConfig.useGlobalConfig ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${promotionsConfig.useGlobalConfig ? 'translate-x-5' : 'translate-x-0'
                  }`} />
              </button>
            </div>

            {!promotionsConfig.useGlobalConfig && (
              <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-slate-500 font-semibold">Hiển thị khối Ưu đãi sản phẩm</label>
                  <button
                    type="button"
                    onClick={() => handlePromotionsChange('show', !promotionsConfig?.show)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${promotionsConfig.show ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${promotionsConfig.show ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                {promotionsConfig.show && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {promotionsConfig.list.map((promo, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={promo}
                            onChange={(e) => {
                              const list = [...promotionsConfig.list];
                              list[idx] = e.target.value;
                              handlePromotionsChange('list', list);
                            }}
                            className="flex-1 bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = promotionsConfig.list.filter((_, i) => i !== idx);
                              handlePromotionsChange('list', list);
                            }}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newPromo}
                        onChange={(e) => setNewPromo(e.target.value)}
                        placeholder="Thêm ưu đãi mới cho sản phẩm này..."
                        className="flex-1 bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newPromo.trim()) return;
                          handlePromotionsChange('list', [...promotionsConfig.list, newPromo.trim()]);
                          setNewPromo('');
                        }}
                        className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Why Choose Us Tab Editor */}
        {activeTab === 'whyChooseUs' && whyChooseUsConfig && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-slate-500 font-semibold">Sử dụng Lý do chọn Haniu toàn cục</label>
              <button
                type="button"
                onClick={() => handleWhyChooseUsChange('useGlobalConfig', !whyChooseUsConfig?.useGlobalConfig)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${whyChooseUsConfig.useGlobalConfig ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${whyChooseUsConfig.useGlobalConfig ? 'translate-x-5' : 'translate-x-0'
                  }`} />
              </button>
            </div>

            {!whyChooseUsConfig.useGlobalConfig && (
              <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-slate-500 font-semibold">Hiển thị khối Lý do chọn Haniu</label>
                  <button
                    type="button"
                    onClick={() => handleWhyChooseUsChange('show', !whyChooseUsConfig?.show)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${whyChooseUsConfig.show ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${whyChooseUsConfig.show ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                {whyChooseUsConfig.show && (
                  <div className="space-y-3">
                    <div className="space-y-3">
                      {whyChooseUsConfig.list.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={item.icon}
                            onChange={(e) => {
                              const list = [...whyChooseUsConfig.list];
                              list[idx] = { ...list[idx], icon: e.target.value };
                              handleWhyChooseUsChange('list', list);
                            }}
                            className="w-12 text-center bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-2 py-1.5"
                          />
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => {
                              const list = [...whyChooseUsConfig.list];
                              list[idx] = { ...list[idx], text: e.target.value };
                              handleWhyChooseUsChange('list', list);
                            }}
                            className="flex-1 bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = whyChooseUsConfig.list.filter((_, i) => i !== idx);
                              handleWhyChooseUsChange('list', list);
                            }}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newWhyIcon}
                        onChange={(e) => setNewWhyIcon(e.target.value)}
                        placeholder="Icon (🌹)"
                        className="w-20 text-center bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-2 py-1.5"
                      />
                      <input
                        type="text"
                        value={newWhyText}
                        onChange={(e) => setNewWhyText(e.target.value)}
                        placeholder="Lý do riêng cho sản phẩm này..."
                        className="flex-1 bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newWhyText.trim()) return;
                          handleWhyChooseUsChange('list', [...whyChooseUsConfig.list, { icon: newWhyIcon, text: newWhyText.trim() }]);
                          setNewWhyText('');
                        }}
                        className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Delivery Policy Tab Editor */}
        {activeTab === 'delivery' && deliveryPolicyConfig && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-slate-500 font-semibold">Sử dụng Giao hàng toàn cục</label>
              <button
                type="button"
                onClick={() => handleDeliveryPolicyChange('useGlobalConfig', !deliveryPolicyConfig?.useGlobalConfig)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${deliveryPolicyConfig.useGlobalConfig ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${deliveryPolicyConfig.useGlobalConfig ? 'translate-x-5' : 'translate-x-0'
                  }`} />
              </button>
            </div>

            {!deliveryPolicyConfig.useGlobalConfig && (
              <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-slate-500 font-semibold">Hiển thị khối Giao hàng</label>
                  <button
                    type="button"
                    onClick={() => handleDeliveryPolicyChange('show', !deliveryPolicyConfig?.show)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${deliveryPolicyConfig.show ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${deliveryPolicyConfig.show ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                {deliveryPolicyConfig.show && (
                  <div className="space-y-4">
                    {/* Lines */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-450 block border-b pb-1">Thời gian vận chuyển riêng</span>

                      <div className="space-y-2">
                        {deliveryPolicyConfig.list.lines.map((line, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={line.label}
                              onChange={(e) => {
                                const list = [...deliveryPolicyConfig.list.lines];
                                list[idx].label = e.target.value;
                                handleDeliveryPolicyChange('list', { ...deliveryPolicyConfig.list, lines: list });
                              }}
                              className="w-1/3 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                            />
                            <input
                              type="text"
                              value={line.value}
                              onChange={(e) => {
                                const list = [...deliveryPolicyConfig.list.lines];
                                list[idx].value = e.target.value;
                                handleDeliveryPolicyChange('list', { ...deliveryPolicyConfig.list, lines: list });
                              }}
                              className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const list = deliveryPolicyConfig.list.lines.filter((_, i) => i !== idx);
                                handleDeliveryPolicyChange('list', { ...deliveryPolicyConfig.list, lines: list });
                              }}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newDelivLabel}
                          onChange={(e) => setNewDelivLabel(e.target.value)}
                          placeholder="Khu vực..."
                          className="w-1/3 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                        />
                        <input
                          type="text"
                          value={newDelivVal}
                          onChange={(e) => setNewDelivVal(e.target.value)}
                          placeholder="Thời gian..."
                          className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newDelivLabel.trim() || !newDelivVal.trim()) return;
                            handleDeliveryPolicyChange('list', {
                              ...deliveryPolicyConfig.list,
                              lines: [...deliveryPolicyConfig.list.lines, { label: newDelivLabel, value: newDelivVal }]
                            });
                            setNewDelivLabel('');
                            setNewDelivVal('');
                          }}
                          className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold"
                        >
                          Thêm dòng
                        </button>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-450 block border-b pb-1">Các lưu ý riêng</span>

                      <div className="space-y-2">
                        {deliveryPolicyConfig.list.bulletPoints.map((point, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={point}
                              onChange={(e) => {
                                const list = [...deliveryPolicyConfig.list.bulletPoints];
                                list[idx] = e.target.value;
                                handleDeliveryPolicyChange('list', { ...deliveryPolicyConfig.list, bulletPoints: list });
                              }}
                              className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const list = deliveryPolicyConfig.list.bulletPoints.filter((_, i) => i !== idx);
                                handleDeliveryPolicyChange('list', { ...deliveryPolicyConfig.list, bulletPoints: list });
                              }}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newDelivBullet}
                          onChange={(e) => setNewDelivBullet(e.target.value)}
                          placeholder="Lưu ý riêng..."
                          className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newDelivBullet.trim()) return;
                            handleDeliveryPolicyChange('list', {
                              ...deliveryPolicyConfig.list,
                              bulletPoints: [...deliveryPolicyConfig.list.bulletPoints, newDelivBullet.trim()]
                            });
                            setNewDelivBullet('');
                          }}
                          className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold"
                        >
                          Thêm lưu ý
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Brand Commitment Tab Editor */}
        {activeTab === 'commitment' && brandCommitmentConfig && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-slate-500 font-semibold">Sử dụng Cam kết toàn cục</label>
              <button
                type="button"
                onClick={() => handleBrandCommitmentChange('useGlobalConfig', !brandCommitmentConfig.useGlobalConfig)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${brandCommitmentConfig.useGlobalConfig ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${brandCommitmentConfig.useGlobalConfig ? 'translate-x-5' : 'translate-x-0'
                  }`} />
              </button>
            </div>

            {!brandCommitmentConfig.useGlobalConfig && (
              <div className="space-y-4 border-t border-slate-50 dark:border-zinc-800 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-slate-500 font-semibold">Hiển thị khối Cam kết Haniu</label>
                  <button
                    type="button"
                    onClick={() => handleBrandCommitmentChange('show', !brandCommitmentConfig.show)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${brandCommitmentConfig.show ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${brandCommitmentConfig.show ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                 {brandCommitmentConfig.show && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {brandCommitmentConfig.list.map((comm, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={comm}
                            onChange={(e) => {
                              const list = [...brandCommitmentConfig.list];
                              list[idx] = e.target.value;
                              handleBrandCommitmentChange('list', list);
                            }}
                            className="flex-1 bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = brandCommitmentConfig.list.filter((_, i) => i !== idx);
                              handleBrandCommitmentChange('list', list);
                            }}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newCommitment}
                        onChange={(e) => setNewCommitment(e.target.value)}
                        placeholder="Thêm cam kết riêng cho sản phẩm..."
                        className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCommitment.trim()) return;
                          handleBrandCommitmentChange('list', [...brandCommitmentConfig.list, newCommitment.trim()]);
                          setNewCommitment('');
                        }}
                        className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
