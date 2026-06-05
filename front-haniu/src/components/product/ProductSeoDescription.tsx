'use client';

import React, { useState } from 'react';

interface SeoSection {
  icon: string;
  title: string;
  content: string;
}

interface ProductSeoDescriptionProps {
  product: {
    name: string;
    category?: { name: string };
    layoutConfig?: string;
  };
}

export default function ProductSeoDescription({ product }: ProductSeoDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  let config: any = {};
  try {
    if (product.layoutConfig) {
      config = typeof product.layoutConfig === 'string' ? JSON.parse(product.layoutConfig) : product.layoutConfig;
    }
  } catch (e) {
    console.error('Failed to parse layoutConfig in ProductSeoDescription', e);
  }

  const show = config.showSeoDescription !== false;
  if (!show) return null;

  const categoryName = product.category?.name || 'Quà tặng';
  const productName = product.name;

  const title = config.seoDescription?.title || "📖 Chi tiết sản phẩm & Câu chuyện thương hiệu";
  
  const sections: SeoSection[] = config.seoDescription?.sections || [
    {
      icon: "🎁",
      title: `Ý nghĩa món quà ${productName}`,
      content: `Mỗi món quà tại Haniu không đơn thuần là vật chất, mà là cả một thông điệp yêu thương được gửi gắm trọn vẹn. Sản phẩm ${productName} được thiết kế đặc biệt nhằm tôn vinh những khoảnh khắc đáng nhớ trong cuộc sống. Dù là dịp sinh nhật, kỷ niệm ngày yêu, ngày cưới hay các dịp lễ tri ân đặc biệt, đây sẽ là cầu nối hoàn hảo gắn kết tình cảm giữa bạn và người nhận quà, đem lại niềm vui bất ngờ đầy ý nghĩa.`
    },
    {
      icon: "💎",
      title: "Chất liệu cao cấp & độ bền vượt trội",
      content: `Chúng tôi luôn đặt tiêu chuẩn chất lượng lên hàng đầu. Sản phẩm thuộc nhóm ${categoryName} này được tuyển chọn từ nguồn nguyên liệu tự nhiên tinh khiết nhất: Hoa sáp thơm mềm mại tự nhiên giữ hương lâu tới 3 năm; hộp đựng làm từ carton lạnh cứng cáp bọc giấy mỹ thuật nhập khẩu sang trọng; các phụ kiện đi kèm hoàn toàn an toàn, thân thiện với người dùng.`
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
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-800 dark:text-zinc-100 tracking-tight uppercase border-b border-slate-100 dark:border-zinc-800 pb-3 flex items-center gap-2">
        {title}
      </h2>

      <div className={`space-y-5 sm:space-y-6 text-xs sm:text-sm text-slate-660 dark:text-zinc-350 leading-relaxed font-normal ${!isExpanded ? 'max-h-[250px] sm:max-h-[300px] overflow-hidden relative' : ''}`}>
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h3 className="font-extrabold text-slate-800 dark:text-zinc-200 flex items-center gap-2 text-xs sm:text-sm">
              <span className="select-none shrink-0">{section.icon}</span> <span>{section.title}</span>
            </h3>
            <p className="pl-4 sm:pl-6 text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}

        {/* Gradient Overlay for collapsed state */}
        {!isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />
        )}
      </div>

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 font-bold px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-[11px] sm:text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          {isExpanded ? 'Thu gọn bài viết' : 'Đọc toàn bộ mô tả sản phẩm'}
        </button>
      </div>
    </div>
  );
}
