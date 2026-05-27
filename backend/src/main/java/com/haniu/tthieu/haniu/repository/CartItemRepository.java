package com.haniu.tthieu.haniu.repository;

import com.haniu.tthieu.haniu.entity.cart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findByCartId(UUID cartId);
    void deleteByCartId(UUID cartId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM CartItem ci WHERE ci.variant.id = :variantId")
    void deleteByVariantId(UUID variantId);
}
