package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

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
}
