'use client';

import React, { useState, useEffect } from 'react';

interface RealtimePreviewProps {
  engravingText: string;
  cardMessage: string;
  giftWrap: string;
  isCustomizable: boolean;
  config?: {
    showEngraving?: boolean;
    showEngravingMockup?: boolean;
    showCardMessage?: boolean;
    showCardMessageMockup?: boolean;
    [key: string]: any;
  };
}

export default function RealtimePreview({
  engravingText,
  cardMessage,
  giftWrap,
  isCustomizable,
  config
}: RealtimePreviewProps) {
  if (!isCustomizable) return null;

  const showEngraving = (config?.showEngraving ?? true) && (config?.showEngravingMockup ?? true) && isCustomizable;
  const showCardMessage = (config?.showCardMessage ?? true) && (config?.showCardMessageMockup ?? true);

  const [activeTab, setActiveTab] = useState<'laser' | 'card'>('laser');

  // Automatically switch tab if one of them is disabled
  useEffect(() => {
    if (!showEngraving && activeTab === 'laser') {
      setActiveTab('card');
    } else if (!showCardMessage && activeTab === 'card') {
      setActiveTab('laser');
    }
  }, [showEngraving, showCardMessage]);

  if (!showEngraving && !showCardMessage) return null;

  // Set engraving style based on gift wrap or category (wood/leather)
  const getTextureClass = () => {
    if (giftWrap === 'Vintage Kraft') {
      return 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-800/70 to-amber-950 text-amber-100 border border-amber-900';
    }
    return 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-700/80 to-amber-900 text-amber-100 border border-amber-800'; // Default Premium Wood
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 sm:p-6 rounded-3xl space-y-4 shadow-sm w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-50 dark:border-zinc-850 gap-2">
        <h3 className="font-bold text-xs text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
          🎨 Mô phỏng cá nhân hóa realtime
        </h3>
        
        <div className="flex gap-1.5 overflow-x-auto">
          {showEngraving && (
            <button
              type="button"
              onClick={() => setActiveTab('laser')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                activeTab === 'laser'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-50 text-slate-500 dark:bg-zinc-800'
              }`}
            >
              Xem khắc Laser
            </button>
          )}
          {showCardMessage && (
            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                activeTab === 'card'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-50 text-slate-500 dark:bg-zinc-800'
              }`}
            >
              Xem thiệp viết tay
            </button>
          )}
        </div>
      </div>

      {activeTab === 'laser' && showEngraving && (
        <div className="space-y-3 w-full">
          <div className="text-[10px] text-slate-400 font-semibold italic">Mockup bề mặt sản phẩm khắc gỗ/da:</div>
          {/* Laser Mockup Container */}
          <div className={`relative h-44 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 ${getTextureClass()} transition-all shadow-inner`}>
            {/* Wood Texture Simulation */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay bg-repeat bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&q=80')` }} />
            
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            <div className="text-center space-y-2 z-10 select-none w-full px-2">
              <p className="text-[9px] uppercase tracking-widest text-amber-500/60 font-semibold">Haniu Personalized</p>
              
              {/* Laser Text */}
              <div 
                className="text-base sm:text-xl md:text-2xl font-serif italic text-amber-950 font-semibold tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)] leading-relaxed select-none break-all max-w-full"
                style={{ 
                  fontFamily: 'Georgia, serif',
                  textShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), 0px 1px 1px rgba(255,255,255,0.1)',
                  color: '#3d1d03',
                  opacity: engravingText ? 0.95 : 0.25
                }}
              >
                {engravingText || 'Nhập nội dung khắc của bạn'}
              </div>
              
              <div className="w-12 h-[1px] bg-amber-950/20 mx-auto" />
            </div>
            
            {/* Burned effect around the edges */}
            <div className="absolute inset-0 border-[6px] border-amber-950/20 rounded-2xl pointer-events-none" />
          </div>
          <div className="text-[9px] text-slate-450 dark:text-zinc-500 leading-relaxed text-center">
            *Hình ảnh mô phỏng có thể khác biệt 5-10% so với nét khắc laser thực tế trên vật liệu tự nhiên.
          </div>
        </div>
      )}

      {activeTab === 'card' && showCardMessage && (
        <div className="space-y-3.5 w-full">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            💌 Mô phỏng thiệp viết tay Haniu:
          </div>
          
          {/* Card Mockup Container */}
          <div 
            className="relative min-h-[190px] rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-md border overflow-hidden w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-50/80 via-orange-50/50 to-amber-100/40 border-amber-500/10 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-amber-950/20 dark:border-zinc-800"
            style={{
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 14px rgba(220,100,50,0.06)'
            }}
          >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/lined-paper-2.png')` }} />
            
            {/* Header section */}
            <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-amber-800/70 dark:text-amber-500/60 pb-2 border-b border-amber-900/5 dark:border-zinc-800/80">
              <span className="font-serif italic text-xs">Dear, Best wishes</span>
              <span className="uppercase tracking-widest text-[9px] flex items-center gap-1">
                <span>🎁</span> Haniu Premium Gift Card
              </span>
            </div>
            
            {/* Card Text Area (Beautiful Handwriting Font) */}
            <div 
              className="my-4 text-slate-850 dark:text-zinc-150 text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed text-center overflow-y-auto max-h-[100px] px-2 break-words select-none scrollbar-thin"
              style={{
                fontFamily: "var(--font-dancing-script), cursive",
                opacity: cardMessage ? 0.95 : 0.35,
                textShadow: '0.3px 0.3px 0px rgba(0,0,0,0.1)'
              }}
            >
              {cardMessage || '"Lời nhắn yêu thương nắn nót viết tay gửi tới người nhận..."'}
            </div>

            {/* Footer section */}
            <div className="flex items-center justify-between text-[9px] text-slate-450 dark:text-zinc-550 pt-2 border-t border-amber-900/5 dark:border-zinc-800/80">
              <span className="font-medium italic">Handwritten with love 💖</span>
              <span className="font-bold flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                Haniu team sẽ nắn nót viết tay ✍️
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
