package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.feedback.Review;
import com.haniu.tthieu.haniu.entity.product.Product;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.repository.ProductRepository;
import com.haniu.tthieu.haniu.repository.ReviewRepository;
import com.haniu.tthieu.haniu.repository.UserRepository;
import com.haniu.tthieu.haniu.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public Review createReview(String email, UUID productId, int rating, String comment) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(rating)
                .comment(comment)
                .isApproved(false) // Needs admin moderation by default
                .build();

        return reviewRepository.save(review);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getApprovedReviewsByProduct(UUID productId) {
        return reviewRepository.findByProductIdAndIsApprovedTrue(productId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getAllReviewsByProduct(UUID productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public Review approveReview(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setApproved(true);
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(UUID reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
