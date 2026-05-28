package com.haniu.tthieu.haniu.controller;

import com.haniu.tthieu.haniu.dto.CursorPageResponse;
import com.haniu.tthieu.haniu.dto.ProductRequestDto;
import com.haniu.tthieu.haniu.dto.ProductResponseDto;
import com.haniu.tthieu.haniu.document.ProductDocument;
import com.haniu.tthieu.haniu.entity.enums.ProductStatus;
import com.haniu.tthieu.haniu.entity.product.Product;
import com.haniu.tthieu.haniu.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponseDto> createProduct(@RequestBody ProductRequestDto request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable UUID id,
            @RequestBody ProductRequestDto request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductResponseDto> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponseDto>> getProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) Boolean isAccessory,
            @RequestParam(required = false) UUID brandId,
            @RequestParam(required = false) UUID collectionId,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) String occasionSlug,
            @RequestParam(required = false) String recipientSlug,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

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
        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (occasionSlug != null && !occasionSlug.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.join("occasions").get("slug"), occasionSlug));
        }
        if (recipientSlug != null && !recipientSlug.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.join("recipients").get("slug"), recipientSlug));
        }

        return ResponseEntity.ok(productService.getProducts(spec, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductDocument>> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.searchProducts(q, pageable));
    }

    @GetMapping("/cursor")
    public ResponseEntity<CursorPageResponse<ProductResponseDto>> getProductsCursor(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) Boolean isAccessory,
            @RequestParam(required = false) UUID brandId,
            @RequestParam(required = false) UUID collectionId,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) Boolean isNew,
            @RequestParam(required = false) String occasionSlug,
            @RequestParam(required = false) String recipientSlug,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productService.getProductsCursor(
                categoryId, categorySlug, isAccessory, brandId, collectionId, isFeatured, isNew, occasionSlug, recipientSlug, cursor, size));
    }
}
