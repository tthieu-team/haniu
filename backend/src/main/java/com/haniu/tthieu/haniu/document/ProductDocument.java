package com.haniu.tthieu.haniu.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.util.List;

@Document(indexName = "products", createIndex = false)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDocument {

    @Id
    private String id;

    @Field(type = FieldType.Keyword, name = "category_id")
    private String categoryId;

    @Field(type = FieldType.Text, name = "category_name")
    private String categoryName;

    @Field(type = FieldType.Keyword, name = "brand_id")
    private String brandId;

    @Field(type = FieldType.Text, name = "brand_name")
    private String brandName;

    @Field(type = FieldType.Keyword, name = "collection_id")
    private String collectionId;

    @Field(type = FieldType.Text, name = "collection_name")
    private String collectionName;

    @Field(type = FieldType.Keyword, name = "occasions")
    private List<String> occasions;

    @Field(type = FieldType.Keyword, name = "recipients")
    private List<String> recipients;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;


    @Field(type = FieldType.Keyword)
    private String slug;

    @Field(type = FieldType.Keyword)
    private String sku;

    @Field(type = FieldType.Text, name = "short_description")
    private String shortDescription;

    @Field(type = FieldType.Text)
    private String description;

    @Field(type = FieldType.Keyword, name = "thumbnail_url")
    private String thumbnailUrl;

    @Field(type = FieldType.Double)
    private BigDecimal price;

    @Field(type = FieldType.Double, name = "sale_price")
    private BigDecimal salePrice;

    @Field(type = FieldType.Integer)
    private int stock;

    @Field(type = FieldType.Keyword)
    private String status;

    @Field(type = FieldType.Keyword, name = "layout_template")
    private String layoutTemplate;

    @Field(type = FieldType.Text, name = "layout_config")
    private String layoutConfig;

    @Field(type = FieldType.Text, name = "specifications")
    private String specifications;

    @Field(type = FieldType.Boolean, name = "is_featured")
    private boolean isFeatured;


    @Field(type = FieldType.Boolean, name = "is_new")
    private boolean isNew;


    @Field(type = FieldType.Double, name = "average_rating")
    private BigDecimal averageRating;

    @Field(type = FieldType.Integer, name = "total_reviews")
    private int totalReviews;

    @Field(type = FieldType.Integer, name = "total_sold")
    private int totalSold;

    @Field(type = FieldType.Keyword)
    private String material;

    @Field(type = FieldType.Keyword)
    private String color;

    @Field(type = FieldType.Nested)
    private List<VariantDocument> variants;

    @Field(type = FieldType.Nested)
    private List<AttributeDocument> attributes;

    @Field(type = FieldType.Nested)
    private List<MediaDocument> medias;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MediaDocument {
        @Field(type = FieldType.Keyword)
        private String url;
        @Field(type = FieldType.Keyword)
        private String type;
        @Field(type = FieldType.Text, name = "alt_text")
        private String altText;
        @Field(type = FieldType.Boolean, name = "is_thumbnail")
        private boolean isThumbnail;
        @Field(type = FieldType.Integer, name = "sort_order")
        private int sortOrder;
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VariantDocument {
        @Field(type = FieldType.Keyword)
        private String id;
        @Field(type = FieldType.Keyword)
        private String sku;
        @Field(type = FieldType.Text)
        private String name;
        @Field(type = FieldType.Keyword)
        private String color;
        @Field(type = FieldType.Keyword)
        private String size;
        @Field(type = FieldType.Keyword)
        private String material;
        @Field(type = FieldType.Double)
        private BigDecimal price;
        @Field(type = FieldType.Double, name = "sale_price")
        private BigDecimal salePrice;
        @Field(type = FieldType.Integer)
        private int stock;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttributeDocument {
        @Field(type = FieldType.Keyword)
        private String name;
        @Field(type = FieldType.Keyword)
        private String value;
    }
}
