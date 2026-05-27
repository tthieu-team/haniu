package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    @Query("SELECT p FROM Product p " +
           "LEFT JOIN FETCH p.category " +
           "LEFT JOIN FETCH p.brand " +
           "LEFT JOIN FETCH p.collection " +
           "LEFT JOIN FETCH p.occasions " +
           "LEFT JOIN FETCH p.recipients " +
           "WHERE p.slug = :slug AND p.deletedAt IS NULL")
    Optional<Product> findBySlugFetchAll(@Param("slug") String slug);

    Optional<Product> findBySlug(String slug);

    @Query(value = "SELECT EXISTS(SELECT 1 FROM products WHERE sku = :sku)", nativeQuery = true)
    boolean existsBySkuIncludingDeleted(@Param("sku") String sku);

    @Query("SELECT p FROM Product p " +
           "WHERE p.status = :status AND (" +
           "lower(p.name) LIKE lower(concat('%', :keyword, '%')) OR " +
           "lower(p.description) LIKE lower(concat('%', :keyword, '%')) OR " +
           "lower(p.sku) LIKE lower(concat('%', :keyword, '%')))")
    org.springframework.data.domain.Page<Product> searchProductsFallback(
            @Param("keyword") String keyword,
            @Param("status") com.haniu.tthieu.haniu.entity.enums.ProductStatus status,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT o.id, COUNT(p) FROM Product p JOIN p.occasions o WHERE p.deletedAt IS NULL GROUP BY o.id")
    java.util.List<Object[]> countProductsByOccasion();
}
