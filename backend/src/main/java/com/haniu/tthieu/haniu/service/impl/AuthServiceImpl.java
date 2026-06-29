package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.dto.LoginRequestDto;
import com.haniu.tthieu.haniu.dto.RegisterRequestDto;
import com.haniu.tthieu.haniu.dto.TokenResponseDto;
import com.haniu.tthieu.haniu.dto.VerifyEmailRequestDto;
import com.haniu.tthieu.haniu.dto.ResendOtpRequestDto;
import com.haniu.tthieu.haniu.dto.ForgotPasswordRequestDto;
import com.haniu.tthieu.haniu.dto.ResetPasswordRequestDto;
import com.haniu.tthieu.haniu.entity.enums.Role;
import com.haniu.tthieu.haniu.entity.enums.UserStatus;
import com.haniu.tthieu.haniu.entity.user.RefreshToken;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.entity.user.VerificationCode;
import com.haniu.tthieu.haniu.repository.RefreshTokenRepository;
import com.haniu.tthieu.haniu.repository.UserRepository;
import com.haniu.tthieu.haniu.repository.VerificationCodeRepository;
import com.haniu.tthieu.haniu.security.JwtTokenProvider;
import com.haniu.tthieu.haniu.service.AuthService;
import com.haniu.tthieu.haniu.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final HttpServletRequest httpServletRequest;


    private boolean isVerificationRequired() {
        try {
            String headerVal = httpServletRequest.getHeader("X-Require-Verification");
            log.info("Received X-Require-Verification header: {}", headerVal);
            if (headerVal != null) {
                return Boolean.parseBoolean(headerVal);
            }
        } catch (Exception e) {
            log.warn("Failed to read X-Require-Verification header: {}", e.getMessage());
        }
        return true;
    }


    @Override
    public TokenResponseDto register(RegisterRequestDto request) {
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        User user;
        boolean requireVerification = isVerificationRequired();

        if (existingUserOpt.isPresent()) {
            User existing = existingUserOpt.get();
            if (existing.getStatus() == UserStatus.ACTIVE) {
                throw new RuntimeException("Email is already in use");
            }
            // If status is PENDING
            existing.setFullName(request.getFullName());
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
            existing.setPhone(request.getPhone());
            if (requireVerification) {
                user = userRepository.save(existing);
                saveAndSendOtp(user.getEmail());
                return TokenResponseDto.builder()
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .phone(user.getPhone())
                        .role(user.getRole().name())
                        .build();
            } else {
                existing.setStatus(UserStatus.ACTIVE);
                existing.setEmailVerified(true);
                user = userRepository.save(existing);
                return generateTokens(user);
            }
        } else {
            if (requireVerification) {
                user = User.builder()
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .fullName(request.getFullName())
                        .phone(request.getPhone())
                        .role(Role.USER)
                        .status(UserStatus.PENDING)
                        .emailVerified(false)
                        .phoneVerified(false)
                        .build();
                user = userRepository.save(user);
                saveAndSendOtp(user.getEmail());
                return TokenResponseDto.builder()
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .phone(user.getPhone())
                        .role(user.getRole().name())
                        .build();
            } else {
                user = User.builder()
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .fullName(request.getFullName())
                        .phone(request.getPhone())
                        .role(Role.USER)
                        .status(UserStatus.ACTIVE)
                        .emailVerified(true)
                        .phoneVerified(false)
                        .build();
                user = userRepository.save(user);
                return generateTokens(user);
            }
        }
    }

    @Override
    public TokenResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.PENDING) {
            if (isVerificationRequired()) {
                throw new RuntimeException("Tài khoản chưa được xác thực. Vui lòng xác thực mã OTP gửi qua Email.");
            } else {
                user.setStatus(UserStatus.ACTIVE);
                user.setEmailVerified(true);
                user = userRepository.save(user);
            }
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản đã bị khóa hoặc không hoạt động.");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return generateTokens(user);
    }


    @Override
    public TokenResponseDto verifyEmail(VerifyEmailRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (user.getStatus() == UserStatus.ACTIVE && user.isEmailVerified()) {
            return generateTokens(user);
        }

        VerificationCode verificationCode = verificationCodeRepository
                .findFirstByEmailAndVerifiedFalseOrderByExpiresAtDesc(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Mã OTP không tồn tại hoặc đã được xác thực"));

        if (verificationCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn");
        }

        if (!verificationCode.getCode().equals(request.getCode())) {
            throw new RuntimeException("Mã OTP không chính xác");
        }

        verificationCode.setVerified(true);
        verificationCodeRepository.save(verificationCode);

        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(true);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return generateTokens(user);
    }

    @Override
    public void resendOtp(ResendOtpRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản đã được kích hoạt.");
        }

        saveAndSendOtp(user.getEmail());
    }

    @Override
    public TokenResponseDto refresh(String refreshTokenStr) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (token.isRevoked() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token has expired or been revoked");
        }

        User user = token.getUser();
        // Revoke old token
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        return generateTokens(user);
    }

    @Override
    public void logout(String refreshTokenStr) {
        refreshTokenRepository.findByToken(refreshTokenStr).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    private void saveAndSendOtp(String email) {
        String code = generateOtpCode();
        VerificationCode verificationCode = VerificationCode.builder()
                .email(email)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();
        verificationCodeRepository.save(verificationCode);
        try {
            emailService.sendVerificationCode(email, code);
        } catch (Exception e) {
            log.error("=================================================");
            log.error("GỬI EMAIL XÁC THỰC THẤT BẠI CHO EMAIL: {}", email);
            log.error("MÃ OTP XÁC THỰC CỦA BẠN LÀ: {}", code);
            log.error("Chi tiết lỗi: {}", e.getMessage());
            log.error("=================================================");
        }
    }

    private String generateOtpCode() {
        SecureRandom random = new SecureRandom();
        int num = 100000 + random.nextInt(900000);
        return String.valueOf(num);
    }

    private TokenResponseDto generateTokens(User user) {
        String accessToken = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String refreshTokenStr = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(refreshTokenStr)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        return TokenResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }

    @Override
    public void forgotPassword(ForgotPasswordRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email này."));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản này hiện đang không hoạt động hoặc chưa được kích hoạt.");
        }

        String code = generateOtpCode();
        VerificationCode verificationCode = VerificationCode.builder()
                .email(user.getEmail())
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();
        verificationCodeRepository.save(verificationCode);
        try {
            emailService.sendPasswordResetCode(user.getEmail(), code);
        } catch (Exception e) {
            log.error("=================================================");
            log.error("GỬI EMAIL ĐẶT LẠI MẬT KHẨU THẤT BẠI CHO EMAIL: {}", user.getEmail());
            log.error("MÃ OTP ĐẶT LẠI MẬT KHẨU CỦA BẠN LÀ: {}", code);
            log.error("Chi tiết lỗi: {}", e.getMessage());
            log.error("=================================================");
        }
    }

    @Override
    public void resetPassword(ResetPasswordRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email này."));

        VerificationCode verificationCode = verificationCodeRepository
                .findFirstByEmailAndVerifiedFalseOrderByExpiresAtDesc(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Mã OTP đặt lại mật khẩu không hợp lệ hoặc đã sử dụng."));

        if (verificationCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn.");
        }

        if (!verificationCode.getCode().equals(request.getCode())) {
            throw new RuntimeException("Mã OTP không chính xác.");
        }

        verificationCode.setVerified(true);
        verificationCodeRepository.save(verificationCode);

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
