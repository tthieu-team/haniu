'use client';

import React, { useState } from 'react';

interface RealtimePreviewProps {
  engravingText: string;
  cardMessage: string;
  giftWrap: string;
  isCustomizable: boolean;
}

export default function RealtimePreview({
  engravingText,
  cardMessage,
  giftWrap,
  isCustomizable
}: RealtimePreviewProps) {
  const [activeTab, setActiveTab] = useState<'laser' | 'card'>('laser');

  if (!isCustomizable && !cardMessage) return null;

  // Set engraving style based on gift wrap or category (wood/leather)
  const getTextureClass = () => {
    if (giftWrap === 'Vintage Kraft') {
      return 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-800/70 to-amber-950 text-amber-100 border border-amber-900';
    }
    return 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-700/80 to-amber-900 text-amber-100 border border-amber-800'; // Default Premium Wood
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-zinc-850">
        <h3 className="font-bold text-xs text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
          🎨 Mô phỏng cá nhân hóa realtime
        </h3>
        
        <div className="flex gap-1.5">
          {isCustomizable && (
            <button
              type="button"
              onClick={() => setActiveTab('laser')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeTab === 'laser'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-50 text-slate-500 dark:bg-zinc-800'
              }`}
            >
              Xem khắc Laser
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === 'card' || !isCustomizable
                ? 'bg-rose-500 text-white'
                : 'bg-slate-50 text-slate-500 dark:bg-zinc-800'
            }`}
          >
            Xem thiệp viết tay
          </button>
        </div>
      </div>

      {activeTab === 'laser' && isCustomizable && (
        <div className="space-y-3">
          <div className="text-[10px] text-slate-400 font-semibold italic">Mockup bề mặt sản phẩm khắc gỗ/da:</div>
          {/* Laser Mockup Container */}
          <div className={`relative h-44 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 ${getTextureClass()} transition-all shadow-inner`}>
            {/* Wood Texture Simulation */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay bg-repeat bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&q=80')` }} />
            
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            <div className="text-center space-y-2 z-10 select-none">
              <p className="text-[9px] uppercase tracking-widest text-amber-500/60 font-semibold">Haniu Personalized</p>
              
              {/* Laser Text */}
              <div 
                className="text-xl md:text-2xl font-serif italic text-amber-950 font-semibold tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)] leading-relaxed select-none break-all max-w-[280px]"
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

      {(activeTab === 'card' || !isCustomizable) && (
        <div className="space-y-3">
          <div className="text-[10px] text-slate-400 font-semibold italic">Mô phỏng thiệp viết tay Haniu:</div>
          
          {/* Card Mockup Container */}
          <div className="relative h-44 rounded-2xl bg-amber-50/45 dark:bg-zinc-950/20 border border-amber-500/10 p-6 flex flex-col justify-between shadow-inner">
            <div className="flex justify-between items-center text-[10px] text-amber-800/60 font-bold tracking-wider">
              <span>Dear, Best wishes</span>
              <span>🎁 Haniu Gift Card</span>
            </div>
            
            {/* Card Text */}
            <div 
              className="text-slate-800 dark:text-zinc-200 text-sm italic font-medium leading-relaxed font-serif text-center overflow-y-auto max-h-[80px] px-2 break-words"
              style={{
                fontFamily: 'Times New Roman, Georgia, serif',
                opacity: cardMessage ? 0.95 : 0.3
              }}
            >
              {cardMessage || '"Lời nhắn yêu thương gửi tới người nhận..."'}
            </div>

            <div className="text-right text-[9px] text-slate-400 font-medium">
              Haniu team sẽ nắn nót viết tay ✍️
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
