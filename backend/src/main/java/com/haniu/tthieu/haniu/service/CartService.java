package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.dto.CartDto;
import com.haniu.tthieu.haniu.dto.CartItemRequestDto;

import java.util.UUID;

public interface CartService {
    CartDto getCart(String email, String sessionId);
    CartDto addToCart(String email, String sessionId, CartItemRequestDto request);
    CartDto updateQuantity(String email, String sessionId, UUID itemId, int quantity);
    CartDto removeItem(String email, String sessionId, UUID itemId);
    void mergeCarts(String email, String sessionId);
    void clearCart(UUID cartId);
    CartDto getCartById(UUID cartId);
    CartDto createBuyNowCart(CartItemRequestDto request);
}
