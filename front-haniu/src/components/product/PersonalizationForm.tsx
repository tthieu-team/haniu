'use client';

import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

export interface PersonalizationConfig {
  showEngraving?: boolean;
  engravingLabel?: string;
  engravingPlaceholder?: string;
  engravingMaxLength?: number;

  showCardMessage?: boolean;
  cardMessageLabel?: string;
  cardMessagePlaceholder?: string;
  cardMessageMaxLength?: number;
}

interface PersonalizationFormProps {
  engravingText: string;
  setEngravingText: (val: string) => void;
  cardMessage: string;
  setCardMessage: (val: string) => void;
  config?: PersonalizationConfig;
}

export default function PersonalizationForm({
  engravingText,
  setEngravingText,
  cardMessage,
  setCardMessage,
  config
}: PersonalizationFormProps) {
  const trans = useTranslate();
  const showEngraving = false;
  const engravingLabel = config?.engravingLabel || "Khắc tên hoặc lời chúc muốn khắc lên sản phẩm";
  const engravingPlaceholder = config?.engravingPlaceholder || "Nhập nội dung muốn khắc (ví dụ: Happy Birthday, Hieu & Vy...)";
  const engravingMaxLength = config?.engravingMaxLength ?? 50;

  const showCardMessage = config?.showCardMessage ?? true;
  const cardMessageLabel = config?.cardMessageLabel || "Nội dung thư/thiệp gửi kèm gói quà";
  const cardMessagePlaceholder = config?.cardMessagePlaceholder || "Nhập lời chúc nắn nót viết tay gửi tới người nhận...";
  const cardMessageMaxLength = config?.cardMessageMaxLength ?? 200;

  const [activeTab, setActiveTab] = useState<'engraving' | 'card'>('engraving');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea to match content height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [cardMessage]);

  // Set default active tab based on availability
  useEffect(() => {
    if (!showEngraving && activeTab === 'engraving' && showCardMessage) {
      setActiveTab('card');
    }
  }, [showEngraving, showCardMessage, activeTab]);

  const showAny = showEngraving || showCardMessage;
  if (!showAny) return null;

  const showMockupTabs = showEngraving && showCardMessage;

  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-5 space-y-4 text-xs font-semibold w-full shadow-xs">
      {/* Tab Selection (only visible if BOTH engraving and card are enabled) */}
      {showMockupTabs && (
        <div className="flex bg-slate-100/80 dark:bg-zinc-800 p-0.5 rounded-xl border border-slate-200/40 dark:border-zinc-800/80 w-full mb-1">
          <button
            type="button"
            onClick={() => setActiveTab('engraving')}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'engraving'
              ? 'bg-white dark:bg-zinc-700 text-rose-500 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
          >
            <Icon name="edit" size={12} /> {trans("Khắc Laser")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'card'
              ? 'bg-white dark:bg-zinc-700 text-rose-500 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
          >
            <Icon name="mail" size={12} /> {trans("Thiệp viết tay")}
          </button>
        </div>
      )}

      {/* Simulator Panels */}
      <div className="space-y-4">
        {/* Engraving Simulator */}
        {showEngraving && (activeTab === 'engraving' || !showCardMessage) && (
          <div className="space-y-3 w-full animate-fade-in">
            <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span>{trans(engravingLabel)}</span>
              <span className="font-mono text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-zinc-400">{engravingText.length}/{engravingMaxLength} {trans("ký tự")}</span>
            </div>

            {/* Dark Walnut Laser Engraving simulator canvas */}
            <div className="relative h-40 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-5 bg-gradient-to-tr from-[#2a1708] via-[#3a200c] to-[#2a1708] border-2 border-[#1e1005] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
              {/* Natural wood grain textures overlay */}
              <div className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay bg-repeat bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&q=80')` }} />
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />

              <div className="text-center space-y-1.5 z-10 w-full px-4">
                <p className="text-[7.5px] uppercase tracking-widest text-amber-500/40 font-black">Haniu Wood Laser Engraving</p>

                <input
                  type="text"
                  maxLength={engravingMaxLength}
                  placeholder={trans(engravingPlaceholder)}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  className="w-full text-center bg-transparent border-none outline-none text-base sm:text-lg md:text-xl font-serif italic font-bold tracking-wide focus:ring-0 focus:border-none focus:outline-none cursor-text text-[#170a01] placeholder-[#170a01]/30"
                  style={{
                    fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
                    textShadow: '0.5px 0.5px 1px rgba(255,255,255,0.06)'
                  }}
                />

                <div className="w-16 h-[1px] bg-[#170a01]/10 mx-auto" />
              </div>

              {/* Laser burned framing effect */}
              <div className="absolute inset-2 border border-[#170a01]/10 rounded-xl pointer-events-none" />
              <div className="absolute inset-0.5 border-4 border-[#170a01]/25 rounded-2xl pointer-events-none" />
            </div>

            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal leading-normal italic text-center">
              {trans("*Nhấp trực tiếp vào thanh gỗ ở trên để chỉnh sửa nội dung khắc laser.")}
            </p>
          </div>
        )}

        {/* Handwritten Card Simulator */}
        {showCardMessage && (activeTab === 'card' || !showEngraving) && (
          <div className="space-y-3 w-full animate-fade-in">
            <div className="flex justify-between items-center text-slate-500 dark:text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span>{trans(cardMessageLabel)}</span>
              <span className="font-mono text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-zinc-400">{cardMessage.length}/{cardMessageMaxLength} {trans("ký tự")}</span>
            </div>

            {/* Handwritten Letter Paper Simulator */}
            <div className="relative min-h-[180px] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-md border overflow-hidden w-full bg-[#fcfaf2] border-amber-900/10 dark:bg-zinc-900 dark:border-zinc-800">
              {/* Paper shadow edge for a realistic feel */}
              <div className="absolute top-0 bottom-0 left-6 w-[1px] bg-red-400/20 dark:bg-red-500/10 pointer-events-none" />

              <div 
                className="flex justify-between items-center text-[15px] sm:text-[17px] font-bold tracking-wide text-amber-900/60 dark:text-amber-400/80 pb-2 border-b border-amber-900/10 dark:border-zinc-800/80 z-10"
                style={{ fontFamily: "var(--font-dancing-script), cursive" }}
              >
                <span>{trans("Thư viết tay gửi người nhận")}</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <Icon name="edit" size={10} /> Handmade Note
                </span>
              </div>

              <textarea
                ref={textareaRef}
                rows={2}
                maxLength={cardMessageMaxLength}
                placeholder={trans(cardMessagePlaceholder)}
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                className="my-3 w-full bg-transparent border-none outline-none text-lg font-medium text-left overflow-y-hidden pl-8 pr-4 break-words scrollbar-none resize-none focus:ring-0 focus:border-none focus:outline-none text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 z-10"
                style={{
                  fontFamily: "var(--font-dancing-script), cursive",
                  textShadow: '0.2px 0.2px 0px rgba(0,0,0,0.05)',
                  lineHeight: '32px',
                  backgroundImage: 'linear-gradient(transparent, transparent 31px, rgba(144, 120, 96, 0.18) 31px, rgba(144, 120, 96, 0.18) 32px)',
                  backgroundSize: '100% 32px',
                  backgroundAttachment: 'local',
                  paddingTop: '4px', // Adjust so text sits directly on the lines
                  minHeight: '96px'
                }}
              />

              <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-zinc-500 pt-3 z-10">
                <span className="font-medium italic flex items-center gap-1">
                  {trans("Nắn nót từng nét chữ")} <Icon name="💖" size={9} className="text-rose-500" />
                </span>
                <span className="font-serif italic">{trans("Haniu Collection")}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal leading-normal italic text-center">
              {trans("*Nhấp trực tiếp lên thiệp ở trên để viết lời chúc.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
