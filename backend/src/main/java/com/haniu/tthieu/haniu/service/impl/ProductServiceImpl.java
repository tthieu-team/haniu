package com.haniu.tthieu.haniu.service.impl;

import com.haniu.tthieu.haniu.dto.CursorPageResponse;
import com.haniu.tthieu.haniu.dto.ProductRequestDto;
import com.haniu.tthieu.haniu.dto.ProductResponseDto;
import com.haniu.tthieu.haniu.document.ProductDocument;
import com.haniu.tthieu.haniu.entity.enums.MediaType;
import com.haniu.tthieu.haniu.entity.product.*;
import com.haniu.tthieu.haniu.repository.*;
import com.haniu.tthieu.haniu.repository.elasticsearch.ProductElasticsearchRepository;
import com.haniu.tthieu.haniu.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import com.haniu.tthieu.haniu.exception.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductMediaRepository productMediaRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final CollectionRepository collectionRepository;
    private final OccasionRepository occasionRepository;
    private final RecipientRepository recipientRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductElasticsearchRepository productElasticsearchRepository;
    private final co.elastic.clients.elasticsearch.ElasticsearchClient elasticsearchClient;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;

    private boolean isElasticsearchAvailable = false;

    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            log.info("Checking Elasticsearch connection...");
            co.elastic.clients.transport.endpoints.BooleanResponse response = elasticsearchClient.ping();
            isElasticsearchAvailable = response.value();
            log.info("Elasticsearch connection status: {}", isElasticsearchAvailable ? "AVAILABLE" : "UNAVAILABLE");
        } catch (Exception e) {
            log.warn("Elasticsearch is not available. Search fallback to PostgreSQL will be used. Error: {}", e.getMessage());
            isElasticsearchAvailable = false;
        }
    }

    @Override
    public ProductResponseDto createProduct(ProductRequestDto request) {
        log.info("Creating product with name: {}", request.getName());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = request.getBrandId() != null ?
                brandRepository.findById(request.getBrandId()).orElse(null) : null;

        com.haniu.tthieu.haniu.entity.product.Collection collection = request.getCollectionId() != null ?
                collectionRepository.findById(request.getCollectionId()).orElse(null) : null;

        Product product = Product.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .sku(request.getSku())
                .description(request.getDescription())
                .category(category)
                .brand(brand)
                .collection(collection)
                .price(request.getBasePrice())
                .salePrice(request.getSalePrice())
                .stock(request.getStock())
                .isFeatured(request.isFeatured())
                .isNew(request.isNew())
                .isCustomizable(request.isCustomizable())
                .allowAdminChat(request.isAllowAdminChat())
                .allowPhotoUpload(request.isAllowPhotoUpload())
                .allowPhotobooth(request.isAllowPhotobooth())
                .status(request.getStatus())
                .layoutTemplate(request.getLayoutTemplate())
                .layoutConfig(request.getLayoutConfig())
                .specifications(request.getSpecifications())
                .includedItems(request.getIncludedItems())
                .seoTitle(request.getSeoTitle())
                .seoDescription(request.getSeoDescription())
                .seoKeywords(request.getSeoKeywords())
                .build();

        // Map Occasions and Recipients
        if (request.getOccasions() != null && !request.getOccasions().isEmpty()) {
            Set<Occasion> occasions = new HashSet<>(occasionRepository.findAllById(request.getOccasions()));
            product.setOccasions(occasions);
        }

        if (request.getRecipients() != null && !request.getRecipients().isEmpty()) {
            Set<Recipient> recipients = new HashSet<>(recipientRepository.findAllById(request.getRecipients()));
            product.setRecipients(recipients);
        }

        Product savedProduct = productRepository.save(product);

        // Save Variants
        List<ProductVariant> savedVariants = new ArrayList<>();
        if (request.getVariants() != null) {
            for (ProductRequestDto.VariantRequestDto vDto : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(savedProduct)
                        .sku(vDto.getSku())
                        .name(vDto.getName())
                        .color(vDto.getColor())
                        .size(vDto.getSize())
                        .material(vDto.getMaterial())
                        .price(vDto.getPrice())
                        .salePrice(vDto.getSalePrice())
                        .stock(vDto.getStock())
                        .weight(vDto.getWeight())
                        .imageUrl(vDto.getImageUrl())
                        .specifications(vDto.getSpecifications())
                        .build();
                savedVariants.add(productVariantRepository.save(variant));
            }
        }

        // Save Media
        List<ProductMedia> savedMedia = new ArrayList<>();
        if (request.getMedia() != null) {
            for (ProductRequestDto.MediaRequestDto mDto : request.getMedia()) {
                ProductMedia media = ProductMedia.builder()
                        .product(savedProduct)
                        .url(mDto.getUrl())
                        .type(MediaType.valueOf(mDto.getType()))
                        .altText(mDto.getAltText())
                        .isThumbnail(mDto.isThumbnail())
                        .sortOrder(mDto.getSortOrder())
                        .build();
                savedMedia.add(productMediaRepository.save(media));
            }
        }

        // Save Attributes
        List<ProductAttribute> savedAttributes = new ArrayList<>();
        if (request.getAttributes() != null) {
            for (ProductRequestDto.AttributeRequestDto aDto : request.getAttributes()) {
                ProductAttribute attribute = ProductAttribute.builder()
                        .product(savedProduct)
                        .attributeName(aDto.getName())
                        .attributeValue(aDto.getValue())
                        .build();
                savedAttributes.add(productAttributeRepository.save(attribute));
            }
        }

        // Sync to Elasticsearch
        syncToElasticsearch(savedProduct, savedVariants, savedMedia);

        return mapToResponseDto(savedProduct, savedVariants, savedMedia, savedAttributes);
    }

    @Override
    public ProductResponseDto updateProduct(UUID id, ProductRequestDto request) {
        log.info("Updating product with ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = request.getBrandId() != null ?
                brandRepository.findById(request.getBrandId()).orElse(null) : null;

        com.haniu.tthieu.haniu.entity.product.Collection collection = request.getCollectionId() != null ?
                collectionRepository.findById(request.getCollectionId()).orElse(null) : null;

        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setSku(request.getSku());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setBrand(brand);
        product.setCollection(collection);
        product.setPrice(request.getBasePrice());
        product.setSalePrice(request.getSalePrice());
        product.setStock(request.getStock());
        product.setFeatured(request.isFeatured());
        product.setNew(request.isNew());
        product.setCustomizable(request.isCustomizable());
        product.setAllowAdminChat(request.isAllowAdminChat());
        product.setAllowPhotoUpload(request.isAllowPhotoUpload());
        product.setAllowPhotobooth(request.isAllowPhotobooth());
        product.setStatus(request.getStatus());
        product.setLayoutTemplate(request.getLayoutTemplate());
        product.setLayoutConfig(request.getLayoutConfig());
        product.setSpecifications(request.getSpecifications());
        product.setIncludedItems(request.getIncludedItems());
        product.setSeoTitle(request.getSeoTitle());
        product.setSeoDescription(request.getSeoDescription());
        product.setSeoKeywords(request.getSeoKeywords());

        // Update Occasions & Recipients
        product.getOccasions().clear();
        if (request.getOccasions() != null && !request.getOccasions().isEmpty()) {
            product.getOccasions().addAll(occasionRepository.findAllById(request.getOccasions()));
        }

        product.getRecipients().clear();
        if (request.getRecipients() != null && !request.getRecipients().isEmpty()) {
            product.getRecipients().addAll(recipientRepository.findAllById(request.getRecipients()));
        }

        Product savedProduct = productRepository.save(product);

        // Manage product variants: update, delete, or soft-delete
        List<ProductVariant> existingVariants = productVariantRepository.findByProductId(id);
        Set<UUID> keptVariantIds = new HashSet<>();
        List<ProductVariant> savedVariants = new ArrayList<>();

        if (request.getVariants() != null) {
            for (ProductRequestDto.VariantRequestDto vDto : request.getVariants()) {
                ProductVariant variantToSave = null;

                // 1. Try matching by ID first
                if (vDto.getId() != null) {
                    variantToSave = existingVariants.stream()
                            .filter(v -> v.getId().equals(vDto.getId()))
                            .findFirst()
                            .orElse(null);
                }

                // 2. Try matching by SKU next (if not found by ID)
                if (variantToSave == null && vDto.getSku() != null) {
                    variantToSave = existingVariants.stream()
                            .filter(v -> vDto.getSku().equals(v.getSku()))
                            .findFirst()
                            .orElse(null);
                }

                if (variantToSave != null) {
                    // Update fields of the existing variant
                    variantToSave.setSku(vDto.getSku());
                    variantToSave.setName(vDto.getName());
                    variantToSave.setColor(vDto.getColor());
                    variantToSave.setSize(vDto.getSize());
                    variantToSave.setMaterial(vDto.getMaterial());
                    variantToSave.setPrice(vDto.getPrice());
                    variantToSave.setSalePrice(vDto.getSalePrice());
                    variantToSave.setStock(vDto.getStock());
                    variantToSave.setWeight(vDto.getWeight());
                    variantToSave.setImageUrl(vDto.getImageUrl());
                    variantToSave.setSpecifications(vDto.getSpecifications());
                    variantToSave.setActive(true); // Re-activate if it was inactive
                } else {
                    // Create a new variant
                    variantToSave = ProductVariant.builder()
                            .product(savedProduct)
                            .sku(vDto.getSku())
                            .name(vDto.getName())
                            .color(vDto.getColor())
                            .size(vDto.getSize())
                            .material(vDto.getMaterial())
                            .price(vDto.getPrice())
                            .salePrice(vDto.getSalePrice())
                            .stock(vDto.getStock())
                            .weight(vDto.getWeight())
                            .imageUrl(vDto.getImageUrl())
                            .specifications(vDto.getSpecifications())
                            .isActive(true)
                            .build();
                }

                ProductVariant saved = productVariantRepository.save(variantToSave);
                savedVariants.add(saved);
                keptVariantIds.add(saved.getId());
            }
        }

        // Clean up or soft-delete variants not present in the update request
        for (ProductVariant existingVar : existingVariants) {
            if (!keptVariantIds.contains(existingVar.getId())) {
                boolean isReferenced = orderItemRepository.existsByVariantId(existingVar.getId());
                if (isReferenced) {
                    // Soft delete: keep in DB but set isActive = false
                    existingVar.setActive(false);
                    productVariantRepository.save(existingVar);
                } else {
                    // Hard delete: remove from cart items first, then delete variant
                    cartItemRepository.deleteByVariantId(existingVar.getId());
                    productVariantRepository.delete(existingVar);
                }
            }
        }
        productVariantRepository.flush();

        // Delete old media and save new ones
        productMediaRepository.deleteByProductId(id);
        List<ProductMedia> savedMedia = new ArrayList<>();
        if (request.getMedia() != null) {
            for (ProductRequestDto.MediaRequestDto mDto : request.getMedia()) {
                ProductMedia media = ProductMedia.builder()
                        .product(savedProduct)
                        .url(mDto.getUrl())
                        .type(MediaType.valueOf(mDto.getType()))
                        .altText(mDto.getAltText())
                        .isThumbnail(mDto.isThumbnail())
                        .sortOrder(mDto.getSortOrder())
                        .build();
                savedMedia.add(productMediaRepository.save(media));
            }
        }

        // Delete old attributes and save new ones
        productAttributeRepository.deleteByProductId(id);
        productAttributeRepository.flush();

        List<ProductAttribute> savedAttributes = new ArrayList<>();
        if (request.getAttributes() != null) {
            for (ProductRequestDto.AttributeRequestDto aDto : request.getAttributes()) {
                ProductAttribute attribute = ProductAttribute.builder()
                        .product(savedProduct)
                        .attributeName(aDto.getName())
                        .attributeValue(aDto.getValue())
                        .build();
                savedAttributes.add(productAttributeRepository.save(attribute));
            }
        }

        // Sync to Elasticsearch
        syncToElasticsearch(savedProduct, savedVariants, savedMedia);

        return mapToResponseDto(savedProduct, savedVariants, savedMedia, savedAttributes);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        List<ProductVariant> variants = productVariantRepository.findByProductIdAndIsActiveTrue(id);
        List<ProductMedia> media = productMediaRepository.findByProductIdOrderBySortOrderAsc(id);
        List<ProductAttribute> attributes = productAttributeRepository.findByProductId(id);
        return mapToResponseDto(product, variants, media, attributes);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlugFetchAll(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        List<ProductVariant> variants = productVariantRepository.findByProductIdAndIsActiveTrue(product.getId());
        List<ProductMedia> media = productMediaRepository.findByProductIdOrderBySortOrderAsc(product.getId());
        List<ProductAttribute> attributes = productAttributeRepository.findByProductId(product.getId());
        return mapToResponseDto(product, variants, media, attributes);
    }

    @Override
    public void deleteProduct(UUID id) {
        log.info("Soft deleting product with ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setDeletedAt(LocalDateTime.now());
        productRepository.save(product);

        // Remove from Elasticsearch
        if (isElasticsearchAvailable) {
            try {
                productElasticsearchRepository.deleteById(id.toString());
            } catch (Exception e) {
                log.error("Failed to delete product {} from Elasticsearch", id, e);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> getProducts(Specification<Product> spec, Pageable pageable) {
        return productRepository.findAll(spec, pageable).map(product -> {
            List<ProductVariant> variants = productVariantRepository.findByProductIdAndIsActiveTrue(product.getId());
            List<ProductMedia> media = productMediaRepository.findByProductIdOrderBySortOrderAsc(product.getId());
            List<ProductAttribute> attributes = productAttributeRepository.findByProductId(product.getId());
            return mapToResponseDto(product, variants, media, attributes);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDocument> searchProducts(String keyword, Pageable pageable) {
        if (isElasticsearchAvailable) {
            try {
                return productElasticsearchRepository.searchPublishedProducts(keyword, pageable);
            } catch (Exception e) {
                log.warn("Elasticsearch query failed, falling back to database search. Error: {}", e.getMessage());
            }
        }

        // Fallback: search in database
        log.info("Performing fallback search in PostgreSQL for keyword: {}", keyword);
        Page<Product> dbProducts = productRepository.searchProductsFallback(
                keyword, 
                com.haniu.tthieu.haniu.entity.enums.ProductStatus.PUBLISHED, 
                pageable
        );

        // Map Page<Product> to Page<ProductDocument>
        return dbProducts.map(this::mapToDocument);
    }

    private ProductDocument mapToDocument(Product product) {
        List<ProductVariant> variants = productVariantRepository.findByProductIdAndIsActiveTrue(product.getId());
        List<ProductMedia> media = productMediaRepository.findByProductIdOrderBySortOrderAsc(product.getId());

        String thumbnail = media.stream()
                .filter(ProductMedia::isThumbnail)
                .map(ProductMedia::getUrl)
                .findFirst()
                .orElse(media.isEmpty() ? null : media.get(0).getUrl());

        List<ProductDocument.VariantDocument> variantDocs = variants.stream()
                .map(v -> ProductDocument.VariantDocument.builder()
                        .id(v.getId().toString())
                        .sku(v.getSku())
                        .name(v.getName())
                        .color(v.getColor())
                        .size(v.getSize())
                        .material(v.getMaterial())
                        .price(v.getPrice())
                        .salePrice(v.getSalePrice())
                        .stock(v.getStock())
                        .build())
                .toList();

        List<ProductDocument.MediaDocument> mediaDocs = media.stream()
                .map(m -> ProductDocument.MediaDocument.builder()
                        .url(m.getUrl())
                        .type(m.getType().name())
                        .altText(m.getAltText())
                        .isThumbnail(m.isThumbnail())
                        .sortOrder(m.getSortOrder())
                        .build())
                .toList();

        List<String> occasionSlugs = product.getOccasions() != null ?
                product.getOccasions().stream().map(Occasion::getSlug).toList() : Collections.emptyList();

        List<String> recipientSlugs = product.getRecipients() != null ?
                product.getRecipients().stream().map(Recipient::getSlug).toList() : Collections.emptyList();

        return ProductDocument.builder()
                .id(product.getId().toString())
                .categoryId(product.getCategory().getId().toString())
                .categoryName(product.getCategory().getName())
                .brandId(product.getBrand() != null ? product.getBrand().getId().toString() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .collectionId(product.getCollection() != null ? product.getCollection().getId().toString() : null)
                .collectionName(product.getCollection() != null ? product.getCollection().getName() : null)
                .occasions(occasionSlugs)
                .recipients(recipientSlugs)
                .name(product.getName())
                .slug(product.getSlug())
                .sku(product.getSku())
                .description(product.getDescription())
                .thumbnailUrl(thumbnail)
                .price(product.getPrice())
                .salePrice(product.getSalePrice())
                .stock(product.getStock())
                .status(product.getStatus().name())
                .layoutTemplate(product.getLayoutTemplate())
                .layoutConfig(product.getLayoutConfig())
                .specifications(product.getSpecifications())
                .isFeatured(product.isFeatured())
                .isNew(product.isNew())
                .variants(variantDocs)
                .medias(mediaDocs)
                .build();
    }

    private void syncToElasticsearch(Product product, List<ProductVariant> variants, List<ProductMedia> media) {
        if (!isElasticsearchAvailable) {
            log.debug("Elasticsearch is not available, skipping sync for product {}", product.getId());
            return;
        }
        try {
            ProductDocument doc = mapToDocument(product);
            productElasticsearchRepository.save(doc);
            log.info("Successfully synced product {} to Elasticsearch", product.getId());
        } catch (Exception e) {
            log.error("Failed to sync product {} to Elasticsearch", product.getId(), e);
        }
    }

    private ProductResponseDto mapToResponseDto(Product product, List<ProductVariant> variants, List<ProductMedia> media, List<ProductAttribute> attributes) {
        List<ProductResponseDto.AttributeResponseDto> attrList = attributes != null ? attributes.stream()
                .map(a -> ProductResponseDto.AttributeResponseDto.builder()
                        .id(a.getId())
                        .name(a.getAttributeName())
                        .value(a.getAttributeValue())
                        .build())
                .collect(Collectors.toList()) : Collections.emptyList();

        ProductResponseDto.CategoryInfo catInfo = ProductResponseDto.CategoryInfo.builder()
                .id(product.getCategory().getId())
                .name(product.getCategory().getName())
                .slug(product.getCategory().getSlug())
                .build();

        ProductResponseDto.BrandInfo brandInfo = product.getBrand() != null ?
                ProductResponseDto.BrandInfo.builder()
                        .id(product.getBrand().getId())
                        .name(product.getBrand().getName())
                        .slug(product.getBrand().getSlug())
                        .build() : null;

        ProductResponseDto.CollectionInfo collInfo = product.getCollection() != null ?
                ProductResponseDto.CollectionInfo.builder()
                        .id(product.getCollection().getId())
                        .name(product.getCollection().getName())
                        .slug(product.getCollection().getSlug())
                        .build() : null;

        List<ProductResponseDto.OccasionInfo> occInfos = product.getOccasions() != null ?
                product.getOccasions().stream()
                        .map(o -> ProductResponseDto.OccasionInfo.builder()
                                .id(o.getId())
                                .name(o.getName())
                                .slug(o.getSlug())
                                .build())
                        .collect(Collectors.toList()) : Collections.emptyList();

        List<ProductResponseDto.RecipientInfo> recInfos = product.getRecipients() != null ?
                product.getRecipients().stream()
                        .map(r -> ProductResponseDto.RecipientInfo.builder()
                                .id(r.getId())
                                .name(r.getName())
                                .slug(r.getSlug())
                                .build())
                        .collect(Collectors.toList()) : Collections.emptyList();

        List<ProductResponseDto.VariantResponseDto> varList = variants.stream()
                .map(v -> ProductResponseDto.VariantResponseDto.builder()
                        .id(v.getId())
                        .sku(v.getSku())
                        .name(v.getName())
                        .color(v.getColor())
                        .size(v.getSize())
                        .material(v.getMaterial())
                        .price(v.getPrice())
                        .salePrice(v.getSalePrice())
                        .stock(v.getStock())
                        .weight(v.getWeight())
                        .imageUrl(v.getImageUrl())
                        .specifications(v.getSpecifications())
                        .build())
                .toList();

        List<ProductResponseDto.MediaResponseDto> mediaList = media.stream()
                .map(m -> ProductResponseDto.MediaResponseDto.builder()
                        .id(m.getId())
                        .url(m.getUrl())
                        .type(m.getType().name())
                        .altText(m.getAltText())
                        .isThumbnail(m.isThumbnail())
                        .sortOrder(m.getSortOrder())
                        .build())
                .toList();

        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .sku(product.getSku())
                .description(product.getDescription())
                .category(catInfo)
                .brand(brandInfo)
                .collection(collInfo)
                .basePrice(product.getPrice())
                .salePrice(product.getSalePrice())
                .stock(product.getStock())
                .isFeatured(product.isFeatured())
                .isNew(product.isNew())
                .isCustomizable(product.isCustomizable())
                .allowAdminChat(product.isAllowAdminChat())
                .allowPhotoUpload(product.isAllowPhotoUpload())
                .allowPhotobooth(product.isAllowPhotobooth())
                .status(product.getStatus())
                .layoutTemplate(product.getLayoutTemplate())
                .layoutConfig(product.getLayoutConfig())
                .specifications(product.getSpecifications())
                .includedItems(product.getIncludedItems())
                .seoTitle(product.getSeoTitle())
                .seoDescription(product.getSeoDescription())
                .seoKeywords(product.getSeoKeywords())
                .averageRating(product.getAverageRating())
                .totalReviews(product.getTotalReviews())
                .totalSold(product.getTotalSold())
                .totalViews(product.getTotalViews())
                .occasions(occInfos)
                .recipients(recInfos)
                .variants(varList)
                .media(mediaList)
                .attributes(attrList)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    @Override
    public CursorPageResponse<ProductResponseDto> getProductsCursor(
            UUID categoryId,
            String categorySlug,
            Boolean isAccessory,
            UUID brandId,
            UUID collectionId,
            Boolean isFeatured,
            Boolean isNew,
            String occasionSlug,
            String recipientSlug,
            String cursor,
            int size) {

        Specification<Product> spec = Specification.where((root, query, cb) -> cb.isNull(root.get("deletedAt")));

        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        }
        if (categorySlug != null && !categorySlug.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("slug"), categorySlug));
        }
        if (isAccessory != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("isAccessory"), isAccessory));
        }
        if (brandId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("brand").get("id"), brandId));
        }
        if (collectionId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("collection").get("id"), collectionId));
        }
        if (isFeatured != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isFeatured"), isFeatured));
        }
        if (isNew != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isNew"), isNew));
        }
        if (occasionSlug != null && !occasionSlug.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.join("occasions").get("slug"), occasionSlug));
        }
        if (recipientSlug != null && !recipientSlug.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.join("recipients").get("slug"), recipientSlug));
        }

        if (cursor != null && !cursor.trim().isEmpty()) {
            try {
                String decoded = new String(java.util.Base64.getDecoder().decode(cursor));
                String[] parts = decoded.split("_");
                if (parts.length == 2) {
                    java.time.LocalDateTime cursorCreatedAt = java.time.LocalDateTime.parse(parts[0]);
                    UUID cursorId = UUID.fromString(parts[1]);

                    spec = spec.and((root, query, cb) -> cb.or(
                        cb.lessThan(root.get("createdAt"), cursorCreatedAt),
                        cb.and(
                            cb.equal(root.get("createdAt"), cursorCreatedAt),
                            cb.lessThan(root.get("id"), cursorId)
                        )
                    ));
                }
            } catch (Exception e) {
                // Ignore invalid cursor
            }
        }

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(
            0, size + 1,
            org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Order.desc("createdAt"),
                org.springframework.data.domain.Sort.Order.desc("id")
            )
        );

        List<Product> products = productRepository.findAll(spec, pageable).getContent();

        boolean hasNext = products.size() > size;
        List<Product> contentProducts = hasNext ? products.subList(0, size) : products;

        String nextCursor = null;
        if (hasNext && !contentProducts.isEmpty()) {
            Product lastProduct = contentProducts.get(contentProducts.size() - 1);
            String rawCursor = lastProduct.getCreatedAt().toString() + "_" + lastProduct.getId().toString();
            nextCursor = java.util.Base64.getEncoder().encodeToString(rawCursor.getBytes());
        }

        // Optimize: Batch fetch child entities to prevent N+1 query issue
        List<UUID> productIds = contentProducts.stream().map(Product::getId).collect(Collectors.toList());

        Map<UUID, List<ProductVariant>> variantsMap = new HashMap<>();
        Map<UUID, List<ProductMedia>> mediaMap = new HashMap<>();
        Map<UUID, List<ProductAttribute>> attributesMap = new HashMap<>();

        if (!productIds.isEmpty()) {
            List<ProductVariant> allVariants = productVariantRepository.findByProductIdInAndIsActiveTrue(productIds);
            variantsMap = allVariants.stream().collect(Collectors.groupingBy(v -> v.getProduct().getId()));

            List<ProductMedia> allMedia = productMediaRepository.findByProductIdInOrderBySortOrderAsc(productIds);
            mediaMap = allMedia.stream().collect(Collectors.groupingBy(m -> m.getProduct().getId()));

            List<ProductAttribute> allAttributes = productAttributeRepository.findByProductIdIn(productIds);
            attributesMap = allAttributes.stream().collect(Collectors.groupingBy(a -> a.getProduct().getId()));
        }

        Map<UUID, List<ProductVariant>> finalVariantsMap = variantsMap;
        Map<UUID, List<ProductMedia>> finalMediaMap = mediaMap;
        Map<UUID, List<ProductAttribute>> finalAttributesMap = attributesMap;

        List<ProductResponseDto> dtos = contentProducts.stream()
                .map(product -> {
                    List<ProductVariant> variants = finalVariantsMap.getOrDefault(product.getId(), Collections.emptyList());
                    List<ProductMedia> media = finalMediaMap.getOrDefault(product.getId(), Collections.emptyList());
                    List<ProductAttribute> attributes = finalAttributesMap.getOrDefault(product.getId(), Collections.emptyList());
                    return mapToResponseDto(product, variants, media, attributes);
                })
                .collect(Collectors.toList());

        return CursorPageResponse.<ProductResponseDto>builder()
                .content(dtos)
                .nextCursor(nextCursor)
                .hasNext(hasNext)
                .build();
    }
}
