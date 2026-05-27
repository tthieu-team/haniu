'use client';

import React, { useState } from 'react';

interface ProductPoliciesProps {
  product: {
    layoutConfig?: string;
  };
}

export default function ProductPolicies({ product }: ProductPoliciesProps) {
  let config: any = {};
  try {
    if (product?.layoutConfig) {
      config = typeof product.layoutConfig === 'string' ? JSON.parse(product.layoutConfig) : product.layoutConfig;
    }
  } catch (e) {
    console.error('Failed to parse layoutConfig in ProductPolicies', e);
  }

  // Check if policies section is shown at all
  const showSection = config.showPolicies !== false;
  if (!showSection) return null;

  // Tabs visibility config
  const tabsConfig = [
    { code: 'returns', name: 'Đổi trả & Hoàn tiền', show: config.policies?.showReturns !== false },
    { code: 'warranty', name: 'Chính sách Bảo hành', show: config.policies?.showWarranty !== false },
    { code: 'care', name: 'Hướng dẫn bảo quản', show: config.policies?.showCare !== false },
    { code: 'engraving', name: 'Hướng dẫn khắc tên', show: config.policies?.showEngraving !== false },
    { code: 'faq', name: 'Câu hỏi thường gặp FAQ', show: config.policies?.showFaq !== false }
  ];

  // Active tabs filtered list
  const activeTabs = tabsConfig.filter(t => t.show);
  const [activeTab, setActiveTab] = useState<string>(activeTabs[0]?.code || 'returns');

  if (activeTabs.length === 0) return null;

  // Content helper from config or fallback
  const returnsTitle = config.policies?.returns?.title || "🔄 Cam kết đổi trả trong vòng 7 ngày";
  const returnsContent = config.policies?.returns?.content || (
    <>
      <p>Haniu cam kết đổi trả sản phẩm mới 100% hoàn toàn miễn phí hoặc hoàn tiền trong vòng 7 ngày kể từ lúc nhận hàng nếu gặp các trường hợp sau:</p>
      <ul className="list-disc pl-5 space-y-1.5 mt-2">
        <li>Sản phẩm bị nứt, vỡ, móp méo trong quá trình vận chuyển.</li>
        <li>Nội dung khắc laser sai sót so với yêu cầu đã xác nhận trước đó.</li>
        <li>Sản phẩm lỗi kỹ thuật do nhà sản xuất (hỏng khóa, bung chỉ khâu sổ da, v.v.).</li>
      </ul>
      <p className="text-[10px] text-slate-400 mt-3">*Lưu ý: Không áp dụng đổi trả đối với sản phẩm cá nhân hóa khắc tên riêng nếu lý do xuất phát từ việc khách hàng đổi ý hoặc nhập sai thông tin khắc ban đầu.</p>
    </>
  );

  const warrantyTitle = config.policies?.warranty?.title || "🛡️ Thời hạn bảo hành sản phẩm";
  const warrantyContent = config.policies?.warranty?.content || (
    <>
      <p>Tại Haniu Gift Shop, tất cả sản phẩm đều được áp dụng chính sách bảo hành chính hãng để đảm bảo sự yên tâm tuyệt đối:</p>
      <ul className="list-disc pl-5 space-y-1.5 mt-2">
        <li><strong>Sổ bìa da thật:</strong> Bảo hành 12 tháng đối với bề mặt da và đường chỉ may thủ công.</li>
        <li><strong>Bình giữ nhiệt tre/treo gỗ:</strong> Bảo hành 6 tháng về khả năng giữ nhiệt.</li>
        <li><strong>Phụ kiện hộp gỗ, ly sứ:</strong> Bảo hành 3 tháng đối với các chi tiết kim loại, khóa đồng.</li>
      </ul>
      <p className="mt-3">Hỗ trợ bảo trì trọn đời (làm mới đồ da, tra dầu gỗ) với chi phí ưu đãi dành cho khách hàng thân thiết.</p>
    </>
  );

  const careTitle = config.policies?.care?.title || "🌱 Hướng dẫn bảo quản đồ gỗ và da tự nhiên";
  const careContent = config.policies?.care?.content || (
    <>
      <p>Sản phẩm của Haniu đa số chế tác từ các vật liệu tự nhiên cao cấp như gỗ thông, tre, da bò thật. Để kéo dài tuổi thọ của quà tặng, quý khách vui lòng:</p>
      <ul className="list-disc pl-5 space-y-1.5 mt-2">
        <li><strong>Đồ gỗ/Tre:</strong> Tránh ngâm nước quá lâu hoặc phơi trực tiếp dưới ánh nắng gắt. Vệ sinh bằng khăn ẩm và lau khô ngay sau đó.</li>
        <li><strong>Đồ da thật:</strong> Tránh ẩm ướt, không để ở nơi quá nóng hoặc tiếp xúc hóa chất tẩy rửa mạnh. Nên lau bằng xi chuyên dụng đồ da định kỳ.</li>
        <li><strong>Ly sứ vẽ vàng:</strong> Không sử dụng trong lò vi sóng hoặc máy rửa bát để bảo vệ lớp vàng kim 24k vẽ tay tinh xảo.</li>
      </ul>
    </>
  );

  const engravingTitle = config.policies?.engraving?.title || "✍️ Hướng dẫn yêu cầu thiết kế khắc Laser";
  const engravingContent = config.policies?.engraving?.content || (
    <>
      <p>Dịch vụ cá nhân hóa khắc tên giúp quà tặng trở nên độc bản và ý nghĩa hơn bao giờ hết:</p>
      <ul className="list-disc pl-5 space-y-1.5 mt-2">
        <li><strong>Độ dài khuyến nghị:</strong> Dưới 30 ký tự (để nét khắc to, rõ và đẹp nhất).</li>
        <li><strong>Font chữ khắc:</strong> Haniu hỗ trợ font viết tay hoa văn lãng mạn cho thiệp, font in hoa vuông vắn lịch sự cho sổ da doanh nghiệp.</li>
        <li><strong>Khắc Logo công ty:</strong> Khách hàng doanh nghiệp muốn in/khắc logo số lượng lớn vui lòng tải file vector (.PDF, .AI, .SVG) và liên hệ Zalo Admin để nhận bản demo mockup trước khi tiến hành sản xuất hàng loạt.</li>
      </ul>
    </>
  );

  const faqTitle = config.policies?.faq?.title || "💬 Các câu hỏi thường gặp";
  const faqContent = config.policies?.faq?.content || (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="font-bold text-slate-700 dark:text-zinc-305">Q: Tôi có được xem bản vẽ demo trước khi khắc thật không?</p>
        <p className="text-slate-500 dark:text-zinc-400 pl-4">A: Có! Sau khi đặt hàng, nhân viên kỹ thuật Haniu sẽ liên hệ gửi bản vẽ demo mockup 2D thiết kế qua Zalo/Email để bạn duyệt trước khi bấm máy khắc laser.</p>
      </div>
      <div className="space-y-1">
        <p className="font-bold text-slate-700 dark:text-zinc-305">Q: Thời gian giao hàng khắc tên mất bao lâu?</p>
        <p className="text-slate-500 dark:text-zinc-400 pl-4">A: Mặc dù là hàng cá nhân hóa, Haniu có quy trình xử lý tối ưu nên thời gian giao hàng cực nhanh: Nội thành Hà Nội giao trong ngày (hỏa tốc 2h), các tỉnh thành khác chỉ từ 2 - 4 ngày làm việc.</p>
      </div>
      <div className="space-y-1">
        <p className="font-bold text-slate-700 dark:text-zinc-305">Q: Haniu có cung cấp hóa đơn đỏ VAT cho khách hàng doanh nghiệp không?</p>
        <p className="text-slate-500 dark:text-zinc-400 pl-4">A: Có, Haniu có đầy đủ tư cách pháp nhân để xuất hóa đơn tài chính VAT 8-10% và cung cấp hồ sơ năng lực báo giá cạnh tranh cho các đơn hàng quà tặng doanh nghiệp số lượng lớn.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      {/* Tabs list */}
      <div className="flex gap-2 border-b border-slate-50 dark:border-zinc-855 overflow-x-auto pb-3 text-xs font-bold shrink-0 custom-scrollbar">
        {activeTabs.map(tab => (
          <button
            key={tab.code}
            type="button"
            onClick={() => setActiveTab(tab.code)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.code
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 font-extrabold'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="text-xs text-slate-600 dark:text-zinc-350 leading-relaxed font-normal space-y-3">
        {activeTab === 'returns' && (
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">{returnsTitle}</h4>
            {typeof returnsContent === 'string' ? <p>{returnsContent}</p> : returnsContent}
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">{warrantyTitle}</h4>
            {typeof warrantyContent === 'string' ? <p>{warrantyContent}</p> : warrantyContent}
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">{careTitle}</h4>
            {typeof careContent === 'string' ? <p>{careContent}</p> : careContent}
          </div>
        )}

        {activeTab === 'engraving' && (
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">{engravingTitle}</h4>
            {typeof engravingContent === 'string' ? <p>{engravingContent}</p> : engravingContent}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-zinc-200">{faqTitle}</h4>
            {typeof faqContent === 'string' ? <p>{faqContent}</p> : faqContent}
          </div>
        )}
      </div>
    </div>
  );
}
