package com.haniu.tthieu.haniu.entity.product;

import com.haniu.tthieu.haniu.entity.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_slug", columnList = "slug"),
    @Index(name = "idx_products_sku", columnList = "sku"),
    @Index(name = "idx_products_category_id", columnList = "category_id"),
    @Index(name = "idx_products_brand_id", columnList = "brand_id"),
    @Index(name = "idx_products_collection_id", columnList = "collection_id"),
    @Index(name = "idx_products_price", columnList = "price"),
    @Index(name = "idx_products_status", columnList = "status"),
    @Index(name = "idx_products_is_featured", columnList = "is_featured"),
    @Index(name = "idx_products_is_new", columnList = "is_new"),
    @Index(name = "idx_products_created_at", columnList = "created_at")
})
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id")
    private Collection collection;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "products_occasions",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "occasion_id")
    )
    private Set<Occasion> occasions;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "products_recipients",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "recipient_id")
    )
    private Set<Recipient> recipients;



    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "sale_price", precision = 12, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "cost_price", precision = 12, scale = 2)
    private BigDecimal costPrice;

    @Column(nullable = false)
    @Builder.Default
    private int stock = 0;

    @Column(precision = 10, scale = 2)
    private BigDecimal weight;

    private String material;

    private String color;

    private String barcode;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ProductStatus status;

    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private boolean isFeatured = false;

    @Column(name = "is_new", nullable = false)
    @Builder.Default
    private boolean isNew = true;

    @Column(name = "is_customizable", nullable = false)
    @Builder.Default
    private boolean isCustomizable = false;


    @Column(name = "average_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_reviews", nullable = false)
    @Builder.Default
    private int totalReviews = 0;

    @Column(name = "total_sold", nullable = false)
    @Builder.Default
    private int totalSold = 0;

    @Column(name = "total_views", nullable = false)
    @Builder.Default
    private int totalViews = 0;

    @Column(name = "seo_title")
    private String seoTitle;

    @Column(name = "seo_description", columnDefinition = "TEXT")
    private String seoDescription;

    @Column(name = "seo_keywords", columnDefinition = "TEXT")
    private String seoKeywords;

    @Column(name = "layout_template", nullable = false, length = 100)
    @Builder.Default
    private String layoutTemplate = "DEFAULT";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "layout_config", columnDefinition = "jsonb")
    private String layoutConfig;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "specifications", columnDefinition = "jsonb")
    private String specifications;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;



    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Version
    private Long version;
}
