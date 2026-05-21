package com.haniu.tthieu.haniu.repository.elasticsearch;

import com.haniu.tthieu.haniu.document.ProductDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductElasticsearchRepository extends ElasticsearchRepository<ProductDocument, String> {

    // Standard search method by name or description
    Page<ProductDocument> findByNameOrDescription(String name, String description, Pageable pageable);

    // Filter by category slug
    Page<ProductDocument> findByCategoryId(String categoryId, Pageable pageable);

    // Filter by brand id
    Page<ProductDocument> findByBrandId(String brandId, Pageable pageable);

    // Filter by price range
    Page<ProductDocument> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // Filter by status (e.g. PUBLISHED)
    Page<ProductDocument> findByStatus(String status, Pageable pageable);

    // Complex query searching name/description/sku/brand/category with fuzzy search
    @Query("{\"bool\": {\"must\": [{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name^3\", \"description\", \"brand_name^2\", \"category_name^2\", \"sku\"], \"fuzziness\": \"AUTO\"}}], \"filter\": [{\"term\": {\"status\": \"PUBLISHED\"}}]}}")
    Page<ProductDocument> searchPublishedProducts(String keyword, Pageable pageable);
}
