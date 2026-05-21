package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.dto.OrderRequestDto;
import com.haniu.tthieu.haniu.dto.OrderResponseDto;
import com.haniu.tthieu.haniu.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(
            Principal principal,
            @Valid @RequestBody OrderRequestDto request) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(orderService.createOrder(email, request));
    }

    @GetMapping("/track")
    public ResponseEntity<OrderResponseDto> getOrderByTrackingToken(@RequestParam String token) {
        return ResponseEntity.ok(orderService.getOrderByTrackingToken(token));
    }

    @GetMapping("/code/{orderCode}")
    public ResponseEntity<OrderResponseDto> getOrderByCode(@PathVariable String orderCode) {
        return ResponseEntity.ok(orderService.getOrderByCode(orderCode));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponseDto>> getMyOrders(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(orderService.getOrdersByUser(principal.getName()));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @PutMapping("/{orderId}/payment-status")
    public ResponseEntity<OrderResponseDto> updatePaymentStatus(
            @PathVariable UUID orderId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.updatePaymentStatus(orderId, status));
    }
}
