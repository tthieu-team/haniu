package com.haniu.tthieu.haniu.service;

import com.haniu.tthieu.haniu.dto.CursorPageResponse;
import com.haniu.tthieu.haniu.dto.ProductRequestDto;
import com.haniu.tthieu.haniu.dto.ProductResponseDto;
import com.haniu.tthieu.haniu.document.ProductDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import com.haniu.tthieu.haniu.entity.product.Product;

import java.util.UUID;

public interface ProductService {
    ProductResponseDto createProduct(ProductRequestDto request);

    ProductResponseDto updateProduct(UUID id, ProductRequestDto request);

    ProductResponseDto getProductById(UUID id);

    ProductResponseDto getProductBySlug(String slug);

    void deleteProduct(UUID id);

    Page<ProductResponseDto> getProducts(Specification<Product> spec, Pageable pageable);

    CursorPageResponse<ProductResponseDto> getProductsCursor(
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
            int size);

    Page<ProductDocument> searchProducts(String keyword, Pageable pageable);
}
