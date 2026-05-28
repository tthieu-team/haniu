package com.haniu.tthieu.haniu.entity.feedback;

import com.haniu.tthieu.haniu.entity.product.Product;
import com.haniu.tthieu.haniu.entity.user.User;
import com.haniu.tthieu.haniu.entity.order.OrderItem;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "reviews", indexes = {
    @Index(name = "idx_reviews_product_id", columnList = "product_id"),
    @Index(name = "idx_reviews_user_id", columnList = "user_id"),
    @Index(name = "idx_reviews_is_approved", columnList = "is_approved")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", unique = true)
    private OrderItem orderItem;

    @Column(nullable = false)
    private int rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "images", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> images = new java.util.ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "videos", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> videos = new java.util.ArrayList<>();

    @Column(name = "is_approved", nullable = false)
    @Builder.Default
    private boolean isApproved = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
