package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.dto.LoginRequestDto;
import com.haniu.tthieu.haniu.dto.RegisterRequestDto;
import com.haniu.tthieu.haniu.dto.TokenResponseDto;
import com.haniu.tthieu.haniu.dto.VerifyEmailRequestDto;
import com.haniu.tthieu.haniu.dto.ResendOtpRequestDto;
import com.haniu.tthieu.haniu.dto.ForgotPasswordRequestDto;
import com.haniu.tthieu.haniu.dto.ResetPasswordRequestDto;
import com.haniu.tthieu.haniu.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<TokenResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<TokenResponseDto> verifyEmail(@Valid @RequestBody VerifyEmailRequestDto request) {
        return ResponseEntity.ok(authService.verifyEmail(request));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<Map<String, String>> resendOtp(@Valid @RequestBody ResendOtpRequestDto request) {
        authService.resendOtp(request);
        return ResponseEntity.ok(Map.of("message", "Mã OTP mới đã được gửi về email của bạn."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(Map.of("message", "Mã xác thực đặt lại mật khẩu đã được gửi về email của bạn."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequestDto request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập lại."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDto> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(authService.refresh(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken != null) {
            authService.logout(refreshToken);
        }
        return ResponseEntity.noContent().build();
    }
}
