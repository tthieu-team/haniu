package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-link")
    public ResponseEntity<Map<String, String>> createPaymentLink(@RequestBody Map<String, String> body) {
        String orderIdStr = body.get("orderId");
        String gateway = body.get("gateway");

        if (orderIdStr == null || gateway == null) {
            return ResponseEntity.badRequest().build();
        }

        UUID orderId = UUID.fromString(orderIdStr);
        String paymentLink = paymentService.createPaymentLink(orderId, gateway);

        return ResponseEntity.ok(Map.of("paymentUrl", paymentLink));
    }

    @PostMapping("/webhook/{gateway}")
    public ResponseEntity<Void> handleWebhook(
            @PathVariable String gateway,
            @RequestParam Map<String, String> params) {
        paymentService.processWebhook(gateway, params);
        return ResponseEntity.ok().build();
    }

    // Support GET requests for easy simulation or dev testing callback testing
    @GetMapping("/webhook/{gateway}")
    public ResponseEntity<Void> handleWebhookGet(
            @PathVariable String gateway,
            @RequestParam Map<String, String> params) {
        paymentService.processWebhook(gateway, params);
        return ResponseEntity.ok().build();
    }
}
