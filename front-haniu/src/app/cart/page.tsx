'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { useCouponStore } from '@/store/coupon';
import Link from 'next/link';
import Icon from '@/components/common/Icons';

export default function CartPage() {
  const { cart, loading, fetchCart, updateQuantity, removeItem } = useCartStore();
  const { appliedCoupon, discountAmount, error: couponError, applyCoupon } = useCouponStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const loadCart = async () => {
    const res = await fetchCart();
    if (!res) {
      // Mock data for preview/fallback
      useCartStore.setState({
        cart: {
          id: "cart-mock-123",
          totalItems: 2,
          totalPrice: 670000,
          items: [
            {
              id: "ci-1",
              productId: "prod-1",
              productName: "Hộp Quà Lãng Mạn - Eternal Love",
              productSlug: "eternal-love-giftbox",
              variantId: "var-1",
              variantName: "Standard",
              imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=80",
              quantity: 1,
              unitPrice: 490000,
              totalPrice: 490000,
              customizationInfo: '{"text":"Chúc mừng sinh nhật Trang"}'
            },
            {
              id: "ci-2",
              productId: "prod-2",
              productName: "Ly Sứ Cao Cấp Men Hỏa Biến",
              productSlug: "fire-glaze-ceramic-cup",
              imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&q=80",
              quantity: 1,
              unitPrice: 180000,
              totalPrice: 180000
            }
          ]
        }
      });
    }
  };

  useEffect(() => {
    loadCart();
    const savedCoupon = localStorage.getItem('haniu_active_coupon');
    if (savedCoupon) {
      setCouponCode(savedCoupon);
    }
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      await updateQuantity(itemId, newQty);
    } catch (err) {
      // Mock local state update
      if (cart) {
        const updatedItems = cart.items.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty
            };
          }
          return item;
        });
        const totalItems = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
        const totalPrice = updatedItems.reduce((acc, i) => acc + i.totalPrice, 0);
        useCartStore.setState({ cart: { ...cart, items: updatedItems, totalItems, totalPrice } });
      }
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Xóa sản phẩm này khỏi giỏ hàng?')) return;
    try {
      await removeItem(itemId);
    } catch (err) {
      if (cart) {
        const updatedItems = cart.items.filter(item => item.id !== itemId);
        const totalItems = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
        const totalPrice = updatedItems.reduce((acc, i) => acc + i.totalPrice, 0);
        useCartStore.setState({ cart: { ...cart, items: updatedItems, totalItems, totalPrice } });
      }
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    const subtotal = cart?.totalPrice || 0;
    const res = await applyCoupon(couponCode, subtotal);
    if (res) {
      const activeDiscount = useCouponStore.getState().discountAmount;
      setCouponSuccess(`Áp dụng mã giảm giá thành công: Giảm ${activeDiscount.toLocaleString()}đ!`);
    } else {
      // Local check fallback simulation
      if (couponCode.toUpperCase() === 'HANIUNEW') {
        const discount = subtotal * 0.1;
        useCouponStore.setState({
          appliedCoupon: {
            code: 'HANIUNEW',
            name: 'Chào bạn mới',
            discountType: 'PERCENT',
            discountValue: 10,
            active: true
          },
          discountAmount: discount,
          error: null
        });
        setCouponSuccess(`Áp dụng mã HANIUNEW thành công: Giảm ${discount.toLocaleString()}đ!`);
        localStorage.setItem('haniu_active_coupon', 'HANIUNEW');
      }
    }
  };

  const subtotal = cart?.totalPrice || 0;
  const deliveryFee = subtotal > 300000 ? 0 : 30000;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Giỏ hàng của bạn</h1>
        <p className="text-slate-400 text-xs mt-1">Quản lý các món quà ý nghĩa bạn đã chọn cho người thương</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">Đang tải giỏ hàng của bạn...</div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-12 rounded-3xl text-center space-y-4">
          <p className="text-slate-400 text-sm">Giỏ hàng của bạn đang trống.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition-all">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 flex gap-4 items-center"
              >
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=80"}
                  alt={item.productName}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 line-clamp-1">{item.productName}</h3>
                  {item.variantName && (
                    <span className="inline-block bg-slate-50 dark:bg-zinc-800 text-[10px] text-slate-500 px-2 py-0.5 rounded font-medium border border-slate-100 dark:border-zinc-700">
                      Biến thể: {item.variantName}
                    </span>
                  )}
                  {item.customizationInfo && (
                    <div className="text-[10px] text-rose-500/90 font-medium flex items-center gap-1">
                      <Icon name="🎨" size={12} /> Cá nhân hóa: {item.customizationInfo}
                    </div>
                  )}
                  <div className="font-extrabold text-sm text-rose-500">{(item.unitPrice).toLocaleString()}đ</div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
                  >
                    <Icon name="minus" size={12} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
                  >
                    <Icon name="plus" size={12} />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center ml-2 cursor-pointer"
                  >
                    <Icon name="close" size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart totals and coupons */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 h-fit space-y-6">
            <h2 className="font-bold text-slate-800 dark:text-white text-base">Tổng đơn hàng</h2>

            {/* Coupon Application */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pb-4 border-b border-slate-100 dark:border-zinc-800">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Mã giảm giá</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã..."
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 text-base md:text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 uppercase font-semibold text-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-xl hover:bg-slate-900"
                >
                  Áp dụng
                </button>
              </div>
              {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-500 font-semibold">{couponSuccess}</p>}
            </form>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Phí vận chuyển</span>
                <span>{deliveryFee === 0 ? 'Miễn phí' : `${deliveryFee.toLocaleString()}đ`}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Giảm giá coupon</span>
                  <span>-{discountAmount.toLocaleString()}đ</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-800 dark:text-white border-t border-slate-100 dark:border-zinc-800 pt-3">
                <span>Tổng tiền</span>
                <span className="text-rose-500 font-extrabold text-base">{total.toLocaleString()}đ</span>
              </div>
            </div>

            <Link
              href={{
                pathname: '/checkout',
                query: { cartId: cart.id, coupon: discountAmount > 0 ? couponCode : '' }
              }}
              className="block w-full py-3 bg-rose-500 hover:bg-rose-600 text-white text-center font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition-all"
            >
              Tiến hành đặt hàng
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
