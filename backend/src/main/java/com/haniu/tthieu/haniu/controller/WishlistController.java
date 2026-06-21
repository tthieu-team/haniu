package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.feedback.Wishlist;
import com.haniu.tthieu.haniu.entity.product.Product;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.repository.UserRepository;
import com.haniu.tthieu.haniu.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(Principal principal) {
        if (principal == null) {
            return null;
        }
        return userRepository.findByEmail(principal.getName()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(Principal principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(wishlistService.getWishlistProducts(user));
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<Void> toggleWishlist(Principal principal, @PathVariable UUID productId) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        wishlistService.toggleWishlist(user, productId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Void> addToWishlist(Principal principal, @PathVariable UUID productId) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        wishlistService.addToWishlist(user, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromWishlist(Principal principal, @PathVariable UUID productId) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearWishlist(Principal principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        wishlistService.clearWishlist(user);
        return ResponseEntity.noContent().build();
    }
}
