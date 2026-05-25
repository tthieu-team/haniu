package com.haniu.tthieu.haniu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class OrderRequestDto {
    private UUID cartId; // To pull items from cart

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @NotBlank(message = "Customer email is required")
    private String customerEmail;

    @NotBlank(message = "Shipping province is required")
    private String shippingProvince;

    @NotBlank(message = "Shipping district is required")
    private String shippingDistrict;

    @NotBlank(message = "Shipping ward is required")
    private String shippingWard;

    @NotBlank(message = "Shipping address line is required")
    private String shippingAddressLine;

    private String note;
    private String paymentMethod; // e.g. COD, MOMO, VNPAY
    private String couponCode;
    private String shippingMethod; // e.g. STANDARD, FAST, EXPRESS
}
