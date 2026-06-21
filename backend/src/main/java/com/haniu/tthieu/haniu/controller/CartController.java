package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.dto.CartDto;
import com.haniu.tthieu.haniu.dto.CartItemRequestDto;
import com.haniu.tthieu.haniu.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart(
            Principal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(cartService.getCart(email, sessionId));
    }

    @PostMapping
    public ResponseEntity<CartDto> addToCart(
            Principal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId,
            @RequestBody CartItemRequestDto request) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(cartService.addToCart(email, sessionId, request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateQuantity(
            Principal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId,
            @PathVariable UUID itemId,
            @RequestBody Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        if (quantity == null) {
            return ResponseEntity.badRequest().build();
        }
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(cartService.updateQuantity(email, sessionId, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto> removeItem(
            Principal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId,
            @PathVariable UUID itemId) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(cartService.removeItem(email, sessionId, itemId));
    }

    @PostMapping("/merge")
    public ResponseEntity<Void> mergeCarts(
            Principal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        if (principal != null && sessionId != null) {
            cartService.mergeCarts(principal.getName(), sessionId);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<CartDto> getCartById(@PathVariable UUID cartId) {
        return ResponseEntity.ok(cartService.getCartById(cartId));
    }

    @PostMapping("/buy-now")
    public ResponseEntity<CartDto> createBuyNowCart(@RequestBody CartItemRequestDto request) {
        return ResponseEntity.ok(cartService.createBuyNowCart(request));
    }

    @PutMapping("/items/{itemId}/customization")
    public ResponseEntity<CartDto> updateCustomizationInfo(
            Principal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId,
            @PathVariable UUID itemId,
            @RequestBody Map<String, String> body) {
        String customizationInfo = body.get("customizationInfo");
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(cartService.updateCustomizationInfo(email, sessionId, itemId, customizationInfo));
    }
}
