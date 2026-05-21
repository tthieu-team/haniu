package com.haniu.tthieu.haniu.dto;

import com.haniu.tthieu.haniu.entity.enums.ProductStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequestDto {

    private String name;
    private String slug;
    private String sku;
    private String description;
    private UUID categoryId;
    private UUID brandId;
    private UUID collectionId;
    private BigDecimal basePrice;
    private BigDecimal salePrice;
    private int stock;
    private boolean isFeatured;
    private boolean isNew;
    private boolean isCustomizable;
    private ProductStatus status;
    
    private String layoutTemplate;
    private String layoutConfig;
    private String specifications;
    
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
    
    private Set<UUID> occasions;
    private Set<UUID> recipients;
    
    private List<VariantRequestDto> variants;
    private List<MediaRequestDto> media;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VariantRequestDto {
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
    public static class MediaRequestDto {
        private String url;
        private String type; // IMAGE or VIDEO
        private String altText;
        private boolean isThumbnail;
        private int sortOrder;
    }
}
