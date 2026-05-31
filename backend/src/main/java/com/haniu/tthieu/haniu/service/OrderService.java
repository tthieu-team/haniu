package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.dto.OrderRequestDto;
import com.haniu.tthieu.haniu.dto.OrderResponseDto;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderResponseDto createOrder(String email, OrderRequestDto request);
    OrderResponseDto getOrderByCode(String orderCode);
    OrderResponseDto getOrderByTrackingToken(String trackingToken);
    List<OrderResponseDto> getOrdersByUser(String email);
    List<OrderResponseDto> getAllOrders();
    OrderResponseDto updateOrderStatus(UUID orderId, String orderStatus);
    OrderResponseDto updatePaymentStatus(UUID orderId, String paymentStatus);
    List<OrderResponseDto> lookupOrders(String query);
}

