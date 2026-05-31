package com.haniu.tthieu.haniu.service;

public interface EmailService {
    void sendVerificationCode(String to, String code);
    void sendPasswordResetCode(String to, String code);
    void sendOrderConfirmation(String to, com.haniu.tthieu.haniu.dto.OrderResponseDto order);
}

