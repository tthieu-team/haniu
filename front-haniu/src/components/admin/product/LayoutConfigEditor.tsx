'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';
import PersonalizationConfigForm from './PersonalizationConfigForm';
import LayoutEditorSeo from './layout/LayoutEditorSeo';
import LayoutEditorBadges from './layout/LayoutEditorBadges';
import LayoutEditorPromotions from './layout/LayoutEditorPromotions';
import LayoutEditorWhyChooseUs from './layout/LayoutEditorWhyChooseUs';
import LayoutEditorDelivery from './layout/LayoutEditorDelivery';
import LayoutEditorCommitment from './layout/LayoutEditorCommitment';
import LayoutEditorPolicies from './layout/LayoutEditorPolicies';
import LayoutEditorFaq from './layout/LayoutEditorFaq';

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

export default function LayoutConfigEditor({
  value,
  onChange,
  productName = 'Sản phẩm',
  categoryName = 'Quà tặng'
}: LayoutConfigEditorProps) {
  const [config, setConfig] = useState<LayoutConfig>({});
  const [activeTab, setActiveTab] = useState<
    | 'seo'
    | 'returns'
    | 'warranty'
    | 'care'
    | 'faq'
    | 'badges'
    | 'promotions'
    | 'whyChooseUs'
    | 'delivery'
    | 'commitment'
    | 'customization'
  >('seo');

  const [newPromo, setNewPromo] = useState('');
  const [newCommitment, setNewCommitment] = useState('');
  const [newWhyIcon, setNewWhyIcon] = useState('🌹');
  const [newWhyText, setNewWhyText] = useState('');
  const [newDelivLabel, setNewDelivLabel] = useState('');
  const [newDelivVal, setNewDelivVal] = useState('');
  const [newDelivBullet, setNewDelivBullet] = useState('');

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
            content: "Haniu ra đời từ niềm đam mê khơi dậy những cảm xúc chân thành qua từng món quà trao đi. Chúng tôi tin rằng một món quà tuyệt vời nhất không nằm ở giá trị vật chất của nó, mà nằm ở sự thấu hiểu và dấu ấn riêng biệt của người tặng. Đó chính là lý do Haniu tiên phong cung cấp giải pháp quà tặng thiết kế cá nhân hóa thiệp chúc mừng riêng theo yêu cầu."
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
- Sản phẩm lỗi kỹ thuật do nhà sản xuất (hỏng khóa, bung chỉ khâu sổ da, v.v.).

*Lưu ý: Không áp dụng đổi trả đối với sản phẩm nếu lý do xuất phát từ việc khách hàng đổi ý.`
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
        showFaq: parsed.policies?.showFaq ?? true,
        faq: {
          title: parsed.policies?.faq?.title || "💬 Các câu hỏi thường gặp",
          content: Array.isArray(parsed.policies?.faq?.content)
            ? parsed.policies.faq.content
            : [
              { question: "Tôi có được xem ảnh gói quà trước khi giao không?", answer: "Có! Sau khi đóng gói, nhân viên Haniu sẽ chụp ảnh thành phẩm gửi qua Zalo/Email để bạn duyệt trước khi shipper lấy hàng." },
              { question: "Thời gian giao hàng mất bao lâu?", answer: "Haniu có quy trình xử lý tối ưu nên thời gian giao hàng cực nhanh: Nội thành Hà Nội giao trong ngày (hỏa tốc 2h), các tỉnh thành khác chỉ từ 2 - 4 ngày làm việc." },
              { question: "Haniu có cung cấp hóa đơn đỏ VAT cho khách hàng doanh nghiệp không?", answer: "Có, Haniu có đầy đủ tư cách pháp nhân để xuất hóa đơn tài chính VAT 8-10% và cung cấp hồ sơ năng lực báo giá cạnh tranh cho các đơn hàng quà tặng doanh nghiệp số lượng lớn." }
            ]
        }
      },
      trustBadges: {
        useGlobalConfig: parsed.trustBadges?.useGlobalConfig ?? false,
        showGenuine: parsed.trustBadges?.showGenuine ?? true,
        showReturns: parsed.trustBadges?.showReturns ?? true,
        showShipping: parsed.trustBadges?.showShipping ?? true,
        showPayment: parsed.trustBadges?.showPayment ?? true,
        showSupport: parsed.trustBadges?.showSupport ?? true,
      },
      promotionsConfig: {
        useGlobalConfig: parsed.promotionsConfig?.useGlobalConfig ?? false,
        show: parsed.promotionsConfig?.show ?? true,
        list: parsed.promotionsConfig?.list || [
          "Miễn phí ship cho đơn từ 499k",
          "Giảm 10% khi mua 2 hộp quà",
          "Tặng thiệp viết tay miễn phí",
          "Freeship nội thành Hà Nội"
        ]
      },
      whyChooseUsConfig: {
        useGlobalConfig: parsed.whyChooseUsConfig?.useGlobalConfig ?? false,
        show: parsed.whyChooseUsConfig?.show ?? true,
        list: parsed.whyChooseUsConfig?.list || [
          { icon: "🌹", text: "Hoa sáp thơm giữ màu tới 3 năm" },
          { icon: "🎁", text: "Tặng kèm hộp quà cao cấp" },
          { icon: "✉️", text: "Tặng kèm thiệp chúc mừng viết tay" },
          { icon: "🚚", text: "Giao nhanh toàn quốc" },
          { icon: "💝", text: "Phù hợp mọi dịp đặc biệt" }
        ]
      },
      deliveryPolicyConfig: {
        useGlobalConfig: parsed.deliveryPolicyConfig?.useGlobalConfig ?? false,
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
        useGlobalConfig: parsed.brandCommitmentConfig?.useGlobalConfig ?? false,
        show: parsed.brandCommitmentConfig?.show ?? true,
        list: parsed.brandCommitmentConfig?.list || [
          "Hình ảnh sản phẩm thật 100% tự chụp",
          "Đóng gói cẩn thận, chống va đập, bảo vệ tối đa",
          "Hoàn tiền hoặc đổi mới ngay lập tức nếu sản phẩm không giống mô tả"
        ]
      },
      customizationConfig: {
        showCardMessage: parsed.customizationConfig?.showCardMessage ?? true,
        showCardMessageMockup: parsed.customizationConfig?.showCardMessageMockup ?? true,
        cardMessageLabel: parsed.customizationConfig?.cardMessageLabel || "Lời nhắn trên thiệp chúc mừng",
        cardMessagePlaceholder: parsed.customizationConfig?.cardMessagePlaceholder || "Nhập nội dung thư chúc mừng gửi tới người nhận...",
        showGiftWrap: parsed.customizationConfig?.showGiftWrap ?? false,
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

  const handleSeoToggleShow = () => {
    if (!config.seoDescription) return;
    updateParent({ ...config, showSeoDescription: !config.showSeoDescription });
  };

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

  const handlePolicyToggleShow = (tab: 'returns' | 'warranty' | 'care') => {
    if (!config.policies) return;
    const showKey = `show${tab.charAt(0).toUpperCase() + tab.slice(1)}` as 'showReturns' | 'showWarranty' | 'showCare';
    const updatedPolicies = {
      ...config.policies,
      [showKey]: !config.policies[showKey]
    };
    updateParent({
      ...config,
      policies: updatedPolicies
    });
  };

  const handlePolicyChange = (tab: 'returns' | 'warranty' | 'care', field: 'title' | 'content', val: string) => {
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

  const handleFaqToggleShow = () => {
    if (!config.policies || !config.policies.faq) return;
    updateParent({
      ...config,
      policies: {
        ...config.policies,
        showFaq: !config.policies.showFaq
      }
    });
  };

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

  const promotionsConfig = config.promotionsConfig;
  const whyChooseUsConfig = config.whyChooseUsConfig;
  const deliveryPolicyConfig = config.deliveryPolicyConfig;
  const brandCommitmentConfig = config.brandCommitmentConfig;

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
          { id: 'returns', label: 'Chính sách Đổi trả', icon: 'refresh' },
          { id: 'warranty', label: 'Bảo hành', icon: 'shield' },
          { id: 'care', label: 'Bảo quản', icon: 'heart' },
          { id: 'faq', label: 'FAQ', icon: 'help' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
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
          <LayoutEditorSeo
            showSeoDescription={config.showSeoDescription ?? true}
            title={config.seoDescription.title}
            sections={config.seoDescription.sections}
            onToggleShow={handleSeoToggleShow}
            onTitleChange={handleSeoTitleChange}
            onSectionChange={handleSeoSectionChange}
            onAddSection={addSeoSection}
            onRemoveSection={removeSeoSection}
          />
        )}

        {activeTab === 'badges' && config.trustBadges && (
          <LayoutEditorBadges
            trustBadges={config.trustBadges}
            onChangeBadge={handleTrustBadgeChange}
          />
        )}

        {activeTab === 'promotions' && promotionsConfig && (
          <LayoutEditorPromotions
            promotionsConfig={promotionsConfig}
            newPromo={newPromo}
            setNewPromo={setNewPromo}
            onToggleShow={(val) => handlePromotionsChange('show', val)}
            onUpdateList={(list) => handlePromotionsChange('list', list)}
          />
        )}

        {activeTab === 'whyChooseUs' && whyChooseUsConfig && (
          <LayoutEditorWhyChooseUs
            whyChooseUsConfig={whyChooseUsConfig}
            newWhyIcon={newWhyIcon}
            newWhyText={newWhyText}
            setNewWhyIcon={setNewWhyIcon}
            setNewWhyText={setNewWhyText}
            onToggleShow={(val) => handleWhyChooseUsChange('show', val)}
            onUpdateList={(list) => handleWhyChooseUsChange('list', list)}
          />
        )}

        {activeTab === 'delivery' && deliveryPolicyConfig && (
          <LayoutEditorDelivery
            deliveryPolicyConfig={deliveryPolicyConfig}
            newDelivLabel={newDelivLabel}
            newDelivVal={newDelivVal}
            newDelivBullet={newDelivBullet}
            setNewDelivLabel={setNewDelivLabel}
            setNewDelivVal={setNewDelivVal}
            setNewDelivBullet={setNewDelivBullet}
            onToggleShow={(val) => handleDeliveryPolicyChange('show', val)}
            onUpdateList={(list) => handleDeliveryPolicyChange('list', list)}
          />
        )}

        {activeTab === 'commitment' && brandCommitmentConfig && (
          <LayoutEditorCommitment
            brandCommitmentConfig={brandCommitmentConfig}
            newCommitment={newCommitment}
            setNewCommitment={setNewCommitment}
            onToggleShow={(val) => handleBrandCommitmentChange('show', val)}
            onUpdateList={(list) => handleBrandCommitmentChange('list', list)}
          />
        )}



        {['returns', 'warranty', 'care'].includes(activeTab) && config.policies && (
          <LayoutEditorPolicies
            activeTab={activeTab as 'returns' | 'warranty' | 'care'}
            show={!!config.policies[`show${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as 'showReturns' | 'showWarranty' | 'showCare']}
            title={config.policies[activeTab as 'returns' | 'warranty' | 'care']?.title || ''}
            content={config.policies[activeTab as 'returns' | 'warranty' | 'care']?.content || ''}
            onToggleShow={() => handlePolicyToggleShow(activeTab as 'returns' | 'warranty' | 'care')}
            onTitleChange={(val) => handlePolicyChange(activeTab as 'returns' | 'warranty' | 'care', 'title', val)}
            onContentChange={(val) => handlePolicyChange(activeTab as 'returns' | 'warranty' | 'care', 'content', val)}
          />
        )}

        {activeTab === 'faq' && config.policies && config.policies.faq && (
          <LayoutEditorFaq
            showFaq={config.policies.showFaq ?? true}
            faqConfig={config.policies.faq}
            onToggleShow={handleFaqToggleShow}
            onTitleChange={handleFaqTitleChange}
            onItemChange={handleFaqItemChange}
            onAddItem={addFaqItem}
            onRemoveItem={removeFaqItem}
          />
        )}
      </div>
    </div>
  );
}
