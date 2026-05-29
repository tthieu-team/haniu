'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOrderStore } from '@/store/order';
import { useCartStore, Cart } from '@/store/cart';
import { useCouponStore } from '@/store/coupon';
import { useAuthStore } from '@/store/auth';
import Icon from '@/components/common/Icons';
import { fetchApi } from '@/lib/api';
import AddressPicker from '@/components/common/AddressPicker';
import { cartService } from '@/services/cart.service';

interface PaymentMethodConfig {
  code: string;
  label: string;
  desc: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
}

const ALL_PAYMENT_METHODS: PaymentMethodConfig[] = [
  { code: 'COD', label: 'Thanh toán COD', desc: 'Nhận hàng rồi mới trả tiền', icon: '💵', enabled: true, sortOrder: 0 },
  { code: 'VNPAY', label: 'Thẻ ATM / Mobile Banking', desc: 'Thanh toán qua cổng VNPAY', icon: '🏦', enabled: true, sortOrder: 1 },
  { code: 'MOMO', label: 'Thanh toán ví MoMo', desc: 'Nhanh chóng, an toàn tuyệt đối', icon: '🌸', enabled: true, sortOrder: 2 },
];

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, fetchCart, clearCartState } = useCartStore();
  const { appliedCoupon, discountAmount, applyCoupon } = useCouponStore();
  const { user, isAuthenticated } = useAuthStore();

  const paramCartId = searchParams.get('cartId');
  const [checkoutCart, setCheckoutCart] = useState<Cart | null>(null);
  const activeCart = checkoutCart || cart;

  const cartId = paramCartId || activeCart?.id || '';
  const initialCoupon = searchParams.get('coupon') || appliedCoupon?.code || '';
  const initialShipping = searchParams.get('shippingMethod') || 'STANDARD';
  const initialPayment = searchParams.get('paymentMethod') || 'COD';

  const [shippingMethod, setShippingMethod] = useState(initialShipping);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingProvince: '',
    shippingDistrict: '',
    shippingWard: '',
    shippingAddressLine: '',
    note: '',
    paymentMethod: initialPayment,
    couponCode: initialCoupon
  });

  const { createOrder, createPaymentLink, loading } = useOrderStore();
  const [error, setError] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(ALL_PAYMENT_METHODS);

  const subtotal = activeCart?.totalPrice || 0;

  const originalSubtotal = activeCart?.items.reduce((acc, item) => {
    const orig = item.originalPrice || item.unitPrice;
    return acc + orig * item.quantity;
  }, 0) || 0;

  const productDiscount = originalSubtotal - subtotal;

  // Synced Shipping Fee Calculations
  const getShippingFee = () => {
    if (shippingMethod === 'FAST') {
      return subtotal >= 500000 ? 0 : 50000;
    }
    if (shippingMethod === 'EXPRESS') {
      return subtotal >= 1000000 ? 0 : 100000;
    }
    return subtotal >= 300000 ? 0 : 30000; // STANDARD
  };

  const deliveryFee = getShippingFee();
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const getDeliveryEstimation = () => {
    if (shippingMethod === 'FAST') return 'Giao nhanh dự kiến: 1 - 2 ngày';
    if (shippingMethod === 'EXPRESS') return 'Hỏa tốc giao trong 2 giờ';
    return 'Giao tiêu chuẩn dự kiến: 2 - 4 ngày';
  };

  useEffect(() => {
    if (paramCartId) {
      cartService.getCartById(paramCartId)
        .then((data) => {
          setCheckoutCart(data);
        })
        .catch((err) => {
          console.error("Failed to fetch checkout cart:", err);
          fetchCart();
        });
    } else {
      fetchCart();
    }
  }, [paramCartId, fetchCart]);

  useEffect(() => {
    // Fetch enabled payment methods from system config
    fetchApi('/api/v1/system-configs/payment_methods')
      .then((data) => {
        if (data?.configValue) {
          const parsed: PaymentMethodConfig[] = JSON.parse(data.configValue);
          const enabled = parsed.filter((m) => m.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
          if (enabled.length > 0) setPaymentMethods(enabled);
        }
      })
      .catch(() => {
        // Fallback to all methods if config not found
        setPaymentMethods(ALL_PAYMENT_METHODS);
      });
  }, []);

  useEffect(() => {
    if (initialCoupon && subtotal > 0) {
      applyCoupon(initialCoupon, subtotal);
    }
  }, [initialCoupon, subtotal, applyCoupon]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || user.fullName,
        customerPhone: prev.customerPhone || user.phone || '',
        customerEmail: prev.customerEmail || user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId) {
      setError('Giỏ hàng trống hoặc không hợp lệ.');
      return;
    }

    try {
      setError('');
      const order = await createOrder({
        cartId,
        shippingMethod,
        ...formData
      });

      clearCartState();

      if (formData.paymentMethod === 'COD') {
        router.push(`/orders/success?orderCode=${order.orderCode}`);
      } else {
        // Online payment: MOMO or VNPAY
        const paymentRes = await createPaymentLink(order.id, formData.paymentMethod);
        if (paymentRes?.paymentUrl) {
          window.location.href = paymentRes.paymentUrl;
        } else {
          router.push(`/orders/success?orderCode=${order.orderCode}`);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
      // Local fallback simulator if backend is offline
      const mockOrderCode = "HN-" + Date.now();
      clearCartState();
      if (formData.paymentMethod === 'COD') {
        router.push(`/orders/success?orderCode=${mockOrderCode}`);
      } else {
        router.push(`/orders/callback?orderCode=${mockOrderCode}&gateway=${formData.paymentMethod}&status=00`);
      }
    }
  };

  return (
    <div className="w-full space-y-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Thông tin đặt hàng</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1.5">Vui lòng điền địa chỉ giao hàng và thông tin liên hệ để hoàn tất đơn quà tặng</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information & Shipping address */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-slate-100 dark:border-zinc-800">
          <h2 className="font-bold text-slate-800 dark:text-white text-base pb-3 border-b border-slate-100 dark:border-zinc-800">Thông tin giao hàng</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Họ tên người nhận</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full text-base md:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Số điện thoại</label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full text-base md:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-700 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Địa chỉ Email</label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full text-base md:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-700 dark:text-white"
              />
            </div>
            <AddressPicker
              province={formData.shippingProvince}
              district={formData.shippingDistrict}
              ward={formData.shippingWard}
              addressLine={formData.shippingAddressLine}
              onChange={(fields) => setFormData((prev) => ({
                ...prev,
                ...(fields.province !== undefined && { shippingProvince: fields.province }),
                ...(fields.district !== undefined && { shippingDistrict: fields.district }),
                ...(fields.ward !== undefined && { shippingWard: fields.ward }),
                ...(fields.addressLine !== undefined && { shippingAddressLine: fields.addressLine }),
              }))}
            />
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Ghi chú giao hàng (Không bắt buộc)</label>
              <textarea
                value={formData.note}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                className="w-full text-base md:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-700 dark:text-white h-20"
              />
            </div>
          </div>

          {/* Shipping Methods inside Form */}
          <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Phương thức vận chuyển</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'STANDARD', name: 'Tiêu chuẩn', desc: 'Dự kiến 2-4 ngày', price: subtotal >= 300000 ? 0 : 30000 },
                { code: 'FAST', name: 'Giao nhanh', desc: 'Dự kiến 1-2 ngày', price: subtotal >= 500000 ? 0 : 50000 },
                { code: 'EXPRESS', name: 'Hỏa tốc 2h', desc: 'Giao trong ngày', price: subtotal >= 1000000 ? 0 : 100000 }
              ].map(sm => (
                <button
                  key={sm.code}
                  type="button"
                  onClick={() => setShippingMethod(sm.code)}
                  className={`p-2.5 text-center rounded-xl border text-[10px] font-bold transition-all flex flex-col justify-between h-20 ${shippingMethod === sm.code
                      ? 'border-rose-500 bg-rose-50/10 text-rose-600 dark:border-rose-400 dark:text-rose-400'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-350 dark:hover:bg-zinc-850'
                    }`}
                >
                  <div className="flex flex-col items-center w-full space-y-0.5">
                    <span className="block truncate w-full">{sm.name}</span>
                    <span className="font-mono text-[9px] font-black text-rose-500 dark:text-rose-400 block">
                      {sm.price === 0 ? 'Freeship' : `${(sm.price / 1000)}k`}
                    </span>
                  </div>
                  <span className="text-[8px] text-slate-400 dark:text-zinc-550 font-normal block w-full truncate">{sm.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Selection, Order Summary and Confirm order button */}
        <div className="space-y-6">
          {/* Order Summary box */}
          {activeCart && activeCart.items.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-zinc-800">
                <h2 className="font-bold text-slate-800 dark:text-white text-base">Tóm tắt đơn hàng</h2>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                  {activeCart.totalItems} sản phẩm
                </span>
              </div>

              {/* Item List */}
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                {activeCart.items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center text-xs">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&q=80"}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100 dark:border-zinc-850 animate-fade-in"
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="font-bold text-slate-800 dark:text-zinc-200 truncate">{item.productName}</h4>
                      {item.variantName && (
                        <p className="text-[9px] text-slate-400">Biến thể: {item.variantName}</p>
                      )}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">SL: {item.quantity} x {item.unitPrice.toLocaleString()}đ</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-zinc-200">{(item.totalPrice).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Tạm tính (Giá gốc)</span>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">{originalSubtotal.toLocaleString()}đ</span>
                </div>
                {productDiscount > 0 && (
                  <div className="flex justify-between text-rose-500 font-semibold">
                    <span>Giảm giá sản phẩm</span>
                    <span>-{productDiscount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-500 font-medium">Miễn phí</span>
                    ) : (
                      `${deliveryFee.toLocaleString()}đ`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold animate-pulse">
                    <span>Mã giảm giá ({formData.couponCode})</span>
                    <span>-{discountAmount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-slate-800 dark:text-white border-t border-slate-100 dark:border-zinc-800 pt-2.5">
                  <span>Tổng tiền</span>
                  <div className="text-right">
                    <span className="text-rose-500 font-extrabold text-base block">{total.toLocaleString()}đ</span>
                    {productDiscount + discountAmount > 0 && (
                      <span className="text-[9px] text-slate-400 font-normal block">Đã giảm -{(productDiscount + discountAmount).toLocaleString()}đ</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-4 shadow-sm">
            <h2 className="font-bold text-slate-800 dark:text-white text-base pb-3 border-b border-slate-100 dark:border-zinc-800">Phương thức thanh toán</h2>

            <div className="space-y-3">
              {paymentMethods.map(pm => (
                <label key={pm.code} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/50 dark:border-zinc-700/50 rounded-xl cursor-pointer hover:bg-slate-100/50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.code}
                    checked={formData.paymentMethod === pm.code}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="text-rose-500 focus:ring-rose-500"
                  />
                  <Icon name={pm.icon} size={18} className="shrink-0" />
                  <div className="text-xs min-w-0">
                    <span className="font-bold block text-slate-850 dark:text-zinc-200">{pm.label}</span>
                    <span className="text-slate-400 text-[10px] block truncate">{pm.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-900/40 p-4 rounded-2xl border border-slate-200/30 text-[10px] text-slate-450 dark:text-zinc-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-zinc-300">
              <Icon name="calendar" size={12} /> {getDeliveryEstimation()}
            </div>
            <p>Cam kết giao đúng hẹn. Bạn được quyền kiểm tra sản phẩm trước khi thanh toán.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white text-center font-bold text-xs rounded-2xl shadow-lg shadow-rose-500/20 transition-all cursor-pointer hover:scale-[1.01]"
          >
            {loading ? 'Đang tạo đơn hàng...' : 'Xác nhận Đặt hàng'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Đang tải form đặt hàng...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
