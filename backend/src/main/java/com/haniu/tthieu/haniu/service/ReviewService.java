package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.entity.feedback.Review;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    Review createReview(String email, UUID productId, UUID orderItemId, int rating, String comment, List<String> images, List<String> videos);
    UUID getPendingOrderItemId(String email, UUID productId);
    List<Review> getApprovedReviewsByProduct(UUID productId);
    List<Review> getAllReviewsByProduct(UUID productId);
    List<Review> getAllApprovedReviews();
    Review approveReview(UUID reviewId);
    void deleteReview(UUID reviewId);
}
