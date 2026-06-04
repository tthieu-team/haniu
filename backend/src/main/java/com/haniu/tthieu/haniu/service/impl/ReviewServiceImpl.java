package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.entity.feedback.Review;
import com.haniu.tthieu.haniu.entity.product.Product;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.entity.order.OrderItem;
import com.haniu.tthieu.haniu.repository.ProductRepository;
import com.haniu.tthieu.haniu.repository.ReviewRepository;
import com.haniu.tthieu.haniu.repository.UserRepository;
import com.haniu.tthieu.haniu.repository.OrderItemRepository;
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
    private final OrderItemRepository orderItemRepository;

    @Override
    public Review createReview(String email, UUID productId, UUID orderItemId, int rating, String comment, List<String> images, List<String> videos) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));

        // Validations
        if (!orderItem.getProduct().getId().equals(productId)) {
            throw new RuntimeException("This order item is not for the specified product");
        }
        String orderEmail = orderItem.getOrder().getCustomerEmail();
        String userEmail = orderItem.getOrder().getUser() != null ? orderItem.getOrder().getUser().getEmail() : null;
        if (!email.equals(orderEmail) && !email.equals(userEmail)) {
            throw new RuntimeException("You do not own this order item");
        }
        if (orderItem.getOrder().getOrderStatus() != com.haniu.tthieu.haniu.entity.enums.OrderStatus.DELIVERED) {
            throw new RuntimeException("You can only review items that have been delivered");
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .orderItem(orderItem)
                .rating(rating)
                .comment(comment)
                .images(images != null ? images : new java.util.ArrayList<>())
                .videos(videos != null ? videos : new java.util.ArrayList<>())
                .isApproved(false) // Needs admin moderation by default
                .build();

        return reviewRepository.save(review);
    }

    @Override
    @Transactional(readOnly = true)
    public UUID getPendingOrderItemId(String email, UUID productId) {
        List<OrderItem> items = orderItemRepository.findUnreviewedItems(email, productId);
        return items.isEmpty() ? null : items.get(0).getId();
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
    @Transactional(readOnly = true)
    public List<Review> getAllApprovedReviews() {
        return reviewRepository.findByIsApprovedTrue();
    }

    @Override
    public Review approveReview(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setApproved(true);
        Review saved = reviewRepository.save(review);
        updateProductReviewStats(saved.getProduct());
        return saved;
    }

    @Override
    public void deleteReview(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        Product product = review.getProduct();
        reviewRepository.delete(review);
        updateProductReviewStats(product);
    }

    private void updateProductReviewStats(Product product) {
        List<Review> approvedReviews = reviewRepository.findByProductIdAndIsApprovedTrue(product.getId());
        int count = approvedReviews.size();
        if (count > 0) {
            double sum = approvedReviews.stream().mapToInt(Review::getRating).sum();
            product.setAverageRating(java.math.BigDecimal.valueOf(sum / count));
        } else {
            product.setAverageRating(java.math.BigDecimal.ZERO);
        }
        product.setTotalReviews(count);
        productRepository.save(product);
    }
}
