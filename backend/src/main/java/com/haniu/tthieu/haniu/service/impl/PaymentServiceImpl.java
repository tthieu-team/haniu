package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.enums.*;
import com.haniu.tthieu.haniu.entity.order.Order;
import com.haniu.tthieu.haniu.entity.order.Payment;
import com.haniu.tthieu.haniu.repository.OrderRepository;
import com.haniu.tthieu.haniu.repository.PaymentRepository;
import com.haniu.tthieu.haniu.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public String createPaymentLink(UUID orderId, String gateway) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Order is already paid");
        }

        PaymentGateway payGateway = PaymentGateway.valueOf(gateway.toUpperCase());

        // Create or update payment record
        Payment payment = paymentRepository.findByOrderOrderCode(order.getOrderCode())
                .orElseGet(() -> Payment.builder()
                        .order(order)
                        .amount(order.getTotalPrice())
                        .paymentGateway(payGateway)
                        .status(TransactionStatus.PENDING)
                        .build());

        payment.setPaymentGateway(payGateway);
        paymentRepository.save(payment);

        // Standard callback simulation link for development/testing
        // Redirects user to local frontend checkout success page with validation
        String frontendUrl = "http://localhost:3000";
        return String.format("%s/orders/callback?orderCode=%s&gateway=%s&status=00",
                frontendUrl, order.getOrderCode(), gateway.toUpperCase());
    }

    @Override
    public void processWebhook(String gateway, Map<String, String> ipnParams) {
        String orderCode = ipnParams.get("orderCode");
        String status = ipnParams.get("status"); // "00" = SUCCESS, other = FAILED

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found in Webhook processing: " + orderCode));

        Payment payment = paymentRepository.findByOrderOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Payment record not found for order: " + orderCode));

        payment.setRawResponse(ipnParams.toString());
        payment.setTransactionCode(ipnParams.getOrDefault("transactionNo", UUID.randomUUID().toString()));

        if ("00".equals(status)) {
            payment.setStatus(TransactionStatus.SUCCESS);
            payment.setPaidAt(LocalDateTime.now());
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setOrderStatus(OrderStatus.CONFIRMED);
        } else {
            payment.setStatus(TransactionStatus.FAILED);
            order.setPaymentStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
        orderRepository.save(order);
    }
}
