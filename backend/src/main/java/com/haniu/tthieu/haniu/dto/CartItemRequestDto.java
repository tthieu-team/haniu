package com.haniu.tthieu.haniu.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CartItemRequestDto {
    private UUID productId;
    private UUID variantId;
    private int quantity;
    private String customizationInfo; // JSON configuration string
}
