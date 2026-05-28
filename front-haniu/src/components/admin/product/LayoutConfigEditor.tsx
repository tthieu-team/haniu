'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';

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
}

interface LayoutConfigEditorProps {
  value: string;
  onChange: (val: string) => void;
  productName?: string;
  categoryName?: string;
}

export default function LayoutConfigEditor({ value, onChange, productName = 'Sản phẩm', categoryName = 'Quà tặng' }: LayoutConfigEditorProps) {
  const [config, setConfig] = useState<LayoutConfig>({});
  const [activeTab, setActiveTab] = useState<'seo' | 'returns' | 'warranty' | 'care' | 'engraving' | 'faq'>('seo');

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

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
      <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2 flex items-center gap-1.5">
        <Icon name="settings" size={14} /> Cấu hình Chi tiết Sản phẩm & Chính sách
      </h3>

      {/* Selector Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800/50 p-1 rounded-2xl overflow-x-auto scrollbar-none">
        {[
          { id: 'seo', label: 'Mô tả & Câu chuyện', icon: 'gift' },
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-slate-500 font-semibold flex items-center gap-2">
                Hiển thị phần "Mô tả & Câu chuyện"
              </label>
              <button
                type="button"
                onClick={toggleSeoDescription}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  config.showSeoDescription ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  config.showSeoDescription ? 'translate-x-5' : 'translate-x-0'
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
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        config.policies?.[showKey] ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        config.policies?.[showKey] ? 'translate-x-5' : 'translate-x-0'
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
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  config.policies.showFaq ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-800'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  config.policies.showFaq ? 'translate-x-5' : 'translate-x-0'
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
      </div>
    </div>
  );
}
