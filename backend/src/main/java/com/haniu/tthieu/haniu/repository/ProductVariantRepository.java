package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.product.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {
    List<ProductVariant> findByProductId(UUID productId);
    List<ProductVariant> findByProductIdAndIsActiveTrue(UUID productId);
    List<ProductVariant> findByProductIdInAndIsActiveTrue(List<UUID> productIds);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM ProductVariant pv WHERE pv.product.id = :productId")
    void deleteByProductId(UUID productId);
}
