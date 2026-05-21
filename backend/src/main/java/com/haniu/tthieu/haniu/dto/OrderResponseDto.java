package com.haniu.tthieu.haniu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private UUID id;
    private String orderCode;
    private String trackingToken;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String shippingProvince;
    private String shippingDistrict;
    private String shippingWard;
    private String shippingAddressLine;
    private String note;
    private BigDecimal subtotalPrice;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalPrice;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
    private LocalDateTime orderedAt;
    private List<OrderItemResponseDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponseDto {
        private UUID id;
        private UUID productId;
        private String productName;
        private String productSlug;
        private String productThumbnail;
        private UUID variantId;
        private String variantName;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private String customizationInfo;
    }
}
