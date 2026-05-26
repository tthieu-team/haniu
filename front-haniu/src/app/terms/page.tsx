import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Điều khoản Dịch vụ - Haniu Gifting',
  description: 'Các điều khoản sử dụng dịch vụ của cửa hàng quà tặng cao cấp Haniu.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-rose-500 transition-colors">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600 dark:text-zinc-300">Điều khoản dịch vụ</span>
      </nav>

      {/* Main Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-12 border border-slate-100 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />

        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            Điều khoản Dịch vụ
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
            Cập nhật lần cuối: Ngày 26 tháng 05 năm 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">1.</span> Giới thiệu
            </h2>
            <p>
              Chào mừng bạn đến với <strong>Haniu Gifting</strong> (haniu.vn). Khi bạn truy cập, đăng ký tài khoản hoặc mua sắm sản phẩm dịch vụ của chúng tôi, bạn đã đồng ý và chịu sự ràng buộc bởi các điều khoản sử dụng dưới đây. Vui lòng đọc kỹ trước khi bắt đầu.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">2.</span> Đăng ký và Bảo mật tài khoản
            </h2>
            <p>
              Để thực hiện các chức năng cá nhân hóa quà tặng, tích điểm mua hàng và lưu lịch sử giao dịch, bạn cần đăng ký một tài khoản thành viên thông qua quy trình xác thực email (OTP).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Bạn phải cung cấp địa chỉ email chính xác và đang hoạt động để nhận mã OTP.</li>
              <li>Bạn có trách nhiệm bảo mật mật khẩu tài khoản cá nhân.</li>
              <li>Haniu có quyền tạm khóa hoặc xóa tài khoản nếu phát hiện bất kỳ dấu hiệu gian lận hoặc vi phạm chính sách của chúng tôi.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">3.</span> Dịch vụ cá nhân hóa &amp; Quà tặng độc quyền
            </h2>
            <p>
              Chúng tôi cung cấp các tùy chọn cá nhân hóa quà tặng (ví dụ: tải ảnh in lên hộp quà, khắc chữ, thiết kế photobooth).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Hình ảnh tải lên phải thuộc quyền sở hữu hợp pháp của bạn và không vi phạm pháp luật hiện hành.</li>
              <li>Hợp đồng mua bán được xác lập kể từ khi chúng tôi gửi email xác nhận đặt hàng và nhận thanh toán đặt cọc.</li>
              <li>Vì tính chất sản phẩm là cá nhân hóa theo yêu cầu riêng, đơn hàng cá nhân hóa sau khi sản xuất sẽ không hỗ trợ đổi trả nếu không do lỗi sản xuất.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">4.</span> Chính sách thanh toán và giao hàng
            </h2>
            <p>
              Haniu hỗ trợ đa dạng phương thức thanh toán chuyển khoản và các ví điện tử. Hàng hóa sẽ được vận chuyển qua các đối tác logistics uy tín đến tận tay người nhận quà mà bạn chỉ định.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">5.</span> Thay đổi điều khoản
            </h2>
            <p>
              Chúng tôi có quyền sửa đổi hoặc thay đổi các điều khoản dịch vụ này bất cứ lúc nào mà không cần thông báo trước. Việc tiếp tục sử dụng website sau khi cập nhật điều khoản đồng nghĩa với việc bạn chấp nhận những thay đổi đó.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
          <Link href="/auth/register" className="font-bold text-xs text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1.5">
            ← Trở lại đăng ký
          </Link>
          <Link href="/privacy" className="font-bold text-xs text-slate-400 dark:text-zinc-500 hover:text-rose-500 transition-colors">
            Chính sách bảo mật →
          </Link>
        </div>
      </div>
    </div>
  );
}
