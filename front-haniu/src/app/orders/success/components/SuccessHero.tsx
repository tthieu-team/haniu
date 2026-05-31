import Icon from '@/components/common/Icons';

interface SuccessHeroProps {
  orderCode: string;
  customerEmail?: string;
}

export default function SuccessHero({ orderCode, customerEmail }: SuccessHeroProps) {
  return (
    <div className="text-center space-y-4 max-w-xl mx-auto">
      <div className="w-18 h-18 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900/30 shadow-inner">
        <Icon name="check" size={32} />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-zinc-100">
          Đặt hàng thành công!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
          Cảm ơn bạn đã lựa chọn <span className="font-extrabold text-rose-500">Haniu Gifting</span>. Đơn hàng của bạn đã được nhận và đang trong quá trình xử lý.
        </p>
        {customerEmail && (
          <p className="text-[11px] text-slate-400 dark:text-zinc-550 bg-slate-100/55 dark:bg-zinc-900/55 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200/40 dark:border-zinc-800/60">
            <Icon name="mail" size={12} className="text-rose-500" />
            Chi tiết đơn hàng đã được gửi đến <span className="font-semibold text-slate-650 dark:text-zinc-300">{customerEmail}</span>
          </p>
        )}
      </div>
    </div>
  );
}
