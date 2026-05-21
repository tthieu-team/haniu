package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.dto.LoginRequestDto;
import com.haniu.tthieu.haniu.dto.RegisterRequestDto;
import com.haniu.tthieu.haniu.dto.TokenResponseDto;

public interface AuthService {
    TokenResponseDto register(RegisterRequestDto request);
    TokenResponseDto login(LoginRequestDto request);
    TokenResponseDto refresh(String refreshToken);
    void logout(String refreshToken);
}
