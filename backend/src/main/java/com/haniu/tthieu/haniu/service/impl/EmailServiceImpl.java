package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;


@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:tthieu.dev.02@gmail.com}")
    private String fromEmail;

    @Override
    public void sendVerificationCode(String to, String code) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            String htmlMsg = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc;\">" +
                    "  <div style=\"background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;\">" +
                    "    <div style=\"text-align: center; margin-bottom: 30px;\">" +
                    "      <h2 style=\"color: #f43f5e; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;\">HANIU Gifting</h2>" +
                    "      <p style=\"color: #64748b; font-size: 14px; margin-top: 5px;\">Trải nghiệm mua sắm quà tặng đặc quyền</p>" +
                    "    </div>" +
                    "    <h3 style=\"color: #0f172a; font-size: 20px; font-weight: 700; margin-bottom: 20px;\">Xác thực tài khoản của bạn</h3>" +
                    "    <p style=\"color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 30px;\">" +
                    "      Chào mừng bạn đến với <strong>Haniu</strong>! Để hoàn tất quá trình đăng ký tài khoản, vui lòng nhập mã OTP xác thực dưới đây. Mã này có hiệu lực trong vòng <strong>5 phút</strong>." +
                    "    </p>" +
                    "    <div style=\"text-align: center; margin: 30px 0;\">" +
                    "      <div style=\"display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%); padding: 18px 40px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.2);\">" +
                    "        <span style=\"font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 6px; font-family: monospace;\">" + code + "</span>" +
                    "      </div>" +
                    "    </div>" +
                    "    <p style=\"color: #94a3b8; font-size: 12px; line-height: 1.5; text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px;\">" +
                    "      Nếu bạn không yêu cầu đăng ký tài khoản này, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ.<br/>" +
                    "      &copy; 2026 Haniu. All rights reserved." +
                    "    </p>" +
                    "  </div>" +
                    "</div>";

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("[Haniu] Mã xác thực tài khoản OTP - " + code);
            helper.setText(htmlMsg, true);

            mailSender.send(mimeMessage);
            log.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send verification email to: " + to, e);
            throw new RuntimeException("Không thể gửi email xác thực. Vui lòng kiểm tra lại cấu hình email.");
        }
    }

    @Override
    public void sendPasswordResetCode(String to, String code) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            String htmlMsg = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc;\">" +
                    "  <div style=\"background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;\">" +
                    "    <div style=\"text-align: center; margin-bottom: 30px;\">" +
                    "      <h2 style=\"color: #f43f5e; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;\">HANIU Gifting</h2>" +
                    "      <p style=\"color: #64748b; font-size: 14px; margin-top: 5px;\">Trải nghiệm mua sắm quà tặng đặc quyền</p>" +
                    "    </div>" +
                    "    <h3 style=\"color: #0f172a; font-size: 20px; font-weight: 700; margin-bottom: 20px;\">Đặt lại mật khẩu tài khoản</h3>" +
                    "    <p style=\"color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 30px;\">" +
                    "      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Haniu của bạn. Vui lòng nhập mã OTP dưới đây để tiến hành thiết lập mật khẩu mới. Mã này có hiệu lực trong vòng <strong>5 phút</strong>." +
                    "    </p>" +
                    "    <div style=\"text-align: center; margin: 30px 0;\">" +
                    "      <div style=\"display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%); padding: 18px 40px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.2);\">" +
                    "        <span style=\"font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 6px; font-family: monospace;\">" + code + "</span>" +
                    "      </div>" +
                    "    </div>" +
                    "    <p style=\"color: #94a3b8; font-size: 12px; line-height: 1.5; text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px;\">" +
                    "      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ bảo mật.<br/>" +
                    "      &copy; 2026 Haniu. All rights reserved." +
                    "    </p>" +
                    "  </div>" +
                    "</div>";

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("[Haniu] Mã đặt lại mật khẩu OTP - " + code);
            helper.setText(htmlMsg, true);

            mailSender.send(mimeMessage);
            log.info("Password reset email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: " + to, e);
            throw new RuntimeException("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.");
        }
    }

    @Override
    public void sendOrderConfirmation(String to, com.haniu.tthieu.haniu.dto.OrderResponseDto order) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            String htmlMsg = buildOrderConfirmationHtml(order);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("[Haniu] Xác nhận đơn hàng thành công #" + order.getOrderCode());
            helper.setText(htmlMsg, true);

            mailSender.send(mimeMessage);
            log.info("Order confirmation email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email to: " + to, e);
            throw new RuntimeException("Không thể gửi email xác nhận đơn hàng.");
        }
    }

    private String buildOrderConfirmationHtml(com.haniu.tthieu.haniu.dto.OrderResponseDto order) {
        StringBuilder itemsHtml = new StringBuilder();
        for (com.haniu.tthieu.haniu.dto.OrderResponseDto.OrderItemResponseDto item : order.getItems()) {
            String thumbnail = item.getProductThumbnail();
            if (thumbnail == null || thumbnail.isEmpty()) {
                thumbnail = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80";
            }
            String variantText = item.getVariantName() != null ? "<div style=\"color: #64748b; font-size: 11px; margin-top: 2px;\">Phân loại: " + item.getVariantName() + "</div>" : "";
            String customizationText = (item.getCustomizationInfo() != null && !item.getCustomizationInfo().trim().isEmpty()) 
                    ? "<div style=\"color: #e11d48; font-size: 11px; margin-top: 2px; font-style: italic; background-color: #fff1f2; padding: 2px 6px; border-radius: 4px; display: inline-block;\">Cá nhân hóa: " + item.getCustomizationInfo() + "</div>" 
                    : "";

            itemsHtml.append("<tr>")
                    .append("  <td style=\"padding: 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; width: 60px;\">")
                    .append("    <img src=\"").append(thumbnail).append("\" style=\"width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;\" />")
                    .append("  </td>")
                    .append("  <td style=\"padding: 12px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: top;\">")
                    .append("    <div style=\"color: #0f172a; font-weight: 600; font-size: 14px;\">").append(item.getProductName()).append("</div>")
                    .append("    ").append(variantText)
                    .append("    ").append(customizationText)
                    .append("  </td>")
                    .append("  <td style=\"padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #475569; font-size: 13px; vertical-align: top;\">")
                    .append("    x").append(item.getQuantity())
                    .append("  </td>")
                    .append("  <td style=\"padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: 600; font-size: 13px; vertical-align: top;\">")
                    .append("    ").append(formatCurrency(item.getTotalPrice()))
                    .append("  </td>")
                    .append("</tr>");
        }

        String fullAddress = order.getShippingAddressLine() + ", " + order.getShippingWard() + ", " + order.getShippingDistrict() + ", " + order.getShippingProvince();
        String formattedDate = order.getOrderedAt() != null 
                ? order.getOrderedAt().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) 
                : "";

        return "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px 10px; background-color: #f8fafc;\">" +
                "  <div style=\"background-color: #ffffff; padding: 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;\">" +
                "    <!-- Header -->" +
                "    <div style=\"text-align: center; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;\">" +
                "      <h2 style=\"color: #f43f5e; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;\">HANIU Gifting</h2>" +
                "      <p style=\"color: #64748b; font-size: 13px; margin: 5px 0 0 0;\">Cảm ơn bạn đã lựa chọn Haniu Shop</p>" +
                "    </div>" +
                "    " +
                "    <!-- Success Banner -->" +
                "    <div style=\"background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 15px; text-align: center; margin-bottom: 25px;\">" +
                "      <span style=\"color: #15803d; font-weight: 700; font-size: 16px;\">Đặt hàng thành công!</span>" +
                "      <p style=\"color: #166534; font-size: 13px; margin: 5px 0 0 0;\">Mã đơn hàng của bạn là <strong>" + order.getOrderCode() + "</strong></p>" +
                "    </div>" +
                "    " +
                "    <!-- Order Info -->" +
                "    <div style=\"margin-bottom: 25px;\">" +
                "      <h4 style=\"color: #0f172a; font-size: 15px; margin: 0 0 12px 0; border-left: 3px solid #f43f5e; padding-left: 8px;\">Thông tin đơn hàng</h4>" +
                "      <table style=\"width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;\">" +
                "        <tr>" +
                "          <td style=\"padding: 4px 0; width: 40%;\">Thời gian đặt hàng:</td>" +
                "          <td style=\"padding: 4px 0; color: #0f172a; font-weight: 600;\">" + formattedDate + "</td>" +
                "        </tr>" +
                "        <tr>" +
                "          <td style=\"padding: 4px 0;\">Phương thức thanh toán:</td>" +
                "          <td style=\"padding: 4px 0; color: #0f172a; font-weight: 600;\">" + translatePaymentMethod(order.getPaymentMethod()) + "</td>" +
                "        </tr>" +
                "        <tr>" +
                "          <td style=\"padding: 4px 0;\">Phương thức vận chuyển:</td>" +
                "          <td style=\"padding: 4px 0; color: #0f172a; font-weight: 600;\">" + translateShippingMethod(order.getShippingMethod()) + "</td>" +
                "        </tr>" +
                "      </table>" +
                "    </div>" +
                "    " +
                "    <!-- Shipping Address -->" +
                "    <div style=\"margin-bottom: 25px;\">" +
                "      <h4 style=\"color: #0f172a; font-size: 15px; margin: 0 0 12px 0; border-left: 3px solid #f43f5e; padding-left: 8px;\">Thông tin giao hàng</h4>" +
                "      <div style=\"background-color: #f8fafc; border-radius: 12px; padding: 15px; border: 1px solid #e2e8f0; font-size: 13px; line-height: 1.6; color: #334155;\">" +
                "        <div style=\"font-weight: 700; color: #0f172a; margin-bottom: 4px;\">" + order.getCustomerName() + "</div>" +
                "        <div>Số điện thoại: " + order.getCustomerPhone() + "</div>" +
                "        <div style=\"margin-top: 4px;\">Địa chỉ: " + fullAddress + "</div>" +
                "        " + (order.getNote() != null && !order.getNote().trim().isEmpty() ? "<div style=\"margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1; color: #64748b; font-style: italic;\">Ghi chú: " + order.getNote() + "</div>" : "") +
                "      </div>" +
                "    </div>" +
                "    " +
                "    <!-- Item Details -->" +
                "    <div style=\"margin-bottom: 25px;\">" +
                "      <h4 style=\"color: #0f172a; font-size: 15px; margin: 0 0 8px 0; border-left: 3px solid #f43f5e; padding-left: 8px;\">Sản phẩm đã chọn</h4>" +
                "      <table style=\"width: 100%; border-collapse: collapse;\">" +
                "        <thead>" +
                "          <tr style=\"border-bottom: 2px solid #e2e8f0; text-align: left; font-size: 12px; color: #64748b;\">" +
                "            <th colspan=\"2\" style=\"padding: 8px 0; font-weight: 600;\">Sản phẩm</th>" +
                "            <th style=\"padding: 8px; text-align: center; font-weight: 600;\">SL</th>" +
                "            <th style=\"padding: 8px 0; text-align: right; font-weight: 600;\">Tổng</th>" +
                "          </tr>" +
                "        </thead>" +
                "        <tbody>" +
                "          " + itemsHtml.toString() +
                "        </tbody>" +
                "      </table>" +
                "    </div>" +
                "    " +
                "    <!-- Price Summary -->" +
                "    <div style=\"border-top: 2px solid #e2e8f0; padding-top: 15px; margin-bottom: 25px;\">" +
                "      <table style=\"width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;\">" +
                "        <tr>" +
                "          <td style=\"padding: 6px 0;\">Tạm tính:</td>" +
                "          <td style=\"padding: 6px 0; text-align: right; color: #0f172a;\">" + formatCurrency(order.getSubtotalPrice()) + "</td>" +
                "        </tr>" +
                "        " + (order.getDiscountAmount() != null && order.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0 ? "<tr><td style=\"padding: 6px 0; color: #e11d48;\">Giảm giá:</td><td style=\"padding: 6px 0; text-align: right; color: #e11d48; font-weight: 600;\">-" + formatCurrency(order.getDiscountAmount()) + "</td></tr>" : "") +
                "        <tr>" +
                "          <td style=\"padding: 6px 0;\">Phí vận chuyển:</td>" +
                "          <td style=\"padding: 6px 0; text-align: right; color: #0f172a;\">" + formatCurrency(order.getShippingFee()) + "</td>" +
                "        </tr>" +
                "        <tr style=\"font-size: 16px; font-weight: 700; border-top: 1px solid #e2e8f0;\">" +
                "          <td style=\"padding: 12px 0 0 0; color: #0f172a;\">Tổng cộng:</td>" +
                "          <td style=\"padding: 12px 0 0 0; text-align: right; color: #f43f5e;\">" + formatCurrency(order.getTotalPrice()) + "</td>" +
                "        </tr>" +
                "      </table>" +
                "    </div>" +
                "    " +
                "    <!-- Footer -->" +
                "    <p style=\"color: #94a3b8; font-size: 12px; line-height: 1.5; text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;\">" +
                "      Haniu Gifting - Trao quà tặng, gửi yêu thương.<br/>" +
                "      Website: <a href=\"https://haniu.vercel.app\" style=\"color: #f43f5e; text-decoration: none;\">haniu.vercel.app</a><br/>" +
                "      &copy; 2026 Haniu. All rights reserved." +
                "    </p>" +
                "  </div>" +
                "</div>";
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "0 đ";
        java.text.DecimalFormatSymbols symbols = new java.text.DecimalFormatSymbols(java.util.Locale.forLanguageTag("vi-VN"));
        java.text.DecimalFormat formatter = new java.text.DecimalFormat("#,###", symbols);
        return formatter.format(amount) + " đ";
    }

    private String translatePaymentMethod(String method) {
        if (method == null) return "";
        switch (method.toUpperCase()) {
            case "COD": return "Thanh toán khi nhận hàng (COD)";
            case "VNPAY": return "Thanh toán trực tuyến qua VNPAY";
            case "MOMO": return "Ví điện tử Momo";
            default: return method;
        }
    }

    private String translateShippingMethod(String method) {
        if (method == null) return "";
        switch (method.toUpperCase()) {
            case "STANDARD": return "Giao hàng tiêu chuẩn";
            case "FAST": return "Giao hàng nhanh";
            case "EXPRESS": return "Giao hàng hỏa tốc";
            default: return method;
        }
    }
}

