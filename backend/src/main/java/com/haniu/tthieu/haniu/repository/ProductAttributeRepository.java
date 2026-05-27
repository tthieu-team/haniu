package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.product.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, UUID> {
    List<ProductAttribute> findByProductId(UUID productId);
    List<ProductAttribute> findByProductIdIn(List<UUID> productIds);

    @Modifying
    @Query("DELETE FROM ProductAttribute pa WHERE pa.product.id = :productId")
    void deleteByProductId(UUID productId);
}
