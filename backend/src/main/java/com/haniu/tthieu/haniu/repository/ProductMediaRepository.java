package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.product.ProductMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductMediaRepository extends JpaRepository<ProductMedia, UUID> {
    List<ProductMedia> findByProductIdOrderBySortOrderAsc(UUID productId);
    List<ProductMedia> findByProductIdInOrderBySortOrderAsc(List<UUID> productIds);
    void deleteByProductId(UUID productId);
}
