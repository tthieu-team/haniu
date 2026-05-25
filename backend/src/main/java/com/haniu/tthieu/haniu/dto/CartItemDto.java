package com.haniu.tthieu.haniu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private UUID id;
    private UUID productId;
    private String productName;
    private String productSlug;
    private UUID variantId;
    private String variantName;
    private String variantSku;
    private String imageUrl;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String customizationInfo;
    
    // Additional fields for rich display & stock verification
    private BigDecimal originalPrice;
    private int stock;
    private String color;
    private String size;
    private String material;
}
