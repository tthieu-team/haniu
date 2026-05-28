package com.haniu.tthieu.haniu.dto;

import com.haniu.tthieu.haniu.entity.enums.ProductStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDto {

    private UUID id;
    private String name;
    private String slug;
    private String sku;
    private String description;
    private String shortDescription;
    private String thumbnailUrl;
    
    private CategoryInfo category;
    private BrandInfo brand;
    private CollectionInfo collection;
    
    private BigDecimal basePrice;
    private BigDecimal salePrice;
    private int stock;
    private boolean isFeatured;
    private boolean isNew;
    private boolean isCustomizable;
    private boolean allowAdminChat;
    private boolean allowPhotoUpload;
    private boolean allowPhotobooth;
    private ProductStatus status;
    
    private String layoutTemplate;
    private String layoutConfig;
    private String specifications;
    private String includedItems;
    
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
    
    private java.math.BigDecimal averageRating;
    private int totalReviews;
    private int totalSold;
    private int totalViews;
    
    private List<OccasionInfo> occasions;
    private List<RecipientInfo> recipients;
    private List<VariantResponseDto> variants;
    private List<MediaResponseDto> media;
    private List<AttributeResponseDto> attributes;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttributeResponseDto {
        private UUID id;
        private String name;
        private String value;
    }

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryInfo {
        private UUID id;
        private String name;
        private String slug;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BrandInfo {
        private UUID id;
        private String name;
        private String slug;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CollectionInfo {
        private UUID id;
        private String name;
        private String slug;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OccasionInfo {
        private UUID id;
        private String name;
        private String slug;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecipientInfo {
        private UUID id;
        private String name;
        private String slug;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VariantResponseDto {
        private UUID id;
        private String sku;
        private String name;
        private String color;
        private String size;
        private String material;
        private BigDecimal price;
        private BigDecimal salePrice;
        private int stock;
        private BigDecimal weight;
        private String imageUrl;
        private String specifications;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MediaResponseDto {
        private UUID id;
        private String url;
        private String type;
        private String altText;
        private boolean isThumbnail;
        private int sortOrder;
    }
}
