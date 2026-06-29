'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { useCouponStore } from '@/store/coupon';
import { useProductStore } from '@/store/product';
import { productService } from '@/services/product.service';
import { getFullImageUrl, fetchApi } from '@/lib/api';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

// Import subcomponents
import CartItemCard from './components/CartItemCard';
import ShippingProgressBar from './components/ShippingProgressBar';
import ProductCard from '@/components/product/ProductCard';

interface PaymentMethodConfig {
  code: string;
  name: string;
  icon: string;
  enabled: boolean;
  sortOrder: number;
}

const ALL_PAYMENT_METHODS: PaymentMethodConfig[] = [
  { code: 'COD', name: 'Thanh toán COD (Khi nhận hàng)', icon: '💵', enabled: true, sortOrder: 0 },
  { code: 'VNPAY', name: 'Cổng thanh toán VNPAY (ATM/Banking)', icon: '🏦', enabled: true, sortOrder: 1 },
  { code: 'MOMO', name: 'Thanh toán ví điện tử MoMo', icon: '🌸', enabled: true, sortOrder: 2 },
];

export default function CartPage() {
  const trans = useTranslate();
  const { cart, loading, fetchCart, updateQuantity, removeItem, addToCart } = useCartStore();
  const {
    appliedCoupon,
    discountAmount,
    error: couponError,
    applyCoupon,
    coupons,
    fetchCoupons,
    clearAppliedCoupon
  } = useCouponStore();

  const { products: recommendedProducts, fetchProducts } = useProductStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // New features state
  const [shippingMethod, setShippingMethod] = useState('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(ALL_PAYMENT_METHODS);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loadingAccessories, setLoadingAccessories] = useState(false);
  const [collectedCodes, setCollectedCodes] = useState<string[]>([]);
  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const [isUsedCouponsOpen, setIsUsedCouponsOpen] = useState(false);

  const loadCart = async () => {
    setIsInitialLoading(true);
    await fetchCart();
    setIsInitialLoading(false);
  };

  const loadAccessories = async () => {
    setLoadingAccessories(true);
    try {
      const res = await productService.getProducts({
        isAccessory: true,
        status: 'PUBLISHED',
        size: 10
      });
      setAccessories(res?.content || []);
    } catch (err) {
      console.error('Failed to load accessories:', err);
    } finally {
      setLoadingAccessories(false);
    }
  };

  useEffect(() => {
    loadCart();
    fetchCoupons();
    loadAccessories();
    fetchProducts({ isFeatured: true, size: 8 });
    const savedCoupon = localStorage.getItem('haniu_active_coupon');
    if (savedCoupon) {
      setCouponCode(savedCoupon);
    }
    const storedCollected = localStorage.getItem('haniu_collected_coupons');
    if (storedCollected) {
      setCollectedCodes(JSON.parse(storedCollected));
    }
    const storedUsed = localStorage.getItem('haniu_used_coupons');
    if (storedUsed) {
      setUsedCodes(JSON.parse(storedUsed));
    }
    // Fetch enabled payment methods from system config
    fetchApi('/api/v1/system-configs/payment_methods')
      .then((data) => {
        if (data?.configValue) {
          const parsed = JSON.parse(data.configValue) as PaymentMethodConfig[];
          const enabled = parsed
            .filter((m) => m.enabled)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((m) => ({ ...m, name: ALL_PAYMENT_METHODS.find(d => d.code === m.code)?.name || m.code }));
          if (enabled.length > 0) {
            setPaymentMethods(enabled);
            setPaymentMethod(enabled[0].code); // default to first enabled
          }
        }
      })
      .catch(() => {
        // Fallback: keep all methods
      });
  }, []);

  const subtotal = cart?.totalPrice || 0;

  const originalSubtotal = cart?.items.reduce((acc, item) => {
    const orig = item.originalPrice || item.unitPrice;
    return acc + orig * item.quantity;
  }, 0) || 0;

  const productDiscount = originalSubtotal - subtotal;

  const [couponWarning, setCouponWarning] = useState('');

  // Re-evaluate coupon if subtotal changes to prevent outdated discount values
  useEffect(() => {
    if (!appliedCoupon) return;
    if (subtotal === 0) {
      clearAppliedCoupon();
      return;
    }
    // Check if current subtotal still meets minOrderValue
    if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) {
      clearAppliedCoupon();
      setCouponCode('');
      setCouponWarning(`Mã "${appliedCoupon.code}" đã bị hủy vì đơn hàng chưa đạt ${appliedCoupon.minOrderValue.toLocaleString()}đ tối thiểu.`);
      setTimeout(() => setCouponWarning(''), 5000);
    } else {
      // Re-calculate discount with new subtotal
      applyCoupon(appliedCoupon.code, subtotal);
    }
  }, [subtotal]);

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    const item = cart?.items.find(i => i.id === itemId);
    if (item?.isAccessory && newQty > 1) {
      return;
    }
    if (newQty < 1) {
      handleRemoveItem(itemId);
      return;
    }
    setUpdatingItemId(itemId);
    try {
      await updateQuantity(itemId, newQty);
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật số lượng');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItemId(itemId);
    try {
      await removeItem(itemId);
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa sản phẩm');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    const res = await applyCoupon(couponCode, subtotal);
    if (res) {
      const activeDiscount = useCouponStore.getState().discountAmount;
      setCouponSuccess(`Áp dụng thành công: Giảm ${activeDiscount.toLocaleString()}đ!`);
    }
  };

  const handleQuickApply = async (code: string) => {
    setCouponCode(code);
    setCouponSuccess('');
    const res = await applyCoupon(code, subtotal);
    if (res) {
      const activeDiscount = useCouponStore.getState().discountAmount;
      setCouponSuccess(`Áp dụng thành công: Giảm ${activeDiscount.toLocaleString()}đ!`);
    }
  };

  const handleRemoveCoupon = () => {
    clearAppliedCoupon();
    setCouponCode('');
    setCouponSuccess('');
  };

  const handleAddRecommended = async (productId: string) => {
    setUpdatingItemId(productId);
    try {
      await addToCart({ productId, quantity: 1 });
      await fetchCart(); // Reload cart to reflect new pricing
    } catch (err: any) {
      alert(err.message || 'Lỗi thêm sản phẩm vào giỏ hàng');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const getProductThumbnail = (p: any) => {
    if (p.media && p.media.length > 0) {
      const thumb = p.media.find((m: any) => m.isThumbnail);
      if (thumb) return thumb.url;
      return p.media[0].url;
    }
    return p.thumbnailUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=80";
  };

  // Shipping dynamic fee & threshold calculations
  const getFreeshipThreshold = () => {
    if (shippingMethod === 'FAST') return 500000;
    if (shippingMethod === 'EXPRESS') return 1000000;
    return 300000; // STANDARD
  };

  const getShippingFee = () => {
    if (shippingMethod === 'FAST') {
      return subtotal >= 500000 ? 0 : 50000;
    }
    if (shippingMethod === 'EXPRESS') {
      return subtotal >= 1000000 ? 0 : 100000;
    }
    return subtotal >= 300000 ? 0 : 30000; // STANDARD
  };

  const getDeliveryEstimation = () => {
    if (shippingMethod === 'FAST') return trans('Dự kiến giao: 1 - 2 ngày');
    if (shippingMethod === 'EXPRESS') return trans('Hỏa tốc nhận ngay trong 2 giờ');
    return trans('Dự kiến giao: 2 - 4 ngày');
  };

  const freeShippingThreshold = getFreeshipThreshold();
  const deliveryFee = getShippingFee();
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);
  const totalSavings = productDiscount + discountAmount;

  // Check if cart has out-of-stock items or quantity exceeds stock limits
  const hasValidationErrors = cart?.items.some(
    item => (item.stock !== undefined && item.stock <= 0) || (item.stock !== undefined && item.quantity > item.stock)
  );

  // Filter out products already inside the cart
  const cartProductIds = new Set(cart?.items.map(item => item.productId) || []);
  const filteredRecommended = (recommendedProducts || [])
    .filter(p => !cartProductIds.has(p.id) && !['thiep-chuc-mung-thiet-ke-rieng', 'tui-qua-haniu-cao-cap', 'dich-vu-khac-laser-premium', 'hop-qua-go-thong-tu-nhien'].includes(p.slug))
    .slice(0, 4);

  return (
    <div className="w-full space-y-6 sm:space-y-10">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 dark:border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 font-bold text-[10px] uppercase tracking-wider">
            <Icon name="sparkles" size={10} /> Haniu E-Commerce
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{trans("Giỏ hàng của bạn")}</h1>
          <p className="text-slate-550 dark:text-zinc-400 text-sm">{trans("Quản lý các món quà ý nghĩa bạn đã chọn cho người thương")}</p>
        </div>
        {cart && cart.items.length > 0 && (
          <span className="text-xs text-slate-400 dark:text-zinc-500 mt-2 md:mt-0 font-medium">
            {trans("Có")} <strong className="text-slate-700 dark:text-zinc-300 font-bold">{cart.totalItems}</strong> {trans("sản phẩm trong giỏ hàng")}
          </span>
        )}
      </div>

      {isInitialLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">{trans("Đang tải giỏ hàng của bạn...")}</p>
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="space-y-6 sm:space-y-10">
          {/* Empty cart notification */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-16 rounded-3xl text-center space-y-6 max-w-xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Icon name="cart" size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{trans("Giỏ hàng đang trống")}</h2>
              <p className="text-slate-400 dark:text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed">
                {trans("Có vẻ như bạn chưa chọn được sản phẩm ưng ý. Hãy tiếp tục khám phá các mẫu quà tặng thiết kế độc đáo nhé!")}
              </p>
            </div>
            <Link href="/products" className="inline-block px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02]">
              {trans("Tiếp tục mua sắm")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-10">
          {/* Grid Layout for Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Cart Cards & Free Shipping Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Progress */}
              <ShippingProgressBar subtotal={subtotal} threshold={freeShippingThreshold} />

              {/* Cart List */}
              <div className="space-y-4">
                {cart.items.map(item => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    loading={loading}
                    updatingItemId={updatingItemId}
                    onUpdateQty={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Cross-sell Accessories section */}
              {accessories.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl space-y-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="gift" size={18} className="text-rose-500" />
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">{trans("Khách hàng thường mua kèm")}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {accessories.map(acc => {
                      const isAlreadyInCart = cartProductIds.has(acc.id);
                      return (
                        <div key={acc.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800/80 transition-all">
                          <img
                            src={getFullImageUrl(getProductThumbnail(acc))}
                            alt={trans(acc.name)}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-150"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-xs truncate">{trans(acc.name)}</h4>
                            <p className="text-[10px] text-slate-400 truncate">{trans(acc.shortDescription || 'Món phụ kiện ý nghĩa đi kèm')}</p>
                            <span className="text-xs font-bold text-rose-500 block mt-0.5">{(acc.basePrice || acc.price || 0).toLocaleString()}đ</span>
                          </div>
                          <button
                            type="button"
                            disabled={isAlreadyInCart || updatingItemId === acc.id}
                            onClick={() => handleAddRecommended(acc.id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                              isAlreadyInCart
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/10'
                            }`}
                          >
                            {isAlreadyInCart ? trans('Đã thêm') : trans('Thêm')}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary & Coupon Panels */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
                <h2 className="font-extrabold text-slate-800 dark:text-white text-base">{trans("Tổng đơn hàng")}</h2>

                {/* Delivery Options Selector */}
                <div className="space-y-2.5 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{trans("Chọn phương thức vận chuyển")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setShippingMethod('STANDARD')}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        shippingMethod === 'STANDARD'
                          ? 'border-rose-500 bg-rose-50/10 text-rose-500'
                          : 'border-slate-200 dark:border-zinc-800 text-slate-500'
                      }`}
                    >
                      <Icon name="truck" size={16} />
                      <span className="text-[10px] font-bold block">{trans("Tiêu chuẩn")}</span>
                      <span className="text-[9px] opacity-80">30k / Free &gt;300k</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingMethod('FAST')}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        shippingMethod === 'FAST'
                          ? 'border-rose-500 bg-rose-50/10 text-rose-500'
                          : 'border-slate-200 dark:border-zinc-800 text-slate-500'
                      }`}
                    >
                      <Icon name="zap" size={16} />
                      <span className="text-[10px] font-bold block">{trans("Giao nhanh")}</span>
                      <span className="text-[9px] opacity-80">50k / Free &gt;500k</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingMethod('EXPRESS')}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        shippingMethod === 'EXPRESS'
                          ? 'border-rose-500 bg-rose-50/10 text-rose-500'
                          : 'border-slate-200 dark:border-zinc-800 text-slate-500'
                      }`}
                    >
                      <Icon name="zap" size={16} />
                      <span className="text-[10px] font-bold block">{trans("Hỏa tốc 2h")}</span>
                      <span className="text-[9px] opacity-80">100k / Free &gt;1M</span>
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium italic mt-1.5 flex items-center gap-1">
                    <Icon name="calendar" size={12} /> {getDeliveryEstimation()}
                  </div>
                </div>

                {/* Payment Selection Box */}
                <div className="space-y-2.5 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{trans("Phương thức thanh toán")}</label>
                  <div className="space-y-2">
                    {paymentMethods.map(pm => (
                      <button
                        key={pm.code}
                        type="button"
                        onClick={() => setPaymentMethod(pm.code)}
                        className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                          paymentMethod === pm.code
                            ? 'border-rose-500 bg-rose-50/10 text-rose-500'
                            : 'border-slate-200 dark:border-zinc-800 text-slate-650 dark:text-zinc-350'
                        }`}
                      >
                        <Icon name={pm.icon} size={18} className="shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-xs block">{pm.code}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{trans(pm.name)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coupon Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{trans("Mã giảm giá")}</label>
                  {couponWarning && (
                    <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-300/50 dark:border-amber-700/40 rounded-xl text-[10px] text-amber-700 dark:text-amber-400 font-semibold animate-fade-in">
                      <span className="shrink-0 mt-0.5">⚠️</span>
                      <span>{trans(couponWarning)}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={trans("Nhập mã...")}
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 text-base md:text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 uppercase font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={loading || !couponCode.trim()}
                      className="px-4 py-2 text-xs font-bold bg-slate-800 dark:bg-zinc-800 text-white dark:text-zinc-200 rounded-xl hover:bg-slate-900 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {trans("Áp dụng")}
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 font-semibold">{trans(couponError)}</p>}
                  {couponSuccess && <p className="text-[10px] text-emerald-500 font-semibold">{trans(couponSuccess)}</p>}
                </form>

                {(() => {
                  const collectedCoupons = (coupons || []).filter(c => collectedCodes.some(code => code.toUpperCase() === c.code.toUpperCase()));
                  const availableCoupons = collectedCoupons.filter(c => !usedCodes.some(code => code.toUpperCase() === c.code.toUpperCase()));
                  const usedCoupons = collectedCoupons.filter(c => usedCodes.some(code => code.toUpperCase() === c.code.toUpperCase()));

                  return (
                    <>
                      {/* Available Coupons list */}
                      <div className="space-y-3 pt-2 pb-4 border-b border-slate-100 dark:border-zinc-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{trans("Mã giảm giá khả dụng")}</span>
                        {availableCoupons.length > 0 ? (
                          <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1 animate-fade-in">
                            {availableCoupons.map(c => {
                              const isUnavailable = c.minOrderValue && subtotal < c.minOrderValue;
                              return (
                                <div
                                  key={c.code}
                                  className={`p-2.5 rounded-xl border border-dashed flex justify-between items-center text-xs transition-colors ${
                                    isUnavailable
                                      ? 'border-slate-250 dark:border-zinc-850 bg-slate-50/20 dark:bg-zinc-950/10 opacity-60'
                                      : 'border-slate-200 dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-950/20'
                                  }`}
                                >
                                  <div className="space-y-1 pr-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] ${
                                        isUnavailable
                                          ? 'bg-slate-200 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
                                          : 'bg-rose-500/10 text-rose-500'
                                      }`}>
                                        {c.code}
                                      </span>
                                      <span className="font-bold text-slate-700 dark:text-zinc-300">
                                        {c.discountType === 'PERCENT' ? `${trans("Giảm")} ${c.discountValue}%` : `${trans("Giảm")} ${Number(c.discountValue).toLocaleString()}đ`}
                                      </span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-medium leading-tight">
                                      {trans(c.description) || (c.minOrderValue ? `${trans("Đơn tối thiểu")} ${Number(c.minOrderValue).toLocaleString()}đ` : trans('Tất cả đơn hàng'))}
                                    </p>
                                  </div>
                                  {!isUnavailable && (
                                    <button
                                      onClick={() => handleQuickApply(c.code)}
                                      type="button"
                                      className="px-2.5 py-1 text-[10px] font-bold text-slate-800 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-rose-500 hover:text-rose-500 dark:text-white rounded-lg cursor-pointer transition-all shrink-0 shadow-sm"
                                    >
                                      {trans("Áp dụng")}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 font-medium italic px-2">{trans("Không có mã giảm giá nào khả dụng.")}</p>
                        )}
                      </div>

                      {/* Used Coupons list */}
                      {usedCoupons.length > 0 && (
                        <div className="space-y-3 pt-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                          <button
                            type="button"
                            onClick={() => setIsUsedCouponsOpen(!isUsedCouponsOpen)}
                            className="w-full flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider cursor-pointer select-none"
                          >
                            <span>{trans("Voucher đã được sử dụng")} ({usedCoupons.length})</span>
                            <span className="text-slate-400 dark:text-zinc-500">
                              <Icon name={isUsedCouponsOpen ? "chevron-up" : "chevron-down"} size={10} />
                            </span>
                          </button>
                          
                          {isUsedCouponsOpen && (
                            <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1 opacity-70 animate-fade-in">
                              {usedCoupons.map(c => (
                                <div
                                  key={c.code}
                                  className="p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-950/20 flex justify-between items-center text-xs"
                                >
                                  <div className="space-y-1 pr-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
                                        {c.code}
                                      </span>
                                      <span className="font-bold text-slate-450 line-through dark:text-zinc-550">
                                        {c.discountType === 'PERCENT' ? `${trans("Giảm")} ${c.discountValue}%` : `${trans("Giảm")} ${Number(c.discountValue).toLocaleString()}đ`}
                                      </span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-medium leading-tight">
                                      {trans(c.description) || (c.minOrderValue ? `${trans("Đơn tối thiểu")} ${Number(c.minOrderValue).toLocaleString()}đ` : trans('Tất cả đơn hàng'))}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-450 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-lg shrink-0">
                                    {trans("Đã được sử dụng")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                    <span>{trans("Tạm tính (Giá gốc)")}</span>
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">{originalSubtotal.toLocaleString()}đ</span>
                  </div>
                  {productDiscount > 0 && (
                    <div className="flex justify-between text-rose-500 font-semibold">
                      <span>{trans("Giảm giá sản phẩm")}</span>
                      <span>-{productDiscount.toLocaleString()}đ</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-semibold">
                      <span>{trans("Giảm giá từ Voucher")}</span>
                      <span>-{discountAmount.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                    <span>{trans("Phí vận chuyển")} ({shippingMethod === 'FAST' ? trans('Nhanh') : (shippingMethod === 'EXPRESS' ? trans('Hỏa tốc') : trans('Thường'))})</span>
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-500 font-medium">{trans("Miễn phí")}</span>
                      ) : (
                        `${deliveryFee.toLocaleString()}đ`
                      )}
                    </span>
                  </div>

                  {/* Applied coupon badge */}
                  {discountAmount > 0 && appliedCoupon && (
                    <div className="flex justify-between items-center bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] animate-fade-in">
                      <div className="font-bold flex items-center gap-1">
                        <Icon name="check" size={10} />
                        {trans("Đã áp dụng:")} {appliedCoupon.code}
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        type="button"
                        className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-600 transition-colors cursor-pointer"
                        title={trans("Gỡ coupon")}
                      >
                        <Icon name="close" size={8} />
                      </button>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="flex justify-between font-bold text-sm text-slate-800 dark:text-white border-t border-slate-100 dark:border-zinc-800 pt-4">
                    <span>{trans("Tổng tiền")}</span>
                    <div className="text-right">
                      <span className="text-rose-500 font-extrabold text-lg block">{total.toLocaleString()}đ</span>
                      {totalSavings > 0 && (
                        <span className="text-[10px] text-emerald-500 font-bold block bg-emerald-500/5 px-2 py-0.5 rounded-full inline-block mt-1">
                          🎉 {trans("Đã tiết kiệm")} -{totalSavings.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                {hasValidationErrors ? (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="block w-full py-3.5 bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-650 text-center font-bold text-xs rounded-xl cursor-not-allowed"
                    >
                      {trans("Tiến hành đặt hàng")}
                    </button>
                    <p className="text-[9px] text-red-500 text-center font-semibold">
                      {trans("Vui lòng điều chỉnh số lượng hoặc xóa sản phẩm không khả dụng để tiếp tục.")}
                    </p>
                  </div>
                ) : (
                  <Link
                    href={{
                      pathname: '/checkout',
                      query: {
                        ...(cart.id && cart.id !== 'guest-cart' ? { cartId: cart.id } : {}),
                        coupon: discountAmount > 0 && appliedCoupon ? appliedCoupon.code : '',
                        shippingMethod: shippingMethod,
                        paymentMethod: paymentMethod
                      }
                    }}
                    className="block w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white text-center font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02]"
                  >
                    {trans("Tiến hành đặt hàng")}
                  </Link>
                )}

                <div className="pt-2 text-center">
                  <Link href="/products" className="text-[10px] text-slate-400 dark:text-zinc-550 hover:text-rose-500 hover:underline font-bold transition-colors">
                    ← {trans("Tiếp tục mua sắm")}
                  </Link>
                </div>
              </div>

              {/* Fast Purchasing Trust Policies */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-5 rounded-3xl space-y-3.5 shadow-sm text-xs">
                <h4 className="font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[10px] pb-2 border-b border-slate-50 dark:border-zinc-800 flex items-center gap-1.5">
                  <Icon name="shield" size={12} className="text-rose-500" /> {trans("Cam kết mua sắm tại Haniu")}
                </h4>
                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none text-rose-500"><Icon name="truck" size={16} /></span>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-zinc-300 block">{trans("Miễn phí vận chuyển")}</span>
                    <span className="text-slate-400 text-[10px] block leading-normal">{trans("Mọi đơn hàng từ 300k, giao siêu nhanh toàn quốc.")}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none text-rose-500"><Icon name="lock" size={16} /></span>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-zinc-300 block">{trans("Thanh toán an toàn")}</span>
                    <span className="text-slate-400 text-[10px] block leading-normal">{trans("Bảo mật thông tin ngân hàng và thẻ 100%.")}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none text-rose-500"><Icon name="gift" size={16} /></span>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-zinc-300 block">{trans("Đổi trả 7 ngày")}</span>
                    <span className="text-slate-400 text-[10px] block leading-normal">{trans("Đổi mới hoàn toàn nếu sản phẩm có lỗi sản xuất.")}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none text-rose-500"><Icon name="check" size={16} /></span>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-zinc-300 block">{trans("Đồng kiểm hàng trước")}</span>
                    <span className="text-slate-400 text-[10px] block leading-normal">{trans("Nhận hàng, kiểm tra chất lượng rồi mới thanh toán.")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Bottom Column: Recommended products */}
          {filteredRecommended && filteredRecommended.length > 0 && (
            <div className="space-y-6 pt-10 border-t border-slate-100 dark:border-zinc-800/80">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Icon name="sparkles" size={16} className="text-rose-500" /> {trans("Quà tặng độc đáo nổi bật khác")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {filteredRecommended.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
