'use client';

import { useEffect } from 'react';
import Icon from '@/components/common/Icons';

export interface PersonalizationConfig {
  showEngraving?: boolean;
  engravingLabel?: string;
  engravingPlaceholder?: string;
  engravingMaxLength?: number;
  
  showCardMessage?: boolean;
  cardMessageLabel?: string;
  cardMessagePlaceholder?: string;
  
  showGiftWrap?: boolean;
  giftWrapLabel?: string;
  giftWrapOptions?: string[];
}

interface PersonalizationFormProps {
  engravingText: string;
  setEngravingText: (val: string) => void;
  cardMessage: string;
  setCardMessage: (val: string) => void;
  giftWrap: string;
  setGiftWrap: (val: string) => void;
  config?: PersonalizationConfig;
}

export default function PersonalizationForm({
  engravingText,
  setEngravingText,
  cardMessage,
  setCardMessage,
  giftWrap,
  setGiftWrap,
  config
}: PersonalizationFormProps) {
  const showEngraving = config?.showEngraving ?? true;
  const engravingLabel = config?.engravingLabel || "Khắc chữ / Tên theo yêu cầu (Miễn phí)";
  const engravingPlaceholder = config?.engravingPlaceholder || "Nhập tên hoặc lời chúc muốn khắc (tối đa 50 ký tự)";
  const engravingMaxLength = config?.engravingMaxLength ?? 50;

  const showCardMessage = config?.showCardMessage ?? true;
  const cardMessageLabel = config?.cardMessageLabel || "Lời nhắn trên thiệp chúc mừng";
  const cardMessagePlaceholder = config?.cardMessagePlaceholder || "Nhập nội dung thư chúc mừng gửi tới người nhận...";

  const showGiftWrap = config?.showGiftWrap ?? true;
  const giftWrapLabel = config?.giftWrapLabel || "Chọn ruy băng nơ / hộp gói";
  const giftWrapOptions = config?.giftWrapOptions && config.giftWrapOptions.length > 0
    ? config.giftWrapOptions
    : [
        "Ruy băng Đỏ Lãng Mạn",
        "Ruy băng Vàng Hoàng Gia",
        "Gói bọc giấy Kraft Hoài Cổ"
      ];

  // Auto-correct giftWrap state if it's not present in the custom choices
  useEffect(() => {
    if (showGiftWrap && giftWrapOptions.length > 0) {
      if (!giftWrapOptions.includes(giftWrap)) {
        setGiftWrap(giftWrapOptions[0]);
      }
    }
  }, [giftWrapOptions, giftWrap, setGiftWrap, showGiftWrap]);

  const showAny = showEngraving || showCardMessage || showGiftWrap;
  if (!showAny) return null;

  return (
    <div className="bg-gradient-to-br from-amber-500/5 to-rose-500/5 border border-amber-500/10 rounded-3xl p-4 sm:p-6 space-y-4 text-xs font-semibold w-full">
      <div className="flex items-center gap-2">
        <Icon name="⚙️" size={16} className="text-amber-500" />
        <h3 className="font-bold text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider">Cấu hình cá nhân hóa quà tặng</h3>
      </div>

      {showEngraving && (
        <div className="space-y-2 w-full">
          <label className="block text-slate-500 dark:text-zinc-400 text-[11px] sm:text-xs">{engravingLabel}</label>
          <input
            type="text"
            maxLength={engravingMaxLength}
            placeholder={engravingPlaceholder}
            value={engravingText}
            onChange={(e) => setEngravingText(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-xs bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 rounded-xl border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-sm transition-all"
          />
        </div>
      )}

      {showCardMessage && (
        <div className="space-y-2 w-full">
          <label className="block text-slate-500 dark:text-zinc-400 text-[11px] sm:text-xs">{cardMessageLabel}</label>
          <textarea
            rows={3}
            placeholder={cardMessagePlaceholder}
            value={cardMessage}
            onChange={(e) => setCardMessage(e.target.value)}
            className="w-full px-3 py-2 text-sm sm:text-xs bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 rounded-xl border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-sm transition-all"
          />
        </div>
      )}

      {showGiftWrap && (
        <div className="space-y-2 w-full">
          <label className="block text-slate-500 dark:text-zinc-400 text-[11px] sm:text-xs">{giftWrapLabel}</label>
          <select
            value={giftWrap}
            onChange={(e) => setGiftWrap(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 text-sm sm:text-xs bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 rounded-xl border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-sm transition-all"
          >
            {giftWrapOptions.map((opt, index) => (
              <option key={index} value={opt} className="bg-white dark:bg-zinc-900">{opt}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
