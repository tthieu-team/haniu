import Icon from '@/components/common/Icons';
import CustomizationInfo from '@/app/cart/components/CustomizationInfo';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productThumbnail?: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizationInfo?: string;
}

interface OrderItemsCardProps {
  items: OrderItem[];
}

export default function OrderItemsCard({ items }: OrderItemsCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/50 pb-3 flex items-center gap-2">
        <Icon name="gift" size={16} className="text-rose-500" />
        Sản phẩm mua sắm
      </h3>
      
      <div className="divide-y divide-slate-100 dark:divide-zinc-850 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {items?.map((item) => (
          <div key={item.id} className="py-3 flex gap-3 first:pt-0 last:pb-0">
            <img
              src={item.productThumbnail || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80'}
              alt={item.productName}
              className="w-12 h-12 rounded-lg object-cover border border-slate-100 dark:border-zinc-800/60 shrink-0"
            />
            <div className="flex-1 min-w-0 text-xs space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-zinc-200 truncate" title={item.productName}>
                {item.productName}
              </h4>
              {item.variantName && (
                <p className="text-[10px] text-slate-400 dark:text-zinc-550">
                  Phân loại: <span className="font-medium">{item.variantName}</span>
                </p>
              )}
              <CustomizationInfo info={item.customizationInfo || ''} />
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>x{item.quantity}</span>
                <span className="font-bold text-slate-700 dark:text-zinc-300">
                  {item.totalPrice?.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
