import { useEffect } from 'react';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

interface GiftWrapSelectorProps {
  giftWrap: string;
  setGiftWrap: (val: string) => void;
  options?: string[];
  label?: string;
  show?: boolean;
  borderless?: boolean;
}

const giftWrapDetails: Record<string, { color: string; desc: string; icon: string; imageUrl: string }> = {
  "Ruy băng Đỏ Lãng Mạn": { 
    color: "bg-red-500", 
    desc: "Ruy băng đỏ lãng mạn cho các dịp kỷ niệm, đôi lứa.", 
    icon: "🎀",
    imageUrl: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=120&q=80"
  },
  "Ruy băng Vàng Hoàng Gia": { 
    color: "bg-amber-400", 
    desc: "Ruy băng vàng kim sang trọng, thích hợp tặng sếp, đối tác.", 
    icon: "✨",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=120&q=80"
  },
  "Gói bọc giấy Kraft Hoài Cổ": { 
    color: "bg-amber-700", 
    desc: "Giấy bọc Kraft mộc mạc và dây thừng gai vintage.", 
    icon: "📦",
    imageUrl: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=120&q=80"
  }
};

export default function GiftWrapSelector({
  giftWrap,
  setGiftWrap,
  options,
  label,
  show = true,
  borderless = false
}: GiftWrapSelectorProps) {
  const trans = useTranslate();
  const giftWrapLabel = label || "Chọn ruy băng nơ / hộp gói (Miễn phí)";
  const giftWrapOptions = options && options.length > 0
    ? options
    : [
      "Ruy băng Đỏ Lãng Mạn",
      "Ruy băng Vàng Hoàng Gia",
      "Gói bọc giấy Kraft Hoài Cổ"
    ];

  const optionNames = giftWrapOptions.map(opt => typeof opt === 'object' && opt !== null ? (opt as any).name : String(opt));
  const optionNamesKey = optionNames.join('|');

  // Auto-correct giftWrap state if it's not present in the choices
  useEffect(() => {
    if (show && optionNames.length > 0) {
      if (!optionNames.includes(giftWrap)) {
        setGiftWrap(optionNames[0]);
      }
    }
  }, [optionNamesKey, giftWrap, setGiftWrap, show]);

  if (!show) return null;

  return (
    <div className={borderless ? "space-y-2.5 text-xs font-semibold w-full" : "bg-gradient-to-br from-amber-500/[0.01] to-rose-500/[0.01] border border-slate-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 rounded-3xl p-4 sm:p-5 space-y-3 text-xs font-semibold w-full shadow-xs"}>
      <label className={borderless ? "text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-450 block mb-3" : "block text-slate-500 dark:text-zinc-400 text-[11px] font-bold uppercase tracking-wider"}>
        {trans(giftWrapLabel)}
      </label>
      
      {/* Beautiful Visual Cards Grid */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${giftWrapOptions.length > 3 ? 'max-h-[220px] overflow-y-auto pr-1 scrollbar-thin' : ''}`}>
        {giftWrapOptions.map((opt, index) => {
          const isObj = typeof opt === 'object' && opt !== null;
          const optName = isObj ? (opt as any).name : String(opt);
          const isSelected = giftWrap === optName;
          
          let parsedImageUrl: string | undefined = undefined;
          let icon = "🎁";
          let displayName = optName;

          if (isObj) {
            parsedImageUrl = (opt as any).imageUrl || undefined;
            icon = (opt as any).icon || "🎁";
          } else {
            // Dynamically detect image URL in brackets e.g. [https://...]
            const imageUrlRegex = /^\[(https?:\/\/[^\]]+)\]/i;
            const imgMatch = optName.match(imageUrlRegex);
            let textWithoutImage = optName;
            
            if (imgMatch) {
              parsedImageUrl = imgMatch[1];
              textWithoutImage = optName.replace(imageUrlRegex, '').trim();
            }
            
            // Dynamically detect emoji at the start of option string
            const emojiRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F09F}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}])/u;
            const emojiMatch = textWithoutImage.match(emojiRegex);
            
            displayName = textWithoutImage;
            
            if (emojiMatch) {
              icon = emojiMatch[0];
              displayName = textWithoutImage.replace(emojiRegex, '').trim();
            } else {
              // Check in standard mapping (removing emoji prefix if matching by key)
              const cleanKey = optName.replace(emojiRegex, '').trim();
              const detail = giftWrapDetails[cleanKey] || giftWrapDetails[optName];
              if (detail) {
                icon = detail.icon;
                if (!parsedImageUrl) {
                  parsedImageUrl = detail.imageUrl;
                }
              }
            }
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => setGiftWrap(optName)}
              className={`relative p-1.5 pr-2.5 rounded-xl border text-left flex items-center gap-2 transition-all select-none outline-none cursor-pointer text-[11px] font-bold ${
                isSelected
                  ? 'border-rose-500 bg-rose-500/[0.02] text-rose-600 dark:border-rose-450 dark:text-rose-400 dark:bg-rose-950/10 shadow-[0_2px_8px_rgba(244,63,94,0.06)]'
                  : 'border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-rose-300 dark:hover:bg-zinc-800/50'
              }`}
            >
              {/* Selected checkmark indicator */}
              {isSelected && (
                <span className="absolute -top-1 -right-1 p-0.5 rounded-full bg-rose-500 text-white dark:bg-rose-600 shadow-xs animate-scale-up z-10">
                  <Icon name="check" size={8} />
                </span>
              )}

              {parsedImageUrl ? (
                <img src={parsedImageUrl} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-100/50 dark:border-zinc-800/50" alt="" />
              ) : (
                <span className="text-xs shrink-0 p-1.5 bg-slate-50 dark:bg-zinc-800 rounded-lg">{icon}</span>
              )}
              <span className="leading-tight break-words line-clamp-2">{trans(displayName)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
