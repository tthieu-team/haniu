package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.dto.LoginRequestDto;
import com.haniu.tthieu.haniu.dto.RegisterRequestDto;
import com.haniu.tthieu.haniu.dto.TokenResponseDto;
import com.haniu.tthieu.haniu.dto.VerifyEmailRequestDto;
import com.haniu.tthieu.haniu.dto.ResendOtpRequestDto;
import com.haniu.tthieu.haniu.dto.ForgotPasswordRequestDto;
import com.haniu.tthieu.haniu.dto.ResetPasswordRequestDto;

public interface AuthService {
    TokenResponseDto register(RegisterRequestDto request);
    TokenResponseDto login(LoginRequestDto request);
    TokenResponseDto refresh(String refreshToken);
    void logout(String refreshToken);
    TokenResponseDto verifyEmail(VerifyEmailRequestDto request);
    void resendOtp(ResendOtpRequestDto request);
    void forgotPassword(ForgotPasswordRequestDto request);
    void resetPassword(ResetPasswordRequestDto request);
}
