'use client';

interface PersonalizationFormProps {
  engravingText: string;
  setEngravingText: (val: string) => void;
  cardMessage: string;
  setCardMessage: (val: string) => void;
  giftWrap: string;
  setGiftWrap: (val: string) => void;
}

export default function PersonalizationForm({
  engravingText,
  setEngravingText,
  cardMessage,
  setCardMessage,
  giftWrap,
  setGiftWrap
}: PersonalizationFormProps) {
  return (
    <div className="bg-gradient-to-br from-amber-500/5 to-rose-500/5 border border-amber-500/10 rounded-3xl p-6 space-y-4 text-xs font-semibold">
      <div className="flex items-center gap-2">
        <span className="text-lg">⚙️</span>
        <h3 className="font-bold text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider">Cấu hình cá nhân hóa quà tặng</h3>
      </div>

      <div className="space-y-3">
        <label className="block text-slate-500 dark:text-zinc-400">Khắc chữ / Tên theo yêu cầu (Miễn phí)</label>
        <input
          type="text"
          maxLength={50}
          placeholder="Nhập tên hoặc lời chúc muốn khắc (tối đa 50 ký tự)"
          value={engravingText}
          onChange={(e) => setEngravingText(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-slate-500 dark:text-zinc-400">Lời nhắn trên thiệp chúc mừng</label>
        <textarea
          rows={3}
          placeholder="Nhập nội dung thư chúc mừng gửi tới người nhận..."
          value={cardMessage}
          onChange={(e) => setCardMessage(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-slate-500 dark:text-zinc-400">Chọn ruy băng nơ / hộp gói</label>
        <select
          value={giftWrap}
          onChange={(e) => setGiftWrap(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
        >
          <option value="Red Ribbon">Ruy băng Đỏ Lãng Mạn</option>
          <option value="Gold Ribbon">Ruy băng Vàng Hoàng Gia</option>
          <option value="Vintage Kraft">Gói bọc giấy Kraft Hoài Cổ</option>
        </select>
      </div>
    </div>
  );
}
