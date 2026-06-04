package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.entity.feedback.Review;
import com.haniu.tthieu.haniu.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> createReview(
            Principal principal,
            @PathVariable UUID productId,
            @RequestBody Map<String, Object> body) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Integer rating = (Integer) body.get("rating");
        String comment = (String) body.get("comment");
        String orderItemIdStr = (String) body.get("orderItemId");
        @SuppressWarnings("unchecked")
        List<String> images = (List<String>) body.get("images");
        @SuppressWarnings("unchecked")
        List<String> videos = (List<String>) body.get("videos");

        if (rating == null || orderItemIdStr == null) {
            return ResponseEntity.badRequest().build();
        }

        UUID orderItemId = UUID.fromString(orderItemIdStr);

        return ResponseEntity.ok(reviewService.createReview(
                principal.getName(),
                productId,
                orderItemId,
                rating,
                comment,
                images,
                videos
        ));
    }

    @GetMapping("/product/{productId}/check-eligible")
    public ResponseEntity<Map<String, Object>> checkEligibility(
            Principal principal,
            @PathVariable UUID productId) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("eligible", false));
        }
        UUID pendingId = reviewService.getPendingOrderItemId(principal.getName(), productId);
        if (pendingId != null) {
            return ResponseEntity.ok(Map.of(
                "eligible", true,
                "pendingOrderItemId", pendingId.toString()
            ));
        }
        return ResponseEntity.ok(Map.of("eligible", false));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getApprovedReviews(@PathVariable UUID productId) {
        return ResponseEntity.ok(reviewService.getApprovedReviewsByProduct(productId));
    }

    @GetMapping("/all-approved")
    public ResponseEntity<List<Review>> getAllApprovedReviews() {
        return ResponseEntity.ok(reviewService.getAllApprovedReviews());
    }

    @GetMapping("/product/{productId}/all")
    public ResponseEntity<List<Review>> getAllReviews(@PathVariable UUID productId) {
        return ResponseEntity.ok(reviewService.getAllReviewsByProduct(productId));
    }

    @PutMapping("/{reviewId}/approve")
    public ResponseEntity<Review> approveReview(@PathVariable UUID reviewId) {
        return ResponseEntity.ok(reviewService.approveReview(reviewId));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}
