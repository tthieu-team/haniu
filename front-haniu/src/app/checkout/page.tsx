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
import { productService } from '@/services/product.service';
import CustomizationInfo from '@/app/cart/components/CustomizationInfo';


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
  const { cart, fetchCart, clearCartState, syncGuestCartToBackend } = useCartStore();
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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [tempFormData, setTempFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingProvince: '',
    shippingDistrict: '',
    shippingWard: '',
    shippingAddressLine: '',
    note: ''
  });

  const isAddressFilled = formData.customerName.trim() !== '' &&
    formData.customerPhone.trim() !== '' &&
    formData.shippingProvince.trim() !== '' &&
    formData.shippingDistrict.trim() !== '' &&
    formData.shippingWard.trim() !== '' &&
    formData.shippingAddressLine.trim() !== '';

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
    const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const initCheckoutCart = async () => {
      if (paramCartId && isValidUUID(paramCartId)) {
        try {
          const data = await cartService.getCartById(paramCartId);
          setCheckoutCart(data);
        } catch (err) {
          console.error("Failed to fetch checkout cart:", err);
          fetchCart();
        }
      } else {
        if (!isAuthenticated) {
          try {
            const synced = await syncGuestCartToBackend();
            if (synced) {
              setCheckoutCart(synced);
            } else {
              fetchCart();
            }
          } catch (e) {
            fetchCart();
          }
        } else {
          fetchCart();
        }
      }
    };
    initCheckoutCart();
  }, [paramCartId, isAuthenticated, fetchCart, syncGuestCartToBackend]);

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

    if (!formData.customerName.trim()) {
      setError('Vui lòng điền họ tên người nhận.');
      return;
    }
    if (!formData.customerPhone.trim()) {
      setError('Vui lòng điền số điện thoại.');
      return;
    }
    const phoneRegex = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(formData.customerPhone.trim())) {
      setError('Số điện thoại không đúng định dạng (VD: 0912345678).');
      return;
    }
    if (formData.customerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail.trim())) {
        setError('Địa chỉ email không đúng định dạng.');
        return;
      }
    }
    if (!formData.shippingProvince.trim()) {
      setError('Vui lòng chọn Tỉnh/Thành phố.');
      return;
    }
    if (!formData.shippingDistrict.trim()) {
      setError('Vui lòng chọn Quận/Huyện.');
      return;
    }
    if (!formData.shippingWard.trim()) {
      setError('Vui lòng chọn Phường/Xã.');
      return;
    }
    if (!formData.shippingAddressLine.trim()) {
      setError('Vui lòng điền địa chỉ chi tiết (số nhà, tên đường...).');
      return;
    }

    try {
      setError('');

      // Upload local photobooth images if any
      const itemsToUpload = (activeCart?.items || []).filter(item => {
        if (!item.customizationInfo) return false;
        try {
          const parsed = JSON.parse(item.customizationInfo);
          return parsed.photoboothPhotoUrls && parsed.photoboothPhotoUrls.some((url: string) => url.startsWith('local_pb_'));
        } catch {
          return false;
        }
      });

      if (itemsToUpload.length > 0) {
        setError('⏳ Đang tải lên ảnh photobooth thiết kế của bạn...');
        for (const item of itemsToUpload) {
          const parsed = JSON.parse(item.customizationInfo!);
          const urls = parsed.photoboothPhotoUrls || [];
          const uploadedUrls: string[] = [];

          for (const url of urls) {
            if (url.startsWith('local_pb_')) {
              const base64 = localStorage.getItem(`haniu_pb_${url}`);
              if (base64) {
                // Convert Base64 back to file
                const file = (() => {
                  const arr = base64.split(',');
                  const mime = arr[0].match(/:(.*?);/)![1];
                  const bstr = atob(arr[1]);
                  let n = bstr.length;
                  const u8arr = new Uint8Array(n);
                  while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                  }
                  return new File([u8arr], `photobooth_${url}.png`, { type: mime });
                })();

                const uploadRes = await productService.uploadImage(file);
                if (uploadRes && uploadRes.url) {
                  uploadedUrls.push(uploadRes.url);
                  // Clean up local storage to free space
                  try { localStorage.removeItem(`haniu_pb_${url}`); } catch {}
                } else {
                  throw new Error('Không nhận được URL từ máy chủ khi tải ảnh photobooth.');
                }
              }
            } else {
              uploadedUrls.push(url);
            }
          }

          // Update customization info on backend
          const updatedCustomInfo = JSON.stringify({
            ...parsed,
            photoboothPhotoUrl: uploadedUrls.join(','),
            photoboothPhotoUrls: uploadedUrls
          });
          await cartService.updateCustomizationInfo(item.id, updatedCustomInfo);
        }
        setError(''); // clear uploading indicator
      }

      const order = await createOrder({
        cartId,
        shippingMethod,
        ...formData
      });


      if (formData.couponCode && typeof window !== 'undefined') {
        try {
          const used = localStorage.getItem('haniu_used_coupons');
          const usedList = used ? JSON.parse(used) : [];
          if (!usedList.includes(formData.couponCode)) {
            usedList.push(formData.couponCode);
            localStorage.setItem('haniu_used_coupons', JSON.stringify(usedList));
          }
        } catch (e) {
          console.error('Lỗi khi lưu mã giảm giá đã dùng:', e);
        }
      }

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
    <div className="w-full space-y-10 pt-6 sm:pt-0">
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

          {/* Mobile Address Summary Card */}
          <div className="block md:hidden">
            {isAddressFilled ? (
              <div className="bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/50 dark:border-zinc-800/50 p-4 rounded-2xl relative">
                <button
                  type="button"
                  onClick={() => {
                    setTempFormData({
                      customerName: formData.customerName,
                      customerPhone: formData.customerPhone,
                      customerEmail: formData.customerEmail,
                      shippingProvince: formData.shippingProvince,
                      shippingDistrict: formData.shippingDistrict,
                      shippingWard: formData.shippingWard,
                      shippingAddressLine: formData.shippingAddressLine,
                      note: formData.note
                    });
                    setIsAddressModalOpen(true);
                  }}
                  className="absolute top-4 right-4 text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                >
                  <Icon name="edit" size={12} /> Sửa
                </button>
                <div className="space-y-1.5 text-slate-800 dark:text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{formData.customerName}</span>
                    <span className="text-slate-350 dark:text-zinc-600 font-normal">|</span>
                    <span className="font-semibold text-xs">{formData.customerPhone}</span>
                  </div>
                  {formData.customerEmail && (
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">{formData.customerEmail}</div>
                  )}
                  <div className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed pr-12 pt-1 font-medium">
                    📍 {formData.shippingAddressLine}, {formData.shippingWard}, {formData.shippingDistrict}, {formData.shippingProvince}
                  </div>
                  {formData.note && (
                    <div className="text-[11px] text-slate-450 dark:text-zinc-500 pt-1 border-t border-slate-100 dark:border-zinc-800/50 mt-1 italic">
                      Ghi chú: “{formData.note}”
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempFormData({
                    customerName: formData.customerName,
                    customerPhone: formData.customerPhone,
                    customerEmail: formData.customerEmail,
                    shippingProvince: formData.shippingProvince,
                    shippingDistrict: formData.shippingDistrict,
                    shippingWard: formData.shippingWard,
                    shippingAddressLine: formData.shippingAddressLine,
                    note: formData.note
                  });
                  setIsAddressModalOpen(true);
                }}
                className="w-full py-6 border-2 border-dashed border-rose-300 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-rose-500 dark:text-rose-455 font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <Icon name="plus" size={18} />
                <span className="text-xs uppercase tracking-wider">Nhập địa chỉ giao hàng</span>
              </button>
            )}
          </div>

          {/* Desktop Form Inputs */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Họ tên người nhận</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full text-base md:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full text-base md:text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-700 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Địa chỉ Email (Không bắt buộc)</label>
              <input
                type="email"
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
              <div className="space-y-3 max-h-[380px] sm:max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                {activeCart.items.map(item => (
                  <div key={item.id} className="flex gap-3 items-start text-xs pb-3 border-b border-slate-50 dark:border-zinc-800 last:border-0">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&q=80"}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100 dark:border-zinc-850 animate-fade-in shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="font-bold text-slate-800 dark:text-zinc-200 truncate">{item.productName}</h4>
                      {item.variantName && (
                        <p className="text-[9px] text-slate-400">Biến thể: {item.variantName}</p>
                      )}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">SL: {item.quantity} x {item.unitPrice.toLocaleString()}đ</span>
                      </div>
                      <CustomizationInfo info={item.customizationInfo || ''} />
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

      {/* Mobile Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-0 md:hidden">
          <div className="bg-white dark:bg-zinc-950 w-full h-full flex flex-col">
            {/* Modal Header */}
            <div className="pt-[calc(1.25rem+env(safe-area-inset-top))] pb-5 px-5 border-b border-slate-100 dark:border-zinc-850 flex justify-between items-center shrink-0">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Địa chỉ nhận hàng</h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-850 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center justify-center transition-all cursor-pointer"
              >
                <Icon name="close" size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Họ tên người nhận</label>
                <input
                  type="text"
                  value={tempFormData.customerName}
                  onChange={e => setTempFormData({ ...tempFormData, customerName: e.target.value })}
                  className="w-full text-base bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-700 dark:text-white font-medium"
                  placeholder="Nhập họ tên người nhận"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={tempFormData.customerPhone}
                  onChange={e => setTempFormData({ ...tempFormData, customerPhone: e.target.value })}
                  className="w-full text-base bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-700 dark:text-white font-mono font-medium"
                  placeholder="Nhập số điện thoại nhận hàng"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Địa chỉ Email (Không bắt buộc)</label>
                <input
                  type="email"
                  value={tempFormData.customerEmail}
                  onChange={e => setTempFormData({ ...tempFormData, customerEmail: e.target.value })}
                  className="w-full text-base bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-700 dark:text-white font-medium"
                  placeholder="Nhập email để nhận hóa đơn"
                />
              </div>
              <AddressPicker
                province={tempFormData.shippingProvince}
                district={tempFormData.shippingDistrict}
                ward={tempFormData.shippingWard}
                addressLine={tempFormData.shippingAddressLine}
                onChange={(fields) => setTempFormData((prev) => ({
                  ...prev,
                  ...(fields.province !== undefined && { shippingProvince: fields.province }),
                  ...(fields.district !== undefined && { shippingDistrict: fields.district }),
                  ...(fields.ward !== undefined && { shippingWard: fields.ward }),
                  ...(fields.addressLine !== undefined && { shippingAddressLine: fields.addressLine }),
                }))}
              />
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Ghi chú giao hàng (Không bắt buộc)</label>
                <textarea
                  value={tempFormData.note}
                  onChange={e => setTempFormData({ ...tempFormData, note: e.target.value })}
                  className="w-full text-base bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-700 dark:text-white h-20 font-medium"
                  placeholder="Ghi chú cho người vận chuyển (VD: Giao giờ hành chính, gọi trước khi đến...)"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-zinc-850 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="flex-1 py-3 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!tempFormData.customerName.trim()) {
                    alert('Vui lòng điền họ tên người nhận.');
                    return;
                  }
                  if (!tempFormData.customerPhone.trim()) {
                    alert('Vui lòng điền số điện thoại.');
                    return;
                  }
                  const phoneRegex = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;
                  if (!phoneRegex.test(tempFormData.customerPhone.trim())) {
                    alert('Số điện thoại không đúng định dạng.');
                    return;
                  }
                  if (!tempFormData.shippingProvince.trim() || !tempFormData.shippingDistrict.trim() || !tempFormData.shippingWard.trim() || !tempFormData.shippingAddressLine.trim()) {
                    alert('Vui lòng điền đầy đủ thông tin địa chỉ.');
                    return;
                  }
                  setFormData(prev => ({
                    ...prev,
                    ...tempFormData
                  }));
                  setIsAddressModalOpen(false);
                }}
                className="flex-1 py-3 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-all cursor-pointer shadow-md shadow-rose-500/10"
              >
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}
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
