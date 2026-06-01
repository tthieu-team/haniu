import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Chính sách Bảo mật - Haniu Gifting',
  description: 'Chính sách bảo mật thông tin khách hàng tại Haniu.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-rose-500 transition-colors">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-600 dark:text-zinc-300">Chính sách bảo mật</span>
      </nav>

      {/* Main Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-12 border border-slate-100 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />

        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            Chính sách Bảo mật
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
            Cập nhật lần cuối: Ngày 26 tháng 05 năm 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">1.</span> Thu thập thông tin cá nhân
            </h2>
            <p>
              Haniu tôn trọng quyền riêng tư của bạn và cam kết bảo vệ dữ liệu cá nhân của bạn. Chúng tôi thu thập thông tin của bạn khi bạn sử dụng dịch vụ của chúng tôi:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Thông tin liên hệ: Họ tên, email, số điện thoại, địa chỉ nhận quà.</li>
              <li>Thông tin tài khoản: Email đăng ký, mật khẩu đã mã hóa.</li>
              <li>Nội dung cá nhân hóa: Hình ảnh tải lên in trên hộp quà, nội dung thiệp chúc mừng, thông số cài đặt photobooth.</li>
              <li>Dữ liệu duyệt web: Địa chỉ IP, loại trình duyệt, cookies để cải thiện trải nghiệm sử dụng.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">2.</span> Cách thức sử dụng thông tin
            </h2>
            <p>
              Thông tin thu thập được sử dụng cho các mục đích hợp pháp sau:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Xử lý và vận chuyển đơn hàng quà tặng của bạn.</li>
              <li>Gửi email xác thực OTP tài khoản hoặc liên kết bảo mật.</li>
              <li>Cá nhân hóa sản phẩm quà tặng dựa trên ảnh và yêu cầu khắc chữ bạn cung cấp.</li>
              <li>Cải thiện dịch vụ và phát triển các sản phẩm mới dựa trên phản hồi của khách hàng.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">3.</span> Bảo mật thông tin khách hàng
            </h2>
            <p>
              Tất cả thông tin khách hàng đều được mã hóa bằng giao thức SSL/TLS khi truyền tải. Dữ liệu mật khẩu của bạn được băm và mã hóa an toàn (BCrypt) trong cơ sở dữ liệu của chúng tôi. Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn với bên thứ ba vì mục đích tiếp thị bên ngoài khi chưa được sự đồng ý của bạn.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">4.</span> Quyền của người dùng
            </h2>
            <p>
              Bạn hoàn toàn có quyền truy cập, chỉnh sửa, yêu cầu xuất dữ liệu hoặc yêu cầu xóa tài khoản cùng toàn bộ thông tin cá nhân khỏi hệ thống của Haniu bất kỳ lúc nào bằng cách liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">5.</span> Liên hệ
            </h2>
            <p>
              Mọi thắc mắc hoặc yêu cầu liên quan đến chính sách bảo mật này, xin vui lòng gửi email về: <strong className="text-rose-500">tthieu.dev.02@gmail.com</strong>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
          <Link href="/auth/register" className="font-bold text-xs text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1.5">
            ← Trở lại đăng ký
          </Link>
          <Link href="/terms" className="font-bold text-xs text-slate-400 dark:text-zinc-500 hover:text-rose-500 transition-colors">
            Điều khoản dịch vụ →
          </Link>
        </div>
      </div>
    </div>
  );
}
